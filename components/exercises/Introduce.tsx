"use client";

import type { IntroduceExercise } from "@/lib/types";
import { Dobbin } from "@/components/Dobbin";

/**
 * Introduce - a no-pressure presentation of a NEW word (PRD 6.2 pedagogy rule:
 * teach before testing). Shows the Deitsh word, its phonetic respelling, and its
 * English meaning. No answer, no grading - Dobbin just says hi to the word.
 */
export function Introduce({ exercise }: { exercise: IntroduceExercise }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span className="rounded-full bg-wheat-100 px-4 py-1 font-display text-sm uppercase tracking-wide text-wood-500">
        ✨ New word
      </span>

      <Dobbin mood="wave" size={120} />

      <div className="w-full max-w-md rounded-chunky border-4 border-wheat-500 bg-white px-8 py-7 shadow-pop">
        <div className="font-display text-4xl leading-tight text-wood-800">{exercise.word}</div>
        <div className="mt-1 font-body text-lg text-wood-400">{exercise.phonetic}</div>
        <div className="mx-auto my-4 h-1 w-16 rounded bg-wheat-300" />
        <div className="font-body text-xl font-semibold text-wood-700">{exercise.meaning}</div>
      </div>

      <p className="font-body text-wood-400">
        Dobbin says: give it a read out loud (nobody&apos;s watching). 🐴
      </p>
    </div>
  );
}
