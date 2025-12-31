import React from "react";
import { X } from "lucide-react";
import "./CartDrawer.css";

export default function CartDrawer({ isOpen, onClose, cart, removeFromCart }) {
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Shopping Bag ({cart.length})</h2>
        <button onClick={onClose}><X size={24} /></button>
      </div>
      <div className="cart-items">
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>Your bag is empty.</div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-img" />
              <div className="cart-details">
                <div style={{ fontWeight: '600' }}>{item.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>₹{item.price.toLocaleString()} x {item.qty}</div>
                <button onClick={() => removeFromCart(item.id)} className="cart-remove">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-footer">
        <div className="cart-total"><span>Total</span><span>₹{cartTotal.toLocaleString()}</span></div>
        <button className="btn-add-cart" style={{ marginTop: 0 }} onClick={() => alert("Proceeding to checkout...")}>Checkout</button>
      </div>
    </div>
  );
}