import { describe, it, expect } from "vitest";
import { newCard, reviewCard, dueCards, reviewAccuracy, MAX_BOX } from "../spacedRepetition";

const T0 = 1_000_000_000_000;

describe("spaced repetition", () => {
  it("new cards are due immediately", () => {
    const c = newCard("hallo", T0);
    expect(c.box).toBe(0);
    expect(c.dueAt).toBe(T0);
  });

  it("correct answers promote the box and push due date out", () => {
    const c = reviewCard(newCard("hallo", T0), true, T0);
    expect(c.box).toBe(1);
    expect(c.dueAt).toBeGreaterThan(T0);
    expect(c.correct).toBe(1);
    expect(c.seen).toBe(1);
  });

  it("wrong answers demote to box 0 (resurface soon)", () => {
    let c = reviewCard(newCard("hallo", T0), true, T0);
    c = reviewCard(c, true, T0);
    c = reviewCard(c, false, T0);
    expect(c.box).toBe(0);
    expect(c.dueAt).toBe(T0);
  });

  it("box never exceeds MAX_BOX", () => {
    let c = newCard("hallo", T0);
    for (let i = 0; i < 20; i++) c = reviewCard(c, true, T0);
    expect(c.box).toBe(MAX_BOX);
  });

  it("dueCards returns weakest-first, only due ones", () => {
    const strong = reviewCard(newCard("a", T0), true, T0); // due in future
    const weak = newCard("b", T0); // due now
    const due = dueCards([strong, weak], T0);
    expect(due.map((c) => c.vocabId)).toEqual(["b"]);
  });

  it("reviewAccuracy is 1 for unseen cards (never blocks new learners)", () => {
    expect(reviewAccuracy([newCard("a", T0)])).toBe(1);
  });

  it("reviewAccuracy reflects correct/seen ratio", () => {
    const a = reviewCard(newCard("a", T0), true, T0);
    const b = reviewCard(newCard("b", T0), false, T0);
    expect(reviewAccuracy([a, b])).toBe(0.5);
  });
});
