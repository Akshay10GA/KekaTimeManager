import React, { useState } from "react";
import { X } from "lucide-react";
import "./App.css";

// Import Data
import { PRODUCTS } from "./data/products";

// Import Components
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

// Import Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  // --- State Management ---
  const [view, setView] = useState("home"); // home, shop, product, about, contact
  const [activeProduct, setActiveProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // --- Actions ---
  const navigate = (page, product = null) => {
    setView(page);
    if (product) setActiveProduct(product);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    window.scrollTo(0, 0);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // --- Render View Helper ---
  const renderView = () => {
    switch (view) {
      case "home":
        return <Home products={PRODUCTS} navigate={navigate} setCategoryFilter={setCategoryFilter} openProduct={(p) => navigate("product", p)} />;
      case "shop":
        return <Shop products={PRODUCTS} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} openProduct={(p) => navigate("product", p)} />;
      case "product":
        return <ProductDetail product={activeProduct} addToCart={addToCart} />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      default:
        return <Home products={PRODUCTS} navigate={navigate} setCategoryFilter={setCategoryFilter} openProduct={(p) => navigate("product", p)} />;
    }
  };

  return (
    <div className="app">
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        navigate={navigate} 
        setCategoryFilter={setCategoryFilter} 
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        removeFromCart={removeFromCart} 
      />

      <Header 
        cartCount={cart.length}
        onMenuClick={() => setIsMenuOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={() => setIsSearchOpen(!isSearchOpen)}
        navigate={navigate}
        setCategoryFilter={setCategoryFilter}
      />

      {/* Search Overlay Logic */}
      <div className={`search-overlay ${isSearchOpen ? "open" : ""}`}>
        <div className="container" style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search for kurtas, suits, etc..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { 
              if(e.key === 'Enter') {
                // Simplistic search implementation for now
                setCategoryFilter('all'); 
                navigate('shop'); 
              }
            }}
          />
          <button onClick={() => setIsSearchOpen(false)} style={{ position: 'absolute', right: 0, top: '10px' }}><X size={24} /></button>
        </div>
      </div>

      <main style={{ minHeight: '60vh' }}>
        {renderView()}
      </main>

      <Footer navigate={navigate} setCategoryFilter={setCategoryFilter} />
    </div>
  );
}