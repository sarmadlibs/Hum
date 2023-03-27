import React, { useState, useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { isAuthenticated, signIn, signOut } from "./utils/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser({ name: "Logged in user" });
    }
  }, []);

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
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/chat"
            element={<Chat user={user} onLogout={handleLogout} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
