import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShopSmartLogo } from './ShopSmartLogo';
import { ShoppingBag, Search, Sun, Moon, Heart, User, LogOut, Shield } from 'lucide-react';

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
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside or pressing Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const tier = user?.membershipTier || 'BASIC';

  const getTierBadgeStyle = (userTier) => {
    switch (userTier.toUpperCase()) {
      case 'PRIME':
        return 'bg-[#F9DC5C] text-[#2C3625]';
      case 'PREMIUM':
        return 'bg-[#F28482] text-white';
      default:
        return 'bg-[#84A59D] text-white';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FEF9F0] dark:bg-[#1A261D] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="transition-transform hover:scale-105 duration-200">
            <ShopSmartLogo />
          </div>
          <div>
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0] block leading-none">
              ShopSmart
            </span>
            <span className="font-sans text-xs font-medium text-[#2C3625]/80 dark:text-[#FEF9F0]/80">
              Curated Tech & Mobile Store
            </span>
          </div>
        </Link>

        {/* Center: Pill-shaped Search Bar */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C3625]/60 dark:text-[#FEF9F0]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search laptops, phones..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-xs sm:text-sm text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/60 dark:placeholder-[#FEF9F0]/60 focus:outline-none focus:border-[#F28482] dark:focus:border-[#F28482] focus:ring-1 focus:ring-[#F28482] transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#2C3625]/75 dark:text-[#FEF9F0]/75 hover:text-[#F28482] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Auth State + Theme Toggle + Saved + Cart */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Auth State Button */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 rounded-full bg-[#84A59D] text-white font-bold text-xs flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity cursor-pointer focus:outline-none border-2 border-white dark:border-[#2C3625]"
                title={`Logged in as ${user?.name}`}
                aria-label="User Account Menu"
              >
                {initial}
              </button>

              {/* Account Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 rounded-2xl shadow-xl py-3 px-4 z-50 text-[#2C3625] dark:text-[#FEF9F0] space-y-3">
                  <div className="border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 pb-2.5 space-y-1">
                    <p className="font-display font-bold text-sm truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70 truncate">
                      {user?.email}
                    </p>
                    <div className="pt-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider ${getTierBadgeStyle(tier)}`}>
                        <Shield className="w-3 h-3" />
                        {tier} Member
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 text-xs font-semibold text-[#F28482] hover:text-[#E57371] py-1 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] hover:border-[#F28482] transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="hidden lg:inline text-xs font-semibold text-[#84A59D] hover:underline"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:border-[#F28482] transition-colors relative cursor-pointer"
            title="Saved items"
            aria-label="Saved items"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#F28482] text-[#F28482]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#F28482] text-[#FEF9F0] text-xs font-bold tabular-nums flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] hover:text-[#F28482] hover:border-[#F28482] transition-colors cursor-pointer"
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
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            title="Open Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#FEF9F0]" />
            <span className="hidden sm:inline">Cart</span>
            <span className="w-5 h-5 rounded-full bg-white/25 text-[#FEF9F0] text-xs font-bold tabular-nums flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
