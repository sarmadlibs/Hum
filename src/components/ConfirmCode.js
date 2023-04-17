import React, { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { confirmSignUp } from "../utils/auth";
import "../styles/ConfirmCode.css";

const ConfirmCode = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { email } = useParams();
  const inputRefs = useRef([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    confirmSignUp(email, fullCode)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Confirmation error:", error);
        setError("Confirmation failed, please try again.");
      });
  };

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const inputs = code.map((value, index) => (
    <input
      key={index}
      ref={(el) => (inputRefs.current[index] = el)}
      className="cc-confirmCodeInput"
      type="text"
      maxLength="1"
      value={value}
      onChange={(e) => handleChange(index, e.target.value)}
      onKeyDown={(e) => handleKeyDown(index, e)}
      required
    />
  ));

  return (
    <div className="cc-confirm-container">
      <div className="cc-confirm-content">
        <h2>Confirm Account</h2>
        <p>Please enter the confirmation code sent to your email.</p>
        {error && <div className="cc-error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="cc-input-group cc-code-inputs">{inputs}</div>
          <button className="cc-confirmButton" type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmCode;
