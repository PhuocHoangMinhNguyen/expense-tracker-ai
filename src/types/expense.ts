export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface Expense {
  id: string;
  date: Date | string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  aiCategorized?: boolean;
  aiConfidence?: number;
}

export interface ExpenseFormData {
  date: Date;
  amount: string;
  category: ExpenseCategory;
  description: string;
}

export interface ExpenseStats {
  totalSpending: number;
  monthlySpending: number;
  averageDaily: number;
  transactionCount: number;
  topCategory: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  } | null;
}

export interface CategoryTotal {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

export interface DailyData {
  date: string;
  total: number;
  count: number;
}
