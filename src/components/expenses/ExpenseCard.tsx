'use client';

import Link from 'next/link';
import { Expense } from '@/types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/constants/categories';
import { formatCurrency } from '@/lib/utils/currency';
import { formatRelativeDate } from '@/lib/utils/date';

interface ExpenseCardProps {
  expense: Expense;
  onDelete?: (id: string) => void;
}

// Instagram-style action icons
const HeartIcon = () => (
  <svg aria-label="Like" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2">
    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938Z" />
  </svg>
);

const CommentIcon = () => (
  <svg aria-label="Comment" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2">
    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" />
  </svg>
);

const MoreIcon = () => (
  <svg aria-label="More options" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </svg>
);

export function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  const categoryColor = CATEGORY_COLORS[expense.category];
  const categoryIcon = CATEGORY_ICONS[expense.category];

  return (
    <article className="ig-post animate-fade-in">
      {/* Header - like Instagram post header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Category avatar with story ring */}
          <div className="ig-story-ring p-[2px]">
            <div className="bg-ig-black rounded-full p-[2px]">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${categoryColor}30` }}
              >
                <span className="text-lg">{categoryIcon}</span>
              </div>
            </div>
          </div>

          {/* Category & time */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-ig-text">
              {expense.category}
            </span>
            <span className="text-xs text-ig-text-secondary">
              {formatRelativeDate(expense.date)}
            </span>
          </div>
        </div>

        {/* More options menu */}
        <button className="ig-action-btn text-ig-text">
          <MoreIcon />
        </button>
      </div>

      {/* Content area - the "image" equivalent */}
      <div
        className="aspect-[4/3] flex flex-col items-center justify-center px-6"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}15 0%, ${categoryColor}05 100%)`,
        }}
      >
        <span className="text-5xl mb-4">{categoryIcon}</span>
        <span className="text-3xl font-bold text-ig-text mb-2">
          {formatCurrency(expense.amount)}
        </span>
        <p className="text-center text-ig-text-secondary text-sm max-w-[280px] line-clamp-2">
          {expense.description}
        </p>
        {expense.aiCategorized && (
          <div className="mt-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-action-blue/20">
            <span className="text-xs">🤖</span>
            <span className="text-xs text-action-blue font-medium">AI Categorized</span>
          </div>
        )}
      </div>

      {/* Action buttons - Instagram style */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button className="ig-action-btn text-ig-text hover:text-action-like transition-colors">
              <HeartIcon />
            </button>
            <button className="ig-action-btn text-ig-text">
              <CommentIcon />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/expenses/${expense.id}/edit`}>
              <button className="ig-btn-secondary text-xs px-3 py-1.5">
                Edit
              </button>
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(expense.id)}
                className="text-xs px-3 py-1.5 rounded-ig text-action-like border border-action-like/30 hover:bg-action-like/10 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Amount highlight */}
        <p className="text-sm">
          <span className="font-semibold text-ig-text">Amount: </span>
          <span className="text-ig-text">{formatCurrency(expense.amount)}</span>
        </p>

        {/* Description */}
        {expense.description && (
          <p className="text-sm text-ig-text-secondary mt-1 line-clamp-2">
            {expense.description}
          </p>
        )}

        {/* Date */}
        <time className="text-[10px] text-ig-text-secondary uppercase tracking-wide mt-2 block">
          {new Date(expense.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
      </div>
    </article>
  );
}
