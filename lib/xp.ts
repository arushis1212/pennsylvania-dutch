/**
 * XP scoring. Pure functions. See PRD 6.3.
 *
 * XP per correct exercise, plus a perfect-lesson bonus and a small streak
 * bonus, so daily returning + accuracy both feel rewarded without turning into
 * grindy busywork.
 */

export const XP_PER_CORRECT = 10;
export const PERFECT_LESSON_BONUS = 15;

export interface LessonResult {
  total: number;
  correct: number;
  /** Number of hooves lost during the lesson (one per mistake). */
  mistakes: number;
}

/** XP earned from a completed lesson. */
export function lessonXp(result: LessonResult, currentStreak: number): number {
  const base = result.correct * XP_PER_CORRECT;
  const perfect = result.mistakes === 0 && result.total > 0 ? PERFECT_LESSON_BONUS : 0;
  // Small streak kicker: +1 XP per streak day, capped so it never dominates.
  const streakBonus = Math.min(currentStreak, 10);
  return base + perfect + streakBonus;
}

/** Whether a lesson counts as "passed" (>= 60% correct). */
export function isLessonPassed(result: LessonResult): boolean {
  if (result.total === 0) return false;
  return result.correct / result.total >= 0.6;
}

export interface DailyGoal {
  /** Target XP per day the learner set for themselves. */
  target: number;
}

export const DAILY_GOAL_PRESETS = [
  { label: "Relaxed", target: 20 },
  { label: "Regular", target: 50 },
  { label: "Serious", target: 100 },
] as const;
