import React from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import "./Header.css";

export default function Header({ cartCount, onMenuClick, onCartClick, onSearchClick, navigate, setCategoryFilter }) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick}><Menu size={24} /></button>
      
      <div className="nav-desktop">
        <button onClick={() => { setCategoryFilter('all'); navigate("shop"); }}>Shop</button>
        <button onClick={() => { setCategoryFilter("kurtis"); navigate("shop"); }}>Kurtis</button>
        <button onClick={() => navigate("about")}>About</button>
      </div>

      <div className="brand" onClick={() => navigate("home")} style={{ cursor: 'pointer' }}>PEHRIN</div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <button onClick={onSearchClick}><Search size={22} strokeWidth={1.5} /></button>
        <button className="nav-desktop"><User size={22} strokeWidth={1.5} /></button>
        <button onClick={onCartClick} style={{ position: 'relative' }}>
          <ShoppingBag size={22} strokeWidth={1.5} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}