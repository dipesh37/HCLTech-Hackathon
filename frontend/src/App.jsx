import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { ShopkeeperChat } from './components/ShopkeeperChat';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PRODUCTS, CATEGORIES } from './data/products';
import { fetchProducts } from './api/productApi';
import { Check, Heart, ShoppingBag } from 'lucide-react';

export default function App() {
  const [allProducts, setAllProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState(null);

  // Cart & Wishlist state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Interaction bridge between catalog and shopkeeper chat
  const [pendingInquiry, setPendingInquiry] = useState(null);

  // Notification toast
  const [toast, setToast] = useState(null);

  // Try to load any live products from backend on mount, falling back gracefully
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

  // Cart handlers
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
    showToast(`Added ${product.name} to your tote bag`, 'bag');
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

  // Wishlist handlers
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed from saved items`, 'heart');
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Saved ${product.name} to favorites`, 'heart');
        return [...prev, product];
      }
    });
  };

  const handleRemoveWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // Bridge: Inquire to Shopkeeper
  const handleAskShopkeeper = (product) => {
    const inquiryText = `Could you tell me more about the ${product.name} and who it's best suited for?`;
    setPendingInquiry(inquiryText);
  };

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category
    if (selectedCategory !== 'All Items') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.curatorsNote && p.curatorsNote.toLowerCase().includes(q))
      );
    }

    // Price Filter
    if (priceFilter) {
      if (priceFilter.min !== undefined) {
        result = result.filter((p) => p.price >= priceFilter.min);
      }
      if (priceFilter.max !== undefined && priceFilter.max !== Infinity) {
        result = result.filter((p) => p.price <= priceFilter.max);
      }
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [allProducts, selectedCategory, searchQuery, priceFilter, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { 'All Items': allProducts.length };
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistIds = wishlist.map((item) => item.id);

  return (
    <div className="min-h-screen bg-[#F4F1DE] text-[#3D405B] flex flex-col font-sans selection:bg-[#E07A5F] selection:text-[#FDFBF7]">
      {/* Header */}
      <Header
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Split-Screen Container
          Left Pane (65% width) & Right Pane (35% width) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Pane (65% width): Standard e-commerce UI featuring a product catalog grid */}
          <section className="w-full lg:w-[65%] shrink-0">
            <ProductCatalog
              products={filteredProducts}
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
              sortBy={sortBy}
              onSortChange={setSortBy}
              priceFilter={priceFilter}
              onPriceFilterChange={setPriceFilter}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onOpenQuickView={setQuickViewProduct}
              onAskShopkeeper={handleAskShopkeeper}
            />
          </section>

          {/* Right Pane (35% width): Pinned "Ask the Shopkeeper" chat widget */}
          <section className="w-full lg:w-[35%] lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] shrink-0">
            <ShopkeeperChat
              onAddToCart={handleAddToCart}
              onOpenQuickView={setQuickViewProduct}
              pendingInquiry={pendingInquiry}
              onClearPendingInquiry={() => setPendingInquiry(null)}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#FDFBF7] border-t border-[#3D405B]/20 py-8 px-4 text-center text-xs text-[#5C5F79]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-serif-boutique font-bold text-[#3D405B] text-sm">
              ShopSmart Neighborhood Atelier
            </p>
            <p className="text-[11px] text-[#7E8199]">
              Hand-picked computing instruments, repairable hardware & leather craft.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>30-Day Gentle Living Trial</span>
            <span>•</span>
            <span>Zero Plastic Kraft Packaging</span>
            <span>•</span>
            <span>Workshop Repairs</span>
          </div>
        </div>
      </footer>

      {/* Sliding Drawers and Modals */}
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
        onAskShopkeeper={handleAskShopkeeper}
      />

      {/* Warm Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#3D405B] text-[#FDFBF7] px-4 py-3 rounded-xl shadow-lg border border-[#3D405B] text-xs flex items-center gap-2.5 transition-all transform animate-bounce-short">
          {toast.icon === 'bag' ? (
            <ShoppingBag className="w-4 h-4 text-[#E07A5F]" />
          ) : (
            <Heart className="w-4 h-4 fill-[#E07A5F] text-[#E07A5F]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
