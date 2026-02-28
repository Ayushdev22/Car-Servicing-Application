import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      
      <section className="hero">
        <div className="hero-content">
          <h1>Car Servicing System</h1>
          <p>
            Manage bookings, track services and control everything
            in a professional digital system.
          </p>

          <div className="button-group">
            <button onClick={() => navigate("/register")}>
              User Register
            </button>

            <button onClick={() => navigate("/login")}>
              User Login
            </button>

            <button onClick={() => navigate("/admin-login")}>
              Admin Login
            </button>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>System Features</h2>
        <div className="info-list">
          <p>✔ Easy Service Booking</p>
          <p>✔ Service Status Tracking</p>
          <p>✔ Admin Dashboard Control</p>
          <p>✔ Secure Authentication</p>
          <p>✔ Organized Workflow</p>
        </div>
      </section>

      <footer className="footer">
        <h3>Car Servicing Management System</h3>
        <p>Professional Vehicle Service Platform</p>
        <p>© 2026 All Rights Reserved</p>
      </footer>

    </div>
  );
}

export default LandingPage;