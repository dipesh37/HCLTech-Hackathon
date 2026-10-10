import React from 'react';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const HeroBanner = () => {
  return (
    <section className="w-full bg-[#F9DC5C] text-[#2C3625] py-10 px-4 sm:px-6 lg:px-8 border-b border-[#2C3625]/10">
      <div className="max-w-7xl mx-auto text-center space-y-3">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2C3625]/10 text-[#2C3625]">
          Curated Tech & Mobile Atelier
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-[#2C3625]">
          Thoughtful devices for work, life, and connection.
        </h1>
        <p className="font-sans text-base text-[#2C3625]/90 max-w-prose mx-auto leading-relaxed font-normal">
          From high-performance laptops for coding and daily productivity to flagship mobile phones with pro cameras and all-day battery life.
        </p>

        {/* Small trust badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#2C3625]/90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F28482]" />
            <span>Flagship Laptops & Mobile Phones</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2C3625]" />
            <span>Official Brand Warranties</span>
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
