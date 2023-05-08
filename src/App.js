import React, { useState, useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ConfirmCode from "./components/ConfirmCode";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { isAuthenticated, signUp, signIn, signOut } from "./utils/auth";

const ChatWrapper = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return <Chat user={user} onLogout={handleLogout} />;
};

function App() {
  const storedName = localStorage.getItem("userName");
  const [user, setUser] = useState(storedName ? { name: storedName } : null);

  useEffect(() => {
    if (isAuthenticated()) {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUser({ name: storedName });
      } else {
        setUser(null);
      }
    }
  }, []);

  const handleSignUp = () => {
    setUser({ name: "Logged in user" });
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("userId", userData.id);
  };

  const handleLogout = () => {
    signOut();
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/chat"
            element={<ChatWrapper user={user} onLogout={handleLogout} />}
          />
          <Route path="/confirm/:email" element={<ConfirmCode />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
