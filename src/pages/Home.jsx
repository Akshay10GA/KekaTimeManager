import React from "react";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home({ products, navigate, setCategoryFilter, openProduct }) {
  return (
    <div className="fade-in">
      <section className="hero">
        <img src="https://images.unsplash.com/photo-1627260799827-2c9330364402?q=80&w=2000&auto=format&fit=crop" alt="Banner" className="hero-img" />
        <div className="hero-content">
          <p style={{ letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>Spring Summer '25</p>
          <h1>The Jaipur Edit</h1>
          <button onClick={() => navigate("shop")} className="btn-cta">Shop Collection</button>
        </div>
      </section>

      <section className="section container">
        <h2 className="grid-title">New Arrivals</h2>
        <div className="product-grid">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} onClick={() => openProduct(product)} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={() => navigate("shop")} style={{ borderBottom: '1px solid #000', paddingBottom: '4px', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>View All Products</button>
        </div>
      </section>

      <section className="category-split">
        <div className="cat-block">
           <img src="https://images.unsplash.com/photo-1605218427368-80dc6879bb7e?auto=format&fit=crop&q=80&w=600" className="cat-img" />
           <div className="cat-label" onClick={() => { setCategoryFilter('suits'); navigate('shop'); }}>
             SUITS
           </div>
        </div>
        <div className="cat-block">
           <img src="https://images.unsplash.com/photo-1589810635657-232948472d98?auto=format&fit=crop&q=80&w=600" className="cat-img" />
           <div className="cat-label" onClick={() => { setCategoryFilter('kurtis'); navigate('shop'); }}>
             KURTIS
           </div>
        </div>
      </section>
    </div>
  );
}