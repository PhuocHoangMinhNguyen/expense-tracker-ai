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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">
            Financial Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            AI-powered insights for smarter spending decisions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Spending Card */}
          <div className="group relative overflow-hidden rounded-2xl animate-scale-in" style={{ animationDelay: '0ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-700 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-3xl">💰</span>
                </div>
                <div className="text-sm font-semibold bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Total
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white/80 font-medium">Total Spending</p>
                <p className="text-3xl font-bold">{formatCurrency(stats.totalSpending)}</p>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span>📊</span> {stats.transactionCount} transactions
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Spending Card */}
          <div className="group relative overflow-hidden rounded-2xl animate-scale-in" style={{ animationDelay: '100ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-3xl">📅</span>
                </div>
                <div className="text-sm font-semibold bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  This Month
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white/80 font-medium">Monthly Spending</p>
                <p className="text-3xl font-bold">{formatCurrency(stats.monthlySpending)}</p>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span>📈</span> Current billing period
                </p>
              </div>
            </div>
          </div>

          {/* Average Daily Card */}
          <div className="group relative overflow-hidden rounded-2xl animate-scale-in" style={{ animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-700 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
                <div className="text-sm font-semibold bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Average
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white/80 font-medium">Daily Average</p>
                <p className="text-3xl font-bold">{formatCurrency(stats.averageDaily)}</p>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span>📉</span> Per day spending
                </p>
              </div>
            </div>
          </div>

          {/* Top Category Card */}
          <div className="group relative overflow-hidden rounded-2xl animate-scale-in" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-700 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🏆</span>
                </div>
                <div className="text-sm font-semibold bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Top
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white/80 font-medium">Top Category</p>
                <p className="text-3xl font-bold">
                  {stats.topCategory ? stats.topCategory.category : 'N/A'}
                </p>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span>💎</span>
                  {stats.topCategory ? `${stats.topCategory.percentage.toFixed(0)}% of spending` : 'No data'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {expenses.length === 0 && (
          <Card className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-6xl">💸</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              Start Your Financial Journey
            </h3>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
              Track your expenses with AI-powered categorization and get intelligent insights
            </p>
            <Link href="/expenses/new">
              <Button variant="primary" size="lg" className="shadow-xl shadow-primary-500/20">
                Add Your First Expense
              </Button>
            </Link>
          </Card>
        )}

        {expenses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
            {/* Category Breakdown */}
            <Card hover>
              <CardHeader title="Spending by Category" />
              <div className="space-y-4">
                {categoryTotals.slice(0, 6).map((cat, index) => (
                  <div key={cat.category} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: CATEGORY_COLORS[cat.category] + '30' }}
                        >
                          <span className="text-2xl">{CATEGORY_ICONS[cat.category]}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-100">{cat.category}</p>
                          <p className="text-xs text-gray-500">{cat.count} transaction{cat.count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-100">{formatCurrency(cat.total)}</p>
                        <p className="text-xs text-gray-500">{cat.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500 ease-out shadow-lg"
                        style={{
                          width: `${cat.percentage}%`,
                          background: `linear-gradient(90deg, ${CATEGORY_COLORS[cat.category]}, ${CATEGORY_COLORS[cat.category]}dd)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Expenses */}
            <Card hover>
              <CardHeader
                title="Recent Transactions"
                action={
                  <Link href="/expenses">
                    <Button variant="ghost" size="sm">
                      View All →
                    </Button>
                  </Link>
                }
              />
              <div className="space-y-3">
                {recentExpenses.map((expense, index) => (
                  <Link href={`/expenses/${expense.id}/edit`} key={expense.id}>
                    <div
                      className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-700/30 rounded-xl hover:bg-slate-800/50 hover:border-primary-500/30 transition-all duration-200 cursor-pointer group animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: CATEGORY_COLORS[expense.category] + '40' }}
                        >
                          <span className="text-2xl">{CATEGORY_ICONS[expense.category]}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-100 group-hover:text-primary-400 transition-colors">
                            {expense.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                            {expense.aiCategorized && (
                              <span className="text-xs bg-gradient-to-r from-primary-600 to-primary-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                🤖 <span>AI</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-100">
                          {formatCurrency(expense.amount)}
                        </p>
                        <p className="text-xs text-gray-500">{expense.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}

                {recentExpenses.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No recent expenses</p>
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
