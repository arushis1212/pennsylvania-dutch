import { describe, it, expect } from "vitest";
import { UNITS } from "@/content/units";
import { getLesson, getVocab } from "@/lib/content";
import { isGradable } from "@/lib/types";

/**
 * Enforces the PRD 6.2 pedagogy rule ("teach before testing"): a word's FIRST
 * appearance anywhere in the app must be an `introduce` step, never a cold quiz.
 * Walks every unit's lessons in path order, accumulating introduced vocab ids,
 * and flags any quiz that tests a word not yet introduced.
 */
describe("pedagogy: teach before testing (PRD 6.2)", () => {
  it("introduces every vocab word before any quiz tests it (in path order)", () => {
    const introduced = new Set<string>();
    const violations: string[] = [];

    for (const unit of UNITS) {
      for (const lessonId of unit.lessonIds) {
        const lesson = getLesson(lessonId);
        if (!lesson) continue;
        for (const ex of lesson.exercises) {
          if (ex.type === "introduce") {
            for (const v of ex.vocab ?? []) introduced.add(v);
          } else if (isGradable(ex)) {
            for (const v of ex.vocab ?? []) {
              if (!introduced.has(v)) {
                violations.push(`${lessonId}: quizzes "${v}" before it is introduced`);
              }
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("each introduce step matches its shared vocab entry (no drift)", () => {
    const mismatches: string[] = [];

    for (const unit of UNITS) {
      for (const lessonId of unit.lessonIds) {
        const lesson = getLesson(lessonId);
        if (!lesson) continue;
        for (const ex of lesson.exercises) {
          if (ex.type !== "introduce") continue;
          const id = ex.vocab?.[0];
          if (!id) {
            mismatches.push(`${lessonId}: introduce "${ex.word}" has no vocab id`);
            continue;
          }
          const v = getVocab(id);
          if (!v) mismatches.push(`${lessonId}: unknown vocab id "${id}"`);
          else if (v.deitsh !== ex.word || v.english !== ex.meaning || v.phonetic !== ex.phonetic) {
            mismatches.push(`${lessonId}: introduce "${ex.word}" drifts from vocab "${id}"`);
          }
        }
      }
    }

    expect(mismatches).toEqual([]);
  });

  it("no vocab word is introduced more than once across the whole path", () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const unit of UNITS) {
      for (const lessonId of unit.lessonIds) {
        const lesson = getLesson(lessonId);
        if (!lesson) continue;
        for (const ex of lesson.exercises) {
          if (ex.type !== "introduce") continue;
          for (const v of ex.vocab ?? []) {
            if (seen.has(v)) dupes.push(`${v} re-introduced in ${lessonId}`);
            seen.add(v);
          }
        }
      }
    }
    expect(dupes).toEqual([]);
  });
});
