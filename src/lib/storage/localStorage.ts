import { Expense } from '@/types';

const STORAGE_KEYS = {
  EXPENSES: 'expense-tracker-expenses',
  AI_CACHE: 'expense-tracker-ai-cache',
} as const;

export class LocalStorageManager<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  get(): T | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const item = localStorage.getItem(this.key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${this.key}):`, error);
      return null;
    }
  }

  set(value: T): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.key, serialized);
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${this.key}):`, error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please clear some old expenses.');
      }
    }
  }

  remove(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${this.key}):`, error);
    }
  }

  clear(): void {
    this.remove();
  }
}

// Pre-configured storage instances
export const expenseStorage = new LocalStorageManager<Expense[]>(STORAGE_KEYS.EXPENSES);

export const aiCacheStorage = new LocalStorageManager<Record<string, unknown>>(
  STORAGE_KEYS.AI_CACHE
);

// Helper functions for expense-specific operations
export function loadExpenses(): Expense[] {
  const expenses = expenseStorage.get();
  if (!expenses) {
    return [];
  }

  // Convert date strings back to Date objects if needed
  return expenses.map((expense) => ({
    ...expense,
    date: typeof expense.date === 'string' ? new Date(expense.date) : expense.date,
    createdAt:
      typeof expense.createdAt === 'string' ? new Date(expense.createdAt) : expense.createdAt,
    updatedAt:
      typeof expense.updatedAt === 'string' ? new Date(expense.updatedAt) : expense.updatedAt,
  }));
}

export function saveExpenses(expenses: Expense[]): void {
  expenseStorage.set(expenses);
}

export function clearAllData(): void {
  expenseStorage.clear();
  aiCacheStorage.clear();
}

// AI Cache helpers
export function getAICache<T>(key: string): T | null {
  const cache = aiCacheStorage.get();
  if (!cache || !cache[key]) {
    return null;
  }
  return cache[key] as T;
}

export function setAICache<T>(key: string, value: T): void {
  const cache = aiCacheStorage.get() || {};
  cache[key] = value;
  aiCacheStorage.set(cache);
}

export function clearAICache(): void {
  aiCacheStorage.clear();
}
