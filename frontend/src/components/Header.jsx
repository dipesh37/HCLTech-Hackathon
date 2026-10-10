import React from 'react';
import { ShopSmartLogo } from './ShopSmartLogo';
import { ShoppingBag, Search, Sun, Moon, Heart } from 'lucide-react';

export const Header = ({
  theme,
  onToggleTheme,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FEF9F0] dark:bg-[#1A261D] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="transition-transform hover:scale-105 duration-200">
            <ShopSmartLogo />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0] block leading-none">
              ShopSmart
            </span>
            <span className="text-[11px] font-medium tracking-normal text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
              Curated Neighborhood Atelier
            </span>
          </div>
        </div>

        {/* Center: Pill-shaped Search Bar */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C3625]/50 dark:text-[#FEF9F0]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search pharmacy, beauty, tech, clothes, shoes..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-xs sm:text-sm text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/45 dark:placeholder-[#FEF9F0]/45 focus:outline-none focus:border-[#F28482] dark:focus:border-[#F28482] focus:ring-1 focus:ring-[#F28482] transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#F28482]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Theme Toggle + Saved + Cart */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:border-[#F28482] transition-colors relative"
            title="Saved items"
            aria-label="Saved items"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#F28482] text-[#F28482]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F28482] text-[#FEF9F0] text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Theme Toggle (Sun/Moon icon) */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#F28482] hover:border-[#F28482] transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle light and dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F9DC5C]" />
            ) : (
              <Moon className="w-4 h-4 text-[#2C3625]" />
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs sm:text-sm font-semibold transition-all shadow-xs"
            title="Open Tote Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#FEF9F0]" />
            <span className="hidden sm:inline">Cart</span>
            <span className="w-5 h-5 rounded-full bg-white/25 text-[#FEF9F0] text-xs font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
