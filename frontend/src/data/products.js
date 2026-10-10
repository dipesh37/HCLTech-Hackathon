export const PRODUCTS = [
  {
    id: "LAP101",
    name: "Framework Laptop 13 (Modular Edition)",
    category: "Laptops",
    brand: "Framework",
    price: 1049,
    badge: "Shopkeeper's Favorite",
    rating: 4.9,
    reviewsCount: 38,
    image: "/images/laptop_showcase.jpg",
    description: "Custom modular notebook with swappable USB-C expansion cards, crisp 2.8K matte display, and 100% repairable aluminum chassis.",
    curatorsNote: "My personal daily driver at the counter. When a port wears down or you need an extra HDMI or MicroSD slot, you slide in a module in two seconds. Truly built for a decade.",
    specs: {
      processor: "AMD Ryzen 7 7840U",
      memory: "32GB DDR5 (Upgradable)",
      storage: "1TB Gen4 NVMe",
      display: "13.5\" 2.8K Matte (2256 x 1504)",
      battery: "Up to 14 Hours",
      weight: "1.3 kg",
      sustainability: "100% User Repairable"
    },
    inStock: true
  },
  {
    id: "LAP102",
    name: "MacBook Air 15 (Warm Starlight)",
    category: "Laptops",
    brand: "Apple",
    price: 1299,
    badge: "Café Favorite",
    rating: 4.8,
    reviewsCount: 52,
    image: "/images/laptop_champagne.jpg",
    description: "Whisper-quiet fanless architecture finished in champagne starlight anodized aluminum. Expansive Liquid Retina display with 18-hour endurance.",
    curatorsNote: "For quiet mornings writing essays or researching without fans ever whirring up. You leave the charger in your drawer and go all day.",
    specs: {
      processor: "Apple M3 Chip (8-Core CPU)",
      memory: "16GB Unified Memory",
      storage: "512GB High-Speed SSD",
      display: "15.3\" Liquid Retina (500 nits)",
      battery: "Up to 18 Hours",
      weight: "1.51 kg",
      sustainability: "Recycled Aluminum Body"
    },
    inStock: true
  },
  {
    id: "LAP103",
    name: "ThinkPad Carbon (Warm Slate Edition)",
    category: "Laptops",
    brand: "Lenovo",
    price: 1380,
    badge: "Writer's Choice",
    rating: 4.9,
    reviewsCount: 29,
    image: "/images/laptop_showcase.jpg",
    description: "Legendary tactile keyboard with deep key travel, carbon-fiber reinforced shell in warm matte espresso slate, and anti-glare OLED display.",
    curatorsNote: "If your livelihood involves writing code or long manuscripts, no other keyboard comes close. It cushions your fingers on long late-night sessions.",
    specs: {
      processor: "Intel Core Ultra 7 155H",
      memory: "32GB LPDDR5X",
      storage: "1TB NVMe PCIe 4.0",
      display: "14\" 2.8K OLED Anti-Reflective",
      battery: "Up to 15 Hours",
      weight: "1.12 kg",
      sustainability: "Recycled Magnesium Shell"
    },
    inStock: true
  },
  {
    id: "LAP104",
    name: "Zenbook S 13 OLED (Oatmeal Finish)",
    category: "Laptops",
    brand: "ASUS",
    price: 999,
    badge: "Featherlight",
    rating: 4.7,
    reviewsCount: 24,
    image: "/images/laptop_champagne.jpg",
    description: "At just 1cm thickness and under 1 kilogram, this plasma-ceramic aluminum finish feels like warm stoneware rather than cold industrial metal.",
    curatorsNote: "The ceramic chassis treatment makes it completely smudge-proof. When you hold it, it feels like an art journal rather than an appliance.",
    specs: {
      processor: "Intel Core Ultra 5 125U",
      memory: "16GB LPDDR5X",
      storage: "512GB SSD",
      display: "13.3\" 2.8K OLED HDR 550",
      battery: "Up to 14 Hours",
      weight: "0.99 kg",
      sustainability: "Eco-Plasma Ceramic"
    },
    inStock: true
  },
  {
    id: "KB201",
    name: "Walnut & Terracotta Custom Keyboard",
    category: "Keyboards",
    brand: "Atelier Keycraft",
    price: 220,
    badge: "Hand-Assembled",
    rating: 5.0,
    reviewsCount: 41,
    image: "/images/keyboard_boutique.jpg",
    description: "Solid American walnut casing with pre-lubricated cream linear switches, PBT terracotta accent keycaps, and brass dampening plate.",
    curatorsNote: "Hand-lubricated by our team. The acoustic resonance against walnut gives a deep, comforting 'thock' that turns typing into an art form.",
    specs: {
      processor: "QMK / VIA Programmable",
      memory: "Onboard Profile Memory",
      storage: "Hot-swappable PCB",
      display: "RGB-Free Warm Aesthetic",
      battery: "Wired USB-C Braided Cable",
      weight: "920g Solid Walnut",
      sustainability: "Sustainably Harvested Walnut"
    },
    inStock: true
  },
  {
    id: "ACC301",
    name: "Vegetable-Tanned Leather Laptop Folio",
    category: "Bags & Sleeves",
    brand: "Heritage Craft",
    price: 135,
    badge: "Artisan Leather",
    rating: 4.9,
    reviewsCount: 63,
    image: "/images/leather_sleeve.jpg",
    description: "Full-grain terracotta bridle leather lined with 100% natural cream wool felt. Hand-stitched with waxed linen thread to age with rich patina.",
    curatorsNote: "Cut and conditioned from full-grain hide. Every scratch softens into a rich honey patina over time. Fits all 13-14 inch laptops snug as a glove.",
    specs: {
      processor: "100% Hand-Stitched",
      memory: "Fits 13\" to 14.2\" Laptops",
      storage: "Rear Document / Pen Slot",
      display: "Natural Terracotta Patina",
      battery: "Solid Brass Stud Closure",
      weight: "380g",
      sustainability: "Vegetable-Tanned Italian Leather"
    },
    inStock: true
  },
  {
    id: "DSK401",
    name: "Solid Oak & Brushed Brass Laptop Stand",
    category: "Desk Essentials",
    brand: "Nordic Wood & Brass",
    price: 88,
    badge: "Workshop Made",
    rating: 4.8,
    reviewsCount: 33,
    image: "/images/desk_dock.jpg",
    description: "Dual-slot vertical laptop dock hand-carved from natural oak with heavy brushed brass base plate and wool felt inner lining to preserve anodization.",
    curatorsNote: "Heavy brass weighting means you can lift your laptop in or out with one hand without tipping. Keeps your workspace peaceful and clutter-free.",
    specs: {
      processor: "Solid Natural Oak & Brass",
      memory: "Dual Adjustable Device Slots",
      storage: "Wool Felt Lined Interior",
      display: "Brushed Satin Finish",
      battery: "No Power Required",
      weight: "1.1 kg Stable Weight",
      sustainability: "FSC Certified Hardwood"
    },
    inStock: true
  },
  {
    id: "AUD501",
    name: "Walnut & Espresso Acoustic Studio Monitor",
    category: "Audio",
    brand: "Timber Acoustics",
    price: 285,
    badge: "Warm Sound Signature",
    rating: 4.9,
    reviewsCount: 47,
    image: "/images/headphones_boutique.jpg",
    description: "Solid walnut earcups paired with supple espresso leather earpads and 50mm beryllium dynamic drivers tuned for rich acoustic warmth.",
    curatorsNote: "Tuned for natural instruments, acoustic guitars, and calm focus music. No harsh digital sibilance, just rich, velvety warmth.",
    specs: {
      processor: "50mm Beryllium Drivers",
      memory: "32 Ohm Impedance (Easy to Drive)",
      storage: "Detachable Braided Cord (3.5mm)",
      display: "Natural Walnut Grain",
      battery: "Passive Studio Analog",
      weight: "295g",
      sustainability: "Natural Timber & Biodegradable Pouch"
    },
    inStock: true
  }
];

export const CATEGORIES = [
  "All Items",
  "Laptops",
  "Keyboards",
  "Bags & Sleeves",
  "Desk Essentials",
  "Audio"
];
