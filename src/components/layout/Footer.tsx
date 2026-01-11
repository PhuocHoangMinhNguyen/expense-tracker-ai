export function Footer() {
  return (
    <footer className="glass-dark border-t border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="text-gray-600">•</span>
            <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent font-semibold">
              Expense Tracker AI
            </span>
            <span className="text-gray-600">•</span>
            <span>Built with Next.js & Anthropic Claude</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
