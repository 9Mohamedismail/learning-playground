import { useEffect, useState } from "react";
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

    socket.on("chat message", handleSocketMessage);

    return () => {
      socket.off("chat message", handleSocketMessage);
    };
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const clientOffset = `${socket.id}-${counter}`;
    socket.emit("chat message", inputValue, clientOffset);
    setInputeValue("");
    setCounter(counter + 1);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4">
        {chatMessages &&
          chatMessages.map((message) => (
            <h1 className="border p-2 mb-2"> {message}</h1>
          ))}
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
