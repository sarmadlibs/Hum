import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../utils/auth";
import "../styles/SignUp.css";

const SignUp = ({ onSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(email, password)
      .then(() => {
        onSignUp();
        navigate(`/confirm/${encodeURIComponent(email)}`);
      })
      .catch((error) => {
        console.error("Sign up error:", error);
        setError("Sign up failed, please try again.");
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="signupLabel" htmlFor="email">
              Email
            </label>
            <input
              className="signupInput"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="signupLabel" htmlFor="password">
              Password
            </label>
            <input
              className="signupInput"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="signupButton" type="submit">
            Sign Up
          </button>
          <div className="register-link">
            <p>
              Already have an account? <Link to="/">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
