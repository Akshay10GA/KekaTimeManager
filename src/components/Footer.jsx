import React from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";
import "./Footer.css";

export default function Footer({ navigate, setCategoryFilter }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand" style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#fff' }}>Pehrin</div>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Contemporary ethnic wear for the modern woman. Made with love in Jaipur.</p>
        </div>
        <div>
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-links">
            <li onClick={() => { setCategoryFilter('all'); navigate('shop'); }}>New Arrivals</li>
            <li onClick={() => { setCategoryFilter('kurtis'); navigate('shop'); }}>Kurtis</li>
            <li onClick={() => { setCategoryFilter('suits'); navigate('shop'); }}>Suit Sets</li>
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li onClick={() => navigate('about')}>About Us</li>
            <li onClick={() => navigate('contact')}>Contact</li>
            <li style={{ cursor: 'pointer' }}>Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <h4 className="footer-heading">Follow Us</h4>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Instagram size={20} />
            <Facebook size={20} />
            <Twitter size={20} />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2024 Pehrin Clothing. All rights reserved.
      </div>
    </footer>
  );
}