import { ExpenseCategory, AICategoryPrediction } from '@/types';
import { CATEGORY_KEYWORDS, EXPENSE_CATEGORIES } from '@/lib/constants/categories';
import { callAI, isAIConfigured } from './client';
import { isValidCategory } from '@/lib/utils/validators';

export async function categorizeExpense(description: string): Promise<AICategoryPrediction> {
  // If AI is not configured, use fallback immediately
  if (!isAIConfigured()) {
    return fallbackCategorize(description);
  }

  const systemPrompt = `You are an expense categorization assistant. Categorize expenses into one of these categories: ${EXPENSE_CATEGORIES.join(', ')}.

Respond with ONLY a JSON object in this exact format:
{
  "category": "CategoryName",
  "confidence": 0.95,
  "reasoning": "Brief explanation"
}

The category must be one of: ${EXPENSE_CATEGORIES.join(', ')}.`;

  const userPrompt = `Categorize this expense description: "${description}"`;

  try {
    const response = await callAI(userPrompt, systemPrompt);

    // Try to parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);

    // Validate the category
    if (!isValidCategory(result.category)) {
      console.warn(`Invalid category from AI: ${result.category}, using fallback`);
      return fallbackCategorize(description);
    }

    return {
      category: result.category as ExpenseCategory,
      confidence: Math.min(Math.max(result.confidence || 0.5, 0), 1),
      reasoning: result.reasoning,
    };
  } catch (error) {
    console.error('AI categorization failed, using fallback:', error);
    return fallbackCategorize(description);
  }
}

export function fallbackCategorize(description: string): AICategoryPrediction {
  const lowerDesc = description.toLowerCase();

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.length === 0) continue; // Skip 'Other'

    const matchCount = keywords.filter((keyword) => lowerDesc.includes(keyword)).length;

    if (matchCount > 0) {
      const confidence = Math.min(0.7 + (matchCount * 0.1), 0.95);
      return {
        category: category as ExpenseCategory,
        confidence,
        reasoning: 'Keyword-based categorization (AI unavailable)',
      };
    }
  }

  return {
    category: 'Other',
    confidence: 0.5,
    reasoning: 'No matching keywords found (AI unavailable)',
  };
}
