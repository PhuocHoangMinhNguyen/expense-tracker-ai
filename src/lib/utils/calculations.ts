import {
  Expense,
  ExpenseStats,
  CategoryTotal,
  MonthlyData,
  DailyData,
  ExpenseCategory,
} from '@/types';
import { format, parseISO, differenceInDays } from 'date-fns';
import { getMonthRange } from './date';

export function calculateExpenseStats(expenses: Expense[]): ExpenseStats {
  if (expenses.length === 0) {
    return {
      totalSpending: 0,
      monthlySpending: 0,
      averageDaily: 0,
      transactionCount: 0,
      topCategory: null,
    };
  }

  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate monthly spending (current month)
  const { start: monthStart, end: monthEnd } = getMonthRange();
  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = typeof expense.date === 'string' ? parseISO(expense.date) : expense.date;
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });
  const monthlySpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate average daily spending
  const dates = expenses.map((e) => (typeof e.date === 'string' ? parseISO(e.date) : e.date));
  const oldestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const newestDate = new Date(Math.max(...dates.map((d) => d.getTime())));
  const daysDiff = differenceInDays(newestDate, oldestDate) + 1;
  const averageDaily = daysDiff > 0 ? totalSpending / daysDiff : totalSpending;

  // Find top category
  const categoryTotals = calculateCategoryTotals(expenses);
  const topCategory =
    categoryTotals.length > 0
      ? {
          category: categoryTotals[0].category,
          amount: categoryTotals[0].total,
          percentage: categoryTotals[0].percentage,
        }
      : null;

  return {
    totalSpending,
    monthlySpending,
    averageDaily,
    transactionCount: expenses.length,
    topCategory,
  };
}

export function calculateCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryMap = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { total: 0, count: 0 };
    }
    acc[expense.category].total += expense.amount;
    acc[expense.category].count += 1;
    return acc;
  }, {} as Record<ExpenseCategory, { total: number; count: number }>);

  const categoryTotals: CategoryTotal[] = Object.entries(categoryMap).map(
    ([category, data]) => ({
      category: category as ExpenseCategory,
      total: data.total,
      count: data.count,
      percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
    })
  );

  // Sort by total descending
  return categoryTotals.sort((a, b) => b.total - a.total);
}

export function calculateMonthlyTrends(expenses: Expense[]): MonthlyData[] {
  const monthlyMap: Record<string, { total: number; count: number }> = {};

  expenses.forEach((expense) => {
    const date = typeof expense.date === 'string' ? parseISO(expense.date) : expense.date;
    const monthKey = format(date, 'yyyy-MM');

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { total: 0, count: 0 };
    }

    monthlyMap[monthKey].total += expense.amount;
    monthlyMap[monthKey].count += 1;
  });

  const monthlyData: MonthlyData[] = Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    total: data.total,
    count: data.count,
  }));

  // Sort by month
  return monthlyData.sort((a, b) => a.month.localeCompare(b.month));
}

export function calculateDailyTrends(expenses: Expense[]): DailyData[] {
  const dailyMap: Record<string, { total: number; count: number }> = {};

  expenses.forEach((expense) => {
    const date = typeof expense.date === 'string' ? parseISO(expense.date) : expense.date;
    const dateKey = format(date, 'yyyy-MM-dd');

    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { total: 0, count: 0 };
    }

    dailyMap[dateKey].total += expense.amount;
    dailyMap[dateKey].count += 1;
  });

  const dailyData: DailyData[] = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    total: data.total,
    count: data.count,
  }));

  // Sort by date
  return dailyData.sort((a, b) => a.date.localeCompare(b.date));
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = average(numbers);
  const squareDiffs = numbers.map((num) => Math.pow(num - avg, 2));
  const avgSquareDiff = average(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

export function groupByCategory(
  expenses: Expense[]
): Record<ExpenseCategory, Expense[]> {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<ExpenseCategory, Expense[]>);
}
