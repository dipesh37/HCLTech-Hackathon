import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, ShieldCheck, Heart } from 'lucide-react';

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
  const packaging = 0; // Complimentary
  const total = subtotal + packaging;

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
        className="absolute inset-0 bg-[#3D405B]/40 transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] border-l border-[#3D405B]/20 shadow-xl flex flex-col text-[#3D405B]">
          {/* Header */}
          <div className="p-5 bg-[#F4F1DE] border-b border-[#3D405B]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#E07A5F]" />
              <h2 className="font-serif-boutique text-lg font-bold text-[#3D405B]">
                Your Shopping Tote
              </h2>
              <span className="text-xs bg-[#81B29A] text-[#FDFBF7] px-2 py-0.5 rounded-full font-semibold">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-[#FDFBF7] text-[#5C5F79] hover:text-[#3D405B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderComplete ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#81B29A]/20 border border-[#81B29A] flex items-center justify-center text-[#81B29A]">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif-boutique text-xl font-bold text-[#3D405B]">
                  Packaged with Care!
                </h3>
                <p className="text-xs text-[#5C5F79] max-w-xs mx-auto leading-relaxed">
                  Thank you! Clara is hand-preparing your parcel in recyclable kraft wrapping with a cotton ribbon. You will receive an arrival dispatch soon.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D26A4E] text-[#FDFBF7] text-xs font-semibold shadow-xs transition-colors"
                >
                  Return to Atelier
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#F4F1DE] border border-[#3D405B]/20 flex items-center justify-center text-[#5C5F79]">
                  <ShoppingBag className="w-6 h-6 text-[#E07A5F]" />
                </div>
                <p className="font-serif-boutique text-base font-bold text-[#3D405B]">
                  Your tote is currently empty
                </p>
                <p className="text-xs text-[#5C5F79] max-w-xs mx-auto">
                  Browse our modular laptops, walnut keyboards, and artisan leather goods to fill your parcel.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#F4F1DE] rounded-xl border border-[#3D405B]/15 flex items-center gap-3.5"
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
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-xs text-[#E07A5F]">
                          ${item.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2 bg-[#FDFBF7] border border-[#3D405B]/20 rounded-md px-1.5 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-0.5 text-[#5C5F79] hover:text-[#3D405B]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-[#3D405B] w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-0.5 text-[#5C5F79] hover:text-[#3D405B]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-[#7E8199] hover:text-[#E07A5F] transition-colors"
                      title="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Hand-written Gift Note input */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-[#3D405B] mb-1">
                    Complimentary Handwritten Box Note (Optional):
                  </label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="e.g., Happy writing in the new studio!"
                    className="w-full text-xs p-2.5 rounded-lg bg-[#F4F1DE] border border-[#3D405B]/20 text-[#3D405B] placeholder-[#7E8199] focus:outline-none focus:border-[#E07A5F]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Area */}
          {!orderComplete && cartItems.length > 0 && (
            <div className="p-5 bg-[#F4F1DE] border-t border-[#3D405B]/20 space-y-3">
              <div className="space-y-1.5 text-xs text-[#5C5F79]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#3D405B]">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Eco-Packaging & Carbon Offset</span>
                  <span className="font-medium text-[#81B29A]">Complimentary</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#3D405B]/15 text-sm font-bold text-[#3D405B]">
                  <span>Total</span>
                  <span className="text-[#E07A5F] font-serif-boutique text-base">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSimulateCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 rounded-xl bg-[#E07A5F] hover:bg-[#D26A4E] text-[#FDFBF7] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-[#FDFBF7]" />
                <span>
                  {isCheckingOut ? 'Preparing Order...' : 'Wrap & Dispatch Order'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#5C5F79]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#81B29A]" />
                <span>Protected by 30-Day Gentle Living Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
