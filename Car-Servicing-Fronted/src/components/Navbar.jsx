import React from "react";

function Navbar({ title }) {
  return (
    <div style={{ background: "#1976d2", padding: "15px", color: "white" }}>
      <h2>{title}</h2>
    </div>
  );
}

export default Navbar;