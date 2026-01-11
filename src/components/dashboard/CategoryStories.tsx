'use client';

import { ExpenseCategory } from '@/types';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/constants/categories';

interface CategoryStoriesProps {
  selectedCategory: ExpenseCategory | 'All';
  onSelectCategory: (category: ExpenseCategory | 'All') => void;
  categoryCounts?: Record<ExpenseCategory, number>;
}

export function CategoryStories({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {} as Record<ExpenseCategory, number>,
}: CategoryStoriesProps) {
  const allCategories: (ExpenseCategory | 'All')[] = ['All', ...EXPENSE_CATEGORIES];

  return (
    <div className="py-4 border-b border-ig-border">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
        {allCategories.map((category) => {
          const isActive = selectedCategory === category;
          const isAll = category === 'All';
          const count = isAll ? undefined : categoryCounts[category as ExpenseCategory] || 0;

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className="flex flex-col items-center gap-1 min-w-[72px] group"
            >
              {/* Story ring */}
              <div
                className={`
                  rounded-full p-[3px] transition-all duration-200
                  ${isActive ? 'bg-ig-gradient' : 'bg-ig-border group-hover:bg-ig-text-secondary'}
                `}
              >
                <div className="bg-ig-black rounded-full p-[2px]">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: isAll
                        ? '#262626'
                        : `${CATEGORY_COLORS[category as ExpenseCategory]}20`,
                    }}
                  >
                    <span className="text-2xl">
                      {isAll ? '✨' : CATEGORY_ICONS[category as ExpenseCategory]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Label */}
              <span
                className={`
                  text-xs font-medium truncate max-w-[72px]
                  ${isActive ? 'text-ig-text' : 'text-ig-text-secondary'}
                `}
              >
                {category}
              </span>

              {/* Count badge */}
              {count !== undefined && count > 0 && (
                <span className="text-[10px] text-ig-text-secondary">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
