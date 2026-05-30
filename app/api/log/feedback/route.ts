import { NextRequest, NextResponse } from 'next/server';
import { updateFeedback, FeedbackRating } from '@/lib/db';

const VALID_TAGS = new Set([
  'Response was boring',
  'Response was too complex',
  'Response was incorrect',
]);

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || !('logId' in body) || !('rating' in body)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { logId, rating, tags } = body as Record<string, unknown>;

  if (typeof logId !== 'number') return NextResponse.json({ ok: false }, { status: 400 });
  if (rating !== 'up' && rating !== 'down') return NextResponse.json({ ok: false }, { status: 400 });

  const safeTags: string[] = Array.isArray(tags)
    ? (tags as unknown[]).filter((t): t is string => typeof t === 'string' && VALID_TAGS.has(t))
    : [];

  await updateFeedback(logId, rating as FeedbackRating, safeTags);
  return NextResponse.json({ ok: true });
}
