import React from 'react';
import { ShopSmartLogo } from './ShopSmartLogo';
import { ShoppingBag, Heart, Search, Compass, Store } from 'lucide-react';

export const Header = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="bg-[#FDFBF7] border-b border-[#3D405B]/20 sticky top-0 z-30 shadow-xs">
      {/* Top boutique announcement ribbon */}
      <div className="bg-[#81B29A] text-[#FDFBF7] text-xs font-medium py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Store className="w-3.5 h-3.5" />
        <span>Neighborhood Tech Boutique • 30-Day Gentle Living Trial & Complimentary Shipping</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="transition-transform hover:scale-105 duration-200">
            <ShopSmartLogo />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-boutique text-2xl font-bold tracking-tight text-[#3D405B]">
                ShopSmart
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4F1DE] text-[#3D405B] border border-[#3D405B]/20">
                Atelier
              </span>
            </div>
            <p className="text-xs text-[#5C5F79] font-normal">
              Mindfully Curated Laptops & Workspace Instruments
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5F79]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search laptops, keyboards, leather folios..."
              className="w-full pl-10 pr-4 py-2 bg-[#F4F1DE] border border-[#3D405B]/25 rounded-lg text-sm text-[#3D405B] placeholder-[#7E8199] focus:outline-none focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5C5F79] hover:text-[#3D405B]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Actions: Wishlist & Cart */}
        <div className="flex items-center gap-2.5">
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F4F1DE] hover:bg-[#F8F4EC] border border-[#3D405B]/20 text-[#3D405B] transition-all relative"
            title="View Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#E07A5F] text-[#E07A5F]' : 'text-[#3D405B]'}`} />
            <span className="text-xs font-medium hidden sm:inline">Saved</span>
            {wishlistCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#81B29A] text-[#FDFBF7] text-xs font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#E07A5F] hover:bg-[#D26A4E] text-[#FDFBF7] transition-all shadow-xs"
            title="View Shopping Tote"
          >
            <ShoppingBag className="w-4 h-4 text-[#FDFBF7]" />
            <span className="text-xs font-semibold tracking-wide">Tote Bag</span>
            <span className="w-5 h-5 rounded-full bg-[#FDFBF7] text-[#E07A5F] text-xs font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
