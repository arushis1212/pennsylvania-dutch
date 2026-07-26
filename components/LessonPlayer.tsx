"use client";

import { useState } from "react";
import Link from "next/link";
import type { Exercise, Lesson } from "@/lib/types";
import { isGradable } from "@/lib/types";
import { AnswerValue, gradeExercise, isAnswerReady, correctAnswerText } from "@/lib/grade";
import { ProgressState } from "@/lib/progress";
import { displayStreak } from "@/lib/streak";
import { lessonXp, isLessonPassed } from "@/lib/xp";
import { msUntilNextHoof, formatCountdown } from "@/lib/energy";
import { Dobbin, DOBBIN_BARKS, DobbinMood } from "@/components/Dobbin";
import { QuiltBand } from "@/components/Motifs";
import { Horseshoe } from "@/components/Horseshoe";
import { MultipleChoice } from "@/components/exercises/MultipleChoice";
import { Translate } from "@/components/exercises/Translate";
import { WordBank } from "@/components/exercises/WordBank";
import { Introduce } from "@/components/exercises/Introduce";
import { Matching } from "@/components/exercises/Matching";
import { TrueFalse } from "@/components/exercises/TrueFalse";
import { phoneticFor } from "@/lib/content";
import type { ProgressActions } from "@/lib/useProgress";

type Phase = "answering" | "checked";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function LessonPlayer({
  lesson,
  progress,
  actions,
}: {
  lesson: Lesson;
  progress: ProgressState;
  actions: ProgressActions;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [value, setValue] = useState<AnswerValue | null>(null);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [bark, setBark] = useState<string>("");
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [lockedOut, setLockedOut] = useState(false);
  const [streakBefore] = useState(() => displayStreak(progress.streak));

  const stepCount = lesson.exercises.length; // includes introduce steps
  const gradableTotal = lesson.exercises.filter(isGradable).length; // scoring basis
  const exercise = lesson.exercises[index];
  const isIntro = exercise.type === "introduce";
  const hooves = progress.energy.hooves;

  // Guard: no Hooves to even start.
  if (hooves <= 0 && !done && !lockedOut && phase === "answering" && index === 0 && correctCount === 0 && mistakes === 0) {
    return <OutOfHooves progress={progress} />;
  }
  if (lockedOut) return <OutOfHooves progress={progress} />;
  if (done) {
    return (
      <LessonComplete
        lesson={lesson}
        correct={correctCount}
        mistakes={mistakes}
        total={gradableTotal}
        progress={progress}
        streakBefore={streakBefore}
      />
    );
  }

  const ready = isAnswerReady(exercise, value);

  // Advance to the next step, or finish the lesson. Shared by quiz "Continue"
  // and introduce "Got it!".
  function advance() {
    if (index + 1 >= stepCount) {
      // Only award/complete when the lesson was actually passed.
      const result = { total: gradableTotal, correct: correctCount, mistakes };
      if (isLessonPassed(result)) {
        actions.finishLesson(lesson.lesson_id, result);
      }
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setValue(null);
    setPhase("answering");
    setBark("");
  }

  function check() {
    if (!ready || phase === "checked" || isIntro) return;
    const correct = gradeExercise(exercise, value);
    setLastCorrect(correct);
    setPhase("checked");

    // Feed spaced-repetition for each vocab item this exercise practices.
    for (const vid of exercise.vocab ?? []) actions.recordVocab(vid, correct);

    if (correct) {
      setCorrectCount((c) => c + 1);
      setBark(pick(DOBBIN_BARKS.correct));
    } else {
      setMistakes((m) => m + 1);
      setBark(pick(DOBBIN_BARKS.incorrect));
      actions.mistake(); // deduct a hoof
    }
  }

  // Quiz "Continue" after checking an answer.
  function quizContinue() {
    // If that mistake emptied the stable, force a break.
    if (!lastCorrect && progress.energy.hooves <= 0) {
      setLockedOut(true);
      return;
    }
    advance();
  }

  const mood: DobbinMood = phase === "checked" ? (lastCorrect ? "correct" : "incorrect") : "idle";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-parchment">
      {/* Progress header */}
      <header className="sticky top-0 z-10 bg-parchment/95 px-4 pt-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link
            href="/"
            aria-label="Leave lesson"
            className="text-2xl text-wood-500 transition hover:text-barn-500"
          >
            ✕
          </Link>
          <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-wood-300 bg-white">
            <div
              className="h-full rounded-full bg-wheat-400 transition-all"
              style={{ width: `${(index / stepCount) * 100}%` }}
            />
          </div>
          <div className="flex items-center" title="Hooves (energy)">
            {Array.from({ length: 5 }).map((_, i) => (
              <Horseshoe key={i} filled={i < hooves} size={24} />
            ))}
          </div>
        </div>
        <div className="mx-auto mt-3 max-w-2xl">
          <QuiltBand />
        </div>
      </header>

      {/* Exercise body */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <p className="mb-2 font-body text-sm font-semibold uppercase tracking-wide text-wood-400">
          {lesson.title} · {index + 1} / {stepCount}
        </p>
        <div key={index}>
          {isIntro ? (
            <Introduce exercise={exercise} />
          ) : (
            renderExercise(exercise, value, setValue, phase === "checked", check)
          )}
        </div>
      </main>

      {/* Feedback + action footer */}
      <footer
        className={`sticky bottom-0 border-t-4 px-4 py-5 transition-colors ${
          isIntro
            ? "border-wheat-400 bg-wheat-50"
            : phase === "checked"
              ? lastCorrect
                ? "border-wheat-400 bg-wheat-50"
                : "border-barn-400 bg-barn-50"
              : "border-wood-200 bg-cream"
        }`}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          {isIntro ? (
            <>
              <p className="font-body text-sm text-wood-400">No quiz here, just meet the word. 👋</p>
              <button
                type="button"
                onClick={advance}
                className="ml-auto rounded-chunky border-4 border-wheat-600 bg-wheat-500 px-8 py-3 font-display text-lg text-white shadow-pop transition active:translate-y-1 active:shadow-none"
              >
                {index + 1 >= stepCount ? "Finish" : "Got it!"}
              </button>
            </>
          ) : (
            <>
              {phase === "checked" && (
                <div className="flex items-center gap-3">
                  <Dobbin mood={mood} size={84} variant="bust" />
                  <div>
                    <p className="font-display text-lg text-wood-800">{bark}</p>
                    {!lastCorrect && correctAnswerText(exercise) && (
                      <p className="font-body text-sm text-barn-700">
                        Answer: <span className="font-semibold">{correctAnswerText(exercise)}</span>
                        {phoneticFor(correctAnswerText(exercise)) && (
                          <span className="text-barn-500"> ({phoneticFor(correctAnswerText(exercise))})</span>
                        )}
                      </p>
                    )}
                    {!lastCorrect && exercise.type === "true_false" && exercise.explanation && (
                      <p className="font-body text-xs text-wood-500">{exercise.explanation}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="ml-auto">
                {phase === "answering" ? (
                  <button
                    type="button"
                    disabled={!ready}
                    onClick={check}
                    className="rounded-chunky border-4 border-sky-700 bg-sky-500 px-8 py-3 font-display text-lg text-white shadow-pop transition active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:border-wood-300 disabled:bg-wood-200 disabled:text-wood-400 disabled:shadow-none"
                  >
                    Check
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={quizContinue}
                    className={`rounded-chunky border-4 px-8 py-3 font-display text-lg text-white shadow-pop transition active:translate-y-1 active:shadow-none ${
                      lastCorrect
                        ? "border-wheat-600 bg-wheat-500"
                        : "border-barn-700 bg-barn-500"
                    }`}
                  >
                    {index + 1 >= stepCount ? "Finish" : "Continue"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}

function renderExercise(
  exercise: Exercise,
  value: AnswerValue | null,
  setValue: (v: AnswerValue) => void,
  checked: boolean,
  onEnter: () => void,
) {
  switch (exercise.type) {
    case "introduce":
      return <Introduce exercise={exercise} />; // handled via the isIntro branch; here for exhaustiveness
    case "multiple_choice":
      return (
        <MultipleChoice
          exercise={exercise}
          value={(value as string) ?? null}
          onChange={setValue}
          checked={checked}
        />
      );
    case "translate":
      return (
        <Translate
          exercise={exercise}
          value={(value as string) ?? null}
          onChange={setValue}
          checked={checked}
          onEnter={onEnter}
        />
      );
    case "word_bank":
      return (
        <WordBank
          exercise={exercise}
          value={(value as string[]) ?? null}
          onChange={setValue}
          checked={checked}
        />
      );
    case "matching":
      return (
        <Matching
          exercise={exercise}
          value={(value as string[]) ?? null}
          onChange={setValue}
          checked={checked}
        />
      );
    case "true_false":
      return (
        <TrueFalse
          exercise={exercise}
          value={(value as string) ?? null}
          onChange={setValue}
          checked={checked}
        />
      );
  }
}

function OutOfHooves({ progress }: { progress: ProgressState }) {
  const regen = formatCountdown(msUntilNextHoof(progress.energy));
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-parchment px-6 text-center">
      <Dobbin mood="sleepy" size={180} />
      <h1 className="font-display text-3xl text-wood-800">Dobbin&apos;s plumb tuckered out</h1>
      <p className="max-w-md font-body text-lg text-wood-600">
        Fresh out of Hooves. Dobbin&apos;s having a lie-down in the hay. The next one trots back in{" "}
        <span className="font-semibold text-barn-600">{regen}</span>. Mosey on back then and keep that
        streak alive. 🌾
      </p>
      <Link
        href="/"
        className="rounded-chunky border-4 border-wood-600 bg-wood-500 px-8 py-3 font-display text-lg text-white shadow-pop transition active:translate-y-1 active:shadow-none"
      >
        Back to the barn
      </Link>
    </div>
  );
}

function LessonComplete({
  lesson,
  correct,
  mistakes,
  total,
  progress,
  streakBefore,
}: {
  lesson: Lesson;
  correct: number;
  mistakes: number;
  total: number;
  progress: ProgressState;
  streakBefore: number;
}) {
  const result = { total, correct, mistakes };
  const passed = isLessonPassed(result);
  const streakNow = displayStreak(progress.streak);
  const advancedStreak = streakNow > streakBefore;
  const perfect = mistakes === 0 && passed;
  const earned = passed ? lessonXp(result, streakNow) : 0;

  const mood: DobbinMood = perfect || advancedStreak ? "streak" : passed ? "complete" : "incorrect";

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-parchment px-6 text-center">
      <Dobbin mood={mood} size={190} />
      <h1 className="font-display text-4xl text-wood-800">
        {perfect ? "Not a hoof wrong!" : passed ? "That'll do, Dobbin!" : "Whoa there!"}
      </h1>

      {advancedStreak && (
        <p className="rounded-full bg-barn-100 px-4 py-1 font-display text-barn-700">
          🔥 {streakNow}-day streak, and you&apos;re on a roll (a hay roll)!
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Stat label="Score" value={`${correct}/${total}`} />
        <Stat label="XP earned" value={`+${earned}`} />
        <Stat label="Hooves left" value={`${progress.energy.hooves}`} />
      </div>

      {!passed && (
        <p className="max-w-md font-body text-wood-600">
          Need 60% to pass this one. No XP yet, but nothing lost. Dust off and hop back on! 🐴
        </p>
      )}

      <div className="mt-2 flex gap-3">
        {!passed && (
          <Link
            href={`/lesson/${lesson.lesson_id}`}
            className="rounded-chunky border-4 border-sky-700 bg-sky-500 px-6 py-3 font-display text-white shadow-pop transition active:translate-y-1 active:shadow-none"
          >
            Try again
          </Link>
        )}
        <Link
          href="/"
          className="rounded-chunky border-4 border-wheat-600 bg-wheat-500 px-8 py-3 font-display text-lg text-white shadow-pop transition active:translate-y-1 active:shadow-none"
        >
          Back to the path
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[6rem] rounded-chunky border-4 border-wood-200 bg-white px-4 py-3 shadow-pop-sm">
      <div className="font-display text-2xl text-wood-800">{value}</div>
      <div className="font-body text-xs uppercase tracking-wide text-wood-400">{label}</div>
    </div>
  );
}
