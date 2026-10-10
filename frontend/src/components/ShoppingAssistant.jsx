import React, { useState } from 'react';
import { askShoppingAssistant } from '../api/aiApi';
import { createOrder } from '../api/orderApi';

/**
 * ShoppingAssistant Component (Module 1 AI)
 * AI-powered e-commerce assistant that interprets natural language prompts,
 * extracts budget & preferences, and recommends tailored products.
 */
function ShoppingAssistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [orderNotification, setOrderNotification] = useState(null);

  // Quick sample prompts for judges/users to try with 1 click
  const QUICK_PROMPTS = [
    'Suggest a laptop under $1000 for Java development & coding',
    'Find me the best AI smartphone under $900 for photography',
    'Recommend noise cancelling headphones for working in open office',
    'Suggest ergonomic accessories under $150'
  ];

  const handleAskAI = async (e, customQuery) => {
    if (e) e.preventDefault();
    const promptToSubmit = customQuery || query;
    if (!promptToSubmit.trim()) return;

    setLoading(true);
    setAiResponse(null);
    setOrderNotification(null);

    const response = await askShoppingAssistant(promptToSubmit);
    setAiResponse(response);
    setLoading(false);
  };

  const handleQuickOrderFromAI = async (rec) => {
    const result = await createOrder({
      customerEmail: 'user@shopsmart.ai',
      productId: rec.productId,
      productName: rec.productName,
      quantity: 1,
      price: rec.price
    });

    setOrderNotification(`Order #${result.orderNumber} placed for ${rec.productName}!`);
  };

  return (
    <div className="assistant-container">
      {/* AI Assistant Banner */}
      <div className="ai-banner">
        <div className="ai-badge">🤖 Module 1 · AI Assistant</div>
        <h2>Smart AI Shopping Assistant</h2>
        <p>Tell our AI what you are looking for in plain English. We analyze your requirements and match the ideal products.</p>
      </div>

      {/* Input Box & Prompt Chips */}
      <div className="ai-input-card">
        <form onSubmit={handleAskAI} className="ai-form">
          <input
            type="text"
            className="ai-input"
            placeholder="e.g. Need a high performance laptop under $1200 for software development..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-ai-submit" disabled={loading || !query.trim()}>
            {loading ? 'Analyzing...' : 'Ask AI ✦'}
          </button>
        </form>

        {/* Suggested Quick Prompts */}
        <div className="quick-prompts">
          <span className="prompt-label">Try these sample prompts:</span>
          <div className="chips-wrapper">
            {QUICK_PROMPTS.map((promptText, index) => (
              <button
                key={index}
                className="chip-btn"
                onClick={() => {
                  setQuery(promptText);
                  handleAskAI(null, promptText);
                }}
              >
                💡 "{promptText}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Order Notification Banner */}
      {orderNotification && (
        <div className="notification-banner">
          <span>🎉 {orderNotification}</span>
          <button onClick={() => setOrderNotification(null)}>✕</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="ai-loading-box">
          <div className="ai-pulse-dot"></div>
          <p>Spring AI is parsing your intent & scanning products catalog...</p>
        </div>
      )}

      {/* AI Results Section */}
      {aiResponse && !loading && (
        <div className="ai-results">
          {/* Interpreted Requirement & Budget Card */}
          <div className="intent-card">
            <div className="intent-header">
              <h3>🎯 Requirement Analysis</h3>
              {aiResponse.budget && (
                <span className="budget-tag">Detected Budget: <strong>${aiResponse.budget}</strong></span>
              )}
            </div>
            <p className="interpreted-text">"{aiResponse.interpretedRequirement}"</p>
            {aiResponse.clarifyingQuestion && (
              <div className="clarifying-box">
                <span>💬 Follow-up Suggestion:</span> {aiResponse.clarifyingQuestion}
              </div>
            )}
          </div>

          {/* Recommended Products */}
          <h3 className="recommendations-title">✨ Recommended Products ({aiResponse.recommendations.length})</h3>
          
          <div className="recommendations-grid">
            {aiResponse.recommendations.map((rec) => (
              <div key={rec.productId} className="rec-card">
                <img src={rec.image_url} alt={rec.productName} className="rec-img" />
                <div className="rec-body">
                  <div className="rec-header">
                    <h4>{rec.productName}</h4>
                    <span className="rec-price">${rec.price?.toFixed(2)}</span>
                  </div>

                  <div className="reason-box">
                    <span className="reason-label">Why AI recommends this:</span>
                    <p>{rec.reason}</p>
                  </div>

                  <div className="rec-footer">
                    <span className="availability-badge">✔ {rec.availability}</span>
                    <button
                      className="btn-primary-sm"
                      onClick={() => handleQuickOrderFromAI(rec)}
                    >
                      Instant Order ⚡
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingAssistant;
