import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:6969");

function ChatInterface() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setChatHistory([...chatHistory, msg]);
    });
  }, [chatHistory]);

  const handleSendMessage = () => {
    socket.emit("message", message);
    setChatHistory([...chatHistory, message]);
    setMessage("");
  };

  return (
    <div>
      <div>
        {chatHistory.map((msg, index) => (
          <div key={index}>
            <span>{msg}</span>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatInterface;
