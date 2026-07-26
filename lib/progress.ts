/**
 * Progress store - the single source of truth for the learner's state, backed
 * by localStorage (v1 has no backend/auth; PRD Section 9).
 *
 * Orchestrates the pure engines (energy/streak/xp/spacedRepetition). UI reads
 * through the useProgress() hook in /lib/useProgress.ts, never touching
 * localStorage directly.
 */

import {
  EnergyState,
  initialEnergy,
  resolveEnergy,
  spendHoof,
} from "./energy";
import {
  StreakState,
  initialStreak,
  recordActivity,
  dayKey,
} from "./streak";
import { LessonResult, lessonXp } from "./xp";
import {
  SrsCard,
  newCard,
  reviewCard,
  reviewAccuracy,
  dueCards,
} from "./spacedRepetition";
import { displayStreak } from "./streak";

const STORAGE_KEY = "deitsh.progress.v1";
const SCHEMA_VERSION = 1;

export interface ProgressState {
  version: number;
  xp: number;
  energy: EnergyState;
  streak: StreakState;
  /** Completed lesson IDs. */
  completedLessons: string[];
  /** SRS cards keyed by vocab id. */
  cards: Record<string, SrsCard>;
  /** Daily XP goal target. */
  dailyGoalTarget: number;
  /** XP earned today, keyed to reset each local day. */
  dailyXp: number;
  dailyXpDay: string | null;
  /** Local day the Daily Hex review was last completed (PRD 6.4). */
  lastReviewDay: string | null;
  /** Small personal collection of completed hexes (streak/history visual). */
  hexCollection: CompletedHex[];
}

/** A finished Daily Hex, saved to the collection. */
export interface CompletedHex {
  day: string;
  segments: number;
}

/** XP awarded for finishing the day's Daily Hex review. */
export const REVIEW_XP = 15;

export function defaultProgress(now: number = Date.now()): ProgressState {
  return {
    version: SCHEMA_VERSION,
    xp: 0,
    energy: initialEnergy(now),
    streak: initialStreak(),
    completedLessons: [],
    cards: {},
    dailyGoalTarget: 50,
    dailyXp: 0,
    dailyXpDay: null,
    lastReviewDay: null,
    hexCollection: [],
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadProgress(now: number = Date.now()): ProgressState {
  if (!isBrowser()) return defaultProgress(now);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress(now);
    const parsed = JSON.parse(raw) as ProgressState;
    if (!parsed || parsed.version !== SCHEMA_VERSION) return defaultProgress(now);
    // Resolve time-based regen on every load.
    parsed.energy = resolveEnergy(parsed.energy, now);
    return { ...defaultProgress(now), ...parsed };
  } catch {
    return defaultProgress(now);
  }
}

export function saveProgress(state: ProgressState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full / disabled - degrade to in-memory only */
  }
}

/** Reset today's XP counter if the local day rolled over. */
function rolloverDailyXp(state: ProgressState, now: number): ProgressState {
  const today = dayKey(now);
  if (state.dailyXpDay !== today) {
    return { ...state, dailyXp: 0, dailyXpDay: today };
  }
  return state;
}

// ---- Mutations (all return a NEW state; callers persist + re-render) ----

/** Deduct a hoof for a wrong answer. */
export function applyMistake(state: ProgressState, now: number = Date.now()): ProgressState {
  return { ...state, energy: spendHoof(state.energy, now) };
}

/** Record that a specific vocab item was answered (feeds SRS + gating). */
export function applyVocabResult(
  state: ProgressState,
  vocabId: string,
  correct: boolean,
  now: number = Date.now(),
): ProgressState {
  const existing = state.cards[vocabId] ?? newCard(vocabId, now);
  const updated = reviewCard(existing, correct, now);
  return { ...state, cards: { ...state.cards, [vocabId]: updated } };
}

/** Finalize a completed lesson: award XP, mark done, bump streak. */
export function completeLesson(
  state: ProgressState,
  lessonId: string,
  result: LessonResult,
  now: number = Date.now(),
): ProgressState {
  let next = rolloverDailyXp(state, now);
  const liveStreak = displayStreak(next.streak, now);
  const earned = lessonXp(result, liveStreak);

  const completedLessons = next.completedLessons.includes(lessonId)
    ? next.completedLessons
    : [...next.completedLessons, lessonId];

  next = {
    ...next,
    xp: next.xp + earned,
    dailyXp: next.dailyXp + earned,
    completedLessons,
    streak: recordActivity(next.streak, now),
  };
  return next;
}

/**
 * Finalize the Daily Hex review: award XP, save the completed hex, bump streak.
 * Idempotent per local day - completing it twice the same day is a no-op.
 */
export function completeDailyReview(
  state: ProgressState,
  segments: number,
  now: number = Date.now(),
): ProgressState {
  const today = dayKey(now);
  if (state.lastReviewDay === today) return state; // already done today

  let next = rolloverDailyXp(state, now);
  next = {
    ...next,
    xp: next.xp + REVIEW_XP,
    dailyXp: next.dailyXp + REVIEW_XP,
    streak: recordActivity(next.streak, now),
    lastReviewDay: today,
    hexCollection: [...next.hexCollection, { day: today, segments }].slice(-24),
  };
  return next;
}

/** Change the daily XP goal target. */
export function setDailyGoal(state: ProgressState, target: number): ProgressState {
  return { ...state, dailyGoalTarget: target };
}

/** Wipe all progress (settings/debug affordance). */
export function resetProgress(now: number = Date.now()): ProgressState {
  const fresh = defaultProgress(now);
  saveProgress(fresh);
  return fresh;
}

// ---- Derived selectors ----

/** Rolling review accuracy across the given vocab ids (for unit gating). */
export function accuracyFor(state: ProgressState, vocabIds: string[]): number {
  const cards = vocabIds
    .map((id) => state.cards[id])
    .filter((c): c is SrsCard => Boolean(c));
  return reviewAccuracy(cards);
}

/** Whether today's Daily Hex has already been completed. */
export function isReviewDoneToday(state: ProgressState, now: number = Date.now()): boolean {
  return state.lastReviewDay === dayKey(now);
}

/**
 * Vocab ids to review today. Prefers SRS-due cards; if nothing is due yet,
 * falls back to already-seen cards (soonest-due first) so the Daily Hex is
 * always a meaningful reinforcement, never an empty screen.
 */
export function dueReviewVocabIds(
  state: ProgressState,
  now: number = Date.now(),
  limit = 6,
): string[] {
  const all = Object.values(state.cards);
  const due = dueCards(all, now, limit);
  if (due.length > 0) return due.map((c) => c.vocabId);
  return [...all]
    .sort((a, b) => a.dueAt - b.dueAt)
    .slice(0, limit)
    .map((c) => c.vocabId);
}

export { STORAGE_KEY };
