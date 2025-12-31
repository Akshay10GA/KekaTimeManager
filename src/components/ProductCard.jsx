import React from "react";
import { Heart } from "lucide-react";
import "./ProductCard.css";

export default function ProductCard({ product, onClick }) {
  return (
    <div className="product-card" onClick={onClick}>
      <div className="p-img-wrap">
        <img src={product.image} alt={product.name} className="p-img" />
        <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); alert("Added to wishlist!"); }}>
          <Heart size={16} />
        </button>
      </div>
      <div className="p-details">
        <h3>{product.name}</h3>
        <div className="p-price">₹{product.price.toLocaleString()}</div>
      </div>
    </div>
  );
}