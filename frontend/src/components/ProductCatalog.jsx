import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../api/productApi';
import { createOrder } from '../api/orderApi';

/**
 * ProductCatalog Component
 * Displays interactive product catalog with search, category filtering,
 * price filter, and order placement modal.
 */
function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [loading, setLoading] = useState(true);

  // Modal State for Order Placement
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderEmail, setOrderEmail] = useState('user@shopsmart.ai');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [ordering, setOrdering] = useState(false);

  // Load products and categories on mount or when filter changes
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

  // Handle Order Submission
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
    <div className="catalog-container">
      {/* Search and Filter Controls */}
      <div className="filter-card">
        <div className="filter-header">
          <h2>🛒 Product Catalog</h2>
          <span className="product-count">{products.length} Items Found</span>
        </div>

        <div className="filter-controls">
          {/* Search Input */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products by title or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="price-filter">
            <label>Max Price: <strong>${maxPrice}</strong></label>
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

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No products match your filter.</h3>
          <p>Try clearing your search query or increasing the maximum price slider.</p>
          <button className="btn-primary" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(2000); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="card-image-wrapper">
                <img src={product.image_url} alt={product.name} loading="lazy" />
                <span className="badge-category">{product.category}</span>
                <span className="badge-stock">{product.stock_qty} in stock</span>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span className="brand-name">{product.brand}</span>
                  <span className="rating">⭐ {product.rating}</span>
                </div>

                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="card-footer">
                  <div className="price-tag">
                    <span className="currency">$</span>
                    <span className="amount">{product.price.toFixed(2)}</span>
                  </div>

                  <button
                    className="btn-buy"
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
                <h4>Order Placed Successfully!</h4>
                <p className="order-number-badge">Tracking #: <strong>{orderSuccess.orderNumber}</strong></p>
                <div className="order-summary-box">
                  <p><strong>Item:</strong> {orderSuccess.productName}</p>
                  <p><strong>Quantity:</strong> {orderSuccess.quantity}</p>
                  <p><strong>Total:</strong> ${orderSuccess.totalPrice.toFixed(2)}</p>
                  <p><strong>Status:</strong> <span className="status-pill">{orderSuccess.status}</span></p>
                  <p><strong>Info:</strong> {orderSuccess.trackingInfo}</p>
                </div>
                <button className="btn-primary modal-done-btn" onClick={() => setSelectedProduct(null)}>
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="modal-form">
                <div className="selected-item-preview">
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="preview-img" />
                  <div>
                    <h4>{selectedProduct.name}</h4>
                    <p className="preview-price">${selectedProduct.price.toFixed(2)}</p>
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

                <div className="total-calculation">
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
