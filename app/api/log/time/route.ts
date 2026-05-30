import { NextRequest, NextResponse } from 'next/server';
import { updateTimeSpent } from '@/lib/db';

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (
    typeof body !== 'object' || body === null ||
    !('logId' in body) || !('timeSpentSeconds' in body)
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { logId, timeSpentSeconds } = body as Record<string, unknown>;

  if (typeof logId !== 'number' || typeof timeSpentSeconds !== 'number') {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await updateTimeSpent(logId, Math.round(timeSpentSeconds));
  return NextResponse.json({ ok: true });
}
