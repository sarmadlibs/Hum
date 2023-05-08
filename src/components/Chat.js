import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";

import "../styles/Chat.css";
import SidePanel from "./SidePanel";
import MessageBubble from "./MessageBubble";
import AnimatedChatTitle from "./AnimatedChatTitle";
import { FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import birdLogo from "../assets/img/humming.png";

function Chat({ user, onLogout }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
      localStorage.setItem("userName", user.name);
    } else {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      } else {
        // Redirect to login if no user name found
        onLogout();
      }
    }

    const ws = new WebSocket(
      "wss://0gsjak620c.execute-api.us-east-1.amazonaws.com/production"
    );
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setRetryCount(0);
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, user: message.user === userName },
      ]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setTimeout(() => {
        setRetryCount((count) => count + 1);
      }, 5000);
    };
    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [retryCount, user, onLogout, userName]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      if (socket.readyState === WebSocket.OPEN) {
        const newMessage = {
          id: uuidv4(),
          user: user,
          content: message,
          time: new Date(),
        };
        socket.send(
          JSON.stringify({ action: "sendMessage", data: newMessage })
        );

        setMessage("");
      } else {
        console.error("WebSocket is not in the OPEN state");
      }
    }
  };

  const handleSelectChat = (contact) => {
    setSelectedChat(contact);
  };

  return (
    <div className="chat-container">
      <SidePanel
        user={{ ...user, id: user.name }}
        userName={userName}
        onSelectChat={handleSelectChat}
      />

      <div className="chat-main">
        <header className="chat-header">
          <div className="chat-title-container">
            {selectedChat ? (
              <AnimatedChatTitle text={selectedChat.name} />
            ) : (
              <img src={birdLogo} alt="Chirp Logo" className="logo" />
            )}
          </div>
          <div className="header-right">
            {userName ? (
              <>
                <div className="user-greeting">Hi, {userName}</div>
                <button className="logout-btn" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <div className="user-greeting">Loading...</div>
            )}
          </div>
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
