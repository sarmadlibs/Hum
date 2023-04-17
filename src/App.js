import React, { useState, useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { isAuthenticated, signIn, signOut } from "./utils/auth";

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
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/chat"
            element={<ChatWrapper user={user} onLogout={handleLogout} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
