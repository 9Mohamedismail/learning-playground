import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

const db = await open({
  filename: "chat.db",
  driver: sqlite3.Database,
});

await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room TEXT NOT NULL,
        client_offset TEXT NOT NULL,
        content TEXT NOT NULL,
        UNIQUE(room, client_offset)
    );
    `);

const app = express();
const server = createServer(app);

app.use(
  cors({ origin: "http://localhost:5173", methods: ["GET", "POST", "DELETE"] })
);

const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("a user connected");
  socket.on("join room", async (room) => {
    socket.join(room);
    socket.data.room = room;

    if (!socket.recovered) {
      const since = socket.handshake.auth?.serverOffset?.[room] || 0;
      try {
        const rows = await db.all(
          "SELECT id, content FROM messages WHERE id > ? AND room = ? ORDER BY id ASC",
          [since, room]
        );
        for (const row of rows) {
          socket.emit("chat message", row.content, row.id);
        }
      } catch (e) {
        console.error("Backfill failed:", e);
      }
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", async (msg, clientOffset, room, callback) => {
    let result;
    try {
      // store the message in the database
      result = await db.run(
        "INSERT INTO messages (content, client_offset, room) VALUES (?, ?, ?)",
        msg,
        clientOffset,
        room
      );
    } catch (e) {
      if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
        // the message was already inserted, so we notify the client
        callback();
      } else {
        // nothing to do, just let the client retry
      }
      return;
    }
    // include the offset with the message
    io.to(room).emit("chat message", msg, result.lastID);
    callback();
  });
});

app.delete("/delete/:room", async (req, res) => {
  const room = req.params.room;
  await db.run("DELETE FROM messages WHERE room = ?", room);
  io.to(room).emit("chat delete", 0);
  res.sendStatus(204);
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
