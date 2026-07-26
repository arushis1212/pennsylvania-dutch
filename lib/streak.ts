/**
 * Daily streak logic. Pure functions operating on local calendar days.
 *
 * We compare day-boundaries in the user's local timezone (the app is
 * account-free / single-device in v1, so local time is the right frame).
 */

export interface StreakState {
  /** Current consecutive-day streak. */
  count: number;
  /** Longest streak ever reached (for a future stats screen). */
  best: number;
  /** ISO day-string (YYYY-MM-DD, local) of the last completed activity. */
  lastActiveDay: string | null;
}

export function initialStreak(): StreakState {
  return { count: 0, best: 0, lastActiveDay: null };
}

/** Local YYYY-MM-DD for a timestamp. */
export function dayKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Whole-day difference between two YYYY-MM-DD keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const aUtc = Date.UTC(ay, am - 1, ad);
  const bUtc = Date.UTC(by, bm - 1, bd);
  return Math.round((bUtc - aUtc) / 86_400_000);
}

/**
 * Record activity for `now`. Same-day activity is idempotent (streak unchanged);
 * next-day continues the streak; a gap of 2+ days resets to 1.
 */
export function recordActivity(state: StreakState, now: number = Date.now()): StreakState {
  const today = dayKey(now);
  if (state.lastActiveDay === today) return state; // already counted today

  let count: number;
  if (state.lastActiveDay && daysBetween(state.lastActiveDay, today) === 1) {
    count = state.count + 1;
  } else {
    count = 1; // first ever, or a broken streak
  }
  return { count, best: Math.max(state.best, count), lastActiveDay: today };
}

/**
 * Streak shown in the UI: if the last active day is older than yesterday, the
 * live streak has lapsed to 0 even though we haven't recorded new activity yet.
 */
export function displayStreak(state: StreakState, now: number = Date.now()): number {
  if (!state.lastActiveDay) return 0;
  const gap = daysBetween(state.lastActiveDay, dayKey(now));
  return gap <= 1 ? state.count : 0;
}
