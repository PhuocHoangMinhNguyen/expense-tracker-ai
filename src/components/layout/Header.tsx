'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Instagram-style icons
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg aria-label="Home" fill={active ? "currentColor" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "0" : "2"}>
    <path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" />
  </svg>
);

const ListIcon = ({ active }: { active: boolean }) => (
  <svg aria-label="Expenses" fill={active ? "currentColor" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth={active ? "0" : "2"}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 8h10M7 12h10M7 16h6" strokeWidth="2" stroke="currentColor" fill="none" />
  </svg>
);

const PlusIcon = () => (
  <svg aria-label="New expense" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ChartIcon = ({ active }: { active: boolean }) => (
  <svg aria-label="Analytics" fill={active ? "currentColor" : "none"} height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="10" width="4" height="11" rx="1" fill={active ? "currentColor" : "none"} />
    <rect x="10" y="6" width="4" height="15" rx="1" fill={active ? "currentColor" : "none"} />
    <rect x="17" y="3" width="4" height="18" rx="1" fill={active ? "currentColor" : "none"} />
  </svg>
);

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Top Header - Instagram style */}
      <header className="sticky top-0 z-50 bg-ig-black border-b border-ig-border">
        <div className="max-w-[935px] mx-auto px-4">
          <div className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="ig-story-ring p-[2px]">
                <div className="bg-ig-black rounded-full p-1">
                  <span className="text-xl">💰</span>
                </div>
              </div>
              <span className="text-xl font-semibold ig-gradient-text hidden sm:block">
                Expensy
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`p-2 transition-transform hover:scale-110 ${isActive('/') ? 'text-ig-text' : 'text-ig-text-secondary'}`}
              >
                <HomeIcon active={isActive('/')} />
              </Link>
              <Link
                href="/expenses"
                className={`p-2 transition-transform hover:scale-110 ${isActive('/expenses') ? 'text-ig-text' : 'text-ig-text-secondary'}`}
              >
                <ListIcon active={isActive('/expenses')} />
              </Link>
              <Link
                href="/expenses/new"
                className="p-2 text-ig-text transition-transform hover:scale-110"
              >
                <PlusIcon />
              </Link>
            </nav>

            {/* Desktop Add Button */}
            <div className="hidden md:block">
              <Link href="/expenses/new">
                <button className="ig-btn-primary flex items-center gap-2">
                  <span>Add Expense</span>
                </button>
              </Link>
            </div>

            {/* Mobile - Just show create button */}
            <div className="md:hidden">
              <Link href="/expenses/new" className="p-2 text-ig-text">
                <PlusIcon />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation - Mobile only (Instagram style) */}
      <nav className="ig-bottom-nav md:hidden">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-opacity ${isActive('/') ? 'text-ig-text' : 'text-ig-text-secondary'}`}
        >
          <HomeIcon active={isActive('/')} />
        </Link>

        <Link
          href="/expenses"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-opacity ${isActive('/expenses') ? 'text-ig-text' : 'text-ig-text-secondary'}`}
        >
          <ListIcon active={isActive('/expenses')} />
        </Link>

        <Link
          href="/expenses/new"
          className="flex flex-col items-center justify-center flex-1 h-full text-ig-text"
        >
          <div className="bg-ig-gradient rounded-lg p-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        </Link>

        <Link
          href="/"
          className="flex flex-col items-center justify-center flex-1 h-full text-ig-text-secondary"
        >
          <ChartIcon active={false} />
        </Link>

        {/* Profile placeholder */}
        <div className="flex flex-col items-center justify-center flex-1 h-full">
          <div className={`w-7 h-7 rounded-full bg-ig-card border-2 ${isActive('/profile') ? 'border-ig-text' : 'border-transparent'}`}>
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gradient-purple to-gradient-pink" />
          </div>
        </div>
      </nav>
    </>
  );
}
