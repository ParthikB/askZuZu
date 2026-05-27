/**
 * Layer 1 pre-API safety check.
 *
 * These are obviously inappropriate topics for a children's app.
 * This list is intentionally conservative — it only blocks clear-cut cases so
 * that legitimate educational questions (history of wars, human biology,
 * how medicine works) still reach the API where the system prompt handles them
 * with appropriate age-calibrated nuance.
 *
 * The Anthropic system prompt (layer 2) is the primary safety net for edge
 * cases and context-sensitive topics.
 *
 * To add keywords: append to the relevant section. Each entry is lowercased
 * and checked against the lowercased question via simple substring match.
 * Prefer multi-word phrases over single words to reduce false positives.
 */

const SAFETY_KEYWORDS: string[] = [
  // ── Self-harm & crisis ────────────────────────────────────────────────────
  'suicide',
  'suicidal',
  'self-harm',
  'self harm',
  'cut myself',
  'kill myself',
  'end my life',
  'want to die',
  'hurt myself',

  // ── Explicit sexual content ───────────────────────────────────────────────
  'pornography',
  'porn',
  'masturbat',
  'sexual intercourse',
  'have sex',
  'oral sex',
  'anal sex',
  'rape',
  'molest',
  'child abuse',
  'pedophil',

  // ── Hard drug use (not general "what are drugs" questions) ────────────────
  // Phrases, not single words, to avoid blocking "what are drugs?" type questions.
  'make meth',
  'cook meth',
  'make crystal',
  'how to get high',
  'shoot up heroin',
  'inject heroin',
  'snort cocaine',
  'fentanyl overdose',

  // ── Graphic violence / weapons ────────────────────────────────────────────
  // Single words here are too broad (e.g. "bomb" appears in "bomb cyclone", "bomb pop").
  // Using verb+object phrases catches intent while allowing educational questions.
  'make a bomb',
  'build a bomb',
  'make explosives',
  'build a weapon',
  'make a gun',
  'how to kill',
  'how to murder',
  'how to hurt',
  'torture someone',
  'stab someone',
  'shoot someone',
];

/**
 * Returns true if the question contains a safety-flagged keyword.
 * Comparison is case-insensitive. Trims and normalises whitespace first.
 */
export function containsSafetyKeyword(question: string): boolean {
  const normalised = question.toLowerCase().replace(/\s+/g, ' ').trim();
  return SAFETY_KEYWORDS.some((kw) => normalised.includes(kw));
}

/**
 * The soft-redirect message returned when a keyword is matched.
 * Friendly tone, no shame, suggests a trusted adult.
 */
export const SOFT_REDIRECT_MESSAGE =
  "That's a really important question — I think it's the kind of question that's best to ask a grown-up you trust, like a parent or teacher. They'll be able to talk about it with you properly. 💙";
