import { ExpenseCategory } from './expense';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface ExpenseFilters {
  dateRange: DateRange;
  categories: ExpenseCategory[];
  searchQuery: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface SortOptions {
  field: 'date' | 'amount' | 'category' | 'description';
  order: 'asc' | 'desc';
}
