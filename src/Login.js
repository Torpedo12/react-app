import React, { useState } from "react";
import { motion } from "framer-motion";
import "./index.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email === "arthpatel12@gmail.com" && password === "Asd@123") {
      localStorage.setItem("isAuthenticated", "true");
      onLogin();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="login-box"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h2>Charity Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
            whileFocus={{ scale: 1.05 }}
          />
          {error && <motion.p className="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
          <motion.button 
            type="submit" 
            className="login-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;