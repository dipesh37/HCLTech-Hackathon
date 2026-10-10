export const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Home Appliances",
  "Books",
  "Healthcare",
  "Groceries",
  "Pharmacy",
  "Beauty",
  "Tech",
  "Clothes",
  "Shoes"
];

export const PRODUCTS = [
  // Laptops
  {
    id: "P101",
    name: "Dell Inspiron 15",
    category: "Laptops",
    brand: "Dell",
    price: 650,
    rating: 4.5,
    reviewsCount: 88,
    stockQty: 10,
    isBestseller: false,
    image: "/images/laptop_showcase.jpg",
    imageUrl: "/images/laptop_showcase.jpg",
    description: "15.6 inch FHD Laptop with Intel Core i5 and 16GB RAM for everyday productivity.",
    details: "15.6\" FHD Display, Intel Core i5 12th Gen, 16GB DDR4 RAM, 512GB NVMe SSD, Windows 11."
  },
  {
    id: "P104",
    name: "Lenovo ThinkPad E15",
    category: "Laptops",
    brand: "Lenovo",
    price: 750,
    rating: 4.6,
    reviewsCount: 104,
    stockQty: 12,
    isBestseller: true,
    image: "/images/laptop_showcase.jpg",
    imageUrl: "/images/laptop_showcase.jpg",
    description: "Durable business laptop featuring Intel Core i7 processor and ergonomic keyboard.",
    details: "15.6\" FHD Anti-glare, Intel Core i7 13th Gen, 16GB RAM, 512GB SSD, TrackPoint keyboard."
  },
  {
    id: "P105",
    name: "MacBook Air M2",
    category: "Laptops",
    brand: "Apple",
    price: 1199,
    rating: 4.9,
    reviewsCount: 142,
    stockQty: 5,
    isBestseller: true,
    image: "/images/laptop_champagne.jpg",
    imageUrl: "/images/laptop_champagne.jpg",
    description: "Ultra-thin and light laptop powered by the revolutionary Apple M2 chip with 18-hr battery life.",
    details: "13.6\" Liquid Retina display, Apple M2 chip 8-core CPU/8-core GPU, 8GB Unified Memory, 256GB SSD."
  },

  // Phones
  {
    id: "P102",
    name: "Samsung Galaxy S24",
    category: "Phones",
    brand: "Samsung",
    price: 800,
    rating: 4.8,
    reviewsCount: 95,
    stockQty: 15,
    isBestseller: true,
    image: "/images/laptop_champagne.jpg",
    imageUrl: "/images/laptop_champagne.jpg",
    description: "6.2 inch Dynamic AMOLED 2X display with Galaxy AI features and pro-grade camera.",
    details: "6.2\" FHD+ 120Hz AMOLED, Snapdragon 8 Gen 3, 50MP Main Camera, 4000mAh Battery."
  },
  {
    id: "P103",
    name: "iPhone 15",
    category: "Phones",
    brand: "Apple",
    price: 999,
    rating: 4.9,
    reviewsCount: 160,
    stockQty: 8,
    isBestseller: true,
    image: "/images/laptop_showcase.jpg",
    imageUrl: "/images/laptop_showcase.jpg",
    description: "Innovative Dynamic Island, 48MP main camera, and durable color-infused glass design.",
    details: "6.1\" Super Retina XDR, A16 Bionic chip, 48MP Main Camera with 2x Telephoto, USB-C."
  },
  {
    id: "P106",
    name: "OnePlus 12",
    category: "Phones",
    brand: "OnePlus",
    price: 699,
    rating: 4.7,
    reviewsCount: 62,
    stockQty: 20,
    isBestseller: false,
    image: "/images/laptop_champagne.jpg",
    imageUrl: "/images/laptop_champagne.jpg",
    description: "Flagship performance powered by Snapdragon 8 Gen 3 and 4th Gen Hasselblad Camera.",
    details: "6.82\" 2K 120Hz ProXDR display, 16GB LPDDR5X RAM, 512GB storage, 80W SUPERVOOC charging."
  }
];

