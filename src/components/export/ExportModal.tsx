'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Expense, ExpenseCategory } from '@/types';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from '@/lib/constants/categories';
import { formatDate } from '@/lib/utils/date';
import { formatCurrency } from '@/lib/utils/currency';
import { parseISO } from 'date-fns';

type ExportFormat = 'csv' | 'json' | 'pdf';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  expenses,
}) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([...EXPENSE_CATEGORIES]);
  const [filename, setFilename] = useState('expenses');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Filter expenses based on date range and categories
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Category filter
      if (!selectedCategories.includes(expense.category)) {
        return false;
      }

      // Date filter
      const expenseDate = typeof expense.date === 'string' ? parseISO(expense.date) : expense.date;

      if (startDate) {
        const start = parseISO(startDate);
        if (expenseDate < start) return false;
      }

      if (endDate) {
        const end = parseISO(endDate);
        end.setHours(23, 59, 59, 999);
        if (expenseDate > end) return false;
      }

      return true;
    });
  }, [expenses, selectedCategories, startDate, endDate]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      count: filteredExpenses.length,
      total,
    };
  }, [filteredExpenses]);

  const toggleCategory = (category: ExpenseCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const selectAllCategories = () => {
    setSelectedCategories([...EXPENSE_CATEGORIES]);
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  const escapeCSVField = (field: string): string => {
    return field.replace(/"/g, '""');
  };

  const downloadFile = (content: string | Blob, filename: string, mimeType?: string): void => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount'];
    const rows = filteredExpenses.map((expense) => [
      formatDate(expense.date),
      expense.category,
      escapeCSVField(expense.description),
      expense.amount.toFixed(2),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  };

  const exportJSON = () => {
    const exportData = filteredExpenses.map((expense) => ({
      date: formatDate(expense.date),
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
    }));

    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const exportPDF = () => {
    // Create a simple HTML-based PDF using print
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1a1a1a; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            .subtitle { color: #666; margin-bottom: 24px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f5f5f5; text-align: left; padding: 12px; font-weight: 600; border-bottom: 2px solid #ddd; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            tr:hover { background: #fafafa; }
            .amount { text-align: right; font-family: monospace; }
            .summary { margin-top: 24px; padding: 16px; background: #f9f9f9; border-radius: 8px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .summary-label { color: #666; }
            .summary-value { font-weight: 600; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>Expense Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleDateString()}</div>

          <div class="summary">
            <div class="summary-row">
              <span class="summary-label">Total Records:</span>
              <span class="summary-value">${filteredExpenses.length}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Total Amount:</span>
              <span class="summary-value">${formatCurrency(totalAmount)}</span>
            </div>
            ${startDate || endDate ? `
            <div class="summary-row">
              <span class="summary-label">Date Range:</span>
              <span class="summary-value">${startDate || 'All'} - ${endDate || 'All'}</span>
            </div>
            ` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredExpenses.map((expense) => `
                <tr>
                  <td>${formatDate(expense.date)}</td>
                  <td>${expense.category}</td>
                  <td>${expense.description}</td>
                  <td class="amount">${formatCurrency(expense.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handleExport = async () => {
    if (filteredExpenses.length === 0) {
      alert('No expenses to export with current filters');
      return;
    }

    setIsExporting(true);

    // Simulate a brief loading state for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      switch (format) {
        case 'csv':
          exportCSV();
          break;
        case 'json':
          exportJSON();
          break;
        case 'pdf':
          exportPDF();
          break;
      }
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategories([...EXPENSE_CATEGORIES]);
    setFilename('expenses');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Data" size="xl">
      <div className="space-y-6">
        {/* Export Format Selection */}
        <div>
          <label className="block text-sm font-semibold text-ig-text mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['csv', 'json', 'pdf'] as ExportFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`
                  px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${format === f
                    ? 'bg-action-blue text-white'
                    : 'bg-ig-surface text-ig-text border border-ig-border hover:bg-ig-border'
                  }
                `}
              >
                <span className="block text-lg mb-1">
                  {f === 'csv' ? '📊' : f === 'json' ? '{ }' : '📄'}
                </span>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-semibold text-ig-text mb-3">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-ig-text-secondary mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-ig-surface border border-ig-border rounded-lg text-ig-text text-sm focus:outline-none focus:border-action-blue"
              />
            </div>
            <div>
              <label className="block text-xs text-ig-text-secondary mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-ig-surface border border-ig-border rounded-lg text-ig-text text-sm focus:outline-none focus:border-action-blue"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-ig-text">
              Categories
            </label>
            <div className="flex gap-2">
              <button
                onClick={selectAllCategories}
                className="text-xs text-action-blue hover:underline"
              >
                Select All
              </button>
              <span className="text-ig-text-secondary">|</span>
              <button
                onClick={clearAllCategories}
                className="text-xs text-action-blue hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EXPENSE_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                  ${selectedCategories.includes(category)
                    ? 'bg-ig-surface border-2 border-action-blue text-ig-text'
                    : 'bg-ig-surface border border-ig-border text-ig-text-secondary hover:border-ig-text-secondary'
                  }
                `}
              >
                <span>{CATEGORY_ICONS[category]}</span>
                <span>{category}</span>
                {selectedCategories.includes(category) && (
                  <span className="ml-auto text-action-blue">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filename Input */}
        <div>
          <label className="block text-sm font-semibold text-ig-text mb-2">
            Filename
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
              placeholder="expenses"
              className="flex-1 px-3 py-2 bg-ig-surface border border-ig-border rounded-lg text-ig-text text-sm focus:outline-none focus:border-action-blue"
            />
            <span className="text-ig-text-secondary text-sm">.{format}</span>
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-ig-surface rounded-lg p-4 border border-ig-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-ig-text">Export Summary</span>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-action-blue hover:underline"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-ig-text">{summary.count}</p>
              <p className="text-xs text-ig-text-secondary">Records to export</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ig-text">{formatCurrency(summary.total)}</p>
              <p className="text-xs text-ig-text-secondary">Total amount</p>
            </div>
          </div>
        </div>

        {/* Data Preview */}
        {showPreview && (
          <div className="bg-ig-surface rounded-lg border border-ig-border overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-ig-black sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 text-ig-text-secondary font-medium">Date</th>
                    <th className="text-left px-3 py-2 text-ig-text-secondary font-medium">Category</th>
                    <th className="text-left px-3 py-2 text-ig-text-secondary font-medium">Description</th>
                    <th className="text-right px-3 py-2 text-ig-text-secondary font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-ig-text-secondary">
                        No expenses match the current filters
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.slice(0, 10).map((expense) => (
                      <tr key={expense.id} className="border-t border-ig-border">
                        <td className="px-3 py-2 text-ig-text">{formatDate(expense.date)}</td>
                        <td className="px-3 py-2 text-ig-text">
                          <span className="inline-flex items-center gap-1">
                            <span>{CATEGORY_ICONS[expense.category]}</span>
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-ig-text truncate max-w-[150px]">
                          {expense.description}
                        </td>
                        <td className="px-3 py-2 text-ig-text text-right">
                          {formatCurrency(expense.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filteredExpenses.length > 10 && (
                <div className="px-3 py-2 text-center text-xs text-ig-text-secondary border-t border-ig-border">
                  Showing 10 of {filteredExpenses.length} records
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-ig-text-secondary hover:text-ig-text transition-colors"
          >
            Reset Filters
          </button>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-ig-text bg-ig-surface border border-ig-border rounded-lg hover:bg-ig-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredExpenses.length === 0}
            className="px-6 py-2 text-sm font-semibold text-white bg-action-blue rounded-lg hover:bg-action-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                Export {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
