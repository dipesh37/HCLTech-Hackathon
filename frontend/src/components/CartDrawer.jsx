import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, ShieldCheck } from 'lucide-react';

export const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [customerNote, setCustomerNote] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handleSimulateCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      onClearCart();
    }, 1000);
  };

  const handleClose = () => {
    setOrderComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-[#2C3625]/40 dark:bg-black/60 transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FEF9F0] dark:bg-[#1A261D] border-l border-[#2C3625]/15 dark:border-[#FEF9F0]/20 shadow-2xl flex flex-col text-[#2C3625] dark:text-[#FEF9F0] transition-colors">
          {/* Header */}
          <div className="p-5 bg-white dark:bg-[#2C3625] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#F28482]" />
              <h2 className="text-lg font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                Your Cart
              </h2>
              <span className="text-xs bg-[#F28482] text-[#FEF9F0] px-2.5 py-0.5 rounded-full font-bold">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D] text-[#2C3625]/70 dark:text-[#FEF9F0]/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderComplete ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#84A59D]/20 border border-[#84A59D] flex items-center justify-center text-[#84A59D]">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                  Order Confirmed!
                </h3>
                <p className="text-xs text-[#2C3625]/80 dark:text-[#FEF9F0]/80 max-w-xs mx-auto leading-relaxed">
                  Thank you! Your parcel is being packed in sustainable kraft packaging and dispatched with care.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs font-semibold shadow-xs transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/20 flex items-center justify-center text-[#F28482]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-base font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                  Your cart is empty
                </p>
                <p className="text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70 max-w-xs mx-auto leading-relaxed">
                  Explore our apothecary pharmacy, beauty oils, tech instruments, and apparel to fill your bag.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white dark:bg-[#2C3625] rounded-2xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center gap-3.5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 bg-[#FEF9F0] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0] truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#84A59D] uppercase tracking-wide font-medium">
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-xs text-[#2C3625] dark:text-[#FEF9F0]">
                          ${item.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2 bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 rounded-full px-2 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-0.5 text-[#2C3625]/70 dark:text-[#FEF9F0]/70 hover:text-[#F28482]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-0.5 text-[#2C3625]/70 dark:text-[#FEF9F0]/70 hover:text-[#F28482]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-[#2C3625]/40 dark:text-[#FEF9F0]/40 hover:text-[#F28482] transition-colors"
                      title="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Packaging note */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-[#2C3625] dark:text-[#FEF9F0] mb-1">
                    Order Note / Gift Tag (Optional):
                  </label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="e.g. Please leave at front porch"
                    className="w-full text-xs p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/45 dark:placeholder-[#FEF9F0]/45 focus:outline-none focus:border-[#F28482]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout */}
          {!orderComplete && cartItems.length > 0 && (
            <div className="p-5 bg-white dark:bg-[#2C3625] border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-3">
              <div className="space-y-1.5 text-xs text-[#2C3625]/80 dark:text-[#FEF9F0]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C3625] dark:text-[#FEF9F0]">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Carbon-Neutral Delivery</span>
                  <span className="font-semibold text-[#84A59D]">Complimentary</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 text-sm font-bold text-[#2C3625] dark:text-[#FEF9F0]">
                  <span>Total</span>
                  <span className="text-[#F28482] text-base">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSimulateCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-[#FEF9F0]" />
                <span>
                  {isCheckingOut ? 'Processing Order...' : 'Checkout & Dispatch'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#84A59D]" />
                <span>Protected by 30-Day Gentle Living Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
