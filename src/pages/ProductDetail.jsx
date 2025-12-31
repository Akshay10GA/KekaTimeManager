import React from "react";
import "./ProductDetail.css";

export default function ProductDetail({ product, addToCart }) {
  if (!product) return null;
  return (
    <div className="container p-detail-container fade-in">
      <div className="pd-gallery">
        <img src={product.image} alt={product.name} className="pd-main-img" />
      </div>
      <div className="pd-info">
        <div style={{ marginBottom: '20px', textTransform: 'uppercase', color: '#888', fontSize: '0.8rem', letterSpacing: '1px' }}>Pehrin / {product.category}</div>
        <h1>{product.name}</h1>
        <div className="pd-price">₹{product.price.toLocaleString()}</div>
        <div className="pd-desc">
          <p>{product.desc}</p>
          <p style={{ marginTop: '10px' }}>Handcrafted with love in Jaipur. Pure cotton fabric ensures breathability and comfort for all-day wear.</p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <span style={{ display:'block', marginBottom:'8px', fontWeight:'600', fontSize:'0.9rem' }}>SIZE</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
              <button key={size} style={{ width: '40px', height: '40px', border: '1px solid #ddd', borderRadius: '50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem' }}>{size}</button>
            ))}
          </div>
        </div>

        <button onClick={() => addToCart(product)} className="btn-add-cart">
          Add to Cart - ₹{product.price.toLocaleString()}
        </button>
        
        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.9rem' }}><div style={{ width: '10px', height: '10px', background: '#32CD32', borderRadius: '50%' }}></div> In Stock - Ships in 2 days</div>
        </div>
      </div>
    </div>
  );
}