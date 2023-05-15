import React, { useState, useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ConfirmCode from "./components/ConfirmCode";

import { AnimatePresence, motion } from "framer-motion";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { isAuthenticated, signOut } from "./utils/auth";

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
  const storedEmail = localStorage.getItem("userEmail");
  const [user, setUser] = useState(
    storedName ? { name: storedName, email: storedEmail } : null
  );

  useEffect(() => {
    if (isAuthenticated()) {
      const storedName = localStorage.getItem("userName");
      const storedEmail = localStorage.getItem("userEmail");
      if (storedName && storedEmail) {
        setUser({ name: storedName, email: storedEmail });
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
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userEmail", userData.email);
  };

  const handleLogout = () => {
    signOut();
    setUser(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  };

  function AppRoutes() {
    const location = useLocation();

    const slideVariants = {
      initial: { opacity: 0, x: 150 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -150 },
    };
    const slideLeftVariants = {
      initial: { opacity: 0, x: -150 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 150 },
    };

    const fadeDownVariants = {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    };

    const slideTransition = {
      type: "tween",
      ease: "anticipate",
      duration: 1,
    };

    const fadeDownTransition = {
      type: "tween",
      ease: "anticipate",
      duration: 1,
    };

    return (
      <AnimatePresence mode="wait" hideScrollBar>
        <Routes key={location.key}>
          <Route
            path="/signup"
            element={
              <motion.div
                key="signup"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideVariants}
                transition={slideTransition}
              >
                <SignUp onSignUp={handleSignUp} />
              </motion.div>
            }
          />
          <Route
            path="/"
            element={
              <motion.div
                key="login"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideLeftVariants}
                transition={slideTransition}
              >
                <Login onLogin={handleLogin} />
              </motion.div>
            }
          />
          <Route
            path="/chat"
            element={
              <motion.div
                key="chat"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeDownVariants}
                transition={fadeDownTransition}
              >
                <ChatWrapper user={user} onLogout={handleLogout} />
              </motion.div>
            }
          />
          <Route
            path="/confirm/:email"
            element={
              <motion.div
                key="confirm"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideVariants}
                transition={slideTransition}
              >
                <ConfirmCode />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
