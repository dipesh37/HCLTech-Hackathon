import React from 'react';
import { Heart, ShoppingBag, MessageSquare, Star, Eye } from 'lucide-react';

export const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView,
  onAskShopkeeper
}) => {
  return (
    <article className="bg-[#FDFBF7] rounded-xl border border-[#3D405B]/20 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:border-[#3D405B]/40 group">
      {/* Product Image Area */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#F4F1DE]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-[#81B29A] text-[#FDFBF7] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product)}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#FDFBF7]/90 hover:bg-[#FDFBF7] border border-[#3D405B]/20 text-[#3D405B] transition-transform active:scale-95"
          title={isWishlisted ? "Remove from Saved" : "Save to Wishlist"}
          aria-label={isWishlisted ? "Remove from Saved" : "Save to Wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? 'fill-[#E07A5F] text-[#E07A5F]'
                : 'text-[#3D405B] hover:text-[#E07A5F]'
            }`}
          />
        </button>

        {/* Quick View Trigger on Hover */}
        <button
          onClick={() => onOpenQuickView(product)}
          className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-[#FDFBF7]/90 hover:bg-[#FDFBF7] border border-[#3D405B]/20 text-[#3D405B] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-xs"
        >
          <Eye className="w-3.5 h-3.5 text-[#3D405B]" />
          <span>Craft Details</span>
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-[#5C5F79] mb-1">
            <span className="font-medium tracking-wide uppercase text-[10px] text-[#81B29A]">
              {product.brand} • {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#3D405B]">
              <Star className="w-3.5 h-3.5 fill-[#F2CC8F] text-[#F2CC8F]" />
              <span className="font-semibold text-xs">{product.rating}</span>
              <span className="text-[10px] text-[#7E8199]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-boutique text-lg font-bold text-[#3D405B] leading-snug line-clamp-1 group-hover:text-[#E07A5F] transition-colors">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-xs text-[#5C5F79] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Key Specs Pills */}
          {product.specs && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.specs.memory && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F4F1DE] text-[#3D405B] font-medium border border-[#3D405B]/15">
                  {product.specs.memory}
                </span>
              )}
              {product.specs.battery && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F4F1DE] text-[#3D405B] font-medium border border-[#3D405B]/15">
                  {product.specs.battery}
                </span>
              )}
              {product.specs.weight && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F4F1DE] text-[#3D405B] font-medium border border-[#3D405B]/15">
                  {product.specs.weight}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer: Price & Buttons */}
        <div className="pt-3 border-t border-[#3D405B]/15 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-[#5C5F79] block">Boutique Price</span>
              <span className="text-xl font-bold font-serif-boutique text-[#3D405B]">
                ${product.price.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#81B29A] bg-[#81B29A]/15 px-2 py-0.5 rounded">
              Ready to Pack
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Ask Shopkeeper button */}
            <button
              onClick={() => onAskShopkeeper(product)}
              className="px-3 py-2 rounded-lg bg-[#F4F1DE] hover:bg-[#EAE4CC] border border-[#3D405B]/25 text-[#3D405B] text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              title="Ask Clara at the counter about this item"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#3D405B]" />
              <span>Ask Shopkeeper</span>
            </button>

            {/* Add to Bag button */}
            <button
              onClick={() => onAddToCart(product)}
              className="px-3 py-2 rounded-lg bg-[#E07A5F] hover:bg-[#D26A4E] text-[#FDFBF7] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#FDFBF7]" />
              <span>Add to Tote</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
