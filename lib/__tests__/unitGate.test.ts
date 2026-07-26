import { describe, it, expect } from "vitest";
import { vocabIdsForUnit } from "@/lib/content";
import { defaultProgress, unitMastery } from "@/lib/progress";
import type { SrsCard } from "@/lib/spacedRepetition";
import type { ProgressState } from "@/lib/progress";

const NOW = new Date(2026, 6, 24, 10, 0, 0).getTime();

function cardsFrom(ids: string[], correct: number, seen: number): ProgressState["cards"] {
  const cards: Record<string, SrsCard> = {};
  for (const id of ids) cards[id] = { vocabId: id, box: 2, dueAt: NOW + 100000, seen, correct };
  return cards;
}

/**
 * Regression test for the unlock-gate dilution bug found in the pre-deployment
 * audit: milestone lessons deliberately tag earlier units' vocab ids (for
 * narrative recombination), but vocabIdsForUnit() must NOT include those in the
 * population it hands to unitMastery() for gating - otherwise a learner can
 * clear a unit's gate on already-mastered legacy words without hitting the
 * threshold on that unit's own new content.
 */
describe("unlock gate: scoped to a unit's own vocab (PRD 6.3)", () => {
  it("vocabIdsForUnit returns only farm-animals' own vocab file ids, not cross-referenced ids from milestone lessons", () => {
    const ids = vocabIdsForUnit("farm-animals");
    // farm-animals.json has exactly 29 entries ("der" moved to the greetings-0
    // seed lesson - see CLAUDE.md). The farm-animals-9 milestone lesson also
    // tags fh-mei/fh-helfe/fh-arwet/guder-mariye for recombination - those must
    // be excluded from the gate's population.
    expect(ids).toHaveLength(29);
    expect(ids).not.toContain("fh-mei");
    expect(ids).not.toContain("fh-helfe");
    expect(ids).not.toContain("fh-arwet");
    expect(ids).not.toContain("guder-mariye");
  });

  it("reproduces the audit repro: 66.7% on a unit's own vocab must NOT clear the 70% gate, even with 100% legacy accuracy on cross-referenced prior-unit words", () => {
    const farmIds = vocabIdsForUnit("farm-animals");
    const state = defaultProgress(NOW);

    // 20/29 correct on farm-animals' own words = ~69%, genuinely below 70%.
    const correctIds = farmIds.slice(0, 20);
    const wrongIds = farmIds.slice(20);
    state.cards = {
      ...cardsFrom(correctIds, 1, 1),
      ...cardsFrom(wrongIds, 0, 1),
      // Legacy words a milestone lesson cross-references, already mastered.
      ...cardsFrom(["fh-mei", "fh-helfe", "fh-arwet", "guder-mariye"], 1, 1),
    };

    const mastery = unitMastery(state, farmIds);
    expect(mastery).toBeCloseTo(20 / 29, 5);
    expect(mastery).toBeLessThan(0.7);
  });

  it("70% on a unit's own vocab DOES clear the gate", () => {
    const farmIds = vocabIdsForUnit("farm-animals");
    const state = defaultProgress(NOW);
    const correctIds = farmIds.slice(0, 21); // 21/29 ≈ 72%
    const wrongIds = farmIds.slice(21);
    state.cards = {
      ...cardsFrom(correctIds, 1, 1),
      ...cardsFrom(wrongIds, 0, 1),
    };
    expect(unitMastery(state, farmIds)).toBeGreaterThanOrEqual(0.7);
  });
});
