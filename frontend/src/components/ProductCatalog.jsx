import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../api/productApi';
import { createOrder } from '../api/orderApi';

/**
 * ProductCatalog Component
 * Modeled after Amazon & Myntra sidebar filters and high-density product card grid.
 */
function ProductCatalog({ searchQueryExt = '', selectedCategoryExt = 'All' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryExt);
  const [searchQuery, setSearchQuery] = useState(searchQueryExt);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [loading, setLoading] = useState(true);

  // Sync external search from header
  useEffect(() => {
    if (searchQueryExt !== undefined) setSearchQuery(searchQueryExt);
    if (selectedCategoryExt !== undefined) setSelectedCategory(selectedCategoryExt);
  }, [searchQueryExt, selectedCategoryExt]);

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

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(2000);
  };

  return (
    <div className="main-storefront-layout">
      {/* 1. Left Filter Sidebar (Amazon / Myntra Style) */}
      <aside className="sidebar-filter-panel">
        <div className="filter-section-title">
          <span>Filters & Refine</span>
          <span className="filter-reset-link" onClick={resetFilters}>Clear All</span>
        </div>

        {/* Categories Section */}
        <div className="filter-group">
          <label>Category</label>
          <div className="category-list-items">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-item-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                {selectedCategory === cat && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider Section */}
        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-range-box">
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <div className="price-values-txt">
              <span>$50</span>
              <span>Max: <strong>${maxPrice}</strong></span>
            </div>
          </div>
        </div>

        {/* Amazon Rating Filter */}
        <div className="filter-group">
          <label>Customer Reviews</label>
          <div className="category-list-items">
            <button className="category-item-btn active">⭐ 4.0 & Up (All featured)</button>
            <button className="category-item-btn">⭐ 3.0 & Up</button>
          </div>
        </div>

        {/* Availability */}
        <div className="filter-group">
          <label>Availability</label>
          <div className="category-list-items">
            <button className="category-item-btn active">✔ In Stock Items Only</button>
          </div>
        </div>
      </aside>

      {/* 2. Main Catalog Grid (Amazon / Myntra Layout) */}
      <div className="catalog-content-panel">
        {/* Results Header Bar */}
        <div className="results-header-bar">
          <span className="results-count">
            Showing 1–{products.length} of {products.length} results for <strong>"{selectedCategory}"</strong>
          </span>

          <select className="sort-dropdown">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Avg. Customer Review</option>
          </select>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Fetching products from Amazon catalog database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found for your criteria.</h3>
            <p>Try searching for other keywords or clearing the category filter.</p>
            <button className="btn-primary" onClick={resetFilters} style={{ marginTop: '12px' }}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="amazon-product-grid">
            {products.map((product) => {
              const msrp = (product.price * 1.25).toFixed(2);
              return (
                <div key={product.id} className="myntra-product-card">
                  <div className="card-img-box">
                    <img src={product.image_url} alt={product.name} loading="lazy" />
                    <button className="wishlist-icon-btn" title="Add to Wishlist">❤️</button>
                    <span className="deal-badge-tag">20% OFF</span>
                  </div>

                  <div className="card-details-box">
                    <span className="card-brand-title">{product.brand}</span>
                    <h3 className="card-item-title">{product.name}</h3>

                    {/* Amazon Star Rating */}
                    <div className="amazon-rating-row">
                      <span className="stars-icon">★★★★☆</span>
                      <span className="rating-count-txt">{product.rating} (1,240)</span>
                    </div>

                    {/* Price Block */}
                    <div className="pricing-block-row">
                      <span className="curr-price-txt">${product.price.toFixed(2)}</span>
                      <span className="msrp-price-txt">${msrp}</span>
                      <span className="discount-percentage-txt">(20% OFF)</span>
                    </div>

                    <div className="prime-delivery-tag">
                      <span>prime</span> FREE One-Day Delivery
                    </div>

                    <button
                      className="btn-add-cart-amazon"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOrderSuccess(null);
                      }}
                    >
                      Add to Cart 🛒 / Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Order Modal */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Place Order — ShopSmart.ai</h3>
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
                <button className="btn-primary modal-done-btn" onClick={() => setSelectedProduct(null)} style={{ marginTop: '16px', width: '100%' }}>
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="modal-form">
                <div className="selected-item-preview">
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="preview-img" />
                  <div>
                    <h4>{selectedProduct.name}</h4>
                    <p className="preview-price" style={{ color: '#0f172a', fontWeight: '800' }}>${selectedProduct.price.toFixed(2)}</p>
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
