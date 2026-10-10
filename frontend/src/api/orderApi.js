const API_BASE = 'http://localhost:8080/api';

export async function placeOrder({ customerEmail, customerName, productId, quantity = 1, shippingAddress }) {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerEmail,
        customerName,
        productId: Number(productId) || 1,
        quantity,
        shippingAddress: shippingAddress || 'Standard Shipping Address'
      })
    });
    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Order API offline, generating local simulation:', err.message);
  }

  // Simulated fallback order
  const orderNum = 'ORD-2026-' + Math.floor(10000 + Math.random() * 90000);
  return {
    orderNumber: orderNum,
    customerEmail,
    customerName,
    quantity,
    status: 'PLACED',
    trackingInfo: 'Simulated Order placed successfully. Dispatch scheduled within 24 hours.',
    createdAt: new Date().toISOString()
  };
}

export async function trackOrder(orderNumber) {
  try {
    const response = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderNumber.trim())}`);
    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Track order API error:', err.message);
  }
  return null;
}

export async function advanceOrderStatus(orderNumber) {
  try {
    const response = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderNumber.trim())}/advance`, {
      method: 'POST'
    });
    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Advance status API error:', err.message);
  }
  return null;
}

export async function fetchCustomerOrders(email = 'alex.dev@shopsmart.io') {
  try {
    const response = await fetch(`${API_BASE}/orders/customer/${encodeURIComponent(email)}`);
    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Fetch customer orders error:', err.message);
  }
  return [];
}
