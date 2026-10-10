import React from 'react';
import { X, ShoppingBag, MessageSquare, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onAskShopkeeper
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#3D405B]/40 transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] border border-[#3D405B]/25 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#3D405B]">
        {/* Header Bar */}
        <div className="p-4 bg-[#F4F1DE] border-b border-[#3D405B]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#81B29A] uppercase tracking-wider">
              {product.brand} • {product.category}
            </span>
            {product.badge && (
              <span className="text-[10px] bg-[#E07A5F] text-[#FDFBF7] px-2 py-0.5 rounded-full font-bold">
                {product.badge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#5C5F79] hover:text-[#3D405B] hover:bg-[#FDFBF7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image */}
            <div className="rounded-xl overflow-hidden border border-[#3D405B]/20 bg-[#F4F1DE]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-4/3 object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="space-y-3">
              <h2 className="font-serif-boutique text-2xl font-bold text-[#3D405B] leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-[#5C5F79] leading-relaxed">
                {product.description}
              </p>
              <div className="pt-2">
                <span className="text-2xl font-bold font-serif-boutique text-[#E07A5F]">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-xs text-[#5C5F79] ml-2">
                  (Includes workshop setup & 2-year guarantee)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-2.5">
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D26A4E] text-[#FDFBF7] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FDFBF7]" />
                  <span>Add to Tote</span>
                </button>
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="p-2.5 rounded-xl bg-[#F4F1DE] hover:bg-[#EAE4CC] border border-[#3D405B]/20 text-[#3D405B] transition-colors"
                  title="Save item"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-[#E07A5F] text-[#E07A5F]' : 'text-[#3D405B]'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={() => {
                  onAskShopkeeper(product);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-[#F4F1DE] hover:bg-[#EAE4CC] border border-[#3D405B]/25 text-[#3D405B] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#81B29A]" />
                <span>Ask Clara about this in the Chat</span>
              </button>
            </div>
          </div>

          {/* Curator's Note */}
          {product.curatorsNote && (
            <div className="p-4 rounded-xl bg-[#F4F1DE] border border-[#3D405B]/20 space-y-1.5">
              <span className="text-[11px] font-bold text-[#E07A5F] uppercase tracking-wider block">
                Shopkeeper's Notebook — Clara
              </span>
              <p className="text-xs text-[#3D405B] italic leading-relaxed">
                "{product.curatorsNote}"
              </p>
            </div>
          )}

          {/* Specifications Table */}
          {product.specs && (
            <div className="space-y-3">
              <h3 className="font-serif-boutique text-sm font-bold text-[#3D405B]">
                Craft & Technical Specifications
              </h3>
              <div className="bg-[#F4F1DE]/60 rounded-xl border border-[#3D405B]/15 divide-y divide-[#3D405B]/15 text-xs">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex py-2 px-3.5 justify-between">
                    <span className="font-medium text-[#5C5F79] capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-semibold text-[#3D405B] text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px] text-[#5C5F79]">
            <div className="p-2 rounded-lg bg-[#F4F1DE] border border-[#3D405B]/15 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#81B29A]" />
              <span>Kraft Parcel Shipping</span>
            </div>
            <div className="p-2 rounded-lg bg-[#F4F1DE] border border-[#3D405B]/15 flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-[#81B29A]" />
              <span>30-Day Gentle Trial</span>
            </div>
            <div className="p-2 rounded-lg bg-[#F4F1DE] border border-[#3D405B]/15 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#81B29A]" />
              <span>2-Year Atelier Care</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
