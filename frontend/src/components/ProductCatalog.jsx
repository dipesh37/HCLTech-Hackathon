import React from 'react';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { Coffee, Store, ShieldCheck } from 'lucide-react';

export const ProductCatalog = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  onSortChange,
  priceFilter,
  onPriceFilterChange,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView,
  onAskShopkeeper
}) => {
  return (
    <div className="space-y-6">
      {/* Boutique Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#3D405B]/20 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#81B29A]/15 text-[#3D405B] text-xs font-semibold mb-3">
            <Store className="w-3.5 h-3.5 text-[#81B29A]" />
            <span>Curated Hardware & Atelier Essentials</span>
          </div>
          <h1 className="font-serif-boutique text-2xl sm:text-3xl font-bold text-[#3D405B] leading-tight">
            Thoughtful Tools for Everyday Craft
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5F79] mt-2 leading-relaxed">
            Welcome to ShopSmart. We curate repairable laptops, quiet keyboards with tactile wood chassis, and vegetable-tanned leather cases designed to live with you for years.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-[#3D405B]/15 text-xs text-[#5C5F79]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#81B29A]" />
              <span>Full 2-Year Workshop Care</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
              <span>Free Carbon-Neutral Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#81B29A]" />
              <span>30-Day Gentle Living Trial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category filters, price buttons, and sorting */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        itemCounts={categoryCounts}
        sortBy={sortBy}
        onSortChange={onSortChange}
        priceFilter={priceFilter}
        onPriceFilterChange={onPriceFilterChange}
      />

      {/* Product Catalog Grid */}
      {products.length === 0 ? (
        <div className="p-12 text-center bg-[#FDFBF7] rounded-2xl border border-[#3D405B]/20 space-y-3">
          <p className="font-serif-boutique text-lg font-bold text-[#3D405B]">
            No matching items on our shelves
          </p>
          <p className="text-xs text-[#5C5F79] max-w-sm mx-auto">
            Try adjusting your search terms or price filter, or ask Clara at the right counter to check for workshop inventory.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All Items');
              onPriceFilterChange(null);
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#D26A4E] text-[#FDFBF7] text-xs font-semibold shadow-xs transition-colors"
          >
            Show All Shelves
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onOpenQuickView={onOpenQuickView}
              onAskShopkeeper={onAskShopkeeper}
            />
          ))}
        </div>
      )}
    </div>
  );
};
