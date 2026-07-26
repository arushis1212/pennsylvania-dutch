/**
 * Lightweight spaced-repetition scheduler (Leitner-style boxes).
 *
 * Drives two things (PRD 6.4 + 6.3):
 *   1. The daily Review deck - which weak words to resurface, and when.
 *   2. Unit unlock gating - a dependent unit stays locked until the learner's
 *      rolling review accuracy on prerequisite material clears a threshold.
 *
 * Pure functions; the per-vocab card map is persisted by /lib/progress.ts.
 */

export interface SrsCard {
  vocabId: string;
  /** Leitner box 0..MAX_BOX. Higher box = longer interval = better known. */
  box: number;
  /** Next timestamp (ms) this card is due for review. */
  dueAt: number;
  /** Rolling correct/seen counters used for unit-unlock accuracy. */
  seen: number;
  correct: number;
}

export const MAX_BOX = 5;

/** Interval per box, in ms. Box 0 = due immediately, then widening gaps. */
const BOX_INTERVALS_MS = [
  0, // 0: right away (just missed)
  4 * 60 * 60 * 1000, // 1: 4 hours
  24 * 60 * 60 * 1000, // 2: 1 day
  3 * 24 * 60 * 60 * 1000, // 3: 3 days
  7 * 24 * 60 * 60 * 1000, // 4: 1 week
  16 * 24 * 60 * 60 * 1000, // 5: ~2.5 weeks
];

export function newCard(vocabId: string, now: number = Date.now()): SrsCard {
  return { vocabId, box: 0, dueAt: now, seen: 0, correct: 0 };
}

/** Update a card after the learner answered an item practicing it. */
export function reviewCard(card: SrsCard, correct: boolean, now: number = Date.now()): SrsCard {
  const box = correct ? Math.min(MAX_BOX, card.box + 1) : 0;
  return {
    ...card,
    box,
    dueAt: now + BOX_INTERVALS_MS[box],
    seen: card.seen + 1,
    correct: card.correct + (correct ? 1 : 0),
  };
}

/** Cards currently due, weakest (lowest box) first, capped to `limit`. */
export function dueCards(cards: SrsCard[], now: number = Date.now(), limit = 20): SrsCard[] {
  return cards
    .filter((c) => c.dueAt <= now)
    .sort((a, b) => a.box - b.box || a.dueAt - b.dueAt)
    .slice(0, limit);
}

/**
 * Rolling review accuracy (0..1) across the given cards. Used for unit-unlock
 * gating. Cards never seen contribute nothing; returns 1 for an empty set so a
 * brand-new learner is never blocked before they've reviewed anything.
 */
export function reviewAccuracy(cards: SrsCard[]): number {
  const seen = cards.reduce((s, c) => s + c.seen, 0);
  if (seen === 0) return 1;
  const correct = cards.reduce((s, c) => s + c.correct, 0);
  return correct / seen;
}
