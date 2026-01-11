'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants/categories';
import Link from 'next/link';

export default function DashboardPage() {
  const { expenses, stats, categoryTotals, recentExpenses, isLoading } = useExpenses();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loading size="lg" text="Loading your expenses..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Track your spending with AI-powered insights and analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card hover>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalSpending)}
                </p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlySpending)}
                </p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Daily</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.averageDaily)}
                </p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🧾</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.transactionCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Empty State */}
        {expenses.length === 0 && (
          <Card className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">💸</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No expenses yet</h3>
            <p className="text-gray-600 mb-6">
              Start tracking your expenses to get AI-powered insights and recommendations
            </p>
            <Link href="/expenses/new">
              <Button variant="primary">Add Your First Expense</Button>
            </Link>
          </Card>
        )}

        {expenses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader title="Category Breakdown" />
              <div className="space-y-3">
                {categoryTotals.slice(0, 6).map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{CATEGORY_ICONS[cat.category]}</span>
                        <span className="font-medium text-gray-900">{cat.category}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(cat.total)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: CATEGORY_COLORS[cat.category],
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {cat.count} transaction{cat.count !== 1 ? 's' : ''} ({cat.percentage.toFixed(1)}
                      %)
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Expenses */}
            <Card>
              <CardHeader
                title="Recent Expenses"
                action={
                  <Link href="/expenses">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                }
              />
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{CATEGORY_ICONS[expense.category]}</span>
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-600">{formatDate(expense.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{expense.category}</p>
                    </div>
                  </div>
                ))}

                {recentExpenses.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recent expenses</p>
                )}
              </div>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
