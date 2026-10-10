import React, { useState } from 'react';

// Import Tab Components
import ProductCatalog from './components/ProductCatalog';
import ShoppingAssistant from './components/ShoppingAssistant';
import PolicyAssistant from './components/PolicyAssistant';
import OrderTracker from './components/OrderTracker';

/**
 * Main App Container for ShopSmart AI
 * Manages active navigation tabs and main layout structure.
 */
function App() {
  // Navigation active tab state: 'catalog' | 'shopping-ai' | 'policy-rag' | 'order-tracking'
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <div className="app-wrapper">
      {/* Sleek Glassmorphism Header Navigation */}
      <header className="navbar">
        <div className="brand-logo">
          <span className="brand-icon">⚡</span>
          <h1 className="brand-text">ShopSmart AI</h1>
          <span className="brand-tag">v1.0 Hackathon</span>
        </div>

        {/* Tab Buttons */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            🛒 Products
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

        {/* Backend Connectivity Status Indicator */}
        <div className="server-status-pill">
          <span className="status-dot"></span>
          <span>Backend Ready (:8080)</span>
        </div>
      </header>

      {/* Dynamic Tab View Rendering */}
      <main className="main-content">
        {activeTab === 'catalog' && <ProductCatalog />}
        {activeTab === 'shopping-ai' && <ShoppingAssistant />}
        {activeTab === 'policy-rag' && <PolicyAssistant />}
        {activeTab === 'order-tracking' && <OrderTracker />}
      </main>
    </div>
  );
}

export default App;
