import { describe, it, expect } from "vitest";
import { initialStreak, recordActivity, displayStreak, daysBetween } from "../streak";

// Use local-noon timestamps so day math is timezone-stable within a run.
function day(y: number, m: number, d: number): number {
  return new Date(y, m - 1, d, 12, 0, 0).getTime();
}

describe("streak", () => {
  it("starts empty", () => {
    expect(initialStreak()).toEqual({ count: 0, best: 0, lastActiveDay: null });
  });

  it("first activity sets streak to 1", () => {
    const s = recordActivity(initialStreak(), day(2026, 7, 23));
    expect(s.count).toBe(1);
    expect(s.best).toBe(1);
  });

  it("same-day activity is idempotent", () => {
    let s = recordActivity(initialStreak(), day(2026, 7, 23));
    s = recordActivity(s, day(2026, 7, 23));
    expect(s.count).toBe(1);
  });

  it("consecutive days increment", () => {
    let s = recordActivity(initialStreak(), day(2026, 7, 23));
    s = recordActivity(s, day(2026, 7, 24));
    s = recordActivity(s, day(2026, 7, 25));
    expect(s.count).toBe(3);
    expect(s.best).toBe(3);
  });

  it("a skipped day resets the streak to 1", () => {
    let s = recordActivity(initialStreak(), day(2026, 7, 23));
    s = recordActivity(s, day(2026, 7, 24));
    s = recordActivity(s, day(2026, 7, 27)); // gap
    expect(s.count).toBe(1);
    expect(s.best).toBe(2); // best preserved
  });

  it("displayStreak lapses to 0 after a missed day", () => {
    const s = recordActivity(initialStreak(), day(2026, 7, 23));
    expect(displayStreak(s, day(2026, 7, 24))).toBe(1); // yesterday still counts
    expect(displayStreak(s, day(2026, 7, 26))).toBe(0); // lapsed
  });

  it("daysBetween handles month boundaries", () => {
    expect(daysBetween("2026-07-31", "2026-08-01")).toBe(1);
    expect(daysBetween("2026-02-28", "2026-03-01")).toBe(1); // 2026 not leap: Feb 28 is last day
    expect(daysBetween("2024-02-28", "2024-03-01")).toBe(2); // 2024 leap: Feb 29 in between
  });
});
