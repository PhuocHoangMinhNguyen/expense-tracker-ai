import { ExpenseFormData, ExpenseCategory } from '@/types';
import { EXPENSE_CATEGORIES } from '@/lib/constants/categories';
import { parseCurrency } from './currency';

export interface ValidationErrors {
  [key: string]: string;
}

export function validateExpenseForm(data: ExpenseFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate amount
  if (!data.amount || data.amount.trim() === '') {
    errors.amount = 'Amount is required';
  } else {
    const amount = parseCurrency(data.amount);
    if (amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    } else if (amount > 1000000) {
      errors.amount = 'Amount seems unreasonably high';
    }
  }

  // Validate description
  if (!data.description || data.description.trim() === '') {
    errors.description = 'Description is required';
  } else if (data.description.length > 500) {
    errors.description = 'Description is too long (max 500 characters)';
  }

  // Validate date
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const dateObj = new Date(data.date);
    const now = new Date();

    if (isNaN(dateObj.getTime())) {
      errors.date = 'Invalid date';
    } else if (dateObj > now) {
      errors.date = 'Date cannot be in the future';
    }

    // Check if date is too far in the past (more than 10 years)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    if (dateObj < tenYearsAgo) {
      errors.date = 'Date is too far in the past';
    }
  }

  // Validate category
  if (!data.category) {
    errors.category = 'Category is required';
  } else if (!EXPENSE_CATEGORIES.includes(data.category)) {
    errors.category = 'Invalid category';
  }

  return errors;
}

export function isValidCategory(category: string): category is ExpenseCategory {
  return EXPENSE_CATEGORIES.includes(category as ExpenseCategory);
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getErrorMessage(field: string, errors: ValidationErrors): string | undefined {
  return errors[field];
}
