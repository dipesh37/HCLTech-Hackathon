import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { NavigationTabs } from './NavigationTabs';
import { PackageOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductCatalog = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  onSortChange,
  wishlistIds,
  compareIds = [],
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onOpenQuickView
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Calculate paginated slice
  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentProducts = products.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs with Pill-shaped Buttons */}
      <NavigationTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setCurrentPage(1);
          onSelectCategory(cat);
        }}
        categoryCounts={categoryCounts}
        sortBy={sortBy}
        onSortChange={(val) => {
          setCurrentPage(1);
          onSortChange(val);
        }}
      />

      {/* Denser Product Grid */}
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
            type="button"
            onClick={() => onSelectCategory('All')}
            className="px-4 py-2 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs font-semibold transition-colors"
          >
            View All Categories
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                isCompared={compareIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onToggleCompare={onToggleCompare}
                onAddToCart={onAddToCart}
                onOpenQuickView={onOpenQuickView}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 text-xs text-[#2C3625] dark:text-[#FEF9F0]">
              <span className="text-[#2C3625]/60 dark:text-[#FEF9F0]/60">
                Showing {startIndex + 1}–{Math.min(startIndex + pageSize, products.length)} of {products.length} products
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(safePage - 1)}
                  disabled={safePage === 1}
                  className="p-2 rounded-full border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 bg-white dark:bg-[#2C3625] disabled:opacity-30 hover:border-[#F28482] transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => handlePageChange(pNum)}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                        pNum === safePage
                          ? 'bg-[#F28482] text-white shadow-xs'
                          : 'bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:border-[#F28482]'
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="p-2 rounded-full border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 bg-white dark:bg-[#2C3625] disabled:opacity-30 hover:border-[#F28482] transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
