import { PRODUCTS } from './products';

export const INITIAL_GREETING = "Welcome in! What can I help you find today?";

export const QUICK_PROMPTS = [
  "Best laptop for work & coding",
  "Which flagship phone has the best camera?",
  "Tell me about the MacBook Air M2",
  "What is your top recommended phone?",
  "Looking for budget options under $750"
];

/**
 * Intelligent shopkeeper knowledge response generator for Laptops & Phones.
 */
export function getShopkeeperReply(userInput) {
  const query = userInput.toLowerCase().trim();

  // MacBook Air M2 specific
  if (query.includes("macbook") || query.includes("m2") || query.includes("apple")) {
    const item = PRODUCTS.find(p => p.id === "P105") || PRODUCTS.find(p => p.id === "P103");
    return {
      text: "Apple products are engineered with exceptional care! The MacBook Air M2 is quiet, incredibly fast, and gets up to 18 hours of battery life. If you're looking for a phone to match, the iPhone 15 features the Dynamic Island and a 48MP main camera.",
      recommendedProducts: item ? [item] : []
    };
  }

  // Coding / work / business laptops
  if (query.includes("code") || query.includes("coding") || query.includes("developer") || query.includes("work") || query.includes("business") || query.includes("laptop")) {
    const thinkpad = PRODUCTS.find(p => p.id === "P104");
    const dell = PRODUCTS.find(p => p.id === "P101");
    return {
      text: "For software work and deep focus sessions, you really want durable hardware and ergonomic keyboards. Our Lenovo ThinkPad E15 has a legendary keyboard and Intel Core i7 power. For an everyday workhorse, the Dell Inspiron 15 gives you 16GB RAM at a fantastic value.",
      recommendedProducts: [thinkpad, dell].filter(Boolean)
    };
  }

  // Camera / phone / flagship
  if (query.includes("camera") || query.includes("phone") || query.includes("s24") || query.includes("iphone") || query.includes("oneplus")) {
    const s24 = PRODUCTS.find(p => p.id === "P102");
    const iphone = PRODUCTS.find(p => p.id === "P103");
    return {
      text: "Our mobile lineup features the very best in camera technology and performance. The Samsung Galaxy S24 brings Galaxy AI and a 50MP pro camera, while the iPhone 15 offers seamless iOS integration and 48MP optics. The OnePlus 12 brings Hasselblad tuned color science!",
      recommendedProducts: [s24, iphone].filter(Boolean)
    };
  }

  // Budget / price / cheap / under 750
  if (query.includes("budget") || query.includes("cheap") || query.includes("affordable") || query.includes("under 750") || query.includes("under $750")) {
    const dell = PRODUCTS.find(p => p.id === "P101");
    const oneplus = PRODUCTS.find(p => p.id === "P106");
    return {
      text: "We believe quality tech shouldn't cost a fortune. The Dell Inspiron 15 comes in at $650 with 16GB RAM, while the OnePlus 12 gives you flagship Snapdragon 8 Gen 3 speed for $699.",
      recommendedProducts: [dell, oneplus].filter(Boolean)
    };
  }

  // Return policy / warranty / shipping
  if (query.includes("return") || query.includes("warranty") || query.includes("ship") || query.includes("policy") || query.includes("trial")) {
    return {
      text: "We want you to feel completely at ease. Every device comes with full brand warranty and our 30-day Gentle Living Trial. Take it home, test it out. If it doesn't meet your needs, we offer hassle-free returns.",
      recommendedProducts: []
    };
  }

  // Inquiry about specific product name or brand
  for (const product of PRODUCTS) {
    if (query.includes(product.name.toLowerCase()) || query.includes(product.id.toLowerCase()) || query.includes(product.brand.toLowerCase())) {
      return {
        text: `Ah, the ${product.name}! ${product.description} It is currently in stock for $${product.price} with a rating of ${product.rating}/5. Would you like to add it to your tote?`,
        recommendedProducts: [product]
      };
    }
  }

  // General helpful response
  return {
    text: "I'd be glad to help you find the right device! We specialize in high-performance Laptops (Dell, Lenovo, Apple) and flagship Mobile Phones (Samsung, Apple, OnePlus). Are you looking primarily for work computing or mobile photography?",
    recommendedProducts: [PRODUCTS[0], PRODUCTS[3]]
  };
}

