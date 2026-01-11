import { useState, useMemo, useCallback } from 'react';
import { Expense, ExpenseFilters, SortOptions, ExpenseCategory } from '@/types';
import { isDateInRange } from '@/lib/utils/date';
import { parseISO } from 'date-fns';

export function useFilters(expenses: Expense[]) {
  const [filters, setFilters] = useState<ExpenseFilters>({
    dateRange: { startDate: null, endDate: null },
    categories: [],
    searchQuery: '',
    minAmount: undefined,
    maxAmount: undefined,
  });

  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'date',
    order: 'desc',
  });

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter((expense) =>
        expense.description.toLowerCase().includes(query)
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((expense) =>
        filters.categories.includes(expense.category)
      );
    }

    // Filter by date range
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      filtered = filtered.filter((expense) =>
        isDateInRange(
          expense.date,
          filters.dateRange.startDate,
          filters.dateRange.endDate
        )
      );
    }

    // Filter by amount range
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter((expense) => expense.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter((expense) => expense.amount <= filters.maxAmount!);
    }

    return filtered;
  }, [expenses, filters]);

  const sortedExpenses = useMemo(() => {
    const sorted = [...filteredExpenses];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (sortOptions.field) {
        case 'date': {
          const dateA = typeof a.date === 'string' ? parseISO(a.date) : a.date;
          const dateB = typeof b.date === 'string' ? parseISO(b.date) : b.date;
          compareValue = dateA.getTime() - dateB.getTime();
          break;
        }
        case 'amount':
          compareValue = a.amount - b.amount;
          break;
        case 'category':
          compareValue = a.category.localeCompare(b.category);
          break;
        case 'description':
          compareValue = a.description.localeCompare(b.description);
          break;
      }

      return sortOptions.order === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }, [filteredExpenses, sortOptions]);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setCategories = useCallback((categories: ExpenseCategory[]) => {
    setFilters((prev) => ({ ...prev, categories }));
  }, []);

  const setDateRange = useCallback((startDate: Date | null, endDate: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { startDate, endDate },
    }));
  }, []);

  const setAmountRange = useCallback((minAmount?: number, maxAmount?: number) => {
    setFilters((prev) => ({ ...prev, minAmount, maxAmount }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      dateRange: { startDate: null, endDate: null },
      categories: [],
      searchQuery: '',
      minAmount: undefined,
      maxAmount: undefined,
    });
  }, []);

  const setSorting = useCallback((field: SortOptions['field'], order?: SortOptions['order']) => {
    setSortOptions((prev) => ({
      field,
      order: order || (prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'),
    }));
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.categories.length > 0 ||
      filters.dateRange.startDate !== null ||
      filters.dateRange.endDate !== null ||
      filters.minAmount !== undefined ||
      filters.maxAmount !== undefined
    );
  }, [filters]);

  return {
    filters,
    sortOptions,
    filteredExpenses: sortedExpenses,
    setSearchQuery,
    setCategories,
    setDateRange,
    setAmountRange,
    setSorting,
    clearFilters,
    hasActiveFilters,
    resultCount: sortedExpenses.length,
  };
}
