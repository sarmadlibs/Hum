import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "react-lottie";
import { signIn } from "../utils/auth";
import "../styles/Login.css";
import animationData from "../assets/humming.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const messageRef = useRef(null);

  useEffect(() => {
    const chars = "Let your conversations take flight..".split("");
    const $text = messageRef.current;
    $text.innerHTML = chars.map((c, i) => `<span>${c}</span>`).join("");

    anime({
      targets: $text.querySelectorAll("span"),
      color: [
        { value: "#2c345a" },
        { value: "#7FFFD4" },
        { value: "#FFFFFF" },
        { value: "#9370DB" },
      ],
      duration: 2500,
      delay: anime.stagger(50),
      loop: true,
      easing: "linear",
      direction: "alternate",
    });

    return () => {
      anime.remove($text.querySelectorAll("span"));
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password)
      .then((userData) => {
        onLogin(userData);
        navigate("/chat");
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Login failed, please try again.");
      });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">HUM</h2>
      <div className="catchphrase" ref={messageRef}>
        {" "}
        Let your conversations take flight..
      </div>
      <div className="animation-login-container">
        <Lottie options={defaultOptions} height={200} width={200} />
      </div>
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
