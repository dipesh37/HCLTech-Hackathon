import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShopkeeperChat } from './components/ShopkeeperChat';
import { PRODUCTS, CATEGORIES } from './data/products';
import { fetchProducts } from './api/productApi';
import { ShoppingBag, Heart, MessageSquare } from 'lucide-react';

export default function App() {
  // Theme state: light or dark
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('shopsmart_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('shopsmart_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Products & Filtering state
  const [allProducts, setAllProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Cart & Wishlist state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      if (Array.isArray(data) && data.length > 0) {
        setAllProducts(data);
      }
    }
    load();
  }, []);

  const showToast = (message, icon = 'bag') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart`, 'bag');
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed from saved`, 'heart');
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Saved to favorites`, 'heart');
        return [...prev, product];
      }
    });
  };

  const handleRemoveWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'bestsellers') {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: allProducts.length };
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistIds = wishlist.map((item) => item.id);

  return (
    <div className="min-h-screen bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625] dark:text-[#FEF9F0] flex flex-col font-sans transition-colors duration-200">
      {/* Header: Logo on left, Pill search in center, Theme Toggle + Cart on right */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Banner: Full-width, soft yellow background */}
      <HeroBanner />

      {/* Main Content Area: 5-column denser grid on xl, 4-column on lg */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ProductCatalog
          products={filteredProducts}
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          sortBy={sortBy}
          onSortChange={setSortBy}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onOpenQuickView={setQuickViewProduct}
        />
      </main>

      {/* Floating Ask Shopkeeper Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 px-4 py-3 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] shadow-lg flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
        title="Ask Clara at the counter"
      >
        <img
          src="/images/shopkeeper_avatar.jpg"
          alt="Clara"
          className="w-6 h-6 rounded-full object-cover border border-white"
        />
        <span className="text-xs font-bold tracking-tight">Ask Shopkeeper</span>
      </button>

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-[#2C3625] border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
          <div>
            <p className="font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0] text-sm">
              ShopSmart Curated Neighborhood Goods
            </p>
            <p className="text-[11px] mt-0.5">
              Thoughtful goods for every part of your day • Est. 2024
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Organic Certified</span>
            <span>•</span>
            <span>100% Recyclable Packaging</span>
            <span>•</span>
            <span>Fair Workshop Trade</span>
          </div>
        </div>
      </footer>

      {/* Sliding Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveWishlist={handleRemoveWishlist}
        onAddToCart={handleAddToCart}
        onOpenQuickView={setQuickViewProduct}
      />

      <ProductDetailModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
      />

      <ShopkeeperChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenQuickView={setQuickViewProduct}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#2C3625] dark:bg-[#FEF9F0] text-[#FEF9F0] dark:text-[#2C3625] px-4 py-3 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2.5 transition-all">
          {toast.icon === 'bag' ? (
            <ShoppingBag className="w-4 h-4 text-[#F28482]" />
          ) : (
            <Heart className="w-4 h-4 fill-[#F28482] text-[#F28482]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
