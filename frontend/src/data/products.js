export const CATEGORIES = [
  "All",
  "Pharmacy",
  "Beauty",
  "Tech",
  "Clothes",
  "Shoes"
];

export const PRODUCTS = [
  // Pharmacy
  {
    id: "PH01",
    name: "Chamomile Blossom Herbal Tincture",
    category: "Pharmacy",
    brand: "St. Botanica",
    price: 34,
    rating: 4.9,
    reviewsCount: 88,
    isBestseller: true,
    image: "/images/pharmacy_tincture.jpg",
    description: "Slow-extracted organic chamomile flower heads in amber apothecary glass for restorative evening rest and calm.",
    details: "100% certified organic biodynamic chamomile, distilled vegetable glycerin, spring water. Dropper included."
  },
  {
    id: "PH02",
    name: "Amber Apothecary Mineral Electrolyte Dropper",
    category: "Pharmacy",
    brand: "Element Herbals",
    price: 28,
    rating: 4.8,
    reviewsCount: 52,
    isBestseller: false,
    image: "/images/pharmacy_tincture.jpg",
    description: "Full-spectrum ionic sea minerals harvested from solar salt ponds to replenish daily cellular hydration naturally.",
    details: "Unflavored, sugar-free, 72 trace minerals. Add 10 drops to morning spring water."
  },
  {
    id: "PH03",
    name: "Apothecary Eucalyptus & Herb Chest Balm",
    category: "Pharmacy",
    brand: "Field & Hearth",
    price: 22,
    rating: 4.7,
    reviewsCount: 39,
    isBestseller: false,
    image: "/images/pharmacy_tincture.jpg",
    description: "Hand-poured beeswax balm infused with wild eucalyptus, peppermint leaf, and cold-pressed olive oil for clear breathing.",
    details: "Natural beeswax, extra virgin olive oil, wild-harvested eucalyptus globulus."
  },

  // Beauty
  {
    id: "BE01",
    name: "Cold-Pressed Rosehip Seed Botanical Oil",
    category: "Beauty",
    brand: "Maison Botanique",
    price: 48,
    rating: 5.0,
    reviewsCount: 142,
    isBestseller: true,
    image: "/images/beauty_serum.jpg",
    description: "Unrefined virgin rosehip fruit oil rich in provitamin A and essential fatty acids for luminous, supple skin tone.",
    details: "Single-origin Chilean Rosa Canina, cold-pressed and unrefined to preserve natural carotenoids."
  },
  {
    id: "BE02",
    name: "Raw Honey & Oatmeal Conditioning Soap",
    category: "Beauty",
    brand: "Earth & Lather",
    price: 18,
    rating: 4.8,
    reviewsCount: 64,
    isBestseller: false,
    image: "/images/beauty_serum.jpg",
    description: "Cured for 6 weeks with unfiltered clover honey, ground colloidal oats, and nourishing olive oil for gentle morning cleansing.",
    details: "Saponified olive, coconut, and castor oils with raw mountain honey and colloidal oatmeal."
  },
  {
    id: "BE03",
    name: "Botanical Rosemary Scalp & Hair Nectar",
    category: "Beauty",
    brand: "Maison Botanique",
    price: 38,
    rating: 4.9,
    reviewsCount: 77,
    isBestseller: false,
    image: "/images/beauty_serum.jpg",
    description: "Steam-distilled rosemary leaf essential oil in jojoba and castor base to invigorate the scalp and nourish hair roots.",
    details: "Rosemary leaf oil, organic golden jojoba oil, Jamaican black castor oil, vitamin E."
  },

  // Tech
  {
    id: "TC01",
    name: "Framework Laptop 13 (Modular Edition)",
    category: "Tech",
    brand: "Framework",
    price: 1049,
    rating: 4.9,
    reviewsCount: 94,
    isBestseller: true,
    image: "/images/laptop_showcase.jpg",
    description: "Custom modular notebook with swappable USB-C ports, crisp 2.8K matte screen, and 100% user-repairable aluminum chassis.",
    details: "AMD Ryzen 7 7840U, 32GB DDR5, 1TB NVMe Gen4 SSD, 14 hr battery, screwdriver included."
  },
  {
    id: "TC02",
    name: "MacBook Air 15 (Warm Starlight)",
    category: "Tech",
    brand: "Apple",
    price: 1299,
    rating: 4.9,
    reviewsCount: 118,
    isBestseller: true,
    image: "/images/laptop_champagne.jpg",
    description: "Whisper-quiet fanless architecture in champagne starlight anodized finish with 18-hour battery for all-day focus.",
    details: "Apple M3 Chip, 16GB Unified Memory, 512GB SSD, 15.3\" Liquid Retina display."
  },
  {
    id: "TC03",
    name: "Walnut & Terracotta Custom Keyboard",
    category: "Tech",
    brand: "Atelier Keycraft",
    price: 220,
    rating: 4.9,
    reviewsCount: 56,
    isBestseller: false,
    image: "/images/keyboard_boutique.jpg",
    description: "Hand-lubricated cream linear switches in solid American walnut casing with warm PBT keycaps and soothing acoustics.",
    details: "QMK/VIA hot-swappable PCB, braided USB-C cable, sound-dampening brass plate."
  },
  {
    id: "TC04",
    name: "Vegetable-Tanned Leather Laptop Folio",
    category: "Tech",
    brand: "Heritage Craft",
    price: 135,
    rating: 4.8,
    reviewsCount: 43,
    isBestseller: false,
    image: "/images/leather_sleeve.jpg",
    description: "Full-grain terracotta leather lined with Bavarian wool felt. Hand-stitched with waxed thread to develop rich honey patina.",
    details: "Fits 13-14 inch laptops snugly. Solid brass stud closure and rear document sleeve."
  },
  {
    id: "TC05",
    name: "Solid Oak & Brushed Brass Laptop Stand",
    category: "Tech",
    brand: "Nordic Wood",
    price: 88,
    rating: 4.8,
    reviewsCount: 37,
    isBestseller: false,
    image: "/images/desk_dock.jpg",
    description: "Dual-slot vertical laptop dock hand-carved from natural oak with brushed brass base weight and wool felt inner lining.",
    details: "1.1kg weighted brass foundation, dual device slots, non-slip cork base."
  },
  {
    id: "TC06",
    name: "Timber Acoustics Walnut Studio Headphones",
    category: "Tech",
    brand: "Timber Acoustics",
    price: 285,
    rating: 4.9,
    reviewsCount: 49,
    isBestseller: false,
    image: "/images/headphones_boutique.jpg",
    description: "Solid walnut earcups with supple espresso leather earpads and beryllium drivers tuned for acoustic warmth.",
    details: "50mm Beryllium dynamic drivers, 32 Ohm, detachable braided 3.5mm copper cable."
  },

  // Clothes
  {
    id: "CL01",
    name: "Washed Organic Linen Everyday Workshirt",
    category: "Clothes",
    brand: "Kinsman Atelier",
    price: 115,
    rating: 4.9,
    reviewsCount: 72,
    isBestseller: true,
    image: "/images/clothes_linen.jpg",
    description: "Garment-washed European flax linen with genuine horn buttons and relaxed drape for effortless warm-weather wear.",
    details: "100% Certified European Flax Linen, double-stitched flat-felled seams, pre-washed for softness."
  },
  {
    id: "CL02",
    name: "Relaxed Heavyweight Combed Cotton Crew",
    category: "Clothes",
    brand: "Kinsman Atelier",
    price: 65,
    rating: 4.7,
    reviewsCount: 61,
    isBestseller: false,
    image: "/images/clothes_linen.jpg",
    description: "Spun from 280gsm dense ring-spun organic cotton with a structured neckline that never sags after washing.",
    details: "280 GSM organic cotton knit, rib-knit collar, blind-stitched hem."
  },
  {
    id: "CL03",
    name: "Raw Cotton Chore Jacket (Natural Olive)",
    category: "Clothes",
    brand: "Heritage Craft",
    price: 160,
    rating: 4.8,
    reviewsCount: 45,
    isBestseller: false,
    image: "/images/clothes_linen.jpg",
    description: "Classic utility jacket crafted from unbleached duck canvas dyed in muted botanical olive with three patch pockets.",
    details: "12oz 100% Cotton Canvas, copper rivet reinforcements, internal pen pocket."
  },

  // Shoes
  {
    id: "SH01",
    name: "Artisanal Natural Tan Leather Mules",
    category: "Shoes",
    brand: "Aurora Workshop",
    price: 185,
    rating: 4.9,
    reviewsCount: 83,
    isBestseller: true,
    image: "/images/shoes_mules.jpg",
    description: "Hand-lasted oiled saddle leather slip-on mules with stacked leather heel and molded natural cork footbed.",
    details: "Full-grain Tuscan leather, cushioned arch support, replaceable Vibram rubber heel cap."
  },
  {
    id: "SH02",
    name: "Minimalist Suede Low-Top Deck Shoes",
    category: "Shoes",
    brand: "Aurora Workshop",
    price: 145,
    rating: 4.8,
    reviewsCount: 54,
    isBestseller: false,
    image: "/images/shoes_mules.jpg",
    description: "Buttery soft calf suede in warm olive sand with natural rubber cupsole and waxed cotton laces for all-day walking.",
    details: "Italian calf suede, full leather lining, stitched cupsole construction."
  },
  {
    id: "SH03",
    name: "Waxed Tan Leather Field Boots",
    category: "Shoes",
    brand: "Heritage Craft",
    price: 240,
    rating: 4.9,
    reviewsCount: 68,
    isBestseller: false,
    image: "/images/shoes_mules.jpg",
    description: "Goodyear-welted field boots built with water-resistant waxed leather and durable commando tread for decades of stride.",
    details: "Goodyear welt construction, waxed cowhide leather, brass speed hooks, re-soleable."
  }
];
