import React from 'react';
import { X, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';

export const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#2C3625]/50 dark:bg-black/60 transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#2C3625] dark:text-[#FEF9F0] transition-colors">
        {/* Header Bar */}
        <div className="p-4 bg-[#FEF9F0] dark:bg-[#1A261D] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#84A59D]">
              {product.category}
            </span>
            {product.isBestseller && (
              <span className="text-[10px] bg-[#F28482] text-[#FEF9F0] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                Bestseller
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625] dark:hover:text-[#FEF9F0] hover:bg-white dark:hover:bg-[#2C3625] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 bg-[#FEF9F0] dark:bg-[#1A261D]/50 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#F9DC5C] text-[#F9DC5C]" />
                <span className="text-xs font-semibold">{product.rating}</span>
                <span className="text-[11px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60">
                  ({product.reviewsCount} customer reviews)
                </span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0] leading-snug">
                {product.name}
              </h2>

              <p className="text-xs text-[#2C3625]/80 dark:text-[#FEF9F0]/80 leading-relaxed">
                {product.description}
              </p>

              <div className="pt-2">
                <span className="text-2xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                  ${product.price.toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FEF9F0]" />
                  <span>Add to Tote</span>
                </button>
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="p-2.5 rounded-full bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#F28482] transition-colors"
                  title="Save item"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-[#F28482] text-[#F28482]' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Details & Origin */}
          {product.details && (
            <div className="p-4 rounded-2xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-1">
              <span className="text-[11px] font-bold text-[#84A59D] uppercase tracking-wider block">
                Origin & Ingredient Notes
              </span>
              <p className="text-xs text-[#2C3625]/90 dark:text-[#FEF9F0]/90 leading-relaxed font-normal">
                {product.details}
              </p>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px] text-[#2C3625]/75 dark:text-[#FEF9F0]/75">
            <div className="p-2.5 rounded-xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#84A59D]" />
              <span>Kraft Shipping</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-[#84A59D]" />
              <span>30-Day Returns</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#84A59D]" />
              <span>Quality Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
