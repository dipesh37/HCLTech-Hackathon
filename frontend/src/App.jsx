import React, { useState } from 'react';

// Import Tab Components
import ProductCatalog from './components/ProductCatalog';
import ShoppingAssistant from './components/ShoppingAssistant';
import PolicyAssistant from './components/PolicyAssistant';
import OrderTracker from './components/OrderTracker';

/**
 * Main App Container for ShopSmart AI
 * Modeled after Amazon & Myntra e-commerce navigation, search, and store layout.
 */
function App() {
  // Active view tab: 'catalog' | 'shopping-ai' | 'policy-rag' | 'order-tracking'
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchCategory, setSearchCategory] = useState('All');
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(3);
  const [cartCount, setCartCount] = useState(2);

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    setActiveTab('catalog');
  };

  return (
    <div className="amazon-myntra-storefront">
      {/* 1. Amazon Top Dark Navy Navigation Bar */}
      <header className="amazon-top-header">
        {/* Brand Logo */}
        <div className="brand-amazon-logo" onClick={() => setActiveTab('catalog')}>
          <div className="brand-icon-box">⚡</div>
          <div className="brand-title-group">
            <span className="brand-name-txt">ShopSmart<span>.ai</span></span>
            <span className="brand-sub-tag">HCLTech Hackathon</span>
          </div>
        </div>

        {/* Global Amazon Search Bar */}
        <form onSubmit={handleGlobalSearch} className="amazon-search-container">
          <select
            className="category-select-dropdown"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Laptops">Laptops</option>
            <option value="Phones">Phones</option>
            <option value="Audio">Audio</option>
            <option value="Accessories">Accessories</option>
          </select>

          <input
            type="text"
            className="amazon-search-input"
            placeholder="Search Dell, MacBook, Pixel, Sony Headphones or ask AI..."
            value={headerSearchQuery}
            onChange={(e) => setHeaderSearchQuery(e.target.value)}
          />

          <button type="submit" className="amazon-search-btn" title="Search Products">
            🔍
          </button>
        </form>

        {/* Right Header Actions */}
        <div className="header-actions-group">
          <div className="header-action-item">
            <span className="small-txt">Hello, Sign in</span>
            <span className="bold-txt">Account & Lists ▾</span>
          </div>

          <div className="wishlist-btn-header" onClick={() => setActiveTab('catalog')}>
            <span>❤️</span>
            <span>Wishlist ({wishlistCount})</span>
          </div>

          <div className="cart-btn-header" onClick={() => setActiveTab('order-tracking')}>
            <span>🛒</span>
            <span>Cart</span>
            <span className="cart-count-badge">{cartCount}</span>
          </div>
        </div>
      </header>

      {/* 2. Amazon Sub-Header Category Navigation Bar */}
      <nav className="amazon-sub-navbar">
        <button
          className={`sub-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          ☰ All Products
        </button>

        <button
          className="sub-nav-item"
          onClick={() => setActiveTab('catalog')}
        >
          💻 Laptops & Computers
        </button>

        <button
          className="sub-nav-item"
          onClick={() => setActiveTab('catalog')}
        >
          📱 Mobiles & Accessories
        </button>

        <button
          className="sub-nav-item"
          onClick={() => setActiveTab('catalog')}
        >
          🎧 Audio & Headphones
        </button>

        <button
          className={`sub-nav-item ${activeTab === 'order-tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('order-tracking')}
        >
          📦 Returns & Orders
        </button>

        <button
          className={`sub-nav-item ${activeTab === 'policy-rag' ? 'active' : ''}`}
          onClick={() => setActiveTab('policy-rag')}
        >
          📜 Policy & RAG Helper
        </button>

        {/* Myntra Style AI Shopping Assistant Tab */}
        <button
          className="sub-nav-item ai-tab"
          onClick={() => setActiveTab('shopping-ai')}
        >
          🤖 AI Shopping Assistant ✨
        </button>
      </nav>

      {/* 3. Hero Promo Banner (Shown on Catalog View) */}
      {activeTab === 'catalog' && (
        <section className="hero-promo-slider">
          <div className="promo-text-side">
            <span className="promo-tag-pill">🔥 MYNTRA & AMAZON TECH FESTIVAL</span>
            <h2 className="promo-title">Up To 40% OFF On AI Laptops, Smartphones & Headphones</h2>
            <p className="promo-subtitle">
              Get instant smart recommendations powered by Spring AI & Gemini. Free 1-Day Prime shipping on all orders.
            </p>

            <div className="promo-badges-row">
              <span className="promo-badge-item">⚡ Free 1-Day Delivery</span>
              <span className="promo-badge-item">🔄 14-Day Easy Returns</span>
              <span className="promo-badge-item">🛡️ 1-Year Manufacturer Warranty</span>
            </div>

            <button className="btn-promo-cta" onClick={() => setActiveTab('shopping-ai')}>
              Try AI Shopping Assistant 🤖
            </button>
          </div>
        </section>
      )}

      {/* Dynamic Main View */}
      <main className="main-content-view">
        {activeTab === 'catalog' && <ProductCatalog searchQueryExt={headerSearchQuery} selectedCategoryExt={searchCategory} />}
        {activeTab === 'shopping-ai' && <ShoppingAssistant />}
        {activeTab === 'policy-rag' && <PolicyAssistant />}
        {activeTab === 'order-tracking' && <OrderTracker />}
      </main>
    </div>
  );
}

export default App;
