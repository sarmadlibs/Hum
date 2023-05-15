import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import SidePanel from "./SidePanel";
import MessageBubble from "./MessageBubble";
import AnimatedChatTitle from "./AnimatedChatTitle";
import { FaPaperPlane } from "react-icons/fa";
import birdLogo from "../assets/img/humming.png";

function Chat({ user, onLogout }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState("");
  const chatWindowRef = useRef(null);

  const setupWebSocket = () => {
    const ws = new WebSocket(
      `${process.env.REACT_APP_WS_URL}?userEmail=${encodeURIComponent(
        user.email
      )}`
    );

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      let message;
      try {
        message = JSON.parse(event.data);
      } catch (error) {
        console.error("Failed to parse message as JSON:", event.data);
        return;
      }
      const chatId =
        message.senderEmail === user.email
          ? message.targetEmail
          : message.senderEmail;
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: [
          ...(prevMessages[chatId] || []),
          {
            ...message,
            user: message.senderEmail === user.email ? "You" : chatId,
          },
        ],
      }));
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    setSocket(ws);
  };

  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
      localStorage.setItem("userName", user.name);
      setupWebSocket();
    } else {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
        setupWebSocket();
      } else {
        onLogout();
      }
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user, onLogout]);

  const fetchChatMessages = (chatId) => {
    if (chatId) {
      fetch(
        `${process.env.REACT_APP_API_URL}?user1Email=${encodeURIComponent(
          user.email
        )}&user2Email=${encodeURIComponent(chatId)}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("API response:", data);

          if (data && Array.isArray(data.messages)) {
            setMessages((prevMessages) => ({
              ...prevMessages,
              [chatId]: data.messages.map((message) => ({
                ...message,
                message: message.message.S, // extract message text
                user: message.senderEmail.S === user.email ? "You" : chatId,
              })),
            }));
          } else {
            console.error("Unexpected API response:", data);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleSelectChat = (contact) => {
    setSelectedChat(contact);
    if (contact && contact.email) {
      fetchChatMessages(contact.email);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket && selectedChat) {
      if (socket.readyState === WebSocket.OPEN) {
        console.log("Sending message:", message);
        console.log("User:", user);
        const newMessage = {
          action: "sendMessage",
          message: message,
          senderEmail: user.email,
          targetEmail: selectedChat.email,
        };
        socket.send(JSON.stringify(newMessage));

        //  addnew message to local state
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedChat.email]: [
            ...(prevMessages[selectedChat.email] || []),
            {
              ...newMessage,
              user: "You",
            },
          ],
        }));

        setMessage("");
      } else {
        console.error("WebSocket is not open. Ready state:", socket.readyState);
      }
    }
  };

  useEffect(() => {
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messages, selectedChat]);

  return (
    <div className="chat-container">
      <SidePanel
        user={{ ...user, id: user.email }}
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

        <div className="chat-messages" ref={chatWindowRef}>
          {selectedChat &&
            (messages[selectedChat.email]?.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                user={message.user}
              />
            )) ||
              [])}
        </div>

        <form className="chat-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="chat-send-btn" type="submit">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
