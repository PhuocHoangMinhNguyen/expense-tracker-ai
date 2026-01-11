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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Expenses</h1>
              <p className="text-gray-600">
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
          <Card className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No expenses yet</h3>
            <p className="text-gray-600 mb-6">Start tracking your expenses</p>
            <Link href="/expenses/new">
              <Button variant="primary">Add Expense</Button>
            </Link>
          </Card>
        )}

        {filteredExpenses.length === 0 && hasActiveFilters && (
          <Card className="text-center py-12">
            <p className="text-gray-600">No expenses match your filters</p>
            <Button variant="ghost" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </Card>
        )}

        {filteredExpenses.length > 0 && (
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <Card key={expense.id} hover padding="none">
                <div className="p-4 sm:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[expense.category] + '20' }}
                    >
                      <span className="text-2xl">{CATEGORY_ICONS[expense.category]}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {expense.description}
                        </h3>
                        {expense.aiCategorized && (
                          <span
                            className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full"
                            title="AI Categorized"
                          >
                            🤖 AI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{formatDate(expense.date)}</span>
                        <span>•</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: CATEGORY_COLORS[expense.category] + '20',
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
                      <p className="text-xl font-bold text-gray-900">
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
