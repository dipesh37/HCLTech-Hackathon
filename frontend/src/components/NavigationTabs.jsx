import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export const NavigationTabs = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
  sortBy,
  onSortChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15">
      {/* Category Pills: All, Laptops, Phones */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] ?? 0;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#F28482] text-[#FEF9F0] shadow-xs'
                  : 'bg-white dark:bg-[#2C3625] text-[#2C3625] dark:text-[#FEF9F0] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 hover:border-[#F28482] dark:hover:border-[#F28482]'
              }`}
            >
              <span>{cat}</span>
              {count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                    isSelected
                      ? 'bg-white/25 text-[#FEF9F0]'
                      : 'bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625] dark:text-[#FEF9F0]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-2 shrink-0 text-xs sm:text-sm">
        <span className="text-[#2C3625]/85 dark:text-[#FEF9F0]/85 font-medium">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white dark:bg-[#2C3625] text-[#2C3625] dark:text-[#FEF9F0] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 rounded-full px-3.5 py-1.5 font-semibold focus:outline-none focus:border-[#F28482] cursor-pointer"
        >
          <option value="featured">Featured Goods</option>
          <option value="bestsellers">Bestsellers First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Customer Rated</option>
        </select>
      </div>
    </div>
  );
};
