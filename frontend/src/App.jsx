import React, { useState } from 'react';

// Import Tab Components
import ProductCatalog from './components/ProductCatalog';
import ShoppingAssistant from './components/ShoppingAssistant';
import PolicyAssistant from './components/PolicyAssistant';
import OrderTracker from './components/OrderTracker';

/**
 * Main App Container for ShopSmart AI
 * Futuristic Neo-Bento AI Storefront with embedded command bar & interactive glass UI.
 */
function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [heroPrompt, setHeroPrompt] = useState('');
  const [cartCount, setCartCount] = useState(2);

  const handleHeroCommandSubmit = (e) => {
    e.preventDefault();
    if (!heroPrompt.trim()) return;
    setActiveTab('shopping-ai');
  };

  return (
    <div className="neo-app-wrapper">
      {/* 1. Floating Glass Pill Navbar */}
      <header className="neo-navbar">
        <div className="neo-brand" onClick={() => setActiveTab('catalog')}>
          <div className="neo-brand-icon">⚡</div>
          <span className="neo-brand-text">ShopSmart AI</span>
        </div>

        <nav className="neo-nav-pills">
          <button
            className={`neo-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            🛍️ Products Store
          </button>

          <button
            className={`neo-tab-btn ${activeTab === 'shopping-ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('shopping-ai')}
          >
            🤖 AI Co-Pilot
          </button>

          <button
            className={`neo-tab-btn ${activeTab === 'policy-rag' ? 'active' : ''}`}
            onClick={() => setActiveTab('policy-rag')}
          >
            📚 RAG Policies
          </button>

          <button
            className={`neo-tab-btn ${activeTab === 'order-tracking' ? 'active' : ''}`}
            onClick={() => setActiveTab('order-tracking')}
          >
            📦 Track Shipment
          </button>
        </nav>

        <div className="neo-nav-actions">
          <div className="neo-status-badge">
            <span className="neo-dot-pulse"></span>
            <span>Backend Online (:8080)</span>
          </div>

          <div className="neo-cart-pill" onClick={() => setActiveTab('order-tracking')}>
            <span>🛒 Cart</span>
            <span className="neo-cart-badge">{cartCount}</span>
          </div>
        </div>
      </header>

      {/* 2. Hero Bento AI Command Section (Shown on Store View) */}
      {activeTab === 'catalog' && (
        <section className="neo-hero-bento">
          {/* Main Hero Tile */}
          <div className="bento-hero-tile">
            <div>
              <div className="hero-pill-badge">✨ Next-Gen AI Shopping Engine</div>
              <h1 className="hero-heading">Shop Smarter with Real-Time AI Recommendations</h1>
              <p className="hero-subtitle">
                Type what you need in plain English below or browse our curated tech catalog.
              </p>
            </div>

            {/* Embedded AI Command Bar */}
            <form onSubmit={handleHeroCommandSubmit} className="hero-ai-command-bar">
              <input
                type="text"
                placeholder="e.g. Find me a laptop under $1000 for Java development & AI..."
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
              />
              <button type="submit" className="btn-command-ask">
                Ask AI Co-Pilot ⚡
              </button>
            </form>
          </div>

          {/* Side Bento Stats Tile */}
          <div className="bento-side-tile">
            <div className="side-tile-title">⚡ AI Studio Metrics</div>

            <div className="bento-stat-item">
              <span className="stat-label">Supported Models</span>
              <span className="stat-value">Gemini & Spring AI</span>
            </div>

            <div className="bento-stat-item">
              <span className="stat-label">Vector Search</span>
              <span className="stat-value">PgVector RAG</span>
            </div>

            <div className="bento-stat-item">
              <span className="stat-label">Delivery Guarantee</span>
              <span className="stat-value">1-Day Express</span>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Main View */}
      <main className="neo-main-content">
        {activeTab === 'catalog' && <ProductCatalog heroSearchQuery={heroPrompt} />}
        {activeTab === 'shopping-ai' && <ShoppingAssistant initialPrompt={heroPrompt} />}
        {activeTab === 'policy-rag' && <PolicyAssistant />}
        {activeTab === 'order-tracking' && <OrderTracker />}
      </main>
    </div>
  );
}

export default App;
