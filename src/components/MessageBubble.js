import React, { useEffect, useState } from "react";
import "../styles/MessageBubble.css";

function MessageBubble({ message, user }) {
  const [isCurrentUser] = useState(message?.senderEmail?.S === user);
  const [isVisible, setIsVisible] = useState(false);

  const bubbleStyle = {
    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
    // maxWidth: "60%",
    wordBreak: "break-word",
    marginBottom: 8,
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

  const timestamp = message?.timestamp?.S
    ? new Date(message.timestamp.S).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        hourCycle: "h12",
      })
    : "";

  return (
    <div
      className={
        isCurrentUser
          ? "message-container outgoing"
          : "message-container incoming"
      }
    >
      <div className={bubbleClassName} style={bubbleStyle}>
        <p className="content">{message.message}</p>
      </div>
      {timestamp && <p className="timestamp">{timestamp}</p>}
    </div>
  );
}

export default MessageBubble;
