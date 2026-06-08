/**
 * Simple in-memory rate limiter using a sliding window.
 * Suitable for single-instance deployments.
 * For multi-instance, swap with Redis-backed implementation.
 */

type RateLimitEntry = {
  timestamps: number[];
};

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup(windowMs: number) {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
      if (entry.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
  // Don't block process exit
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

export type RateLimitConfig = {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests per window */
  maxRequests: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  ensureCleanup(config.windowMs);

  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < config.windowMs,
  );

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetAt: oldestInWindow + config.windowMs,
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetAt: now + config.windowMs,
  };
}
