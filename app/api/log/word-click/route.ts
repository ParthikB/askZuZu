import { NextRequest, NextResponse } from 'next/server';
import { logWordClick } from '@/lib/db';

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { logId, word } = body as Record<string, unknown>;

  if (typeof logId !== 'number' || typeof word !== 'string' || !word.trim()) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await logWordClick(logId, word.trim());
  return NextResponse.json({ ok: true });
}
