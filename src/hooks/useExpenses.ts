import { useMemo } from 'react';
import { useExpenseContext } from '@/contexts/ExpenseContext';
import {
  calculateExpenseStats,
  calculateCategoryTotals,
  calculateMonthlyTrends,
  calculateDailyTrends,
} from '@/lib/utils/calculations';

export function useExpenses() {
  const context = useExpenseContext();

  const stats = useMemo(() => {
    return calculateExpenseStats(context.expenses);
  }, [context.expenses]);

  const categoryTotals = useMemo(() => {
    return calculateCategoryTotals(context.expenses);
  }, [context.expenses]);

  const monthlyTrends = useMemo(() => {
    return calculateMonthlyTrends(context.expenses);
  }, [context.expenses]);

  const dailyTrends = useMemo(() => {
    return calculateDailyTrends(context.expenses);
  }, [context.expenses]);

  const recentExpenses = useMemo(() => {
    return [...context.expenses]
      .sort((a, b) => {
        const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
        const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);
  }, [context.expenses]);

  return {
    ...context,
    stats,
    categoryTotals,
    monthlyTrends,
    dailyTrends,
    recentExpenses,
  };
}
