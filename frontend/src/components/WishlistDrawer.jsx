import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveWishlist,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#2C3625]/40 dark:bg-black/60 transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FEF9F0] dark:bg-[#1A261D] border-l border-[#2C3625]/15 dark:border-[#FEF9F0]/20 shadow-2xl flex flex-col text-[#2C3625] dark:text-[#FEF9F0] transition-colors">
          {/* Header */}
          <div className="p-5 bg-white dark:bg-[#2C3625] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 fill-[#F28482] text-[#F28482]" />
              <h2 className="font-display text-lg font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                Saved Favorites
              </h2>
              <span className="text-xs bg-[#84A59D] text-[#FEF9F0] px-2.5 py-0.5 rounded-full font-bold tabular-nums">
                {wishlistItems.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D] text-[#2C3625]/75 dark:text-[#FEF9F0]/75 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 flex items-center justify-center text-[#F28482]">
                  <Heart className="w-6 h-6" />
                </div>
                <p className="font-display text-base font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                  No saved items yet
                </p>
                <p className="font-sans text-xs sm:text-sm text-[#2C3625]/85 dark:text-[#FEF9F0]/85 max-w-xs mx-auto leading-relaxed">
                  Click the heart icon on any product to save it here for later.
                </p>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-white dark:bg-[#2C3625] rounded-2xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center gap-3.5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 bg-[#FEF9F0] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-xs sm:text-sm font-semibold text-[#2C3625] dark:text-[#FEF9F0] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#84A59D] uppercase tracking-wider font-semibold">
                      {item.category}
                    </p>
                    <span className="font-display font-bold text-xs sm:text-sm tabular-nums text-[#2C3625] dark:text-[#FEF9F0] block mt-1">
                      ${item.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onAddToCart(item);
                          onRemoveWishlist(item.id);
                        }}
                        className="px-3 py-1 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#FEF9F0]" />
                        <span>Move to Cart</span>
                      </button>
                      <Link
                        to={`/product/${item.id}`}
                        onClick={onClose}
                        className="text-xs font-medium text-[#2C3625]/85 dark:text-[#FEF9F0]/85 hover:text-[#F28482] underline"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveWishlist(item.id)}
                    className="p-1.5 text-[#2C3625]/50 dark:text-[#FEF9F0]/50 hover:text-[#F28482] transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
