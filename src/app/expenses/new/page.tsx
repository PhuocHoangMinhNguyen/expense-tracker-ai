'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { useExpenseContext } from '@/contexts/ExpenseContext';

export default function NewExpensePage() {
  const { addExpense } = useExpenseContext();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Expense</h1>
          <p className="text-gray-600">Record a new expense with AI-powered categorization</p>
        </div>

        <ExpenseForm onSubmit={addExpense} />
      </main>

      <Footer />
    </div>
  );
}
