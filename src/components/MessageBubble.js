import React, { useState, useEffect, useRef } from "react";
import "../styles/MessageBubble.css";

function MessageBubble({ content, user }) {
  const [isCurrentUser] = useState(user.name === "You");
  const [isVisible, setIsVisible] = useState(false);
  const messageRef = useRef(null);

  const bubbleStyle = {
    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
    maxWidth: "60%",
    wordBreak: "break-word",
    borderRadius: 16,
    marginBottom: 8,
    fontSize: 16,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.3s, transform 0.3s",
  };

  const bubbleClassName = isCurrentUser
    ? "message-bubble outgoing"
    : "message-bubble incoming";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={bubbleClassName} style={bubbleStyle} ref={messageRef}>
      <p className="meta">{user.name}</p>
      <p className="content">{content}</p>
    </div>
  );
}

export default MessageBubble;
