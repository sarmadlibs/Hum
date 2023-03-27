import React, { useState } from "react";
import "../styles/Chat.css";
import MessageBubble from "./MessageBubble";
import { FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

function Chat({ user, onLogout }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: uuidv4(), user: user, content: message, time: new Date() },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>Chirp</h2>
        <button className="btn btn-primary" onClick={onLogout}>
          Logout
        </button>
      </header>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            user={msg.user === user}
            content={msg.content}
            time={msg.time}
          />
        ))}
      </div>
      <form className="chat-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default Chat;
