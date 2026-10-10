/**
 * Order API Handler for ShopSmart AI
 * Communicates with backend at http://localhost:8080/api/orders
 */

const API_BASE_URL = 'http://localhost:8080/api';

// In-memory mock storage for created orders during offline mode
const MOCK_ORDERS = [
  {
    orderNumber: 'ORD-2026-00123',
    customerEmail: 'user@shopsmart.ai',
    productId: 'LAP101',
    productName: 'Dell Inspiron 15 AI Edition',
    quantity: 1,
    totalPrice: 949.99,
    status: 'SHIPPED',
    trackingInfo: 'Package in transit via FedEx. Estimated delivery: Tomorrow by 5 PM.',
    createdAt: '2026-10-09T10:30:00Z'
  },
  {
    orderNumber: 'ORD-2026-00124',
    customerEmail: 'user@shopsmart.ai',
    productId: 'AUD301',
    productName: 'Sony WH-1000XM5 ANC Headphones',
    quantity: 1,
    totalPrice: 349.99,
    status: 'DELIVERED',
    trackingInfo: 'Delivered to front door on Oct 8, 2026.',
    createdAt: '2026-10-07T14:15:00Z'
  }
];

/**
 * Place a new simulated order
 * @param {Object} orderData - { customerEmail, productId, quantity }
 */
export async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) {
      throw new Error(`Order placement failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend API unavailable. Generating mock order placement.', error.message);
    
    // Create mock order response
    const newOrderNumber = `ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      orderNumber: newOrderNumber,
      customerEmail: orderData.customerEmail || 'customer@example.com',
      productId: orderData.productId,
      productName: orderData.productName || 'ShopSmart Item',
      quantity: orderData.quantity || 1,
      totalPrice: (orderData.price || 99.99) * (orderData.quantity || 1),
      status: 'PLACED',
      trackingInfo: 'Order received & queued for dispatch at warehouse central.',
      createdAt: new Date().toISOString()
    };
    
    MOCK_ORDERS.unshift(newOrder);
    return newOrder;
  }
}

/**
 * Track an order by order number
 * @param {string} orderNumber - e.g. ORD-2026-00123
 */
export async function fetchOrder(orderNumber) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderNumber}`, {
      signal: AbortSignal.timeout(3000)
    });
    if (!response.ok) throw new Error('Order not found');
    return await response.json();
  } catch (error) {
    const found = MOCK_ORDERS.find(o => o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase());
    if (found) return found;

    return {
      orderNumber: orderNumber,
      customerEmail: 'customer@shopsmart.ai',
      productName: 'Dell Inspiron 15 AI Edition',
      quantity: 1,
      totalPrice: 949.99,
      status: 'PROCESSING',
      trackingInfo: 'Order confirmed. Warehouse preparing package for courier pickup.',
      createdAt: new Date().toISOString()
    };
  }
}

/**
 * Fetch all user orders
 */
export async function fetchUserOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/my`, {
      signal: AbortSignal.timeout(3000)
    });
    if (!response.ok) throw new Error('Failed to fetch user orders');
    return await response.json();
  } catch (error) {
    return MOCK_ORDERS;
  }
}
