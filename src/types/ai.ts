import { ExpenseCategory } from './expense';

export interface AICategoryPrediction {
  category: ExpenseCategory;
  confidence: number;
  reasoning?: string;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'warning' | 'tip' | 'achievement';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface SpendingPattern {
  pattern: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  averageAmount: number;
  category: ExpenseCategory;
}

export interface BudgetRecommendation {
  category: ExpenseCategory;
  recommendedAmount: number;
  currentAmount: number;
  reasoning: string;
  confidence: number;
}

export interface Anomaly {
  expenseId: string;
  type: 'unusually_high' | 'unusual_category' | 'unusual_frequency';
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestedAction?: string;
}

export interface AIAnalysisResult {
  insights: AIInsight[];
  patterns: SpendingPattern[];
  recommendations: BudgetRecommendation[];
  anomalies: Anomaly[];
}
