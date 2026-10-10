import { PRODUCTS, CATEGORIES } from '../data/products';

const API_BASE = 'http://localhost:8080/api';

export async function fetchProducts(category = null, searchQuery = '') {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    let url = `${API_BASE}/products`;
    const params = new URLSearchParams();
    if (category && category !== 'All Items') params.append('category', category);
    if (searchQuery) params.append('q', searchQuery);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fall back to local products
  }

  // Local filtering
  let filtered = [...PRODUCTS];
  if (category && category !== 'All Items') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.curatorsNote && p.curatorsNote.toLowerCase().includes(q))
    );
  }
  return filtered;
}

export async function fetchCategories() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`${API_BASE}/products/categories`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return ['All Items', ...data];
      }
    }
  } catch {
    // fallback
  }
  return CATEGORIES;
}
