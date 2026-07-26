/**
 * Grading + input-readiness for each exercise type. Keeps the LessonPlayer
 * decoupled from per-type answer shapes.
 *
 * `introduce` steps are ungraded presentations (PRD 6.2) - the player handles
 * them on a separate path and never calls the graders below on them, but we
 * guard them here too so the functions stay total over the Exercise union.
 */

import type { Exercise } from "./types";
import { checkText, checkTokens } from "./answerCheck";

/** A learner's in-progress answer: a string (choice/typed) or ordered tokens. */
export type AnswerValue = string | string[];

export function isAnswerReady(exercise: Exercise, value: AnswerValue | null): boolean {
  if (exercise.type === "introduce") return true; // nothing to answer
  if (value == null) return false;
  if (exercise.type === "word_bank") {
    return Array.isArray(value) && value.length === exercise.answer.length;
  }
  if (exercise.type === "matching") {
    // The Matching component only records correctly-matched pairs, so "ready"
    // means every pair has been paired.
    return Array.isArray(value) && value.length === exercise.pairs.length;
  }
  return typeof value === "string" && value.trim().length > 0;
}

export function gradeExercise(exercise: Exercise, value: AnswerValue | null): boolean {
  if (value == null) return false;
  switch (exercise.type) {
    case "introduce":
      return true; // never scored
    case "multiple_choice":
      return typeof value === "string" && value === exercise.answer;
    case "translate":
      return (
        typeof value === "string" &&
        checkText(value, exercise.answer, exercise.acceptedAnswers)
      );
    case "word_bank":
      return Array.isArray(value) && checkTokens(value, exercise.answer);
    case "matching":
      // Completion == correctness (only correct pairs get recorded).
      return Array.isArray(value) && value.length === exercise.pairs.length;
    case "true_false":
      return typeof value === "string" && value === String(exercise.answer);
  }
}

/** The canonical correct answer as display text (for the "correct answer" reveal). */
export function correctAnswerText(exercise: Exercise): string {
  switch (exercise.type) {
    case "introduce":
      return exercise.word;
    case "word_bank":
      return exercise.answer.join(" ");
    case "matching":
      return "";
    case "true_false":
      return exercise.answer ? "True" : "False";
    default:
      return exercise.answer;
  }
}
