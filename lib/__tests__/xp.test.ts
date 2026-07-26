import { describe, it, expect } from "vitest";
import { lessonXp, isLessonPassed, XP_PER_CORRECT, PERFECT_LESSON_BONUS } from "../xp";

describe("xp scoring", () => {
  it("awards XP per correct answer", () => {
    expect(lessonXp({ total: 10, correct: 7, mistakes: 3 }, 0)).toBe(7 * XP_PER_CORRECT);
  });

  it("adds a perfect-lesson bonus only with zero mistakes", () => {
    expect(lessonXp({ total: 10, correct: 10, mistakes: 0 }, 0)).toBe(
      10 * XP_PER_CORRECT + PERFECT_LESSON_BONUS,
    );
    expect(lessonXp({ total: 10, correct: 9, mistakes: 1 }, 0)).toBe(9 * XP_PER_CORRECT);
  });

  it("adds a capped streak bonus", () => {
    expect(lessonXp({ total: 1, correct: 1, mistakes: 0 }, 3)).toBe(
      XP_PER_CORRECT + PERFECT_LESSON_BONUS + 3,
    );
    // capped at 10
    expect(lessonXp({ total: 1, correct: 1, mistakes: 0 }, 50)).toBe(
      XP_PER_CORRECT + PERFECT_LESSON_BONUS + 10,
    );
  });

  it("passes at >= 60% correct", () => {
    expect(isLessonPassed({ total: 10, correct: 6, mistakes: 4 })).toBe(true);
    expect(isLessonPassed({ total: 10, correct: 5, mistakes: 5 })).toBe(false);
    expect(isLessonPassed({ total: 0, correct: 0, mistakes: 0 })).toBe(false);
  });
});
