'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { ConfirmModal } from '@/components/ui/Modal';
import { useExpenses } from '@/hooks/useExpenses';
import { useFilters } from '@/hooks/useFilters';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import { exportToCSV } from '@/lib/utils/export';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants/categories';
import { Expense } from '@/types';

export default function ExpensesPage() {
  const { expenses, deleteExpense, isLoading } = useExpenses();
  const {
    filteredExpenses,
    setSearchQuery,
    filters,
    setSorting,
    sortOptions,
    hasActiveFilters,
    clearFilters,
  } = useFilters(expenses);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    expense: Expense | null;
  }>({ isOpen: false, expense: null });

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loading size="lg" text="Loading expenses..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">All Expenses</h1>
              <p className="text-gray-400 text-lg">
                {filteredExpenses.length} of {expenses.length} expenses
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExport} disabled={expenses.length === 0}>
                📥 Export CSV
              </Button>
              <Link href="/expenses/new">
                <Button variant="primary">+ Add Expense</Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search expenses..."
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Expenses List */}
        {filteredExpenses.length === 0 && !hasActiveFilters && (
          <Card className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-6xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">No expenses yet</h3>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">Start tracking your expenses with AI-powered categorization</p>
            <Link href="/expenses/new">
              <Button variant="primary" size="lg" className="shadow-xl shadow-primary-500/20">Add Your First Expense</Button>
            </Link>
          </Card>
        )}

        {filteredExpenses.length === 0 && hasActiveFilters && (
          <Card className="text-center py-12 animate-fade-in">
            <p className="text-gray-400 text-lg">No expenses match your filters</p>
            <Button variant="ghost" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </Card>
        )}

        {filteredExpenses.length > 0 && (
          <div className="space-y-3 animate-slide-up">
            {filteredExpenses.map((expense, index) => (
              <Card key={expense.id} hover padding="none" className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                <div className="p-4 sm:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                      style={{ backgroundColor: CATEGORY_COLORS[expense.category] + '30' }}
                    >
                      <span className="text-2xl">{CATEGORY_ICONS[expense.category]}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-100 truncate">
                          {expense.description}
                        </h3>
                        {expense.aiCategorized && (
                          <span
                            className="text-xs bg-gradient-to-r from-primary-600 to-primary-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1"
                            title="AI Categorized"
                          >
                            🤖 <span>AI</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{formatDate(expense.date)}</span>
                        <span>•</span>
                        <span
                          className="px-2 py-0.5 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: CATEGORY_COLORS[expense.category] + '30',
                            color: CATEGORY_COLORS[expense.category],
                          }}
                        >
                          {expense.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-100">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/expenses/${expense.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm({ isOpen: true, expense })}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />

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
