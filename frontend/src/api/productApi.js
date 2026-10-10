import { PRODUCTS, CATEGORIES } from '../data/products';

const API_BASE = 'http://localhost:8080/api';

export async function fetchProducts(category = null, searchQuery = '') {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let url = `${API_BASE}/products`;
    const params = new URLSearchParams();
    if (category && category !== 'All' && category !== 'All Items') {
      params.append('category', category);
    }
    if (searchQuery && searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      const list = Array.isArray(json) ? json : (json.data || []);
      if (Array.isArray(list) && list.length > 0) {
        return list.map(item => ({
          ...item,
          id: item.id || item.productId,
          productId: item.productId || item.id,
          image: item.image || item.imageUrl || '/images/default_product.jpg',
          imageUrl: item.imageUrl || item.image || '/images/default_product.jpg',
          stockQuantity: item.stockQuantity ?? item.stockQty ?? 20,
          inStock: item.inStock ?? ((item.stockQuantity ?? item.stockQty ?? 20) > 0)
        }));
      }
    }
  } catch (err) {
    console.warn('Backend unavailable, using rich client catalog:', err.message);
  }

  // Local fallback filtering
  let filtered = [...PRODUCTS];
  if (category && category !== 'All' && category !== 'All Items') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export async function fetchCategories() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${API_BASE}/products/categories`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const json = await response.json();
      const list = Array.isArray(json) ? json : (json.data || []);
      if (Array.isArray(list) && list.length > 0) {
        return ['All', ...list];
      }
    }
  } catch {
    // fallback
  }
  return CATEGORIES;
}

