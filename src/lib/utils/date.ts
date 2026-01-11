import { format, parseISO, startOfMonth, endOfMonth, subDays, isWithinInterval, formatDistanceToNow } from 'date-fns';

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
}

export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MM/dd/yy');
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
}

export function formatMonthYear(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM yyyy');
}

export function getMonthRange(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

export function getLast30Days(): { start: Date; end: Date } {
  const end = new Date();
  const start = subDays(end, 30);
  return { start, end };
}

export function getLast7Days(): { start: Date; end: Date } {
  const end = new Date();
  const start = subDays(end, 7);
  return { start, end };
}

export function isDateInRange(date: Date | string, start: Date | null, end: Date | null): boolean {
  if (!start && !end) return true;

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (start && !end) {
    return dateObj >= start;
  }

  if (!start && end) {
    return dateObj <= end;
  }

  if (start && end) {
    return isWithinInterval(dateObj, { start, end });
  }

  return true;
}

export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function fromISODateString(dateString: string): Date {
  return parseISO(dateString);
}

export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}
