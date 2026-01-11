'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { useExpenseContext } from '@/contexts/ExpenseContext';

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getExpenseById, updateExpense, isLoading } = useExpenseContext();

  const expense = getExpenseById(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ig-black">
        <Header />
        <main className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-ig-text border-t-transparent rounded-full animate-spin" />
            <p className="text-ig-text-secondary text-sm">Loading expense...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen bg-ig-black pb-20 md:pb-0">
        <Header />
        <main className="flex items-center justify-center h-[60vh]">
          <div className="text-center px-4">
            <div className="ig-story-ring p-[3px] mb-6 inline-block">
              <div className="bg-ig-black rounded-full p-[3px]">
                <div className="w-20 h-20 rounded-full bg-ig-card flex items-center justify-center">
                  <span className="text-4xl">😕</span>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-ig-text mb-2">Expense Not Found</h2>
            <p className="text-ig-text-secondary mb-6">The expense you are looking for does not exist.</p>
            <Link href="/expenses" className="text-action-blue font-semibold">
              Back to Expenses
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleUpdate = async (data: Parameters<typeof updateExpense>[1]) => {
    await updateExpense(expense.id, data);
    router.push('/expenses');
  };

  return (
    <div className="min-h-screen bg-ig-black pb-20 md:pb-0">
      <Header />

      <main className="max-w-[935px] mx-auto">
        {/* Page Header */}
        <div className="px-4 py-4 border-b border-ig-border">
          <h1 className="text-xl font-semibold text-ig-text">Edit Expense</h1>
          <p className="text-sm text-ig-text-secondary">
            Update your expense details
          </p>
        </div>

        <ExpenseForm expense={expense} onSubmit={handleUpdate} />
      </main>
    </div>
  );
}
