import React, { useState } from "react";
import "./HamburgerMennu.css"; // Ensure this filename matches your actual file
import ConfessionPopup from "../Confessions/ConfessionPopup";

const HamburgerMenu = ({ onClick }) => {
  const [showConfessions, setShowConfessions] = useState(false);

  return (
    <div className="hamburger-menu-container hamburger-menu">
      {/* Existing Menu Button */}
      <button className="hamburger-menu-button" onClick={onClick}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <span>Menu</span>
      </button>

      {/* New Confessions Button */}
      <button 
        className="hamburger-menu-button confession-btn" 
        onClick={() => setShowConfessions(true)}
      >
        <svg
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span>Confess</span>
      </button>

      {/* Popup Component */}
      <ConfessionPopup 
        open={showConfessions} 
        onClose={() => setShowConfessions(false)} 
      />
    </div>
  );
};

export default HamburgerMenu;
