'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/types';
import { Input, TextArea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EXPENSE_CATEGORIES } from '@/lib/constants/categories';
import { validateExpenseForm, hasErrors } from '@/lib/utils/validators';
import { toISODateString } from '@/lib/utils/date';
import { parseCurrency } from '@/lib/utils/currency';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel?: () => void;
}

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiSuggestion, setAiSuggestion] = useState<{
    category: ExpenseCategory;
    confidence: number;
  } | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const [formData, setFormData] = useState<ExpenseFormData>({
    date: expense?.date ? new Date(expense.date) : new Date(),
    amount: expense?.amount.toString() || '',
    category: expense?.category || 'Other',
    description: expense?.description || '',
  });

  // Fetch AI category suggestion when description changes
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (formData.description.length > 5 && !expense) {
        setIsLoadingAI(true);
        try {
          const response = await fetch('/api/ai/categorize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: formData.description }),
          });

          if (response.ok) {
            const data = await response.json();
            setAiSuggestion({
              category: data.category,
              confidence: data.confidence,
            });
          }
        } catch (error) {
          console.error('Failed to get AI suggestion:', error);
        } finally {
          setIsLoadingAI(false);
        }
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [formData.description, expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateExpenseForm(formData);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        date: formData.date,
        amount: parseCurrency(formData.amount),
        category: formData.category,
        description: formData.description,
        aiCategorized: aiSuggestion ? true : false,
        aiConfidence: aiSuggestion?.confidence,
      });

      if (!onCancel) {
        router.push('/expenses');
      }
    } catch (error) {
      console.error('Failed to submit expense:', error);
      setErrors({ submit: 'Failed to save expense. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const applySuggestion = () => {
    if (aiSuggestion) {
      setFormData((prev) => ({ ...prev, category: aiSuggestion.category }));
      setAiSuggestion(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="animate-fade-in">
        <div className="space-y-6">
          {/* Date Input */}
          <div>
            <Input
              type="date"
              label="Date"
              name="date"
              value={toISODateString(formData.date)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: new Date(e.target.value),
                }))
              }
              error={errors.date}
              required
            />
          </div>

          {/* Amount Input */}
          <div>
            <Input
              type="number"
              label="Amount"
              name="amount"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              error={errors.amount}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <TextArea
              label="Description"
              name="description"
              rows={3}
              placeholder="What did you spend on?"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              error={errors.description}
              required
            />
          </div>

          {/* AI Suggestion */}
          {aiSuggestion && !errors.description && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600/20 to-purple-600/20 border-2 border-primary-500/30 p-5 animate-scale-in backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-600 opacity-20 rounded-full blur-3xl" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-100 mb-1.5 flex items-center gap-2">
                      <span>AI Suggestion:</span>
                      <span className="text-primary-400">{aiSuggestion.category}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-800/50 rounded-full overflow-hidden max-w-[140px] border border-slate-700/50">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg"
                          style={{ width: `${aiSuggestion.confidence * 100}%` }}
                        />
                      </div>
                      <p className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                        <span>{Math.round(aiSuggestion.confidence * 100)}%</span>
                        <span className="text-gray-500">confident</span>
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={applySuggestion}
                  className="shadow-lg flex-shrink-0"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}

          {/* Category Select */}
          <div>
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value as ExpenseCategory,
                }))
              }
              options={EXPENSE_CATEGORIES.map((cat) => ({
                value: cat,
                label: cat,
              }))}
              error={errors.category}
              required
            />
            {isLoadingAI && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="animate-spin h-4 w-4 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="font-medium">AI is analyzing...</span>
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-500/10 border-2 border-red-500/50 text-red-400 px-4 py-3 rounded-xl font-medium flex items-center gap-2">
              <span>⚠</span>
              {errors.submit}
            </div>
          )}
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} className="min-w-[160px]">
          {expense ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}
