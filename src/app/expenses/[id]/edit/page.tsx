'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Loading } from '@/components/ui/Loading';
import { useExpenseContext } from '@/contexts/ExpenseContext';

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getExpenseById, updateExpense, isLoading } = useExpenseContext();

  const expense = getExpenseById(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loading size="lg" text="Loading expense..." />
        </main>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-5xl">❌</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">Expense Not Found</h2>
            <p className="text-gray-400 mb-8 text-lg">The expense you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/expenses')}
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              ← Back to Expenses
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleUpdate = async (data: Parameters<typeof updateExpense>[1]) => {
    await updateExpense(expense.id, data);
    router.push('/expenses');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">Edit Expense</h1>
          <p className="text-gray-400 text-lg">Update your expense details</p>
        </div>

        <ExpenseForm expense={expense} onSubmit={handleUpdate} />
      </main>

      <Footer />
    </div>
  );
}
