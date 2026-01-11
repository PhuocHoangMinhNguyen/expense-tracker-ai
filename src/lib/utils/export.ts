import { Expense } from '@/types';
import { formatDate } from './date';
import { formatCurrency } from './currency';

export function exportToCSV(expenses: Expense[], filename = 'expenses.csv'): void {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  // CSV headers
  const headers = ['Date', 'Category', 'Description', 'Amount', 'AI Categorized'];

  // Convert expenses to CSV rows
  const rows = expenses.map((expense) => [
    formatDate(expense.date),
    expense.category,
    escapeCSVField(expense.description),
    expense.amount.toFixed(2),
    expense.aiCategorized ? 'Yes' : 'No',
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  // Create and download file
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportToJSON(expenses: Expense[], filename = 'expenses.json'): void {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  const jsonContent = JSON.stringify(expenses, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

export function exportSummaryToCSV(
  expenses: Expense[],
  filename = 'expense-summary.csv'
): void {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  // Calculate summary by category
  const categoryMap: Record<string, { total: number; count: number }> = {};

  expenses.forEach((expense) => {
    if (!categoryMap[expense.category]) {
      categoryMap[expense.category] = { total: 0, count: 0 };
    }
    categoryMap[expense.category].total += expense.amount;
    categoryMap[expense.category].count += 1;
  });

  const headers = ['Category', 'Total Amount', 'Transaction Count', 'Average Amount'];

  const rows = Object.entries(categoryMap).map(([category, data]) => [
    category,
    formatCurrency(data.total),
    data.count.toString(),
    formatCurrency(data.total / data.count),
  ]);

  // Add total row
  const grandTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  rows.push(['TOTAL', formatCurrency(grandTotal), expenses.length.toString(), '']);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

function escapeCSVField(field: string): string {
  // Escape double quotes by doubling them
  return field.replace(/"/g, '""');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
