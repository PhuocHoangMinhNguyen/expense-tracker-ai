import { NextRequest, NextResponse } from 'next/server';
import { categorizeExpense } from '@/lib/ai/categorizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required and must be a string' },
        { status: 400 }
      );
    }

    const prediction = await categorizeExpense(description);

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Categorization API error:', error);
    return NextResponse.json(
      {
        error: 'Categorization failed',
        category: 'Other',
        confidence: 0.5,
      },
      { status: 500 }
    );
  }
}
