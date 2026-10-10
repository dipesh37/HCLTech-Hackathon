import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveWishlist,
  onAddToCart,
  onOpenQuickView
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#3D405B]/40 transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] border-l border-[#3D405B]/20 shadow-xl flex flex-col text-[#3D405B]">
          {/* Header */}
          <div className="p-5 bg-[#F4F1DE] border-b border-[#3D405B]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 fill-[#E07A5F] text-[#E07A5F]" />
              <h2 className="font-serif-boutique text-lg font-bold text-[#3D405B]">
                Saved Favorites
              </h2>
              <span className="text-xs bg-[#81B29A] text-[#FDFBF7] px-2 py-0.5 rounded-full font-semibold">
                {wishlistItems.length} saved
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#FDFBF7] text-[#5C5F79] hover:text-[#3D405B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#F4F1DE] border border-[#3D405B]/20 flex items-center justify-center text-[#5C5F79]">
                  <Heart className="w-6 h-6 text-[#E07A5F]" />
                </div>
                <p className="font-serif-boutique text-base font-bold text-[#3D405B]">
                  No saved items yet
                </p>
                <p className="text-xs text-[#5C5F79] max-w-xs mx-auto">
                  Click the heart icon on any laptop or craft instrument to save it for your next visit.
                </p>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#F4F1DE] rounded-xl border border-[#3D405B]/15 flex items-center gap-3.5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-[#3D405B]/15 bg-[#FDFBF7] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-boutique text-xs font-bold text-[#3D405B] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#5C5F79]">{item.category}</p>
                    <span className="font-bold text-xs text-[#E07A5F] block mt-1">
                      ${item.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onAddToCart(item);
                          onRemoveWishlist(item.id);
                        }}
                        className="px-2.5 py-1 rounded bg-[#E07A5F] hover:bg-[#D26A4E] text-[#FDFBF7] text-[11px] font-medium flex items-center gap-1 shadow-xs"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#FDFBF7]" />
                        <span>Move to Tote</span>
                      </button>
                      <button
                        onClick={() => {
                          onOpenQuickView(item);
                          onClose();
                        }}
                        className="text-[11px] text-[#5C5F79] hover:text-[#3D405B] underline"
                      >
                        Specs
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveWishlist(item.id)}
                    className="p-1.5 text-[#7E8199] hover:text-[#E07A5F] transition-colors"
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
