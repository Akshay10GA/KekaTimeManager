import React from "react";
import "./SideNav.css";

const SideNav = ({ currentView, setCurrentView, setShowThemeModal }) => {
  const navItems = [
    { id: "time", label: "Time Tracker", icon: "⏱️" },
    { id: "confessions", label: "Confessions", icon: "🤫" },
    { id: "movies", label: "Movie Reviews", icon: "🍿" },
    { id: "democracy", label: "Townhall", icon: "🏛️" },
    { id: "quiz", label: "Brain Break", icon: "🧠" },
  ];

  return (
    <nav className="trading-sidenav">
      <div className="sidenav-brand">
        <div className="brand-logo">
          <img src="/Leaf_logo.png" alt="Logo" />
        </div>
        <span className="brand-name">KEKA.UNOFFICIAL</span>
      </div>

      <div className="sidenav-menu">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidenav-item ${currentView === item.id ? "active" : ""}`}
            onClick={() => setCurrentView(item.id)}
          >
            <span className="sidenav-icon">{item.icon}</span>
            <span className="sidenav-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="sidenav-footer">
        <button 
          className="theme-btn" 
          onClick={() => setShowThemeModal(true)}
        >
          <span>🎨</span> Canvas Theme
        </button>
        <div className="connection-status mt-3">
          <div className="status-dot"></div>
          <span>SESSION ACTIVE</span>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;