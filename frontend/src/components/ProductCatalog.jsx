import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../api/productApi';
import { createOrder } from '../api/orderApi';

/**
 * ProductCatalog Component
 * Neo-Bento UI layout for products showcase with instant filters and quick ordering.
 */
function ProductCatalog({ heroSearchQuery = '' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(heroSearchQuery);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [loading, setLoading] = useState(true);

  // Modal State for Order Placement
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderEmail, setOrderEmail] = useState('user@shopsmart.ai');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (heroSearchQuery !== undefined) setSearchQuery(heroSearchQuery);
  }, [heroSearchQuery]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, maxPrice]);

  const loadCategories = async () => {
    const catList = await fetchCategories();
    setCategories(catList);
  };

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts({
      category: selectedCategory,
      q: searchQuery,
      maxPrice: maxPrice
    });
    setProducts(data);
    setLoading(false);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setOrdering(true);
    setOrderSuccess(null);

    const result = await createOrder({
      customerEmail: orderEmail,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: orderQuantity,
      price: selectedProduct.price
    });

    setOrdering(false);
    setOrderSuccess(result);
  };

  return (
    <div className="neo-catalog-container">
      {/* 1. Filter Command Bar */}
      <div className="neo-filter-bar">
        <div className="filter-top-row">
          <h2>🛒 Explore Featured Products</h2>
          <span className="product-count">{products.length} Products Found</span>
        </div>

        <div className="filter-input-grid">
          {/* Search Box */}
          <div className="neo-search-input-box">
            <span className="search-icon-inside">🔍</span>
            <input
              type="text"
              placeholder="Search products by name, specs, or brand (e.g. Dell, Apple)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Price Range Slider */}
          <div className="neo-price-slider-box">
            <label>Max Budget: <strong>${maxPrice}</strong></label>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="neo-category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`neo-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Bento Product Grid */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Neo-Bento catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No matching products found.</h3>
          <p>Try clearing your search query or increasing your budget limit.</p>
          <button className="btn-primary" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(2000); }} style={{ marginTop: '12px' }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="neo-product-grid">
          {products.map((product) => (
            <div key={product.id} className="neo-product-card">
              <div className="neo-card-img-wrapper">
                <img src={product.image_url} alt={product.name} loading="lazy" />
                <span className="neo-badge-category">{product.category}</span>
                <span className="neo-badge-stock">{product.stock_qty} in stock</span>
              </div>

              <div className="neo-card-body">
                <div className="neo-card-meta">
                  <span className="neo-brand-tag">{product.brand}</span>
                  <span className="neo-rating-pill">⭐ {product.rating}</span>
                </div>

                <h3 className="neo-product-title">{product.name}</h3>
                <p className="neo-product-desc">{product.description}</p>

                <div className="neo-card-footer">
                  <div className="neo-price">
                    <span className="currency">$</span>
                    {product.price.toFixed(2)}
                  </div>

                  <button
                    className="btn-neo-order"
                    onClick={() => {
                      setSelectedProduct(product);
                      setOrderSuccess(null);
                    }}
                  >
                    Order Now ⚡
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Order Modal */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Place Simulated Order</h3>
              <button className="close-modal" onClick={() => setSelectedProduct(null)}>✕</button>
            </div>

            {orderSuccess ? (
              <div className="modal-success">
                <div className="success-icon">🎉</div>
                <h4 style={{ color: '#ffffff', marginBottom: '8px' }}>Order Placed Successfully!</h4>
                <p className="order-number-badge">Tracking #: <strong>{orderSuccess.orderNumber}</strong></p>
                <div className="order-summary-box">
                  <p><strong>Item:</strong> {orderSuccess.productName}</p>
                  <p><strong>Quantity:</strong> {orderSuccess.quantity}</p>
                  <p><strong>Total:</strong> ${orderSuccess.totalPrice.toFixed(2)}</p>
                  <p><strong>Status:</strong> <span className="status-pill">{orderSuccess.status}</span></p>
                  <p><strong>Info:</strong> {orderSuccess.trackingInfo}</p>
                </div>
                <button className="btn-primary modal-done-btn" onClick={() => setSelectedProduct(null)} style={{ marginTop: '16px', width: '100%' }}>
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="modal-form">
                <div className="selected-item-preview">
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="preview-img" />
                  <div>
                    <h4 style={{ color: '#ffffff' }}>{selectedProduct.name}</h4>
                    <p className="preview-price" style={{ color: '#06b6d4', fontWeight: '800' }}>${selectedProduct.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Customer Email Address</label>
                  <input
                    type="email"
                    required
                    value={orderEmail}
                    onChange={(e) => setOrderEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.stock_qty || 10}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(parseInt(e.target.value, 10) || 1)}
                  />
                </div>

                <div className="total-calculation" style={{ color: '#ffffff' }}>
                  <span>Total Amount:</span>
                  <strong>${(selectedProduct.price * orderQuantity).toFixed(2)}</strong>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setSelectedProduct(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={ordering}>
                    {ordering ? 'Processing...' : 'Confirm Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;
