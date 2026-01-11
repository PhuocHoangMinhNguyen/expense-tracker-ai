# Expense Tracker AI

A modern, professional expense tracking web application with AI-powered categorization, insights, and budget recommendations built with Next.js 14, TypeScript, and Anthropic Claude AI.

## Features

### Core Features
- ✅ Add, edit, and delete expenses with validation
- ✅ Smart expense categorization (Food, Transportation, Entertainment, Shopping, Bills, Other)
- ✅ Real-time search and filtering
- ✅ Export expenses to CSV
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Data persistence using localStorage

### Dashboard & Analytics
- ✅ Total spending overview
- ✅ Monthly spending tracking
- ✅ Average daily spending
- ✅ Transaction count
- ✅ Category breakdown with visual indicators
- ✅ Recent expenses view

### AI-Powered Features
- 🤖 Automatic expense categorization based on description
- 🤖 AI confidence scores for categorization
- 🤖 Fallback keyword-based categorization when AI is unavailable
- 🤖 Visual AI indicators on categorized expenses

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Anthropic Claude API (claude-3-5-sonnet)
- **State Management:** React Context + Custom Hooks
- **Data Persistence:** localStorage
- **Date Handling:** date-fns
- **Validation:** Custom validators with Zod support

## Getting Started

### Prerequisites

- Node.js 18.x or higher (20.x recommended)
- npm or yarn
- Anthropic API key (optional, but required for AI features)

### Installation

1. **Clone the repository** (or extract if from a zip)
   ```bash
   cd expense-tracker-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   NEXT_PUBLIC_APP_NAME=Expense Tracker AI
   ```

   > **Note:** The app will work without an API key, but AI features will use fallback keyword-based categorization.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Adding an Expense

1. Click the "+ Add Expense" button in the header or dashboard
2. Fill in the expense details:
   - **Date:** When the expense occurred
   - **Amount:** How much you spent
   - **Description:** What you spent on (e.g., "Starbucks coffee")
   - **Category:** Will be auto-suggested by AI based on description
3. Review the AI suggestion (if available) and apply or override
4. Click "Add Expense" to save

### Viewing Expenses

- **Dashboard:** See summary statistics and recent expenses
- **Expenses Page:** View all expenses with search and filter capabilities
- Click on any expense to edit or delete it

### Searching and Filtering

- Use the search bar to find expenses by description
- Filter results update in real-time
- Clear filters button appears when filters are active

### Exporting Data

1. Go to the Expenses page
2. Click "Export CSV" button
3. CSV file will download with all expense data
4. If filters are active, only filtered expenses are exported

## Project Structure

```
expense-tracker-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/ai/            # AI API routes
│   │   ├── expenses/          # Expense pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Dashboard
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── expenses/         # Expense-specific components
│   │   └── layout/           # Layout components
│   │
│   ├── lib/                   # Utilities and helpers
│   │   ├── ai/               # AI integration
│   │   ├── storage/          # localStorage utilities
│   │   ├── utils/            # Helper functions
│   │   └── constants/        # App constants
│   │
│   ├── types/                 # TypeScript type definitions
│   ├── hooks/                 # Custom React hooks
│   └── contexts/              # React contexts
│
├── public/                     # Static assets
├── .env.local                  # Environment variables (create this)
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── tailwind.config.ts          # Tailwind config
```

## Key Components

### ExpenseForm
Handles both adding and editing expenses with:
- Real-time validation
- AI categorization suggestions
- Error handling

### Dashboard
Displays:
- Summary statistics cards
- Category breakdown with progress bars
- Recent expenses list

### ExpenseContext
Central state management for:
- CRUD operations
- localStorage synchronization
- Loading and error states

## AI Features

### Categorization

The app uses Anthropic's Claude API to intelligently categorize expenses:

1. **AI-Powered:** When you enter a description, Claude analyzes it and suggests a category
2. **Confidence Scores:** Shows how confident the AI is (0-100%)
3. **Fallback System:** If AI is unavailable, uses keyword matching
4. **User Override:** You can always override AI suggestions

Example categorizations:
- "Starbucks coffee" → Food (95% confidence)
- "Uber ride home" → Transportation (92% confidence)
- "Netflix subscription" → Entertainment (98% confidence)

### How to Get an Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

## Testing the Application

### Manual Testing Checklist

#### Expense CRUD
- [ ] Add a new expense
- [ ] Edit an existing expense
- [ ] Delete an expense
- [ ] Verify data persists after page reload

#### Search & Filter
- [ ] Search by description
- [ ] Verify filtered results
- [ ] Clear filters

#### Dashboard
- [ ] Check total spending calculation
- [ ] Verify monthly spending
- [ ] Confirm category breakdown percentages
- [ ] View recent expenses

#### AI Features
- [ ] Enter description and wait for AI suggestion
- [ ] Apply AI suggestion
- [ ] Override AI suggestion
- [ ] Verify fallback works when AI unavailable

#### Export
- [ ] Export all expenses to CSV
- [ ] Open CSV and verify data
- [ ] Export filtered expenses

#### Responsive Design
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)

### Sample Test Data

Add these test expenses to verify functionality:

```
1. Starbucks coffee - $5.50 - Food
2. Uber to work - $12.00 - Transportation
3. Netflix subscription - $15.99 - Entertainment
4. Amazon purchase - $45.00 - Shopping
5. Electric bill - $85.00 - Bills
6. Movie tickets - $28.00 - Entertainment
```

## Troubleshooting

### AI Features Not Working

**Problem:** AI categorization not providing suggestions

**Solutions:**
1. Check that `ANTHROPIC_API_KEY` is set in `.env.local`
2. Restart the development server after adding the key
3. Check browser console for error messages
4. Verify your API key is valid in Anthropic console

The app will automatically fall back to keyword-based categorization if AI is unavailable.

### Data Not Persisting

**Problem:** Expenses disappear after page reload

**Solutions:**
1. Check browser console for localStorage errors
2. Ensure you're not in private/incognito mode
3. Check browser localStorage quota
4. Clear browser cache and try again

### Build Errors

**Problem:** TypeScript or build errors

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

The build will be optimized and ready for deployment.

## Deployment

This app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting**

Remember to set environment variables in your deployment platform.

## Future Enhancements

Potential features for future development:
- Dark mode toggle
- Multiple currency support
- Budget tracking with alerts
- Recurring expenses
- Receipt photo uploads
- Charts with Recharts
- Multi-user support with authentication
- Cloud database sync
- Advanced AI insights and recommendations
- Anomaly detection
- Budget recommendations

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is provided as-is for personal and educational use.

## Support

For issues or questions:
1. Check this README for solutions
2. Review the code comments
3. Check browser developer console for errors

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Anthropic Claude](https://www.anthropic.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from Unicode Emoji
