import React from "react";
import { X } from "lucide-react";
import "./MobileMenu.css";

export default function MobileMenu({ isOpen, onClose, navigate, setCategoryFilter }) {
  return (
    <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <span className="brand">Pehrin</span>
        <button onClick={onClose}><X size={28} /></button>
      </div>
      <button className="mm-link" onClick={() => navigate("home")}>Home</button>
      <button className="mm-link" onClick={() => navigate("shop")}>New Arrivals</button>
      <button className="mm-link" onClick={() => { setCategoryFilter("suits"); navigate("shop"); }}>Suits</button>
      <button className="mm-link" onClick={() => navigate("about")}>Our Story</button>
      <button className="mm-link" onClick={() => navigate("contact")}>Contact</button>
    </div>
  );
}