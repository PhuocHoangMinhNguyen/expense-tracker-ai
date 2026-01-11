import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expense Tracker AI - Smart Personal Finance Management',
  description:
    'Track your expenses with AI-powered categorization, insights, and budget recommendations',
  keywords: ['expense tracker', 'finance', 'budget', 'AI', 'personal finance'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ExpenseProvider>{children}</ExpenseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
