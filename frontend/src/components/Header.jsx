import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShopSmartLogo } from './ShopSmartLogo';
import { ShoppingBag, Search, Sun, Moon, Heart, Truck, Scale, User, Crown, Star } from 'lucide-react';

export const Header = ({
  theme,
  onToggleTheme,
  cartCount,
  wishlistCount,
  compareCount = 0,
  customer,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onOpenOrderTracker,
  onOpenAuth,
  searchQuery,
  onSearchChange
}) => {
  const getTierBadge = (tier) => {
    switch (tier) {
      case 'PREMIUM':
        return { label: 'Premium', icon: Crown, color: 'text-[#F28482] bg-[#F28482]/15 border-[#F28482]/30' };
      case 'PRIME':
        return { label: 'Prime', icon: Star, color: 'text-[#84A59D] bg-[#84A59D]/15 border-[#84A59D]/30' };
      default:
        return { label: 'Basic', icon: User, color: 'text-[#2C3625]/70 dark:text-[#FEF9F0]/70 bg-black/5 dark:bg-white/10 border-transparent' };
    }
  };

  const tierInfo = getTierBadge(customer?.membershipTier || 'PRIME');
  const TierIcon = tierInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-[#FEF9F0] dark:bg-[#1A261D] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Logo & Subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="transition-transform hover:scale-105 duration-200 cursor-pointer">
            <ShopSmartLogo />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#2C3625] dark:text-[#FEF9F0] block leading-none">
              ShopSmart<span className="text-[#F28482]">.ai</span>
            </span>
            <span className="text-[11px] font-medium tracking-normal text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
              Autonomous E-Commerce Platform
            </span>
          </div>
        </Link>

        {/* Center: Pill-shaped Search Bar */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C3625]/60 dark:text-[#FEF9F0]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tech, books, appliances, pharmacy, fashion..."
              className="w-full pl-11 pr-16 py-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-xs sm:text-sm text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/45 dark:placeholder-[#FEF9F0]/45 focus:outline-none focus:border-[#F28482] dark:focus:border-[#F28482] focus:ring-1 focus:ring-[#F28482] transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#2C3625]/75 dark:text-[#FEF9F0]/75 hover:text-[#F28482] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Customer Membership Pill */}
          <button
            type="button"
            onClick={onOpenAuth}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:scale-103 ${tierInfo.color}`}
            title="Manage membership tier and preferences"
          >
            <TierIcon className="w-3.5 h-3.5" />
            <span>{customer?.name?.split(' ')[0] || 'Alex'}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10">
              {tierInfo.label}
            </span>
          </button>

          {/* Order Tracker Button */}
          <button
            type="button"
            onClick={onOpenOrderTracker}
            className="p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#84A59D] transition-colors flex items-center gap-1.5 shadow-xs"
            title="Track Orders & Simulated Shipments"
          >
            <Truck className="w-4 h-4 text-[#84A59D]" />
            <span className="text-xs font-semibold hidden lg:inline">Orders</span>
          </button>

          {/* Compare Button */}
          {compareCount > 0 && (
            <button
              type="button"
              onClick={onOpenCompare}
              className="px-3 py-2 rounded-full bg-[#84A59D] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 animate-pulse"
              title="Compare Selected Products"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({compareCount})</span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#F28482] transition-colors relative shadow-xs"
            title="Saved Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F28482] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#F28482] transition-colors relative shadow-xs"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F28482] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#F28482] transition-colors shadow-xs"
            title={theme === 'dark' ? "Switch to daylight mode" : "Switch to midnight mode"}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F28482]" />
            ) : (
              <Moon className="w-4 h-4 text-[#2C3625]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
