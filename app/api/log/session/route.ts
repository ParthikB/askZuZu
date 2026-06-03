import { NextRequest, NextResponse } from 'next/server';
import { logSessionOpen, detectDeviceType } from '@/lib/db';

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { isRepeat } = body as Record<string, unknown>;
  if (typeof isRepeat !== 'boolean') {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const deviceType = detectDeviceType(request.headers.get('user-agent') ?? '');
  await logSessionOpen(deviceType, isRepeat);
  return NextResponse.json({ ok: true });
}
