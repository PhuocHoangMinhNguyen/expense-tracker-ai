'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/expenses', label: 'Expenses', icon: '💳' },
  ];

  return (
    <header className="glass-dark sticky top-0 z-40 border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <span className="text-white text-xl font-bold">💰</span>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                Expense Tracker
              </span>
              <span className="text-xs font-semibold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent leading-tight">
                AI-Powered
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-2.5 rounded-xl font-semibold transition-all duration-200
                  flex items-center gap-2
                  ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-300 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/expenses/new">
              <Button variant="primary" size="md" className="shadow-lg shadow-primary-500/30">
                <span className="hidden sm:inline">+ Add Expense</span>
                <span className="sm:hidden">+ Add</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex border-t border-slate-700/50 -mx-4 sm:-mx-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 text-center py-3 font-semibold transition-all duration-200
                flex items-center justify-center gap-2
                ${
                  pathname === item.href
                    ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/10'
                    : 'text-gray-400 border-b-2 border-transparent hover:text-gray-300'
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
