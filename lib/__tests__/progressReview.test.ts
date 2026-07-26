import { describe, it, expect } from "vitest";
import {
  defaultProgress,
  completeDailyReview,
  isReviewDoneToday,
  REVIEW_XP,
} from "../progress";

const NOW = new Date(2026, 6, 24, 10, 0, 0).getTime();

describe("Daily Hex review completion", () => {
  it("awards XP, saves a hex, and bumps the streak", () => {
    const s0 = defaultProgress(NOW);
    const s1 = completeDailyReview(s0, 5, NOW);
    expect(s1.xp).toBe(REVIEW_XP);
    expect(s1.dailyXp).toBe(REVIEW_XP);
    expect(s1.hexCollection).toHaveLength(1);
    expect(s1.hexCollection[0].segments).toBe(5);
    expect(s1.streak.count).toBe(1);
    expect(isReviewDoneToday(s1, NOW)).toBe(true);
  });

  it("is idempotent within the same local day", () => {
    const s1 = completeDailyReview(defaultProgress(NOW), 5, NOW);
    const s2 = completeDailyReview(s1, 5, NOW + 60_000);
    expect(s2).toBe(s1); // no-op, same reference
    expect(s2.xp).toBe(REVIEW_XP);
    expect(s2.hexCollection).toHaveLength(1);
  });

  it("is not done today before any review", () => {
    expect(isReviewDoneToday(defaultProgress(NOW), NOW)).toBe(false);
  });
});
