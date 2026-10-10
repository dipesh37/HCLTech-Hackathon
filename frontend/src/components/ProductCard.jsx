import React from 'react';
import { Heart, ShoppingBag, Star, Eye, Scale } from 'lucide-react';

export const ProductCard = ({
  product,
  isWishlisted,
  isCompared = false,
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onOpenQuickView
}) => {
  const imgSrc = product.image || product.imageUrl || '/images/default_product.jpg';
  const inStock = product.inStock ?? ((product.stockQuantity ?? product.stockQty ?? 20) > 0);

  return (
    <article className="bg-white dark:bg-[#2C3625] rounded-2xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-[#F28482]/50 group relative">
      {/* Floating Pink "Bestseller" Tag */}
      {product.isBestseller && (
        <div className="absolute top-3 left-3 z-20 bg-[#F28482] text-[#FEF9F0] text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-xs">
          Bestseller
        </div>
      )}

      {/* Top Action Buttons: Wishlist & Compare */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        {onToggleCompare && (
          <button
            type="button"
            onClick={() => onToggleCompare(product)}
            className={`p-2 rounded-full border transition-all ${
              isCompared
                ? 'bg-[#84A59D] text-white border-[#84A59D]'
                : 'bg-white/90 dark:bg-[#2C3625]/90 border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#84A59D]'
            }`}
            title={isCompared ? "Remove from comparison" : "Add to side-by-side compare"}
            aria-label="Compare Product"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          className="p-2 rounded-full bg-white/90 dark:bg-[#2C3625]/90 border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#F28482] dark:hover:text-[#F28482] transition-colors"
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
      </div>

      {/* Product Image Area */}
      <div
        className="relative aspect-square overflow-hidden bg-[#FEF9F0] dark:bg-[#1A261D]/50 cursor-pointer"
        onClick={() => onOpenQuickView(product)}
      >
        <img
          src={imgSrc}
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

      {/* Details Area */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[#84A59D]">
              {product.category}
            </span>
            <span className="truncate max-w-[100px] text-right">
              {product.brand || 'ShopSmart'}
            </span>
          </div>

          <h3
            onClick={() => onOpenQuickView(product)}
            className="text-xs font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0] line-clamp-2 leading-snug cursor-pointer hover:text-[#F28482] transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-[11px] text-[#2C3625]/70 dark:text-[#FEF9F0]/70 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rating and Price Row */}
        <div>
          <div className="flex items-center justify-between pt-2 border-t border-[#2C3625]/5 dark:border-[#FEF9F0]/10">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#2C3625] dark:text-[#FEF9F0]">
              <Star className="w-3 h-3 fill-[#F28482] text-[#F28482]" />
              <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
            </div>

            <span className="text-xs font-extrabold text-[#2C3625] dark:text-[#FEF9F0]">
              ${product.price ? Number(product.price).toFixed(2) : '99.00'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            className={`w-full mt-2.5 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              inStock
                ? 'bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:bg-[#F28482] hover:text-white hover:border-[#F28482]'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
