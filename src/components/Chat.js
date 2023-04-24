import React, { useState, useEffect } from "react";
import "../styles/Chat.css";
import SidePanel from "./SidePanel";
import MessageBubble from "./MessageBubble";
import { FaPaperPlane, FaSearch } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

function Chat({ user, onLogout }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://1iw89h7ej1.execute-api.us-east-1.amazonaws.com/production"
    );
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setRetryCount(0);
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      // Retry WebSocket connection after a delay
      setTimeout(() => {
        setRetryCount((count) => count + 1);
      }, 5000); // 5 seconds delay before retrying
    };
    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [retryCount]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const newMessage = {
        id: uuidv4(),
        user: user,
        content: message,
        time: new Date(),
      };
      socket.send(
        JSON.stringify({ action: "sendMessage", message: newMessage })
      );
      setMessage("");
    }
  };

  const handleSelectChat = (contact) => {
    setSelectedChat(contact);
  };

  return (
    <div className="chat-container">
      <SidePanel onSelectChat={handleSelectChat} />
      <div className="chat-main">
        <header className="chat-header">
          <div className="chat-search">
            <FaSearch />
            <input type="text" placeholder="Search" className="search-input" />
          </div>
          <h2 className="Chirp-title">
            {selectedChat ? selectedChat.name : "Chirp"}
          </h2>
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
