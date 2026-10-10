/**
 * Product API Handler for ShopSmart AI
 * Communicates with backend at http://localhost:8080/api/products
 * Includes fallback mock data for offline/standalone frontend testing.
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Realistic mock products for offline/standalone testing
const MOCK_PRODUCTS = [
  {
    id: 'LAP101',
    name: 'Dell Inspiron 15 AI Edition',
    category: 'Laptops',
    brand: 'Dell',
    description: '16GB RAM, Intel Core i7 13th Gen, 512GB NVMe SSD. Perfect for software engineering & AI development.',
    price: 949.99,
    rating: 4.8,
    stock_qty: 15,
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'LAP102',
    name: 'MacBook Air M3 Pro',
    category: 'Laptops',
    brand: 'Apple',
    description: 'Liquid Retina display, 16GB Unified Memory, 18-hour battery life. Ultra lightweight performance.',
    price: 1299.00,
    rating: 4.9,
    stock_qty: 8,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PHN201',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Phones',
    brand: 'Samsung',
    description: '200MP AI Camera, Snapdragon 8 Gen 3, Built-in S-Pen, 5000mAh Battery with super fast charging.',
    price: 1199.99,
    rating: 4.7,
    stock_qty: 22,
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'PHN202',
    name: 'Google Pixel 8 Pro AI',
    category: 'Phones',
    brand: 'Google',
    description: 'Tensor G3 Chip, Gemini Nano On-Device AI, Magic Eraser, Best-in-class computational camera.',
    price: 899.00,
    rating: 4.6,
    stock_qty: 12,
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'AUD301',
    name: 'Sony WH-1000XM5 ANC Headphones',
    category: 'Audio',
    brand: 'Sony',
    description: 'Industry-leading noise canceling, 30-hour battery life, crystal clear hands-free calling with AI voice pickup.',
    price: 349.99,
    rating: 4.9,
    stock_qty: 30,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ACC401',
    name: 'Logitech MX Master 3S Ergonomic Mouse',
    category: 'Accessories',
    brand: 'Logitech',
    description: '8K DPI track on glass sensor, Quiet clicks, MagSpeed electromagnetic scrolling for power users.',
    price: 99.99,
    rating: 4.8,
    stock_qty: 45,
    image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80'
  }
];

/**
 * Fetch list of all products with optional filters
 * @param {Object} params - Filter parameters { category, maxPrice, q }
 */
export async function fetchProducts(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.category && params.category !== 'All') queryParams.append('category', params.category);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.q) queryParams.append('q', params.q);

    const url = `${API_BASE_URL}/products?${queryParams.toString()}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend API unavailable. Returning mock products data.', error.message);
    
    // Filter mock data offline
    return MOCK_PRODUCTS.filter(item => {
      let matches = true;
      if (params.category && params.category !== 'All') {
        matches = matches && item.category.toLowerCase() === params.category.toLowerCase();
      }
      if (params.maxPrice) {
        matches = matches && item.price <= parseFloat(params.maxPrice);
      }
      if (params.q) {
        const query = params.q.toLowerCase();
        matches = matches && (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query)
        );
      }
      return matches;
    });
  }
}

/**
 * Fetch product details by ID
 * @param {string} id - Product ID
 */
export async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error('Product not found');
    return await response.json();
  } catch (error) {
    return MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  }
}

/**
 * Fetch available category names
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    return ['All', 'Laptops', 'Phones', 'Audio', 'Accessories'];
  }
}
