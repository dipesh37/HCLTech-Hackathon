import { PRODUCTS } from './products';

export const INITIAL_GREETING = "Welcome in! What can I help you find today?";

export const QUICK_PROMPTS = [
  "I need a quiet laptop for café writing",
  "Best machine for coding & multitasking",
  "Tell me about the Framework modular laptop",
  "What is your personal favorite in the shop?",
  "Looking for gifts or desk accessories under $150"
];

/**
 * Intelligent boutique shopkeeper knowledge response generator.
 * Emulates a thoughtful, knowledgeable local shopkeeper without AI tropes.
 */
export function getShopkeeperReply(userInput) {
  const query = userInput.toLowerCase().trim();

  // Framework laptop specific
  if (query.includes("framework") || query.includes("modular") || query.includes("repair")) {
    const item = PRODUCTS.find(p => p.id === "LAP101");
    return {
      text: "The Framework Laptop 13 is truly the crown jewel of our philosophy here. Every single component—from the 2.8K matte screen to the mainboard and battery—can be swapped with just the screwdriver included in the packaging. If you need two USB-C ports on Monday and an HDMI plus MicroSD card slot on Tuesday, you just slide the brass-accented expansion cards in and out. It's built to last ten years rather than being tossed out in three.",
      recommendedProducts: item ? [item] : []
    };
  }

  // Coding / programming / developer
  if (query.includes("code") || query.includes("coding") || query.includes("developer") || query.includes("programming") || query.includes("java") || query.includes("python")) {
    const thinkpad = PRODUCTS.find(p => p.id === "LAP103");
    const framework = PRODUCTS.find(p => p.id === "LAP101");
    return {
      text: "For software work and deep focus sessions, you really want two things: comfortable key travel and ample memory. Our ThinkPad Carbon in Warm Slate has the softest, most tactile scissor switches that prevent finger fatigue over 8-hour sprints. Alternatively, if you like compiling in Linux or upgrading RAM as your projects grow, the Framework 13 comes with 32GB DDR5 ready to go. Both are exceptional companions.",
      recommendedProducts: [thinkpad, framework].filter(Boolean)
    };
  }

  // Writing / café / travel / battery / light
  if (query.includes("café") || query.includes("cafe") || query.includes("writing") || query.includes("travel") || query.includes("battery") || query.includes("light") || query.includes("quiet")) {
    const macbook = PRODUCTS.find(p => p.id === "LAP102");
    const zenbook = PRODUCTS.find(p => p.id === "LAP104");
    return {
      text: "For peaceful mornings with a warm tea at your favorite café table, you want something whisper-quiet with all-day battery. The MacBook Air 15 in Starlight has no internal fan at all—completely silent—and holds a charge for 18 continuous hours. If you prefer Windows, our Zenbook S 13 OLED weighs just 990 grams and has an eco-plasma ceramic finish that feels like smooth river stone rather than cold metal.",
      recommendedProducts: [macbook, zenbook].filter(Boolean)
    };
  }

  // Keyboards / typing / sound / thock
  if (query.includes("keyboard") || query.includes("typing") || query.includes("thock") || query.includes("switch")) {
    const kb = PRODUCTS.find(p => p.id === "KB201");
    return {
      text: "Our Walnut & Terracotta keyboard is hand-assembled right here in the workshop. We lube every single linear switch by hand with Krytox so it has that soothing, muted 'thock' reminiscent of raindrops on a cedar shingle. It features solid American walnut and dye-sublimated PBT keycaps in warm oat and terracotta tones.",
      recommendedProducts: kb ? [kb] : []
    };
  }

  // Audio / sound / music / headphones
  if (query.includes("headphone") || query.includes("audio") || query.includes("music") || query.includes("sound")) {
    const audio = PRODUCTS.find(p => p.id === "AUD501");
    return {
      text: "Our Timber Acoustics walnut headphones are tuned specifically for natural warmth. Instead of synthetic bass-boosts, they use beryllium drivers to render vocals, acoustic strings, and ambient focus soundscapes with organic texture. The espresso leather pads cushion your ears gently for hours.",
      recommendedProducts: audio ? [audio] : []
    };
  }

  // Desk setup / accessories / sleeve / bag / gifts
  if (query.includes("sleeve") || query.includes("bag") || query.includes("leather") || query.includes("desk") || query.includes("stand") || query.includes("gift") || query.includes("under 150") || query.includes("under $150")) {
    const sleeve = PRODUCTS.find(p => p.id === "ACC301");
    const stand = PRODUCTS.find(p => p.id === "DSK401");
    return {
      text: "If you're curating your workspace or looking for a lasting gift, I always point friends toward our Vegetable-Tanned Leather Folio ($135) and our Solid Oak & Brushed Brass Laptop Stand ($88). The leather sleeve develops a gorgeous rich honey sheen as you carry it, and the stand clears up desk space while keeping your notebook cool.",
      recommendedProducts: [sleeve, stand].filter(Boolean)
    };
  }

  // Budget / price / cheap / under 1000
  if (query.includes("budget") || query.includes("cheap") || query.includes("affordable") || query.includes("under 1000") || query.includes("under $1000") || query.includes("price")) {
    const zenbook = PRODUCTS.find(p => p.id === "LAP104");
    return {
      text: "We believe quality computing shouldn't require excessive spending. The Zenbook S 13 OLED comes in at $999 with a breathtaking 2.8K OLED screen and 16GB memory. It feels and performs like machines costing hundreds more, and you'll love its tactile stoneware texture.",
      recommendedProducts: zenbook ? [zenbook] : []
    };
  }

  // Shopkeeper's personal favorite
  if (query.includes("favorite") || query.includes("recommend") || query.includes("personal") || query.includes("pick") || query.includes("best")) {
    const framework = PRODUCTS.find(p => p.id === "LAP101");
    const kb = PRODUCTS.find(p => p.id === "KB201");
    return {
      text: "If I could only take one combination from the counter home with me today, it would be the Framework 13 paired with our Walnut & Terracotta mechanical keyboard. There is something deeply grounding about knowing every part of your workspace can be cared for, repaired, and cherished for decades.",
      recommendedProducts: [framework, kb].filter(Boolean)
    };
  }

  // Return policy / warranty / shipping
  if (query.includes("return") || query.includes("warranty") || query.includes("ship") || query.includes("policy") || query.includes("trial")) {
    return {
      text: "We want you to feel completely at ease. Every laptop and craft piece comes with our 30-day Gentle Living Trial. Take it home, write with it, work with it. If it doesn't bring joy and utility to your day, we provide complimentary return shipping in biodegradable kraft boxes, plus our complete 2-year shop warranty.",
      recommendedProducts: []
    };
  }

  // Inquiry about specific product name
  for (const product of PRODUCTS) {
    if (query.includes(product.name.toLowerCase()) || query.includes(product.id.toLowerCase()) || query.includes(product.brand.toLowerCase())) {
      return {
        text: `Ah, the ${product.name}! ${product.curatorsNote} It's currently in stock at $${product.price}. Would you like me to tuck one into your bag or tell you about compatible accessories?`,
        recommendedProducts: [product]
      };
    }
  }

  // General helpful neighborhood response
  return {
    text: "I'd be glad to help you find the right fit! We carry carefully vetted laptops—from the modular Framework 13 to whisper-quiet MacBooks and featherlight Zenbooks—along with hand-turned desk instruments. Are you looking primarily for everyday writing and travel, software development, or acoustic workspace companions?",
    recommendedProducts: [PRODUCTS[0], PRODUCTS[1]]
  };
}
