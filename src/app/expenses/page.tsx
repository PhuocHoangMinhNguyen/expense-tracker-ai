'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { CategoryStories } from '@/components/dashboard/CategoryStories';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { ConfirmModal } from '@/components/ui/Modal';
import { useExpenses } from '@/hooks/useExpenses';
import { useFilters } from '@/hooks/useFilters';
import { formatCurrency } from '@/lib/utils/currency';
import { exportToCSV } from '@/lib/utils/export';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants/categories';
import { Expense, ExpenseCategory } from '@/types';

// Search icon
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// Download icon
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function ExpensesPage() {
  const { expenses, deleteExpense, isLoading } = useExpenses();
  const {
    filteredExpenses,
    setSearchQuery,
    filters,
    hasActiveFilters,
    clearFilters,
  } = useFilters(expenses);

  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    expense: Expense | null;
  }>({ isOpen: false, expense: null });

  // Calculate category counts
  const categoryCounts = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = expenses.filter(e => e.category === cat).length;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  // Filter by category
  const categoryFilteredExpenses = selectedCategory === 'All'
    ? filteredExpenses
    : filteredExpenses.filter(e => e.category === selectedCategory);

  const handleDelete = async () => {
    if (deleteConfirm.expense) {
      await deleteExpense(deleteConfirm.expense.id);
      setDeleteConfirm({ isOpen: false, expense: null });
    }
  };

  const handleExport = () => {
    const dataToExport = hasActiveFilters ? filteredExpenses : expenses;
    exportToCSV(dataToExport);
  };

  const handleCategorySelect = (category: ExpenseCategory | 'All') => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ig-black">
        <Header />
        <main className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-ig-text border-t-transparent rounded-full animate-spin" />
            <p className="text-ig-text-secondary text-sm">Loading expenses...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ig-black pb-20 md:pb-0">
      <Header />

      <main className="max-w-[935px] mx-auto">
        {/* Page Header */}
        <div className="px-4 py-4 border-b border-ig-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-ig-text">All Expenses</h1>
              <p className="text-sm text-ig-text-secondary">
                {categoryFilteredExpenses.length} of {expenses.length} expenses
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={expenses.length === 0}
              className="p-2 text-ig-text hover:text-ig-text-secondary transition-colors disabled:opacity-50"
              title="Export to CSV"
            >
              <DownloadIcon />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ig-text-secondary">
              <SearchIcon />
            </div>
            <input
              type="search"
              placeholder="Search expenses..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ig-input pl-10"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-action-blue font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Category Stories */}
        <CategoryStories
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          categoryCounts={categoryCounts}
        />

        {/* Summary Stats */}
        {categoryFilteredExpenses.length > 0 && (
          <div className="px-4 py-4 border-b border-ig-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedCategory !== 'All' && (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${CATEGORY_COLORS[selectedCategory]}30` }}
                  >
                    <span className="text-lg">{CATEGORY_ICONS[selectedCategory]}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-ig-text-secondary">
                    {selectedCategory === 'All' ? 'Total' : selectedCategory}
                  </p>
                  <p className="text-lg font-bold text-ig-text">
                    {formatCurrency(categoryFilteredExpenses.reduce((sum, e) => sum + e.amount, 0))}
                  </p>
                </div>
              </div>
              <span className="text-sm text-ig-text-secondary">
                {categoryFilteredExpenses.length} expense{categoryFilteredExpenses.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Empty States */}
        {categoryFilteredExpenses.length === 0 && !hasActiveFilters && selectedCategory === 'All' && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="ig-story-ring p-[3px] mb-6">
              <div className="bg-ig-black rounded-full p-[3px]">
                <div className="w-24 h-24 rounded-full bg-ig-card flex items-center justify-center">
                  <span className="text-5xl">📝</span>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-ig-text mb-2">
              No expenses yet
            </h2>
            <p className="text-ig-text-secondary text-center mb-6 max-w-xs">
              Start tracking your expenses with AI-powered categorization
            </p>
            <Link href="/expenses/new">
              <button className="ig-btn-primary">Add Your First Expense</button>
            </Link>
          </div>
        )}

        {categoryFilteredExpenses.length === 0 && (hasActiveFilters || selectedCategory !== 'All') && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <p className="text-ig-text-secondary mb-4">No expenses match your filters</p>
            <button
              onClick={() => {
                clearFilters();
                setSelectedCategory('All');
              }}
              className="text-sm font-semibold text-action-blue"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Expenses Feed */}
        {categoryFilteredExpenses.length > 0 && (
          <div className="py-4 space-y-4">
            {categoryFilteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={(id) => {
                  const expenseToDelete = expenses.find(e => e.id === id);
                  if (expenseToDelete) {
                    setDeleteConfirm({ isOpen: true, expense: expenseToDelete });
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, expense: null })}
        onConfirm={handleDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete "${deleteConfirm.expense?.description}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
