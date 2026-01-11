'use client';

import { Header } from '@/components/layout/Header';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { useExpenseContext } from '@/contexts/ExpenseContext';

export default function NewExpensePage() {
  const { addExpense } = useExpenseContext();

  return (
    <div className="min-h-screen bg-ig-black pb-20 md:pb-0">
      <Header />

      <main className="max-w-[935px] mx-auto">
        {/* Page Header */}
        <div className="px-4 py-4 border-b border-ig-border">
          <h1 className="text-xl font-semibold text-ig-text">New Expense</h1>
          <p className="text-sm text-ig-text-secondary">
            AI will help categorize your expense
          </p>
        </div>

        <ExpenseForm onSubmit={addExpense} />
      </main>
    </div>
  );
}
