import React, { useState } from "react";
import "../styles/Chat.css";
import SidePanel from "./SidePanel";
import MessageBubble from "./MessageBubble";
import { FaPaperPlane, FaSearch } from "react-icons/fa";
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
      <SidePanel />
      <div className="chat-main">
        <header className="chat-header">
          <div className="chat-search">
            <FaSearch />
            <input type="text" placeholder="Search" className="search-input" />
          </div>
          <h2 className="Chirp-title">Chirp</h2>
          <button className="logout-btn" onClick={onLogout}>
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
    </div>
  );
}

export default Chat;
