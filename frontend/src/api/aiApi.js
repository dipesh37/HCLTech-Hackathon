import { PRODUCTS } from '../data/products';
import { getShopkeeperReply } from '../data/shopkeeperBrain';

const API_BASE = 'http://localhost:8080/api';

/**
 * Module 1: AI Shopping Assistant
 */
export async function askShopkeeper(query) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(`${API_BASE}/ai/shopping-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      const data = json.data || json;

      let recommendedProducts = [];
      if (Array.isArray(data.recommendations)) {
        recommendedProducts = data.recommendations.map(rec => {
          const match = PRODUCTS.find(p => String(p.id) === String(rec.productId) || p.name.toLowerCase() === (rec.productName || '').toLowerCase());
          return {
            id: rec.productId || (match ? match.id : 'REC'),
            productId: rec.productId,
            name: rec.productName || (match ? match.name : 'Curated Item'),
            price: rec.price || (match ? match.price : 899),
            category: match ? match.category : 'Electronics',
            image: match ? match.image : 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',
            description: rec.reason || (match ? match.description : 'Selected for your exact needs.'),
            curatorsNote: rec.reason || 'AI verified match',
            reason: rec.reason,
            availability: rec.availability || 'IN_STOCK'
          };
        });
      }

      return {
        interpretedRequirement: data.interpretedRequirement || null,
        budget: data.budget || null,
        clarifyingQuestion: data.clarifyingQuestion || null,
        text: data.interpretedRequirement 
          ? `I analyzed your request for: "${data.interpretedRequirement}".${data.budget ? ` Budget target: $${data.budget}.` : ''} Here are the top vetted recommendations:`
          : "Here are my recommendations from the catalog:",
        recommendedProducts
      };
    }
  } catch (err) {
    console.warn('AI shopping assistant fallback triggered:', err.message);
  }

  return getShopkeeperReply(query);
}

/**
 * Module 2: RAG Policy Assistant
 */
export async function askPolicyAssistant(question) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(`${API_BASE}/ai/policy-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      const data = json.data || json;
      return {
        answer: data.answer,
        confidence: data.confidence || 'HIGH',
        sources: Array.isArray(data.sources) ? data.sources : [],
        followUpRequired: !!data.followUpRequired
      };
    }
  } catch (err) {
    console.warn('Policy assistant fallback triggered:', err.message);
  }

  // Realistic mock policy response if backend connection drops
  return {
    answer: "According to ShopSmart policies, standard returns are accepted within 30 days. Opened electronics can be returned within 7 days if physical damage is not present. Prime members enjoy free priority returns.",
    confidence: "HIGH",
    sources: [
      { document: "Return Policy", section: "Electronics Returns", version: "2026.1" },
      { document: "Membership Benefits", section: "Prime Shipping & Returns", version: "2026.1" }
    ],
    followUpRequired: false
  };
}

/**
 * Knowledge Base: Ingest text policy
 */
export async function ingestTextPolicy({ title, section, version = '2026.1', content }) {
  const response = await fetch(`${API_BASE}/documents/ingest-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, section, version, content })
  });
  const json = await response.json();
  return json.data || json;
}

/**
 * Knowledge Base: List documents
 */
export async function fetchKnowledgeDocuments() {
  try {
    const response = await fetch(`${API_BASE}/documents`);
    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch {
    // fallback
  }
  return [
    { title: 'Return Policy', category: 'Returns & Refunds', version: '2026.1', effectiveDate: 'Jan 2026', region: 'Global' },
    { title: 'Refund Policy', category: 'Billing & SLA', version: '2026.1', effectiveDate: 'Jan 2026', region: 'Global' },
    { title: 'Shipping Policy', category: 'Fulfillment & Logistics', version: '2026.1', effectiveDate: 'Jan 2026', region: 'Global' },
    { title: 'Warranty Policy', category: 'Hardware Protection', version: '2026.1', effectiveDate: 'Jan 2026', region: 'Global' },
    { title: 'Membership Benefits', category: 'Customer Loyalty', version: '2026.1', effectiveDate: 'Jan 2026', region: 'Global' }
  ];
}
