import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  itemCounts = {},
  sortBy,
  onSortChange,
  priceFilter,
  onPriceFilterChange
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = itemCounts[cat] ?? 0;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#E07A5F] text-[#FDFBF7] shadow-xs'
                  : 'bg-[#FDFBF7] text-[#3D405B] border border-[#3D405B]/25 hover:border-[#3D405B] hover:bg-[#F8F4EC]'
              }`}
            >
              <span>{cat}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected
                      ? 'bg-[#FDFBF7] text-[#E07A5F]'
                      : 'bg-[#F4F1DE] text-[#3D405B]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Secondary filter & sorting bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#3D405B]/15 text-xs text-[#5C5F79]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#3D405B]" />
          <span className="font-medium text-[#3D405B]">Price Budget:</span>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'All Budgets', max: Infinity },
              { label: 'Under $300', max: 300 },
              { label: 'Under $1,100', max: 1100 },
              { label: '$1,100+', min: 1100 }
            ].map((preset, idx) => {
              const active =
                (preset.max === Infinity && !priceFilter) ||
                (priceFilter?.max === preset.max && priceFilter?.min === preset.min);
              return (
                <button
                  key={idx}
                  onClick={() =>
                    onPriceFilterChange(preset.max === Infinity ? null : preset)
                  }
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                    active
                      ? 'bg-[#81B29A] text-[#FDFBF7] border-[#81B29A]'
                      : 'bg-[#FDFBF7] text-[#3D405B] border-[#3D405B]/20 hover:border-[#3D405B]/40'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#3D405B]">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#FDFBF7] border border-[#3D405B]/25 rounded-md px-2.5 py-1 text-xs text-[#3D405B] focus:outline-none focus:border-[#E07A5F]"
          >
            <option value="featured">Shopkeeper's Picks</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Reviews</option>
          </select>
        </div>
      </div>
    </div>
  );
};
