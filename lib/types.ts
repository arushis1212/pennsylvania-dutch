/**
 * Shared content + progress types for Deitsh.
 *
 * Content authors only ever touch files under /content - these types describe
 * the shape those JSON files must follow. Keep exercise types in sync with
 * PRD.md Section 6.2.
 */

/**
 * Active exercise types are TEXT-ONLY. Audio-dependent types (`listen_select`,
 * `listen_type`) are disabled until native-speaker recordings exist - see
 * PRD.md Section 6.2. No `audio` field and no play buttons ship for now.
 */
export type ExerciseType =
  | "multiple_choice"
  | "translate"
  | "word_bank"
  | "matching"
  | "true_false";

/** Base fields shared by every exercise. */
interface ExerciseBase {
  type: ExerciseType;
  /** Prompt/instruction shown above the exercise. */
  prompt: string;
  /**
   * Vocab IDs this exercise practices - used by the spaced-repetition engine
   * to know which words to resurface. See /lib/spacedRepetition.ts.
   */
  vocab?: string[];
  /**
   * Marks content the author is not fully confident on. Rendered nowhere to
   * learners, but surfaced to content reviewers. Per PRD Section 8, unreviewed
   * content is "community-reviewed pending".
   */
  needsReview?: boolean;
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: "multiple_choice";
  options: string[];
  answer: string;
}

export interface TranslateExercise extends ExerciseBase {
  type: "translate";
  /** Direction is implied by the prompt; both accepted answers normalized. */
  answer: string;
  /** Extra accepted answers (spelling/variant tolerance). */
  acceptedAnswers?: string[];
}

export interface WordBankExercise extends ExerciseBase {
  type: "word_bank";
  /** The correct ordered sequence of tokens. */
  answer: string[];
  /** Full token pool shown to the learner (answer tokens + distractors). */
  bank: string[];
}

/** A single word↔meaning pair for a matching exercise. */
export interface MatchPair {
  deitsh: string;
  english: string;
}

/** Two-column tap-to-pair exercise (word ↔ translation). Completing = correct. */
export interface MatchingExercise extends ExerciseBase {
  type: "matching";
  pairs: MatchPair[];
}

/** Short statement; the learner picks True or False. Used for grammar checks. */
export interface TrueFalseExercise extends ExerciseBase {
  type: "true_false";
  /** The statement to judge (shown as the prompt is the instruction). */
  statement: string;
  answer: boolean;
  /** Optional one-line explanation shown on the reveal. */
  explanation?: string;
}

/**
 * A no-quiz presentation step: the learner's FIRST exposure to a new word.
 * Per the PRD 6.2 pedagogy rule, every word must be introduced (word + English
 * meaning + phonetic) before any quiz exercise tests it. Ungraded - there is no
 * right/wrong answer, just exposure. Dobbin presents it.
 */
export interface IntroduceExercise {
  type: "introduce";
  /** The Deitsh word/phrase being taught. */
  word: string;
  /** Its English meaning. */
  meaning: string;
  /** Phonetic respelling (pronunciation guide in place of audio). */
  phonetic: string;
  /** Vocab id(s) this introduces - links to the shared vocab list. */
  vocab?: string[];
  needsReview?: boolean;
}

/** Exercises that are actually graded (everything except `introduce`). */
export type GradableExercise =
  | MultipleChoiceExercise
  | TranslateExercise
  | WordBankExercise
  | MatchingExercise
  | TrueFalseExercise;

export type Exercise = IntroduceExercise | GradableExercise;

/** Type guard: is this a graded quiz step (vs. an introduce presentation)? */
export function isGradable(ex: Exercise): ex is GradableExercise {
  return ex.type !== "introduce";
}

export interface Lesson {
  unit: string;
  lesson_id: string;
  title: string;
  /** One-line description shown on the lesson node. */
  subtitle?: string;
  /** Sub-unit this lesson belongs to (e.g. "Immediate Family"), PRD 6.1. */
  subUnit?: string;
  /** Milestone lesson: a recombining dialogue/reading passage (PRD 6.1). */
  milestone?: boolean;
  /** "pending" until a native/heritage speaker signs off. */
  reviewStatus: "pending" | "reviewed";
  exercises: Exercise[];
}

/** A shared vocab entry referenced by lessons and the review deck. */
export interface VocabEntry {
  id: string;
  deitsh: string;
  english: string;
  /**
   * REQUIRED plain-English phonetic respelling (e.g. "HAH-loh"). Shown next to
   * the written word everywhere as the pronunciation guide in place of audio.
   * See PRD.md Section 6.2 / vocab schema in CLAUDE.md.
   */
  phonetic: string;
  needsReview?: boolean;
}

/** Unit metadata for the learning path (skill tree). */
export interface UnitMeta {
  id: string;
  title: string;
  blurb: string;
  /** Motif icon key used by the UnitCard decoration (see components/Motifs). */
  motif:
    | "buggy"
    | "barn"
    | "quilt"
    | "churn"
    | "wheat"
    | "lantern"
    | "silo"
    | "garden"
    | "loom"
    | "waterwheel"
    | "windmill";
  /**
   * Authoring hint only. The learning path computes LIVE availability from
   * content + the unlock gate (see `unitAvailability` in components/LearningPath),
   * so a built unit with a met gate opens regardless of this value. Use
   * "coming_soon" for themes with no lessons yet.
   */
  status: "available" | "locked" | "coming_soon";
  lessonIds: string[];
  /** Prior unit whose review accuracy gates this one (PRD 6.3). */
  unlockAfter?: string;
  /**
   * Review-accuracy threshold (0-1) a learner must hold on the `unlockAfter`
   * unit's material before this one unlocks. See PRD 6.3 spaced-repetition gating.
   */
  unlockAccuracy?: number;
}
