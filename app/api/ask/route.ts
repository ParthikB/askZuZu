import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { containsSafetyKeyword, SOFT_REDIRECT_MESSAGE } from '@/lib/safety-keywords';
import { buildSystemPrompt } from '@/lib/system-prompt';
import { logUsage, detectDeviceType } from '@/lib/db';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AskResponse {
  answer: string;
  wasRedirected: boolean;
  logId: number | null;
}

// ── Rate limiter ──────────────────────────────────────────────────────────────
// In-memory, per-IP, resets every minute.
// Works correctly on single-instance deploys (local dev, Vercel hobby tier).
// Replace with Redis / Upstash for multi-instance production.

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

// ── Gemini client ─────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<AskResponse>> {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { answer: "ZuZu needs a little rest after so many questions! Try again in a minute. 😊", wasRedirected: false, logId: null },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { answer: "Something went wrong. Please try again!", wasRedirected: false, logId: null },
      { status: 400 }
    );
  }

  if (
    typeof body !== 'object' || body === null ||
    !('question' in body) || !('age' in body)
  ) {
    return NextResponse.json(
      { answer: "Something went wrong. Please try again!", wasRedirected: false, logId: null },
      { status: 400 }
    );
  }

  const { question, age, sessionToken } = body as Record<string, unknown>;

  if (typeof question !== 'string' || question.trim().length === 0 || question.length > 500) {
    return NextResponse.json(
      { answer: "Please ask ZuZu a question (up to 500 characters)!", wasRedirected: false, logId: null },
      { status: 400 }
    );
  }

  if (typeof age !== 'number' || !Number.isInteger(age) || age < 6 || age > 15) {
    return NextResponse.json(
      { answer: "Something went wrong with your age. Please refresh and try again!", wasRedirected: false, logId: null },
      { status: 400 }
    );
  }

  const token = typeof sessionToken === 'string' && sessionToken.length > 0
    ? sessionToken
    : 'unknown';

  const deviceType = detectDeviceType(request.headers.get('user-agent') ?? '');

  // ── Layer 1: pre-API keyword safety check ─────────────────────────────────
  if (containsSafetyKeyword(question)) {
    const logId = await logUsage({
      sessionToken: token,
      userAge: age,
      deviceType,
      childQuestion: question.trim(),
      zuzuResponse: SOFT_REDIRECT_MESSAGE,
      wasRedirected: true,
    });
    return NextResponse.json({ answer: SOFT_REDIRECT_MESSAGE, wasRedirected: true, logId });
  }

  // ── Layer 2: Gemini API call with safety system prompt ────────────────────
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: buildSystemPrompt(age),
      // Gemini 2.5 Flash is a thinking model — thinkingBudget: 0 disables
      // internal reasoning so all output tokens go to the actual answer.
      // Cast to any because the SDK types don't yet include thinkingConfig.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 },
      } as any,
    });

    const result = await model.generateContent(question.trim());
    const answer = result.response.text().trim();

    const wasRedirected =
      answer.includes("ask a grown-up you trust") ||
      answer.includes("parent or teacher");

    const logId = await logUsage({
      sessionToken: token,
      userAge: age,
      deviceType,
      childQuestion: question.trim(),
      zuzuResponse: answer,
      wasRedirected,
    });

    return NextResponse.json({ answer, wasRedirected, logId });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { answer: "ZuZu is taking a little nap right now — try again in a moment! 💤", wasRedirected: false, logId: null },
      { status: 503 }
    );
  }
}
