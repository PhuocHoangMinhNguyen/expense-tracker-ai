export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseCurrency(value: string): number {
  // Remove currency symbols, commas, and spaces
  const cleanValue = value.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

export function validateAmount(value: string): boolean {
  const amount = parseCurrency(value);
  return amount > 0 && amount < 1000000; // Reasonable upper limit
}
