import React from "react";
import "../styles/Contact.css";

function Contact({ name, profilePicture }) {
  return (
    <div className="contact">
      <img src={profilePicture} alt={name} className="contact-image" />
      <p className="contact-name">{name}</p>
    </div>
  );
}

export default Contact;
