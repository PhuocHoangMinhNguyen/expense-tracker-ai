## Project Overview
This repository contains an "Expense Tracker" application that allows users to record, categorize, and review expenses over time. The primary goals of the project are:
- Accurate and trustworthy expense tracking
- Simple and efficient data entry
- Clear summaries and reports
- Long-term maintainability
Correctness, clarity, and data integrity are higher priorities than feature breadth.

## Core Principles
When contributing to this project, always favor:
1. Data correctness over convenience
2. Readability over cleverness
3. Explicit behavior over hidden logic
4. Small, incremental changes
5. Maintainable solutions over premature optimization
Avoid introducing complexity unless it solves a concrete, stated problem

## Target Users
- Individuals tracking personal expenses
- Freelancers or small businesses tracking costs
- Non-technical users
Assume users may:
- Make mistakes when entering data
- Want to audit or export their data later
- Expect transparency and predictability

## Functional Scope
- Create, edit, and delete expenses
- Expense categories (e.g., Food, Transport, Rent)
- Optional tags for expenses
- Monthly and yearly summaries
- Filtering and basic search
- Expense fields
+ Amount
+ Currency
+ Date
+ Category
+ Optional notes

## Data Integrity Rules
- Never silently modify user data
- Never auto-recategorize expenses without user confirmation
- Preserve historical records when categories change
- Validate inputs as both UI and date layers
- Always handle currency explicitly

## UX Expectations
- Expense entry should require minimal effort
- Defaults must be visible and understandable
- Error messages should be clear and actionable
- Empty states should guide the user

## Accessibility Expectations
- Keyboard navigation
- Sufficient color contrast
- Screen-reader friendly labels

## Code Quality Expectations
- Keep business logic separate from UI
- Prefer pure functions where possible
- Avoid large files (over ~300 lines) without justification
- Write self-documenting code
- Add comments only when intent is non-obvious

## Testing Philosophy
Focus tests on:
- Correct calculations
- Date boundaries (month/year changes)
- Large and zero-value amounts
- Multi-currency handling
Avoid brittle tests tied tightly to implementation details.

## Performance Considerations
- Expense lists may grow to tens of thousands of entries
- Avoid N+1 queries
- Optimize only after measuring performance

## Security and Privacy
- Treat all expense data as sensitive
- Do not log raw financial data in production
- Avoid unnecessary third-party data sharing
- Assume users may export or delete their data at any time.

## AI Collaboration Guidelines
When assisting on this project:
- Ask clarifying questions when requirements are ambiguous
- Propose incremental improvements, not full rewrites
- Explain tradeoffs when suggesting architectural changes
- Prefer concrete examples over abstract theory
- Flag risks early
- If uncertain, ask rather than guessing.

## Definition of Done
A task is considered complete when:
- Requirements are satisfied
- Edge cases are handled
- Code is readable and maintainable
- Tests pass
- No unnecessary complexity was added

## Final Note
This project prioritizes "trust". Users rely on it to understand their finances, and even small errors can undermine confidence. When in doubt, choose the solution that is easiest to explain to a careful, skeptical user.