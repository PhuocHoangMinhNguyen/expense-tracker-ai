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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Expense Not Found</h2>
            <p className="text-gray-600 mb-6">The expense you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/expenses')}
              className="text-primary-600 hover:text-primary-700"
            >
              Back to Expenses
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Expense</h1>
          <p className="text-gray-600">Update your expense details</p>
        </div>

        <ExpenseForm expense={expense} onSubmit={handleUpdate} />
      </main>

      <Footer />
    </div>
  );
}
