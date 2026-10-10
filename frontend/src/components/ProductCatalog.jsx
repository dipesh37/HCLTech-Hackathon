import React from 'react';
import { ProductCard } from './ProductCard';
import { NavigationTabs } from './NavigationTabs';
import { PackageOpen } from 'lucide-react';

export const ProductCatalog = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  onSortChange,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView
}) => {
  return (
    <div className="space-y-6">
      {/* Navigation Tabs with Pill-shaped Buttons */}
      <NavigationTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        categoryCounts={categoryCounts}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />

      {/* Denser Product Grid: 5-column on xl / large screens, 4-column on lg / desktops */}
      {products.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-[#2C3625] rounded-2xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FEF9F0] dark:bg-[#1A261D] flex items-center justify-center text-[#F28482]">
            <PackageOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
            No goods found in this section
          </h3>
          <p className="text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70 max-w-sm mx-auto leading-relaxed">
            Try adjusting your search query or selecting a different category from the pill tabs above.
          </p>
          <button
            onClick={() => onSelectCategory('All')}
            className="px-4 py-2 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs font-semibold transition-colors"
          >
            View All Categories
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onOpenQuickView={onOpenQuickView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
