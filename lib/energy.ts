/**
 * Hooves - the reskinned "hearts"/energy system. 🐴
 *
 * DESIGN (PRD 6.3): Hooves regenerate SLOWLY over real time (hours), never
 * instantly. This is the app's PRIMARY pacing lever - running out forces a
 * natural break so a motivated user cannot binge the whole tree in one sitting.
 * We deliberately do NOT offer instant refills, ad-refills, or paywalls.
 *
 * All functions here are PURE (time is passed in), so they are unit-testable
 * and never touch localStorage. Persistence lives in /lib/progress.ts.
 */

export const MAX_HOOVES = 5;

/** One hoof regenerates every 4 real hours. Tunable during testing (PRD 6.3). */
export const REGEN_INTERVAL_MS = 4 * 60 * 60 * 1000;

export interface EnergyState {
  /** Current hooves, 0..MAX_HOOVES. */
  hooves: number;
  /**
   * Anchor timestamp (ms) for the regen clock. When below max, the next hoof
   * arrives at updatedAt + REGEN_INTERVAL_MS. When full, this floats to "now"
   * and is effectively idle.
   */
  updatedAt: number;
}

export function initialEnergy(now: number = Date.now()): EnergyState {
  return { hooves: MAX_HOOVES, updatedAt: now };
}

/**
 * Recompute how many hooves have regenerated since `updatedAt`. Returns a
 * normalized state. Idempotent: calling repeatedly with the same `now` is safe.
 */
export function resolveEnergy(state: EnergyState, now: number = Date.now()): EnergyState {
  if (state.hooves >= MAX_HOOVES) {
    // Already full - keep the clock idle at `now`.
    return { hooves: MAX_HOOVES, updatedAt: now };
  }
  const elapsed = Math.max(0, now - state.updatedAt);
  const gained = Math.floor(elapsed / REGEN_INTERVAL_MS);
  if (gained <= 0) return state;

  const hooves = Math.min(MAX_HOOVES, state.hooves + gained);
  if (hooves >= MAX_HOOVES) {
    return { hooves: MAX_HOOVES, updatedAt: now };
  }
  // Carry the unused remainder of the current interval forward.
  return { hooves, updatedAt: state.updatedAt + gained * REGEN_INTERVAL_MS };
}

/** Spend one hoof on a mistake. No-op at zero. Resolves regen first. */
export function spendHoof(state: EnergyState, now: number = Date.now()): EnergyState {
  const resolved = resolveEnergy(state, now);
  if (resolved.hooves <= 0) return resolved;

  const wasFull = resolved.hooves >= MAX_HOOVES;
  const hooves = resolved.hooves - 1;
  // If we just dropped below full, (re)start the regen clock from now.
  return { hooves, updatedAt: wasFull ? now : resolved.updatedAt };
}

/** Milliseconds until the next hoof regenerates, or 0 if already full. */
export function msUntilNextHoof(state: EnergyState, now: number = Date.now()): number {
  const resolved = resolveEnergy(state, now);
  if (resolved.hooves >= MAX_HOOVES) return 0;
  return Math.max(0, resolved.updatedAt + REGEN_INTERVAL_MS - now);
}

/** Human-friendly "2h 15m" style countdown for the UI. */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "full";
  const totalMinutes = Math.ceil(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
