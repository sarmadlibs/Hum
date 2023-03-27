import React, { useState, useEffect, useRef } from "react";
import "../styles/MessageBubble.css";

function MessageBubble({ content, user }) {
  const [isCurrentUser] = useState(user.name === "You");
  const [isVisible, setIsVisible] = useState(false);
  const messageRef = useRef(null);

  const bubbleStyle = {
    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
    maxWidth: "35%",
    wordBreak: "break-word",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    opacity: isVisible ? 1 : 0, // set opacity based on visibility
    transform: isVisible ? "translateY(0)" : "translateY(20px)", // set transform based on visibility
    transition: "opacity 0.3s, transform 0.3s", // add transition
  };

  const bubbleClassName = isCurrentUser
    ? "message-bubble outgoing"
    : "message-bubble incoming";

  useEffect(() => {
    // set the message bubble to visible after it has mounted
    setIsVisible(true);
  }, []);

  return (
    <div className={bubbleClassName} style={bubbleStyle} ref={messageRef}>
      <p className="meta">{user.name}</p>
      <p className="content">{content}</p>
    </div>
  );
}

export default MessageBubble;
