import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShopkeeperChat } from './components/ShopkeeperChat';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { PRODUCTS, CATEGORIES } from './data/products';
import { fetchProducts, fetchCategories } from './api/productApi';
import { loginCustomer } from './api/authApi';
import { ShoppingBag, Heart, Sparkles, Scale } from 'lucide-react';

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

  // Customer state & preferences
  const [customer, setCustomer] = useState({
    name: 'Alex Chen',
    email: 'alex.dev@shopsmart.io',
    membershipTier: 'PRIME'
  });

  // Products & Filtering state
  const [allProducts, setAllProducts] = useState(PRODUCTS);
  const [availableCategories, setAvailableCategories] = useState(CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Cart, Wishlist & Comparison state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareProducts, setCompareProducts] = useState([]);

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  // Initial load
  useEffect(() => {
    async function load() {
      try {
        const [cats, cust] = await Promise.all([
          fetchCategories(),
          loginCustomer('alex.dev@shopsmart.io', 'password123')
        ]);
        if (Array.isArray(cats) && cats.length > 0) {
          setAvailableCategories(cats);
        }
        if (cust) {
          setCustomer(cust);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    load();
  }, []);

  // Fetch products from backend when category or search changes
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(selectedCategory, searchQuery);
        if (Array.isArray(data) && data.length > 0) {
          setAllProducts(data);
        }
      } catch (err) {
        console.warn('Product fetch fallback:', err);
      }
    }
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const showToast = (message, icon = 'bag') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id));
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item
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
      prev.map((item) => (String(item.id) === String(productId) ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => String(item.id) === String(product.id));
      if (exists) {
        showToast(`Removed from saved`, 'heart');
        return prev.filter((item) => String(item.id) !== String(product.id));
      } else {
        showToast(`Saved to favorites`, 'heart');
        return [...prev, product];
      }
    });
  };

  const handleRemoveWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  };

  // Product Comparison operations
  const handleToggleCompare = (product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((item) => String(item.id) === String(product.id));
      if (exists) {
        showToast(`Removed ${product.name} from comparison`, 'scale');
        return prev.filter((item) => String(item.id) !== String(product.id));
      } else {
        if (prev.length >= 3) {
          showToast(`Max 3 products can be compared side-by-side`, 'scale');
          return prev;
        }
        showToast(`Added ${product.name} to compare`, 'scale');
        return [...prev, product];
      }
    });
  };

  const handleRemoveCompare = (productId) => {
    setCompareProducts((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  };

  const handleClearCompare = () => {
    setCompareProducts([]);
  };

  // Open Order Tracker with specific ID
  const handleTrackOrder = (orderNum) => {
    setTrackingOrderNumber(orderNum);
    setIsOrderTrackerOpen(true);
  };

  // Sorting and client filtering
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Sorting
    if (sortBy === 'bestsellers') {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    return result;
  }, [allProducts, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: allProducts.length };
    allProducts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [allProducts]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistIds = wishlist.map((item) => item.id);
  const compareIds = compareProducts.map((item) => item.id);

  return (
    <div className="min-h-screen bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625] dark:text-[#FEF9F0] flex flex-col font-sans transition-colors duration-200">
      
      {/* Header: Logo, Search, Member Tier, Order Tracker, Wishlist, Cart, Theme */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        compareCount={compareProducts.length}
        customer={customer}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Catalog View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ProductCatalog
          products={filteredProducts}
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          sortBy={sortBy}
          onSortChange={setSortBy}
          wishlistIds={wishlistIds}
          compareIds={compareIds}
          onToggleWishlist={handleToggleWishlist}
          onToggleCompare={handleToggleCompare}
          onAddToCart={handleAddToCart}
          onOpenQuickView={setQuickViewProduct}
        />
      </main>

      {/* Floating Compare Action Bar if products are selected */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 px-5 py-3 rounded-full shadow-2xl flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#84A59D]" />
            <span>Comparing {compareProducts.length} of 3 items</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="px-4 py-1.5 rounded-full bg-[#84A59D] hover:bg-[#6c8f87] text-white text-xs font-bold transition-all shadow-xs"
          >
            View Comparison
          </button>
          <button
            type="button"
            onClick={handleClearCompare}
            className="text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#F28482]"
          >
            Clear
          </button>
        </div>
      )}

      {/* Floating Ask Shopkeeper AI Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 px-5 py-3 rounded-full bg-[#F28482] hover:bg-[#E57371] text-white shadow-xl flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 group"
        title="Open ShopSmart AI Assistant & Policy RAG"
      >
        <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold tracking-tight">ShopSmart AI Assistant</span>
      </button>

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-[#2C3625] border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
          <div>
            <p className="font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0] text-sm">
              ShopSmart AI – Autonomous E-Commerce Platform
            </p>
            <p className="text-[11px] mt-0.5">
              Powered by Spring Boot 3, Spring AI, PgVector & Gemini 3.8 Flash • Hackathon 2026
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>PgVector Similarity Search</span>
            <span>•</span>
            <span>Real-time RAG Policy Grounding</span>
            <span>•</span>
            <span>Simulated Logistics Orchestration</span>
          </div>
        </div>
      </footer>

      {/* Sliding Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        customer={customer}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onTrackOrder={handleTrackOrder}
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

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        initialOrderNumber={trackingOrderNumber}
        customerEmail={customer?.email}
      />

      <ProductComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareProducts={compareProducts}
        onRemoveCompare={handleRemoveCompare}
        onClearCompare={handleClearCompare}
        onAddToCart={handleAddToCart}
      />

      <CustomerAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        customer={customer}
        onUpdateTier={(newTier) => setCustomer((prev) => ({ ...prev, membershipTier: newTier }))}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#2C3625] dark:bg-[#FEF9F0] text-[#FEF9F0] dark:text-[#2C3625] px-4 py-3 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2.5 transition-all">
          {toast.icon === 'bag' ? (
            <ShoppingBag className="w-4 h-4 text-[#F28482]" />
          ) : toast.icon === 'scale' ? (
            <Scale className="w-4 h-4 text-[#84A59D]" />
          ) : (
            <Heart className="w-4 h-4 fill-[#F28482] text-[#F28482]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
