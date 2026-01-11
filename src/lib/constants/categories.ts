import { ExpenseCategory } from '@/types';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#10b981', // green
  Transportation: '#3b82f6', // blue
  Entertainment: '#8b5cf6', // purple
  Shopping: '#f59e0b', // amber
  Bills: '#ef4444', // red
  Other: '#6b7280', // gray
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎮',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📦',
};

export const CATEGORY_KEYWORDS: Record<ExpenseCategory, string[]> = {
  Food: [
    'restaurant',
    'grocery',
    'coffee',
    'lunch',
    'dinner',
    'breakfast',
    'food',
    'cafe',
    'pizza',
    'burger',
    'starbucks',
    'mcdonald',
    'kfc',
    'subway',
    'chipotle',
    'dominos',
  ],
  Transportation: [
    'uber',
    'lyft',
    'gas',
    'gasoline',
    'fuel',
    'parking',
    'bus',
    'train',
    'taxi',
    'metro',
    'subway',
    'car',
    'vehicle',
    'transit',
  ],
  Entertainment: [
    'movie',
    'cinema',
    'theater',
    'concert',
    'game',
    'netflix',
    'spotify',
    'hulu',
    'disney',
    'apple music',
    'youtube',
    'amazon prime',
  ],
  Shopping: [
    'amazon',
    'ebay',
    'target',
    'walmart',
    'store',
    'clothes',
    'clothing',
    'shop',
    'mall',
    'purchase',
    'buy',
  ],
  Bills: [
    'electric',
    'electricity',
    'water',
    'internet',
    'phone',
    'rent',
    'insurance',
    'utility',
    'utilities',
    'mortgage',
    'subscription',
  ],
  Other: [],
};
