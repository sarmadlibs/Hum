import React from "react";
import "../styles/SidePanel.css";
import Contact from "./Contact";

function SidePanel() {
  const dummyContacts = [
    {
      id: 1,
      name: "John Doe",
      profilePicture: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      name: "Jane Smith",
      profilePicture: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Michael Johnson",
      profilePicture: "https://via.placeholder.com/40",
    },
    {
      id: 4,
      name: "Emma Brown",
      profilePicture: "https://via.placeholder.com/40",
    },
  ];

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <h3>Chats</h3>
      </div>
      <div className="side-panel-content">
        {dummyContacts.map((contact) => (
          <Contact
            key={contact.id}
            name={contact.name}
            profilePicture={contact.profilePicture}
          />
        ))}
      </div>
    </div>
  );
}

export default SidePanel;
