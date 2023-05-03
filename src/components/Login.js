import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../utils/auth";
import "../styles/Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password)
      .then((userData) => {
        onLogin(userData); // Pass the entire userData object instead of just email and password
        navigate("/chat");
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Login failed, please try again.");
      });
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="loginLabel" htmlFor="email">
              Email
            </label>
            <input
              className="loginInput"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="loginLabel" htmlFor="password">
              Password
            </label>
            <input
              className="loginInput"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="loginButton" type="submit">
            Login
          </button>
          <div className="register-link">
            <p>
              Don't have an account? <Link to="/signup">Register here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
