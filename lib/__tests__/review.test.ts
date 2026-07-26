import { describe, it, expect } from "vitest";
import { buildReviewSession, hexSegmentsFor, MAX_HEX_SEGMENTS, MIN_HEX_SEGMENTS } from "../review";
import type { VocabEntry } from "../types";

const vocab: VocabEntry[] = [
  { id: "hallo", deitsh: "Hallo", english: "Hello", phonetic: "HAH-loh" },
  { id: "danki", deitsh: "Danki", english: "Thank you", phonetic: "DAHN-kee" },
  { id: "ya", deitsh: "Ya", english: "Yes", phonetic: "yah" },
  { id: "nee", deitsh: "Nee", english: "No", phonetic: "nay" },
  { id: "ade", deitsh: "Ade", english: "Goodbye", phonetic: "ah-DAY" },
];

describe("review session builder", () => {
  it("builds one question per vocab id", () => {
    const qs = buildReviewSession(["hallo", "danki"], vocab, () => 0);
    expect(qs).toHaveLength(2);
    expect(qs[0].vocabId).toBe("hallo");
    expect(qs[0].deitsh).toBe("Hallo");
    expect(qs[0].phonetic).toBe("HAH-loh");
  });

  it("each question's options include the correct meaning and are 4 wide", () => {
    const qs = buildReviewSession(["hallo"], vocab, () => 0.5);
    expect(qs[0].options).toContain("Hello");
    expect(qs[0].answer).toBe("Hello");
    expect(qs[0].options.length).toBe(4);
    expect(new Set(qs[0].options).size).toBe(4); // no dupes
  });

  it("skips unknown vocab ids", () => {
    const qs = buildReviewSession(["hallo", "nope"], vocab, () => 0);
    expect(qs).toHaveLength(1);
  });

  it("clamps hex segments to a sensible range", () => {
    expect(hexSegmentsFor(1)).toBe(MIN_HEX_SEGMENTS);
    expect(hexSegmentsFor(4)).toBe(4);
    expect(hexSegmentsFor(99)).toBe(MAX_HEX_SEGMENTS);
  });
});
