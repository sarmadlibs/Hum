import React, { useEffect, useState } from "react";
import "../styles/MessageBubble.css";

function MessageBubble({ message, user }) {
  const [isCurrentUser] = useState(message.user === "You");
  const [isVisible, setIsVisible] = useState(false);

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
    <div className={bubbleClassName} style={bubbleStyle}>
      <p className="content">{message.message}</p>
    </div>
  );
}

export default MessageBubble;
