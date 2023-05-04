import React, { useRef } from "react";
import AWS from "../awsConfig";
import "../styles/ProfilePopup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DynamoDB } from "aws-sdk";

const s3 = new AWS.S3();

const ProfilePopup = ({
  userId,
  className,
  onClose,
  setUserProfileImage,
  updateUserProfileImage,
  onUpdateContactProfileImage,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const params = {
        Bucket: "chirp-assets",
        Key: `profile-pictures/${userId}/${file.name}`,
        Body: file,
        ContentType: file.type,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading profile image:", err);
          toast.error("Error uploading profile image.");
        } else {
          toast.success("Profile image uploaded successfully!");
          updateProfileImage(userId, data.Location).then(() => {
            updateUserProfileImage(userId, data.Location);
          });
        }
      });
    }
  };

  const updateProfileImage = async (userId, imageUrl) => {
    if (!imageUrl) {
      console.error(
        "Error updating profile image in the database: Image URL is empty or undefined"
      );
      return;
    }

    console.log("UserId:", userId);
    console.log("ImageUrl:", imageUrl);

    const dynamoDb = new DynamoDB();

    const params = {
      TableName: "UserProfile",
      Key: {
        userId: { S: userId },
      },
      UpdateExpression: "SET profileImage = :imageUrl",
      ExpressionAttributeValues: {
        ":imageUrl": { S: imageUrl },
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const response = await dynamoDb.updateItem(params).promise();
      console.log("Profile image updated:", response);

      // Update the image URL in the parent component
      setUserProfileImage(imageUrl);
    } catch (error) {
      console.error("Error updating profile image in the database:", error);
      throw error;
    }

    setUserProfileImage(imageUrl);
    onUpdateContactProfileImage(userId, imageUrl);
  };

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`profile-popup ${className}`} onClick={handlePopupClick}>
      <div className="profile-popup-inner">
        <div className="profile-popup-header">
          <h2>Upload Profile Image</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="profile-popup-content">
          <label className="file-upload-label" htmlFor="file-upload">
            Choose an image
          </label>
          <input
            type="file"
            id="file-upload"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
