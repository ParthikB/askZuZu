import { NextRequest, NextResponse } from 'next/server';
import { logUniqueOpen, detectDeviceType } from '@/lib/db';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const deviceType = detectDeviceType(request.headers.get('user-agent') ?? '');
  await logUniqueOpen(deviceType);
  return NextResponse.json({ ok: true });
}
