import React, { useState } from 'react';
import { fetchOrder, fetchUserOrders } from '../api/orderApi';

/**
 * OrderTracker Component
 * Allows user to track an existing order by order number or view recent simulated orders.
 */
function OrderTracker() {
  const [orderNumInput, setOrderNumInput] = useState('ORD-2026-00123');
  const [loading, setLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);

  const handleTrackOrder = async (e) => {
    if (e) e.preventDefault();
    if (!orderNumInput.trim()) return;

    setLoading(true);
    const orderData = await fetchOrder(orderNumInput);
    setTrackedOrder(orderData);
    setLoading(false);
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED': return 4;
      default: return 1;
    }
  };

  return (
    <div className="tracker-container">
      <div className="tracker-banner">
        <h2>📦 Real-Time Order Tracking</h2>
        <p>Enter your order confirmation number to view shipment status and delivery estimates.</p>
      </div>

      <div className="tracker-card">
        <form onSubmit={handleTrackOrder} className="tracker-form">
          <input
            type="text"
            className="tracker-input"
            placeholder="e.g. ORD-2026-00123"
            value={orderNumInput}
            onChange={(e) => setOrderNumInput(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Track Order 🚀'}
          </button>
        </form>
      </div>

      {trackedOrder && (
        <div className="order-details-card">
          <div className="details-header">
            <div>
              <h3>Order #{trackedOrder.orderNumber}</h3>
              <p className="customer-email">Customer: {trackedOrder.customerEmail}</p>
            </div>
            <span className={`status-badge-lg status-${trackedOrder.status?.toLowerCase()}`}>
              {trackedOrder.status}
            </span>
          </div>

          {/* Stepper Bar */}
          <div className="stepper-wrapper">
            {['Placed', 'Processing', 'Shipped', 'Delivered'].map((stepLabel, idx) => {
              const currentStep = getStatusStepIndex(trackedOrder.status);
              const stepNumber = idx + 1;
              const isCompleted = stepNumber <= currentStep;
              return (
                <div key={stepLabel} className={`step-item ${isCompleted ? 'completed' : ''}`}>
                  <div className="step-circle">{isCompleted ? '✓' : stepNumber}</div>
                  <span className="step-text">{stepLabel}</span>
                </div>
              );
            })}
          </div>

          <div className="info-summary-grid">
            <div className="info-box">
              <span className="info-label">Product Name</span>
              <strong>{trackedOrder.productName}</strong>
            </div>
            <div className="info-box">
              <span className="info-label">Quantity</span>
              <strong>{trackedOrder.quantity} item(s)</strong>
            </div>
            <div className="info-box">
              <span className="info-label">Total Price</span>
              <strong>${trackedOrder.totalPrice?.toFixed(2)}</strong>
            </div>
          </div>

          <div className="tracking-status-box">
            <span>🚚 Shipping Update:</span>
            <p>{trackedOrder.trackingInfo}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracker;
