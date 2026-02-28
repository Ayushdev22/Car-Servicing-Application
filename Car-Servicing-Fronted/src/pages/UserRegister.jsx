import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/UserRegister.css"; // Create this CSS file

function UserRegister() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    // Validation
    if (!user.name || !user.email || !user.password || !user.phone) {
      setMessage("❌ Please fill in all fields!");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await API.post("/users/register", user);
      setMessage("✅ Registration Successful! Redirecting to login...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error(error);
      setMessage("❌ Registration Failed! Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Please fill in your details to register</p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="register-form">
          <div className="form-row">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={user.name}
              onChange={e => setUser({...user, name: e.target.value})}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={e => setUser({...user, email: e.target.value})}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={user.phone}
              onChange={e => setUser({...user, phone: e.target.value})}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={user.password}
              onChange={e => setUser({...user, password: e.target.value})}
              className="form-input"
            />
          </div>

          <button 
            onClick={register} 
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>

        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;