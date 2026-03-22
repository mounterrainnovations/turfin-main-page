// In-memory sliding window rate limiter.
// Note: state is per-instance. On multi-instance deployments (e.g. Vercel
// with many concurrent lambdas) use a distributed store (Upstash Redis, etc.)
// For a waitlist with Turnstile already in place this is sufficient.

interface Window {
  timestamps: number[];
}

const store = new Map<string, Window>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 1;

// Prune IPs that haven't made a request in the last 2 minutes to prevent unbounded growth.
const PRUNE_INTERVAL_MS = 120_000;
let lastPruned = Date.now();

function prune(now: number) {
  if (now - lastPruned < PRUNE_INTERVAL_MS) return;
  for (const [ip, win] of store) {
    if (
      win.timestamps.length === 0 ||
      now - win.timestamps[win.timestamps.length - 1] > WINDOW_MS
    ) {
      store.delete(ip);
    }
  }
  lastPruned = now;
}

/**
 * Returns { allowed: true } or { allowed: false, retryAfterMs: number }.
 */
export function checkRateLimit(
  ip: string,
): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();
  prune(now);

  let win = store.get(ip);
  if (!win) {
    win = { timestamps: [] };
    store.set(ip, win);
  }

  // Drop timestamps outside the current window
  win.timestamps = win.timestamps.filter((t) => now - t < WINDOW_MS);

  if (win.timestamps.length >= MAX_REQUESTS) {
    const oldest = win.timestamps[0];
    const retryAfterMs = WINDOW_MS - (now - oldest);
    return { allowed: false, retryAfterMs };
  }

  win.timestamps.push(now);
  return { allowed: true };
}
