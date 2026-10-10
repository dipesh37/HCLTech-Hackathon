import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';

export const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) => {
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleWishlist(product);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onAddToCart(product);
  };

  return (
    <article className="bg-white dark:bg-[#2C3625] rounded-2xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-[#F28482]/50 group relative">
      {/* Floating Pink "Bestseller" Tag */}
      {product.isBestseller && (
        <div className="absolute top-3 left-3 z-20 bg-[#F28482] text-[#FEF9F0] text-xs font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs pointer-events-none">
          Bestseller
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-[#2C3625]/90 border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#F28482] dark:hover:text-[#F28482] transition-colors cursor-pointer"
        title={isWishlisted ? "Remove from Saved" : "Save to Wishlist"}
        aria-label={isWishlisted ? "Remove from Saved" : "Save to Wishlist"}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted
              ? 'fill-[#F28482] text-[#F28482]'
              : 'text-[#2C3625] dark:text-[#FEF9F0]'
          }`}
        />
      </button>

      {/* Product Image Area linked to Product Detail */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-[#FEF9F0] dark:bg-[#1A261D]/50 block">
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-104"
          loading="lazy"
        />

        {/* Hover Quick Details Trigger */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-[#2C3625]/95 border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-xs font-medium text-[#2C3625] dark:text-[#FEF9F0] flex items-center gap-1 shadow-xs">
            <Eye className="w-3.5 h-3.5" /> Quick Details
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-[#2C3625]/75 dark:text-[#FEF9F0]/75 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-xs text-[#84A59D] dark:text-[#84A59D]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#2C3625] dark:text-[#FEF9F0]">
              <Star className="w-3.5 h-3.5 fill-[#F9DC5C] text-[#F9DC5C]" />
              <span className="font-semibold text-xs">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.id}`}
            className="font-display text-base font-semibold text-[#2C3625] dark:text-[#FEF9F0] line-clamp-2 leading-snug group-hover:text-[#F28482] transition-colors block"
          >
            {product.name}
          </Link>

          {/* Description */}
          <p className="font-sans text-xs text-[#2C3625]/85 dark:text-[#FEF9F0]/85 line-clamp-2 leading-relaxed mt-1.5 font-normal pb-0.5">
            {product.description}
          </p>
        </div>

        {/* Price and Add to Cart */}
        <div className="pt-3 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-[#2C3625]/75 dark:text-[#FEF9F0]/75 block leading-none mb-0.5">
              Price
            </span>
            <span className="font-display text-base sm:text-lg font-bold tabular-nums text-[#2C3625] dark:text-[#FEF9F0]">
              ${product.price?.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCartClick}
            className="px-3.5 py-1.5 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#FEF9F0]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};

