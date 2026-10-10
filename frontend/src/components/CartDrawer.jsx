import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ShieldCheck, Check, Truck, ArrowRight } from 'lucide-react';
import { placeOrder } from '../api/orderApi';

export const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  customer,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onTrackOrder
}) => {
  const [customerNote, setCustomerNote] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
  );
  const isPrimeOrPremium = customer?.membershipTier === 'PRIME' || customer?.membershipTier === 'PREMIUM';
  const shippingFee = (isPrimeOrPremium || subtotal >= 50) ? 0 : 9.99;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    try {
      // Create simulated order in backend PostgreSQL
      const firstItem = cartItems[0];
      const result = await placeOrder({
        customerEmail: customer?.email || 'alex.dev@shopsmart.io',
        customerName: customer?.name || 'Alex Chen',
        productId: firstItem.id || 1,
        quantity: firstItem.quantity || 1,
        shippingAddress: customerNote || '42 Silicon Parkway, San Francisco, CA'
      });

      setConfirmedOrder(result);
      onClearCart();
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClose = () => {
    setConfirmedOrder(null);
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
        <div className="w-screen max-w-md bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625] dark:text-[#FEF9F0] border-l border-[#2C3625]/10 dark:border-[#FEF9F0]/15 shadow-2xl flex flex-col transition-colors">
          
          {/* Header */}
          <div className="p-5 bg-white dark:bg-[#2C3625] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F28482]" />
              <h2 className="text-base font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                Your Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D] text-[#2C3625]/70 dark:text-[#FEF9F0]/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {confirmedOrder ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#84A59D]/20 border-2 border-[#84A59D] flex items-center justify-center text-[#84A59D]">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                  Order Placed Successfully!
                </h3>
                <div className="p-3 bg-white dark:bg-[#2C3625] rounded-2xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 inline-block">
                  <span className="text-xs text-[#2C3625]/60 dark:text-[#FEF9F0]/60">Order Reference: </span>
                  <span className="text-xs font-black text-[#84A59D] ml-1">
                    {confirmedOrder.orderNumber}
                  </span>
                </div>
                <p className="text-xs text-[#2C3625]/80 dark:text-[#FEF9F0]/80 max-w-xs mx-auto leading-relaxed">
                  Your order has been recorded in the central fulfillment database. Simulated delivery events are now live!
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const num = confirmedOrder.orderNumber;
                      handleClose();
                      if (onTrackOrder) onTrackOrder(num);
                    }}
                    className="w-full py-3 rounded-full bg-[#84A59D] hover:bg-[#6c8f87] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Shipment Live</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-2.5 rounded-full border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
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
                  Explore our tech gadgets, apparel, home appliances, and books to fill your bag.
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
                      src={item.image || item.imageUrl || '/images/default_product.jpg'}
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
                          ${Number(item.price).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2 bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 rounded-full px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-0.5 text-[#2C3625]/70 dark:text-[#FEF9F0]/70 hover:text-[#F28482]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-0.5 text-[#2C3625]/70 dark:text-[#FEF9F0]/70 hover:text-[#F28482]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-[#2C3625]/40 dark:text-[#FEF9F0]/40 hover:text-[#F28482] transition-colors"
                      title="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Packaging / Delivery note */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-[#2C3625] dark:text-[#FEF9F0] mb-1">
                    Delivery Instructions / Address:
                  </label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="e.g. 42 Silicon Parkway, San Francisco, CA"
                    className="w-full text-xs p-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/45 dark:placeholder-[#FEF9F0]/45 focus:outline-none focus:border-[#F28482]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout */}
          {!confirmedOrder && cartItems.length > 0 && (
            <div className="p-5 bg-white dark:bg-[#2C3625] border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-3">
              <div className="space-y-1.5 text-xs text-[#2C3625]/80 dark:text-[#FEF9F0]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C3625] dark:text-[#FEF9F0]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shippingFee === 0 ? 'text-[#84A59D]' : 'text-[#2C3625] dark:text-[#FEF9F0]'}`}>
                    {shippingFee === 0 ? 'FREE (Member Perk)' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 text-sm font-bold text-[#2C3625] dark:text-[#FEF9F0]">
                  <span>Total</span>
                  <span className="text-[#F28482] text-base">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 rounded-full bg-[#F28482] hover:bg-[#E57371] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isCheckingOut ? 'Orchestrating Order...' : 'Checkout & Dispatch'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#84A59D]" />
                <span>30-Day Hassle-Free Return Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
