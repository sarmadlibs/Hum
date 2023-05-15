import React from "react";
import "../styles/Contact.css";

function Contact({ name, email, profilePicture, onSelectChat }) {
  return (
    <div className="contact" onClick={onSelectChat}>
      <img src={profilePicture} alt="Profile" className="contact-image" />
      <div>
        <p className="contact-name">{name}</p>
        <p className="contact-email">{email}</p>
      </div>
    </div>
  );
}

export default Contact;
