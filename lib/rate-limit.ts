/**
 * In-memory sliding-window rate limiter per user.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 60_000; // 60 seconds

// Periodic cleanup of stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitMap.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

/**
 * Check if an action by a given user exceeds the sliding-window rate limit.
 *
 * @param userId - Unique identifier for the user
 * @param limit - Maximum allowed requests in the window (default 5)
 * @param windowMs - Time window in milliseconds (default 60,000ms = 1 min)
 * @returns Object indicating whether the request is allowed and retryAfter (in seconds)
 */
export function checkRateLimit(
  userId: string,
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
): { success: boolean; retryAfter?: number } {
  const now = Date.now();
  cleanupStaleEntries(windowMs);

  let record = rateLimitMap.get(userId);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(userId, record);
  }

  // Remove timestamps outside the active window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfter = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      success: false,
      retryAfter: Math.max(1, retryAfter),
    };
  }

  record.timestamps.push(now);
  return { success: true };
}
