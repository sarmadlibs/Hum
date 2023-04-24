import React, { useState, useRef, useEffect } from "react";
import "../styles/SidePanel.css";
import Contact from "./Contact";
import ProfilePopup from "./ProfilePopup";
import { FaSearch } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import userImg from "../assets/img/user.png";

function SidePanel({ onSelectChat }) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const dummyContacts = [
    {
      id: 1,
      name: "John Doe",
      profilePicture: userImg,
    },
    {
      id: 2,
      name: "Jane Smith",
      profilePicture: userImg,
    },
    {
      id: 3,
      name: "Michael Jackson",
      profilePicture: userImg,
    },
    {
      id: 4,
      name: "Harry Potter",
      profilePicture: userImg,
    },
  ];

  const profileImageRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileImageRef.current &&
        !profileImageRef.current.contains(event.target)
      ) {
        setShowProfilePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileImageRef]);

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <img
          ref={profileImageRef}
          src={userImg}
          alt="User profile"
          className="user-profile-image"
          onClick={toggleProfilePopup}
        />
        <div className="chat-search">
          <FaSearch />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <ProfilePopup
          className={showProfilePopup ? "show" : ""}
          onClose={toggleProfilePopup}
        />
      </div>
      <div className="side-panel-content">
        {dummyContacts.map((contact) => (
          <Contact
            key={contact.id}
            name={contact.name}
            profilePicture={contact.profilePicture}
            onSelectChat={() => onSelectChat(contact)}
          />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default SidePanel;
