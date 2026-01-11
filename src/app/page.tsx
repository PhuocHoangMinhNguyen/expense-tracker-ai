'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { CategoryStories } from '@/components/dashboard/CategoryStories';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/utils/currency';
import { CATEGORY_COLORS, CATEGORY_ICONS, EXPENSE_CATEGORIES } from '@/lib/constants/categories';
import { ExpenseCategory } from '@/types';

export default function DashboardPage() {
  const { expenses, stats, categoryTotals, recentExpenses, isLoading, deleteExpense } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');

  // Calculate category counts
  const categoryCounts = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = expenses.filter(e => e.category === cat).length;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  // Filter expenses by selected category
  const filteredExpenses = selectedCategory === 'All'
    ? recentExpenses
    : recentExpenses.filter(e => e.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ig-black">
        <Header />
        <main className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-ig-text border-t-transparent rounded-full animate-spin" />
            <p className="text-ig-text-secondary text-sm">Loading your expenses...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ig-black pb-20 md:pb-0">
      <Header />

      <main className="max-w-[935px] mx-auto">
        {/* Category Stories */}
        <CategoryStories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* Stats Section - Instagram style insights */}
        <div className="px-4 py-6 border-b border-ig-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total */}
            <div className="bg-ig-card rounded-ig-xl p-4 border border-ig-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-pink/20 flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
              </div>
              <p className="text-xl font-bold text-ig-text">{formatCurrency(stats.totalSpending)}</p>
              <p className="text-xs text-ig-text-secondary">Total spending</p>
            </div>

            {/* This Month */}
            <div className="bg-ig-card rounded-ig-xl p-4 border border-ig-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-action-blue/20 flex items-center justify-center">
                  <span className="text-lg">📅</span>
                </div>
              </div>
              <p className="text-xl font-bold text-ig-text">{formatCurrency(stats.monthlySpending)}</p>
              <p className="text-xs text-ig-text-secondary">This month</p>
            </div>

            {/* Daily Average */}
            <div className="bg-ig-card rounded-ig-xl p-4 border border-ig-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-purple/20 flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
              </div>
              <p className="text-xl font-bold text-ig-text">{formatCurrency(stats.averageDaily)}</p>
              <p className="text-xs text-ig-text-secondary">Daily average</p>
            </div>

            {/* Top Category */}
            <div className="bg-ig-card rounded-ig-xl p-4 border border-ig-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-orange/20 flex items-center justify-center">
                  <span className="text-lg">
                    {stats.topCategory ? CATEGORY_ICONS[stats.topCategory.category] : '🏆'}
                  </span>
                </div>
              </div>
              <p className="text-xl font-bold text-ig-text">
                {stats.topCategory ? stats.topCategory.category : 'N/A'}
              </p>
              <p className="text-xs text-ig-text-secondary">
                {stats.topCategory ? `${stats.topCategory.percentage.toFixed(0)}% of total` : 'Top category'}
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {expenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="ig-story-ring p-[3px] mb-6">
              <div className="bg-ig-black rounded-full p-[3px]">
                <div className="w-24 h-24 rounded-full bg-ig-card flex items-center justify-center">
                  <span className="text-5xl">💸</span>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-ig-text mb-2">
              Start Tracking Expenses
            </h2>
            <p className="text-ig-text-secondary text-center mb-6 max-w-xs">
              Add your first expense and let AI categorize it for you
            </p>
            <Link href="/expenses/new">
              <button className="ig-btn-primary">Add Your First Expense</button>
            </Link>
          </div>
        )}

        {/* Category Breakdown - Instagram Insights style */}
        {expenses.length > 0 && categoryTotals.length > 0 && (
          <div className="px-4 py-6 border-b border-ig-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-ig-text">Spending Breakdown</h2>
              <span className="text-sm text-ig-text-secondary">{stats.transactionCount} transactions</span>
            </div>

            <div className="space-y-3">
              {categoryTotals.slice(0, 5).map((cat) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${CATEGORY_COLORS[cat.category]}30` }}
                  >
                    <span className="text-lg">{CATEGORY_ICONS[cat.category]}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-ig-text">{cat.category}</span>
                      <span className="text-sm font-semibold text-ig-text">{formatCurrency(cat.total)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-ig-surface rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: CATEGORY_COLORS[cat.category],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Expenses Feed */}
        {expenses.length > 0 && (
          <div className="py-4">
            <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-base font-semibold text-ig-text">Recent Activity</h2>
              <Link href="/expenses" className="text-sm font-semibold text-action-blue">
                See All
              </Link>
            </div>

            <div className="space-y-4">
              {filteredExpenses.slice(0, 5).map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onDelete={deleteExpense}
                />
              ))}

              {filteredExpenses.length === 0 && selectedCategory !== 'All' && (
                <div className="text-center py-12 px-4">
                  <p className="text-ig-text-secondary">
                    No expenses in {selectedCategory}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
