import React from 'react';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const HeroBanner = () => {
  return (
    <section className="w-full bg-[#F9DC5C] text-[#2C3625] py-10 px-4 sm:px-6 lg:px-8 border-b border-[#2C3625]/10">
      <div className="max-w-7xl mx-auto text-center space-y-3">
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2C3625]/10 text-[#2C3625]">
          Curated Neighborhood Pantry & Goods
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          Thoughtful goods for every part of your day.
        </h1>
        <p className="text-sm sm:text-base text-[#2C3625]/85 max-w-2xl mx-auto leading-relaxed font-normal">
          From herbal apothecary drops and cold-pressed facial oils to modular computing, relaxed linen garments, and hand-lasted footwear.
        </p>

        {/* Small trust badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#2C3625]/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F28482]" />
            <span>Pure Botanical & Organic Ingredients</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2C3625]" />
            <span>Plastic-Free Kraft Packaging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#84A59D]" />
            <span>30-Day Gentle Living Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
