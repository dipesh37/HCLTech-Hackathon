import React, { useState } from 'react';
import { X, User, ShieldCheck, Crown, Star, Sparkles, Check } from 'lucide-react';
import { updateCustomerTier } from '../api/authApi';

const TIERS = [
  {
    key: 'BASIC',
    name: 'Basic Member',
    icon: User,
    badgeColor: 'text-[#2C3625] dark:text-[#FEF9F0] bg-[#2C3625]/10 dark:bg-[#FEF9F0]/15',
    benefits: [
      'Standard shipping (Free above $50)',
      'Standard 30-day return policy',
      'Access to full product catalog'
    ]
  },
  {
    key: 'PRIME',
    name: 'Prime Member',
    icon: Star,
    badgeColor: 'text-[#84A59D] bg-[#84A59D]/20 border border-[#84A59D]/40',
    benefits: [
      'Unlimited FREE Express Shipping on all orders above $25',
      'Priority 7-day hassle-free electronics returns',
      '2% automatic cashback rewards on all purchases',
      'Early access to seasonal sales & warehouse drops'
    ]
  },
  {
    key: 'PREMIUM',
    name: 'Premium Member',
    icon: Crown,
    badgeColor: 'text-[#F28482] bg-[#F28482]/20 border border-[#F28482]/40',
    benefits: [
      'All Prime benefits included',
      'Complimentary Same-Day courier delivery in metro zones',
      '5% automatic cashback rewards',
      'Extended 45-day return window & dedicated VIP support desk'
    ]
  }
];

export const CustomerAuthModal = ({
  isOpen,
  onClose,
  customer,
  onUpdateTier
}) => {
  const [selectedTier, setSelectedTier] = useState(customer?.membershipTier || 'PRIME');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSaveTier = async (tier) => {
    setSelectedTier(tier);
    setSaving(true);
    try {
      await updateCustomerTier(customer?.email || 'alex.dev@shopsmart.io', tier);
      onUpdateTier(tier);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-[#2C3625]/50 dark:bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625] dark:text-[#FEF9F0] w-full max-w-xl rounded-3xl border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-white dark:bg-[#2C3625] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#84A59D]/20 border border-[#84A59D] flex items-center justify-center text-[#84A59D]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                Customer Account & Membership
              </h2>
              <p className="text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
                {customer?.name || 'Alex Chen'} ({customer?.email || 'alex.dev@shopsmart.io'})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D] text-[#2C3625]/70 dark:text-[#FEF9F0]/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C3625]/60 dark:text-[#FEF9F0]/60 mb-1">
              Select Active Membership Tier
            </h3>
            <p className="text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
              Switch tiers below to test tier-specific shipping rules, return policy terms, and pricing in real time:
            </p>
          </div>

          <div className="space-y-3">
            {TIERS.map((tier) => {
              const Icon = tier.icon;
              const isCurrent = (customer?.membershipTier || selectedTier) === tier.key;
              return (
                <div
                  key={tier.key}
                  onClick={() => handleSaveTier(tier.key)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white dark:bg-[#2C3625] border-[#F28482] ring-2 ring-[#F28482]/20 shadow-sm'
                      : 'bg-white/60 dark:bg-[#2C3625]/60 border-[#2C3625]/10 dark:border-[#FEF9F0]/15 hover:border-[#F28482]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-xl ${tier.badgeColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-[#2C3625] dark:text-[#FEF9F0]">
                        {tier.name}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-[11px] font-bold text-[#F28482] flex items-center gap-1 bg-[#F28482]/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Active Tier
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1 pl-7">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="text-[11px] text-[#2C3625]/75 dark:text-[#FEF9F0]/75 list-disc">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-[#84A59D] hover:bg-[#6c8f87] text-[#FEF9F0] text-xs font-bold transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
