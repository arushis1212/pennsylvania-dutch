import { describe, it, expect } from "vitest";
import { gradeExercise, isAnswerReady, correctAnswerText } from "../grade";
import { checkText, normalize } from "../answerCheck";
import type {
  MultipleChoiceExercise,
  TranslateExercise,
  WordBankExercise,
  MatchingExercise,
  TrueFalseExercise,
} from "../types";

const match: MatchingExercise = {
  type: "matching",
  prompt: "Match",
  pairs: [
    { deitsh: "Hallo", english: "Hello" },
    { deitsh: "Danki", english: "Thank you" },
  ],
};

const tf: TrueFalseExercise = {
  type: "true_false",
  prompt: "True or False?",
  statement: "Danki means thank you.",
  answer: true,
};

const mc: MultipleChoiceExercise = {
  type: "multiple_choice",
  prompt: "Hello",
  options: ["Hallo", "Danki"],
  answer: "Hallo",
};

const tr: TranslateExercise = {
  type: "translate",
  prompt: "Yes",
  answer: "Ya",
  acceptedAnswers: ["Ja"],
};

const wb: WordBankExercise = {
  type: "word_bank",
  prompt: "How are you?",
  answer: ["Wie", "bischt", "du"],
  bank: ["Wie", "bischt", "du", "geht's"],
};

describe("answer normalization", () => {
  it("is case/punctuation/whitespace tolerant", () => {
    expect(normalize("  Wie geht's?  ")).toBe("wie gehts");
    expect(checkText("ya", "Ya")).toBe(true);
    expect(checkText("JA", "Ya", ["Ja"])).toBe(true);
    expect(checkText("", "Ya")).toBe(false);
  });
});

describe("grading", () => {
  it("multiple choice exact match", () => {
    expect(gradeExercise(mc, "Hallo")).toBe(true);
    expect(gradeExercise(mc, "Danki")).toBe(false);
  });

  it("translate accepts variants", () => {
    expect(gradeExercise(tr, "ya")).toBe(true);
    expect(gradeExercise(tr, "Ja")).toBe(true);
    expect(gradeExercise(tr, "Nee")).toBe(false);
  });

  it("word bank requires correct order", () => {
    expect(gradeExercise(wb, ["Wie", "bischt", "du"])).toBe(true);
    expect(gradeExercise(wb, ["Wie", "du", "bischt"])).toBe(false);
    expect(gradeExercise(wb, ["Wie", "bischt"])).toBe(false);
  });

  it("readiness gates the Check button", () => {
    expect(isAnswerReady(mc, null)).toBe(false);
    expect(isAnswerReady(mc, "Hallo")).toBe(true);
    expect(isAnswerReady(tr, "   ")).toBe(false);
    expect(isAnswerReady(wb, ["Wie", "bischt"])).toBe(false);
    expect(isAnswerReady(wb, ["Wie", "bischt", "du"])).toBe(true);
  });

  it("matching is correct once every pair is matched", () => {
    expect(gradeExercise(match, ["Hallo", "Danki"])).toBe(true);
    expect(gradeExercise(match, ["Hallo"])).toBe(false);
    expect(isAnswerReady(match, ["Hallo"])).toBe(false);
    expect(isAnswerReady(match, ["Hallo", "Danki"])).toBe(true);
  });

  it("true/false compares against the boolean answer", () => {
    expect(gradeExercise(tf, "true")).toBe(true);
    expect(gradeExercise(tf, "false")).toBe(false);
    expect(isAnswerReady(tf, "false")).toBe(true);
    expect(isAnswerReady(tf, null)).toBe(false);
    expect(correctAnswerText(tf)).toBe("True");
  });

  it("exposes the canonical answer text for reveals", () => {
    expect(correctAnswerText(wb)).toBe("Wie bischt du");
    expect(correctAnswerText(mc)).toBe("Hallo");
    expect(correctAnswerText(match)).toBe("");
  });
});
