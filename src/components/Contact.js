import React from "react";
import "../styles/Contact.css";

function Contact({ name, profilePicture, onSelectChat }) {
  return (
    <div className="contact" onClick={onSelectChat}>
      <img src={profilePicture} alt={name} className="contact-image" />
      <p className="contact-name">{name}</p>
    </div>
  );
}

export default Contact;
