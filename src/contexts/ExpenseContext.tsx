'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Expense } from '@/types';
import { loadExpenses, saveExpenses } from '@/lib/storage/localStorage';

interface ExpenseContextType {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Expense>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getExpenseById: (id: string) => Expense | undefined;
  clearAllExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expenses from localStorage on mount
  useEffect(() => {
    try {
      const loadedExpenses = loadExpenses();
      setExpenses(loadedExpenses);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load expenses:', err);
      setError('Failed to load expenses from storage');
      setIsLoading(false);
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && expenses.length >= 0) {
      try {
        saveExpenses(expenses);
      } catch (err) {
        console.error('Failed to save expenses:', err);
        setError('Failed to save expenses to storage');
      }
    }
  }, [expenses, isLoading]);

  const addExpense = useCallback(
    async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
      try {
        const newExpense: Expense = {
          ...expenseData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setExpenses((prev) => [...prev, newExpense]);
        setError(null);

        return newExpense;
      } catch (err) {
        console.error('Failed to add expense:', err);
        setError('Failed to add expense');
        throw err;
      }
    },
    []
  );

  const updateExpense = useCallback(async (id: string, updates: Partial<Expense>): Promise<void> => {
    try {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id
            ? {
                ...expense,
                ...updates,
                updatedAt: new Date(),
              }
            : expense
        )
      );
      setError(null);
    } catch (err) {
      console.error('Failed to update expense:', err);
      setError('Failed to update expense');
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id: string): Promise<void> => {
    try {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      setError(null);
    } catch (err) {
      console.error('Failed to delete expense:', err);
      setError('Failed to delete expense');
      throw err;
    }
  }, []);

  const getExpenseById = useCallback(
    (id: string): Expense | undefined => {
      return expenses.find((expense) => expense.id === id);
    },
    [expenses]
  );

  const clearAllExpenses = useCallback(async (): Promise<void> => {
    try {
      setExpenses([]);
      setError(null);
    } catch (err) {
      console.error('Failed to clear expenses:', err);
      setError('Failed to clear expenses');
      throw err;
    }
  }, []);

  const value: ExpenseContextType = {
    expenses,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    clearAllExpenses,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpenseContext(): ExpenseContextType {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
}
