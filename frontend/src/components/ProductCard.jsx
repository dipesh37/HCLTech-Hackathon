import React from 'react';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';

export const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView
}) => {
  return (
    <article className="bg-white dark:bg-[#2C3625] rounded-2xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-[#F28482]/50 group relative">
      {/* Floating Pink "Bestseller" Tag */}
      {product.isBestseller && (
        <div className="absolute top-3 left-3 z-20 bg-[#F28482] text-[#FEF9F0] text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-xs">
          Bestseller
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => onToggleWishlist(product)}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-[#2C3625]/90 border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#F28482] dark:hover:text-[#F28482] transition-colors"
        title={isWishlisted ? "Remove from Saved" : "Save to Wishlist"}
        aria-label={isWishlisted ? "Remove from Saved" : "Save to Wishlist"}
      >
        <Heart
          className={`w-3.5 h-3.5 transition-colors ${
            isWishlisted
              ? 'fill-[#F28482] text-[#F28482]'
              : 'text-[#2C3625] dark:text-[#FEF9F0]'
          }`}
        />
      </button>

      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-[#FEF9F0] dark:bg-[#1A261D]/50 cursor-pointer" onClick={() => onOpenQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-104"
          loading="lazy"
        />

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-[#2C3625]/95 border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-[11px] font-medium text-[#2C3625] dark:text-[#FEF9F0] flex items-center gap-1 shadow-xs">
            <Eye className="w-3 h-3" /> Quick Details
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#84A59D] dark:text-[#84A59D]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#2C3625] dark:text-[#FEF9F0]">
              <Star className="w-3 h-3 fill-[#F9DC5C] text-[#F9DC5C]" />
              <span className="font-medium text-[11px]">{product.rating}</span>
            </div>
          </div>

          {/* Title with tracking-tight */}
          <h3
            onClick={() => onOpenQuickView(product)}
            className="text-xs sm:text-sm font-semibold tracking-tight text-[#2C3625] dark:text-[#FEF9F0] line-clamp-2 leading-snug cursor-pointer group-hover:text-[#F28482] transition-colors"
          >
            {product.name}
          </h3>

          {/* Description with leading-relaxed */}
          <p className="text-[11px] text-[#2C3625]/75 dark:text-[#FEF9F0]/75 line-clamp-2 leading-relaxed mt-1 font-normal">
            {product.description}
          </p>
        </div>

        {/* Price and Add to Cart */}
        <div className="pt-2.5 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60 block leading-none">
              Price
            </span>
            <span className="text-sm sm:text-base font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="px-3 py-1.5 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#FEF9F0]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};
