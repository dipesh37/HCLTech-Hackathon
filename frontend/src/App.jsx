import React, { useState } from 'react';

// Import Components
import ProductCatalog from './components/ProductCatalog';
import ShoppingAssistant from './components/ShoppingAssistant';
import PolicyAssistant from './components/PolicyAssistant';
import OrderTracker from './components/OrderTracker';

/**
 * Main App Component for ShopSmart AI
 * Clean, bright modern e-commerce storefront with integrated AI features.
 */
function App() {
  // Navigation active tab state: 'catalog' | 'shopping-ai' | 'policy-rag' | 'order-tracking'
  const [activeTab, setActiveTab] = useState('catalog');
  const [cartCount, setCartCount] = useState(2);

  return (
    <div className="app-root">
      {/* Top Announcement Bar */}
      <div className="top-announcement">
        <span>🚀 Free Express Shipping on orders over $50</span>
        <span className="announcement-badge">NEW</span>
        <span>✨ 24/7 AI Shopping Assistant Online</span>
      </div>

      <div className="app-wrapper">
        {/* Modern E-Commerce Header Navbar */}
        <header className="navbar">
          <div className="brand-logo" onClick={() => setActiveTab('catalog')}>
            <div className="brand-icon">⚡</div>
            <div className="brand-title-wrap">
              <h1 className="brand-text">ShopSmart AI</h1>
              <span className="brand-tag">Intelligent E-Commerce</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalog')}
            >
              🛍️ Shop Products
            </button>
            
            <button
              className={`nav-tab-btn ${activeTab === 'shopping-ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('shopping-ai')}
            >
              🤖 AI Assistant
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'policy-rag' ? 'active' : ''}`}
              onClick={() => setActiveTab('policy-rag')}
            >
              📚 Policy RAG
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'order-tracking' ? 'active' : ''}`}
              onClick={() => setActiveTab('order-tracking')}
            >
              📦 Track Order
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="nav-right-actions">
            <div className="server-status-pill">
              <span className="status-dot"></span>
              <span>Backend Ready (:8080)</span>
            </div>

            <button className="cart-icon-btn" title="View Shopping Cart" onClick={() => setActiveTab('order-tracking')}>
              🛒
              <span className="cart-badge-count">{cartCount}</span>
            </button>
          </div>
        </header>

        {/* Hero Banner (Shown when on Products tab) */}
        {activeTab === 'catalog' && (
          <section className="hero-banner">
            <div className="hero-content">
              <span className="hero-tag">✨ AI-Powered E-Commerce Store</span>
              <h2 className="hero-title">Next-Gen Tech, Picked Perfectly For You</h2>
              <p className="hero-subtitle">
                Explore top-tier laptops, smartphones, and audio gear. Need personalized help? Our AI assistant analyzes your exact budget and workflow in real time.
              </p>
              <div className="hero-actions">
                <button className="btn-hero-primary" onClick={() => setActiveTab('shopping-ai')}>
                  Ask AI Shopping Assistant 🤖
                </button>
                <button className="btn-hero-secondary" onClick={() => setActiveTab('policy-rag')}>
                  Read Store Policies 📜
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Main View */}
        <main className="main-content">
          {activeTab === 'catalog' && <ProductCatalog />}
          {activeTab === 'shopping-ai' && <ShoppingAssistant />}
          {activeTab === 'policy-rag' && <PolicyAssistant />}
          {activeTab === 'order-tracking' && <OrderTracker />}
        </main>
      </div>
    </div>
  );
}

export default App;
