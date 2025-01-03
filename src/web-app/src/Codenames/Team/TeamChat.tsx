import { TeamEnum } from "./TeamEnum.ts";
import { KeyboardEvent, useState } from "react";

function TeamChat({ team }: { team: TeamEnum }) {
  const master = "DoctorMatt";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  function onMessageKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onSendMessage();
    }
  }

  function onSendMessage() {
    setMessages([...messages, message]);
    setMessage("");
  }

  return (
    <div className="flex flex-col space-y-3 bg-white bg-opacity-10 rounded p-1 lg:p-2">
      <div className="max-h-48 overflow-y-auto space-y-2">
        {messages.map((message, index) => (
          <div key={index}>
            <span className="text-emerald-400">{master}</span>: {message}
          </div>
        ))}
      </div>
      <div className="flex flex-row space-x-3">
        <input
          type="text"
          className="w-full border bg-white bg-opacity-15 rounded p-2"
          placeholder="Type your message..."
          value={message}
          onChange={event => setMessage(event.target.value)}
          onKeyDown={onMessageKeyDown}
        />
        <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded" onClick={onSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default TeamChat;
