import React, { useState, useEffect } from 'react';
import { X, Search, Package, Truck, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { trackOrder, advanceOrderStatus, fetchCustomerOrders } from '../api/orderApi';

const STATUS_STEPS = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock, desc: 'Confirmed by ShopSmart' },
  { key: 'PROCESSING', label: 'Processing', icon: Package, desc: 'Packed at Warehouse' },
  { key: 'SHIPPED', label: 'In Transit', icon: Truck, desc: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Signed & Received' }
];

export const OrderTrackerModal = ({
  isOpen,
  onClose,
  initialOrderNumber = '',
  customerEmail = 'alex.dev@shopsmart.io'
}) => {
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber || 'ORD-2026-00101');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const target = initialOrderNumber || orderNumberInput || 'ORD-2026-00101';
      setOrderNumberInput(target);
      handleSearch(target);
      loadRecentOrders();
    }
  }, [isOpen, initialOrderNumber]);

  const loadRecentOrders = async () => {
    try {
      const orders = await fetchCustomerOrders(customerEmail);
      if (Array.isArray(orders) && orders.length > 0) {
        setRecentOrders(orders);
      }
    } catch {
      // fallback
    }
  };

  const handleSearch = async (numToSearch) => {
    const num = (numToSearch || orderNumberInput).trim();
    if (!num) return;
    setLoading(true);
    setError(null);
    try {
      const order = await trackOrder(num);
      if (order) {
        setCurrentOrder(order);
      } else {
        setError(`No order found with number "${num}". Please check the order ID.`);
      }
    } catch (err) {
      setError('Unable to fetch order tracking status right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStatus = async () => {
    if (!currentOrder || !currentOrder.orderNumber) return;
    setAdvancing(true);
    try {
      const updated = await advanceOrderStatus(currentOrder.orderNumber);
      if (updated) {
        setCurrentOrder(updated);
        loadRecentOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdvancing(false);
    }
  };

  if (!isOpen) return null;

  const getStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-[#2C3625]/50 dark:bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625] dark:text-[#FEF9F0] w-full max-w-2xl rounded-3xl border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-white dark:bg-[#2C3625] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#84A59D]/20 border border-[#84A59D] flex items-center justify-center text-[#84A59D]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                Autonomous Order Tracking & Fulfillment
              </h2>
              <p className="text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
                Live supply chain events & delivery orchestration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D] text-[#2C3625]/70 dark:text-[#FEF9F0]/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Search Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSearch(orderNumberInput); }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C3625]/50 dark:text-[#FEF9F0]/50" />
              <input
                type="text"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="Enter Order Number (e.g. ORD-2026-00101)"
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-xs sm:text-sm text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/45 dark:placeholder-[#FEF9F0]/45 focus:outline-none focus:border-[#F28482]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-full bg-[#F28482] hover:bg-[#E57371] text-[#FEF9F0] text-xs font-bold transition-colors disabled:opacity-50 shrink-0 shadow-xs"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>

          {/* Quick Order Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#2C3625]/70 dark:text-[#FEF9F0]/70 font-medium text-[11px]">
              Sample Orders:
            </span>
            {['ORD-2026-00101', 'ORD-2026-00102'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setOrderNumberInput(num);
                  handleSearch(num);
                }}
                className="px-3 py-1 rounded-full bg-white dark:bg-[#2C3625] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 text-[11px] font-semibold text-[#84A59D] hover:border-[#84A59D] transition-colors"
              >
                {num}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {currentOrder && (
            <div className="space-y-6">
              
              {/* Order Status Badge & Overview */}
              <div className="p-5 bg-white dark:bg-[#2C3625] rounded-3xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#2C3625]/60 dark:text-[#FEF9F0]/60">
                        Order Number:
                      </span>
                      <span className="text-sm font-extrabold text-[#2C3625] dark:text-[#FEF9F0]">
                        {currentOrder.orderNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60 mt-0.5">
                      Recipient: {currentOrder.customerName || 'Valued Customer'} ({currentOrder.customerEmail})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#84A59D]/20 text-[#84A59D] border border-[#84A59D]/30">
                      Status: {currentOrder.status}
                    </span>
                    <span className="text-sm font-bold text-[#F28482]">
                      ${currentOrder.totalPrice ? Number(currentOrder.totalPrice).toFixed(2) : '99.00'}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="pt-3 pb-1">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? 'bg-[#84A59D] text-[#FEF9F0] shadow-xs'
                                : 'bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625]/40 dark:text-[#FEF9F0]/40 border border-[#2C3625]/15 dark:border-[#FEF9F0]/20'
                            } ${isCurrent ? 'ring-4 ring-[#84A59D]/30 scale-105' : ''}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[11px] font-bold mt-2 ${isCompleted ? 'text-[#2C3625] dark:text-[#FEF9F0]' : 'text-[#2C3625]/50 dark:text-[#FEF9F0]/50'}`}>
                            {step.label}
                          </span>
                          <span className="text-[10px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hidden sm:block">
                            {step.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking Note */}
                <div className="p-3.5 rounded-2xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15">
                  <p className="text-[11px] font-semibold text-[#84A59D] uppercase tracking-wider mb-1">
                    Live Shipment Status:
                  </p>
                  <p className="text-xs leading-relaxed text-[#2C3625] dark:text-[#FEF9F0]">
                    {currentOrder.trackingInfo || 'Order processing smoothly through regional distribution center.'}
                  </p>
                </div>
              </div>

              {/* Action: Mock Delivery Event */}
              {currentOrder.status !== 'DELIVERED' && (
                <div className="p-4 rounded-3xl bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#2C3625] dark:text-[#FEF9F0]">
                      Hackathon Delivery Simulation
                    </h4>
                    <p className="text-[11px] text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
                      Advance status to next stage (Warehouse Packing → In Transit → Delivered)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdvanceStatus}
                    disabled={advancing}
                    className="px-4 py-2 rounded-full bg-[#84A59D] hover:bg-[#6c8f87] text-[#FEF9F0] text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${advancing ? 'animate-spin' : ''}`} />
                    <span>{advancing ? 'Updating...' : 'Simulate Next Event'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
