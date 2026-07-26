/**
 * Daily Hex review session builder (PRD 6.4). Turns the SRS due-cards into a
 * small set of review questions. Pure + testable; the page pulls due cards from
 * progress and vocab from content, then renders each answered question as a
 * filled segment of the day's hex sign.
 */

import type { VocabEntry } from "./types";

export interface ReviewQuestion {
  vocabId: string;
  deitsh: string;
  phonetic: string;
  /** "What does X mean?" - the learner picks the English meaning. */
  options: string[];
  answer: string;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a review question per vocab id (skipping ids with no vocab entry).
 * Each question is a 4-option meaning check; distractors are other vocab
 * meanings. `rng` is injectable for deterministic tests.
 */
export function buildReviewSession(
  vocabIds: string[],
  vocab: VocabEntry[],
  rng: () => number = Math.random,
): ReviewQuestion[] {
  const byId = new Map(vocab.map((v) => [v.id, v]));
  const allMeanings = vocab.map((v) => v.english);

  const questions: ReviewQuestion[] = [];
  for (const id of vocabIds) {
    const entry = byId.get(id);
    if (!entry) continue;

    const distractors = shuffle(
      allMeanings.filter((m) => m !== entry.english),
      rng,
    ).slice(0, 3);
    const options = shuffle([entry.english, ...distractors], rng);

    questions.push({
      vocabId: id,
      deitsh: entry.deitsh,
      phonetic: entry.phonetic,
      options,
      answer: entry.english,
    });
  }
  return questions;
}

/** Clamp the hex to a sensible number of segments for one day's review. */
export const MIN_HEX_SEGMENTS = 3;
export const MAX_HEX_SEGMENTS = 6;

export function hexSegmentsFor(count: number): number {
  return Math.max(MIN_HEX_SEGMENTS, Math.min(MAX_HEX_SEGMENTS, count));
}
