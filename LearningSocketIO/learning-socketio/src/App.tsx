import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./socket";

function App() {
  const [inputValue, setInputeValue] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const handleSocketMessage = (msg: string, serverOffset: number): void => {
      setChatMessages((prev) => [...prev, msg]);
      socket.auth.serverOffset = serverOffset;
    };

    const handleDeleteChat = (serverOffset: number): void => {
      console.log("wassssup");
      socket.auth.serverOffset = serverOffset;
    };

    socket.on("chat message", handleSocketMessage);
    socket.on("chat delete", handleDeleteChat);

    return () => {
      socket.off("chat message", handleSocketMessage);
      socket.off("chat delete", handleDeleteChat);
    };
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const clientOffset = `${socket.id}-${counter}`;
    socket.emit("chat message", inputValue, clientOffset);
    setInputeValue("");
    setCounter(counter + 1);
  };

  const onDelete = () => {
    axios
      .get("/DELETE")
      .then(() => {
        console.log("hey");
        socket.emit("chat delete");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4">
        {chatMessages &&
          chatMessages.map((message) => (
            <h1 className="border p-2 mb-2"> {message}</h1>
          ))}
      </div>
      <div className="px-2">
        <button
          className="border border-black rounded p-4 mb-2"
          onClick={onDelete}
        >
          Clear Chat
        </button>
        <h1> {socket.auth.serverOffset}</h1>
      </div>
      <div className="h-full flex flex-col justify-end">
        <form className="flex" onSubmit={onSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputeValue(e.target.value)}
            placeholder="Enter text here"
            className="border border-black rounded w-full p-4"
          />
          <button type="submit" className="border border-black rounded p-4">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
