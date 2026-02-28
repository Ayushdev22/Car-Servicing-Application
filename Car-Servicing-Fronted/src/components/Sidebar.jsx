import React from "react";

function Sidebar() {
  return (
    <div style={{
      width: "200px",
      background: "#263238",
      color: "white",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <h3>Dashboard</h3>
      <p>Bookings</p>
      <p>Status</p>
    </div>
  );
}

export default Sidebar;