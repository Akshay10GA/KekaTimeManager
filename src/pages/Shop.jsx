import React from "react";
import ProductCard from "../components/ProductCard";
import "./Shop.css";

export default function Shop({ products, categoryFilter, setCategoryFilter, openProduct }) {
  const filteredProducts = products.filter(p => categoryFilter === "all" || p.category === categoryFilter);

  return (
    <div className="section container fade-in" style={{ paddingTop: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="grid-title" style={{ marginBottom: '10px' }}>Shop All</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {['all', 'suits', 'kurtis', 'dresses', 'coords'].map(cat => (
            <button 
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onClick={() => openProduct(product)} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>No products found in this category.</div>
      )}
    </div>
  );
}