import React, { useState, useEffect } from "react";
import "../styles/Chat.css";
import SidePanel from "./SidePanel";
import MessageBubble from "./MessageBubble";
import { FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
// import birdLogo from "../assets/img/bird-logo-legit.png";
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
      "wss://1iw89h7ej1.execute-api.us-east-1.amazonaws.com/production"
    );
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setRetryCount(0);
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, user: message.user.name === userName },
      ]);
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
  }, [retryCount, user, onLogout, userName]);

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
          {selectedChat ? (
            <h2 className="chat-title">{selectedChat.name}</h2>
          ) : (
            <img src={birdLogo} alt="Chirp Logo" className="logo" />
          )}
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
