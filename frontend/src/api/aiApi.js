import { PRODUCTS } from '../data/products';
import { getShopkeeperReply } from '../data/shopkeeperBrain';

const API_BASE = 'http://localhost:8080/api';

/**
 * Ask the shopkeeper / AI shopping assistant
 */
export async function askShopkeeper(query) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE}/ai/shopping-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      // Map backend response format to shopkeeper message
      let recommendedProducts = [];
      if (Array.isArray(data.recommendations)) {
        recommendedProducts = data.recommendations.map(rec => {
          const match = PRODUCTS.find(p => p.id === rec.productId);
          return match || {
            id: rec.productId || 'REC',
            name: rec.productName,
            price: rec.price || 999,
            category: 'Laptops',
            image: '/images/laptop_showcase.jpg',
            description: rec.reason || 'Curated recommendation from the inventory.',
            curatorsNote: rec.reason || 'Selected for your exact needs.'
          };
        });
      }
      return {
        text: data.interpretedRequirement 
          ? `I understand you're looking for: "${data.interpretedRequirement}". Here is what I pulled from our workshop shelves:`
          : (data.text || "Here are my personal recommendations based on what you asked:"),
        recommendedProducts
      };
    }
  } catch {
    // Backend not running or timed out; use rich local shopkeeper brain
  }

  return getShopkeeperReply(query);
}
