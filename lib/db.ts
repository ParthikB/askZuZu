import { neon } from '@neondatabase/serverless';

// null when DATABASE_URL is not configured — all logging calls are silently skipped.
// This keeps the app functional even without a database connection.
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export type DeviceType = 'mobile' | 'desktop';

interface LogUsageParams {
  sessionToken: string;
  userAge: number;
  deviceType: DeviceType;
  childQuestion: string;
  zuzuResponse: string;
  wasRedirected: boolean;
}

/**
 * Inserts a usage log row and returns the new row's id (used to update
 * time_spent_seconds later). Returns null if the DB is not configured or
 * if the insert fails.
 */
export async function logUsage(params: LogUsageParams): Promise<number | null> {
  if (!sql) return null;
  try {
    const rows = await sql`
      INSERT INTO usage_logs
        (session_token, user_age, device_type, child_question, zuzu_response, was_redirected)
      VALUES
        (${params.sessionToken}, ${params.userAge}, ${params.deviceType},
         ${params.childQuestion}, ${params.zuzuResponse}, ${params.wasRedirected})
      RETURNING id
    `;
    return (rows[0] as { id: number }).id;
  } catch (err) {
    console.error('DB logUsage error:', err);
    return null;
  }
}

/**
 * Updates the time_spent_seconds field for an existing log row.
 * Called when the user clicks "Ask another question".
 */
export async function updateTimeSpent(logId: number, timeSpentSeconds: number): Promise<void> {
  if (!sql) return;
  try {
    await sql`
      UPDATE usage_logs
      SET time_spent_seconds = ${timeSpentSeconds}
      WHERE id = ${logId}
    `;
  } catch (err) {
    console.error('DB updateTimeSpent error:', err);
  }
}

export type FeedbackRating = 'up' | 'down';

/**
 * Records thumbs-up / thumbs-down feedback and optional reason tags
 * for a given log row. Tags are only present on thumbs-down.
 */
export async function updateFeedback(
  logId: number,
  rating: FeedbackRating,
  tags: string[]
): Promise<void> {
  if (!sql) return;
  try {
    await sql`
      UPDATE usage_logs
      SET feedback_rating = ${rating},
          feedback_tags   = ${tags}
      WHERE id = ${logId}
    `;
  } catch (err) {
    console.error('DB updateFeedback error:', err);
  }
}

/**
 * Records a first-visit open. Called at most once per browser
 * (enforced client-side via the zuzu_visited localStorage key).
 * Stores only timestamp (auto-set by DB) + device type — no PII.
 */
export async function logUniqueOpen(deviceType: DeviceType): Promise<void> {
  if (!sql) return;
  try {
    await sql`INSERT INTO unique_opens (device_type) VALUES (${deviceType})`;
  } catch (err) {
    console.error('DB logUniqueOpen error:', err);
  }
}

/** Derives 'mobile' or 'desktop' from a User-Agent string. */
export function detectDeviceType(userAgent: string): DeviceType {
  return /mobile|android|iphone|ipad|tablet/i.test(userAgent) ? 'mobile' : 'desktop';
}
