import React from 'react';
import { X, Check, ShoppingBag, Star, Sparkles, AlertCircle } from 'lucide-react';

export const ProductComparisonModal = ({
  isOpen,
  onClose,
  compareProducts = [],
  onRemoveCompare,
  onClearCompare,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-[#2C3625]/50 dark:bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625] dark:text-[#FEF9F0] w-full max-w-4xl rounded-3xl border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-white dark:bg-[#2C3625] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F28482]/20 border border-[#F28482] flex items-center justify-center text-[#F28482]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                Side-by-Side Product Comparison
              </h2>
              <p className="text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
                Detailed specs, value analysis, and specifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {compareProducts.length > 0 && (
              <button
                type="button"
                onClick={onClearCompare}
                className="text-xs text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#F28482] px-3 py-1 rounded-full border border-[#2C3625]/10 dark:border-[#FEF9F0]/20"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D] text-[#2C3625]/70 dark:text-[#FEF9F0]/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {compareProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 flex items-center justify-center text-[#F28482]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-base font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                No products selected for comparison
              </p>
              <p className="text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70 max-w-sm mx-auto leading-relaxed">
                Click the "Compare" button on any product card in the catalog to evaluate specs and prices side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className={`grid grid-cols-${compareProducts.length + 1} gap-4 min-w-[600px]`}>
                
                {/* Labels Column */}
                <div className="space-y-6 pt-24 font-semibold text-xs text-[#2C3625]/60 dark:text-[#FEF9F0]/60">
                  <div className="h-8 flex items-center">Category</div>
                  <div className="h-8 flex items-center">Brand</div>
                  <div className="h-8 flex items-center">Price</div>
                  <div className="h-8 flex items-center">Customer Rating</div>
                  <div className="h-8 flex items-center">Stock Availability</div>
                  <div className="h-20 flex items-start">Description</div>
                  <div className="h-10 flex items-center">Action</div>
                </div>

                {/* Product Columns */}
                {compareProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-white dark:bg-[#2C3625] rounded-3xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-6 relative flex flex-col justify-between"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => onRemoveCompare(p.id)}
                      className="absolute top-3 right-3 p-1 rounded-full bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625]/50 dark:text-[#FEF9F0]/50 hover:text-[#F28482]"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Image & Title */}
                    <div className="text-center space-y-2">
                      <img
                        src={p.image || p.imageUrl}
                        alt={p.name}
                        className="w-20 h-20 mx-auto rounded-2xl object-cover border border-[#2C3625]/10 dark:border-[#FEF9F0]/15"
                      />
                      <h4 className="text-xs font-bold text-[#2C3625] dark:text-[#FEF9F0] line-clamp-2 leading-snug">
                        {p.name}
                      </h4>
                    </div>

                    {/* Rows */}
                    <div className="space-y-6 text-xs text-[#2C3625] dark:text-[#FEF9F0]">
                      <div className="h-8 flex items-center font-medium text-[#84A59D]">
                        {p.category}
                      </div>
                      <div className="h-8 flex items-center font-medium">
                        {p.brand || 'ShopSmart Certified'}
                      </div>
                      <div className="h-8 flex items-center font-bold text-[#F28482] text-sm">
                        ${p.price}
                      </div>
                      <div className="h-8 flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#F28482] text-[#F28482]" />
                        <span>{p.rating || '4.8'}</span>
                      </div>
                      <div className="h-8 flex items-center">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          (p.inStock ?? true)
                            ? 'bg-[#84A59D]/20 text-[#84A59D]'
                            : 'bg-rose-500/20 text-rose-500'
                        }`}>
                          {(p.inStock ?? true) ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="h-20 flex items-start text-[11px] leading-relaxed text-[#2C3625]/75 dark:text-[#FEF9F0]/75 overflow-hidden">
                        {p.description}
                      </div>
                      <div className="h-10 flex items-center">
                        <button
                          type="button"
                          onClick={() => onAddToCart(p)}
                          className="w-full py-2 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
