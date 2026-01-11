'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { useExpenseContext } from '@/contexts/ExpenseContext';

export default function NewExpensePage() {
  const { addExpense } = useExpenseContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">Add Expense</h1>
          <p className="text-gray-400 text-lg">Record a new expense with AI-powered categorization</p>
        </div>

        <ExpenseForm onSubmit={addExpense} />
      </main>

      <Footer />
    </div>
  );
}
