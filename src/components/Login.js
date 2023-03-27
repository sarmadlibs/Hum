import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../utils/auth";
import "../styles/Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (email, password) => {
    return signIn(email, password);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password)
      .then(() => {
        onLogin();
        navigate("/chat");
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Login failed, please try again.");
      });
  };

  return (
    <div className="Login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
