import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AWS from "../awsConfig";
import { CognitoIdentityServiceProvider, DynamoDB } from "aws-sdk";

import "../styles/SidePanel.css";
import Contact from "./Contact";
import ProfilePopup from "./ProfilePopup";
import { FaSearch, FaEdit } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import userImg from "../assets/img/user2.svg";

const userPoolId = process.env.REACT_APP_USER_POOL_ID;

function SidePanel({ user, userName, onSelectChat }) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userProfileImage, setUserProfileImage] = useState(userImg);

  const profileImageRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const cognito = new CognitoIdentityServiceProvider();
      const dynamoDb = new AWS.DynamoDB();

      const params = {
        UserPoolId: userPoolId,
      };

      try {
        const response = await cognito.listUsers(params).promise();
        const users = response.Users.map(async (user) => {
          const userId = user.Username;
          const userName = user.Attributes.find(
            (attr) => attr.Name === "name"
          ).Value;
          const userEmail = user.Attributes.find(
            (attr) => attr.Name === "email"
          ).Value;

          const params = {
            TableName: "UserProfile",
            Key: {
              userId: { S: userId },
            },
          };

          let userProfileImage = userImg;
          try {
            const response = await dynamoDb.getItem(params).promise();
            if (response.Item && response.Item.profileImage) {
              userProfileImage = response.Item.profileImage.S;
            }
          } catch (error) {
            console.error(
              "Error fetching profile image from the database:",
              error
            );
          }

          return {
            id: userId,
            name: userName,
            email: userEmail,
            profilePicture: userProfileImage,
          };
        });

        const resolvedUsers = await Promise.all(users);
        const filteredUsers = resolvedUsers.filter(
          (contact) => contact.email !== user.id
        );

        setContacts(filteredUsers);
      } catch (error) {
        console.error("An error occurred while fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      const dynamoDb = new AWS.DynamoDB();
      const params = {
        TableName: "UserProfile",
        Key: {
          userId: { S: user.id },
        },
      };

      try {
        const response = await dynamoDb.getItem(params).promise();
        if (response.Item && response.Item.profileImage) {
          setUserProfileImage(response.Item.profileImage.S);
        }
      } catch (error) {
        console.error("Error fetching profile image from the database:", error);
      }
    };

    fetchUserProfileImage();
  }, []);

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const updateUserProfileImage = (userId, imageUrl) => {
    setContacts((prevContacts) => {
      return prevContacts.map((contact) => {
        if (contact.id === userId) {
          return { ...contact, profilePicture: imageUrl };
        }
        return contact;
      });
    });
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="side-panel glassmorphic">
      <div className="side-panel-inner">
        <div className="side-panel-header glassmorphic">
          <div
            className="user-profile-image-container"
            ref={profileImageRef}
            onClick={toggleProfilePopup}
          >
            <img
              src={userProfileImage}
              alt="User profile"
              className="user-profile-image glassmorphic"
            />
            <div className="image-overlay glassmorphic">
              <FaEdit />
            </div>
          </div>
          <div className="chat-search glassmorphic">
            <FaSearch />
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <ProfilePopup
            userId={user.id}
            className={showProfilePopup ? "show glassmorphic" : ""}
            onClose={toggleProfilePopup}
            setUserProfileImage={setUserProfileImage}
            updateUserProfileImage={updateUserProfileImage}
            onUpdateContactProfileImage={updateUserProfileImage}
          />
        </div>
        <div className="side-panel-content">
          {filteredContacts.map((contact) => (
            <Contact
              key={contact.id}
              name={contact.name}
              email={contact.email} // should i be testing to see which emails come back
              profilePicture={contact.profilePicture}
              onSelectChat={() => onSelectChat(contact)}
            />
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SidePanel;
