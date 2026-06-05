import { NextRequest, NextResponse } from 'next/server';
import { insertParentFeedback } from '@/lib/db';

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { rating, suggestions } = body as Record<string, unknown>;

  if (
    typeof rating !== 'number' ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const safeSuggestions = typeof suggestions === 'string' ? suggestions.slice(0, 1000) : '';

  await insertParentFeedback(rating, safeSuggestions);
  return NextResponse.json({ ok: true });
}
