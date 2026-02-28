import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/UserLogin.css"; // Create this CSS file

function UserLogin() {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    // Validation
    if (!data.email || !data.password) {
      setMessage("❌ Please fill in all fields!");
      setMessageType("error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setMessage("❌ Please enter a valid email address!");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await API.post("/users/login", data);
      
      if (res.data && res.data.id) {
        localStorage.setItem("userId", res.data.id);
        localStorage.setItem("userEmail", data.email);
        
        setMessage("✅ Login Successful! Redirecting...");
        setMessageType("success");
        
        // Store token if your API returns one
        if (res.data.token) {
          localStorage.setItem("userToken", res.data.token);
        }
        
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 1500);
      } else {
        setMessage("❌ Invalid response from server!");
        setMessageType("error");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different error scenarios
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setMessage("❌ Invalid email or password!");
            break;
          case 404:
            setMessage("❌ User not found!");
            break;
          case 400:
            setMessage("❌ Please check your credentials!");
            break;
          case 500:
            setMessage("❌ Server error! Please try again later.");
            break;
          default:
            setMessage(`❌ ${error.response.data?.message || "Login failed!"}`);
        }
      } else if (error.request) {
        setMessage("❌ Network error! Please check your connection.");
      } else {
        setMessage("❌ An unexpected error occurred!");
      }
      
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please login to your account</p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="login-form">
          <div className="form-row">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={e => setData({...data, email: e.target.value})}
                onKeyPress={handleKeyPress}
                className="form-input"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={data.password}
                onChange={e => setData({...data, password: e.target.value})}
                onKeyPress={handleKeyPress}
                className="form-input"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button 
            onClick={login} 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>

        <div className="register-link">
          Don't have an account? <a href="/register">Create Account</a>
        </div>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <small>Email: user@demo.com</small>
          <small>Password: demo123</small>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;