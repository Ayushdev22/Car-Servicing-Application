import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css"; // Create this CSS file

function AdminLogin() {
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
      const res = await API.post("/admin/login", data);
      
      // Store admin data
      localStorage.setItem("adminId", res.data.id);
      localStorage.setItem("adminEmail", data.email);
      localStorage.setItem("adminRole", "ADMIN");
      
      // Store token if your API returns one
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
      }
      
      setMessage("✅ Login Successful! Redirecting to Admin Dashboard...");
      setMessageType("success");
      
      // Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
      
    } catch (error) {
      console.error("Admin login error:", error);
      
      // Handle different error scenarios
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setMessage("❌ Invalid admin credentials!");
            break;
          case 403:
            setMessage("❌ Access denied! Admin privileges required.");
            break;
          case 404:
            setMessage("❌ Admin account not found!");
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
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-icon">⚙️</div>
          <h2>Admin Portal</h2>
          <p>Secure access for administrators only</p>
        </div>

        {message && (
          <div className={`admin-message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="admin-login-form">
          <div className="admin-form-row">
            <label>Admin Email</label>
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">📧</span>
              <input
                type="email"
                placeholder="Enter admin email"
                value={data.email}
                onChange={e => setData({...data, email: e.target.value})}
                onKeyPress={handleKeyPress}
                className="admin-form-input"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <label>Admin Password</label>
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={data.password}
                onChange={e => setData({...data, password: e.target.value})}
                onKeyPress={handleKeyPress}
                className="admin-form-input"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button 
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="admin-form-options">
            <label className="admin-remember">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/admin/forgot-password" className="admin-forgot">
              Forgot Password?
            </a>
          </div>

          <button 
            onClick={login} 
            className={`admin-login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="admin-spinner"></span>
                Authenticating...
              </>
            ) : (
              'Access Admin Dashboard'
            )}
          </button>
        </div>

        <div className="admin-security-badge">
          <span className="security-icon">🛡️</span>
          <span>Secure Admin Access</span>
        </div>

        <div className="admin-demo-credentials">
          <p>Demo Admin Credentials:</p>
          <small>Email: admin@demo.com</small>
          <small>Password: admin123</small>
          <small className="admin-note">(For testing purposes only)</small>
        </div>

        <div className="admin-footer">
          <a href="/">← Back to Home</a>
          <span className="separator">|</span>
          <a href="/login">User Login</a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="admin-decoration">
        <div className="admin-circle circle-1"></div>
        <div className="admin-circle circle-2"></div>
        <div className="admin-circle circle-3"></div>
      </div>
    </div>
  );
}

export default AdminLogin;