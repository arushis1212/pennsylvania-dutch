"use client";

import { useEffect, useState } from "react";
import type { WordBankExercise } from "@/lib/types";

/**
 * Word-bank sentence building - tap tokens in order to assemble the sentence
 * (PRD 6.2). Tokens can repeat, so selection is tracked by bank INDEX, not by
 * string value. Parent re-keys this component per exercise, so local state
 * resets cleanly on each new question.
 */
export function WordBank({
  exercise,
  onChange,
  checked,
}: {
  exercise: WordBankExercise;
  value: string[] | null;
  onChange: (v: string[]) => void;
  checked: boolean;
}) {
  const [picked, setPicked] = useState<number[]>([]);

  useEffect(() => {
    onChange(picked.map((i) => exercise.bank[i]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  const pickedSet = new Set(picked);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-wood-800">{exercise.prompt}</h2>

      {/* Assembly line */}
      <div className="flex min-h-[4rem] flex-wrap items-center gap-2 rounded-chunky border-4 border-dashed border-wood-200 bg-cream px-3 py-3">
        {picked.length === 0 && (
          <span className="px-2 font-body text-wood-400">Tap the words below…</span>
        )}
        {picked.map((bankIdx, pos) => (
          <button
            key={`${bankIdx}-${pos}`}
            type="button"
            disabled={checked}
            onClick={() => setPicked((p) => p.filter((_, k) => k !== pos))}
            className="rounded-xl border-4 border-sky-500 bg-white px-4 py-2 font-body text-lg font-semibold text-wood-800 shadow-pop-sm"
          >
            {exercise.bank[bankIdx]}
          </button>
        ))}
      </div>

      {/* Underline showing slot count */}
      <div className="h-1 w-full rounded bg-wood-100" />

      {/* Bank */}
      <div className="flex flex-wrap gap-2">
        {exercise.bank.map((tok, i) => {
          const used = pickedSet.has(i);
          return (
            <button
              key={i}
              type="button"
              disabled={checked || used}
              onClick={() => setPicked((p) => [...p, i])}
              className={`rounded-xl border-4 px-4 py-2 font-body text-lg font-semibold shadow-pop-sm transition active:translate-y-0.5 ${
                used
                  ? "border-wood-100 bg-wood-100 text-transparent"
                  : "border-wood-200 bg-white text-wood-800 hover:border-sky-400 hover:bg-sky-50"
              }`}
            >
              {tok}
            </button>
          );
        })}
      </div>
    </div>
  );
}
