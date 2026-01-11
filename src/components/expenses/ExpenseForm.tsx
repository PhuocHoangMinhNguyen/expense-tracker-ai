'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/types';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/constants/categories';
import { validateExpenseForm, hasErrors } from '@/lib/utils/validators';
import { toISODateString } from '@/lib/utils/date';
import { parseCurrency } from '@/lib/utils/currency';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void> | Promise<Expense>;
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount - Big prominent input */}
      <div className="text-center py-8 border-b border-ig-border">
        <label className="text-sm text-ig-text-secondary mb-2 block">Amount</label>
        <div className="flex items-center justify-center gap-1">
          <span className="text-4xl font-light text-ig-text">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
            className="text-5xl font-semibold text-ig-text bg-transparent border-none outline-none text-center w-48 placeholder:text-ig-border"
            required
          />
        </div>
        {errors.amount && (
          <p className="text-action-like text-sm mt-2">{errors.amount}</p>
        )}
      </div>

      {/* Description */}
      <div className="px-4 py-4 border-b border-ig-border">
        <label className="text-sm font-medium text-ig-text mb-2 block">Description</label>
        <textarea
          rows={2}
          placeholder="What did you spend on?"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="ig-input resize-none"
          required
        />
        {errors.description && (
          <p className="text-action-like text-sm mt-2">{errors.description}</p>
        )}

        {/* AI Loading indicator */}
        {isLoadingAI && (
          <div className="mt-3 flex items-center gap-2 text-sm text-ig-text-secondary">
            <div className="w-4 h-4 border-2 border-action-blue border-t-transparent rounded-full animate-spin" />
            <span>AI is analyzing...</span>
          </div>
        )}
      </div>

      {/* AI Suggestion */}
      {aiSuggestion && !errors.description && (
        <div className="mx-4 p-4 bg-ig-card border border-ig-border rounded-ig-xl animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ig-gradient flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <p className="text-sm font-medium text-ig-text">
                  AI suggests: <span className="text-action-blue">{aiSuggestion.category}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-20 h-1.5 bg-ig-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ig-gradient rounded-full"
                      style={{ width: `${aiSuggestion.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-ig-text-secondary">
                    {Math.round(aiSuggestion.confidence * 100)}% confident
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={applySuggestion}
              className="ig-btn-primary text-sm px-4 py-2"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Category Selection - Instagram style grid */}
      <div className="px-4 py-4 border-b border-ig-border">
        <label className="text-sm font-medium text-ig-text mb-3 block">Category</label>
        <div className="grid grid-cols-3 gap-3">
          {EXPENSE_CATEGORIES.map((cat) => {
            const isSelected = formData.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-ig-xl border transition-all
                  ${isSelected
                    ? 'border-action-blue bg-action-blue/10'
                    : 'border-ig-border bg-ig-card hover:bg-ig-surface'
                  }
                `}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${CATEGORY_COLORS[cat]}30` }}
                >
                  <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                </div>
                <span className={`text-xs font-medium ${isSelected ? 'text-action-blue' : 'text-ig-text'}`}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p className="text-action-like text-sm mt-2">{errors.category}</p>
        )}
      </div>

      {/* Date */}
      <div className="px-4 py-4 border-b border-ig-border">
        <label className="text-sm font-medium text-ig-text mb-2 block">Date</label>
        <input
          type="date"
          value={toISODateString(formData.date)}
          onChange={(e) => setFormData((prev) => ({ ...prev, date: new Date(e.target.value) }))}
          className="ig-input"
          required
        />
        {errors.date && (
          <p className="text-action-like text-sm mt-2">{errors.date}</p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="mx-4 p-4 bg-action-like/10 border border-action-like/30 rounded-ig-xl">
          <p className="text-action-like text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-4 flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="flex-1 ig-btn-secondary py-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 ig-btn-primary py-3 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{expense ? 'Update' : 'Add Expense'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
