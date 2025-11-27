import React from "react";
import "./HamburgerMennu.css"; // This import requires the file above to exist

const HamburgerMenu = ({ onClick }) => {
  return (
    <div className="hamburger-menu-container hamburger-menu">
      <button className="hamburger-menu-button" onClick={onClick}>
        {/* Hamburger Icon */}
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

        {/* Menu Text */}
        <span>Menu</span>
      </button>
    </div>
  );
};

export default HamburgerMenu;