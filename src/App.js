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
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser({ name: "Logged in user" });
    }
  }, []);

  const handleSignUp = (email, password) => {
    signUp(email, password).then((userData) => {
      setUser(userData);
    });
  };

  const handleLogin = (email, password) => {
    signIn(email, password).then((userData) => {
      setUser(userData);
    });
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
