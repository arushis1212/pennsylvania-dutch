"use client";

import { useEffect, useMemo, useState } from "react";
import type { MatchingExercise } from "@/lib/types";
import { phoneticFor } from "@/lib/content";

/**
 * Vocabulary Matching - two-column tap-to-pair. Tap a Deitsh word, then its
 * English meaning; correct pairs lock in, wrong pairs flash and clear. The
 * exercise is "done" (and correct) once every pair is matched. Parent re-keys
 * this per exercise, so shuffle + state reset cleanly.
 */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Matching({
  exercise,
  onChange,
  checked,
}: {
  exercise: MatchingExercise;
  value: string[] | null;
  onChange: (v: string[]) => void;
  checked: boolean;
}) {
  // Each column shows pair indices in an independent shuffled order.
  const leftOrder = useMemo(() => shuffle(exercise.pairs.map((_, i) => i)), [exercise]);
  const rightOrder = useMemo(() => shuffle(exercise.pairs.map((_, i) => i)), [exercise]);

  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [selRight, setSelRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<[number, number] | null>(null);

  useEffect(() => {
    onChange([...matched].map((i) => exercise.pairs[i].deitsh));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  // When both sides are selected, resolve the attempt.
  useEffect(() => {
    if (selLeft == null || selRight == null) return;
    if (selLeft === selRight) {
      setMatched((m) => new Set(m).add(selLeft));
      setSelLeft(null);
      setSelRight(null);
    } else {
      const pair: [number, number] = [selLeft, selRight];
      setWrong(pair);
      const t = setTimeout(() => {
        setWrong(null);
        setSelLeft(null);
        setSelRight(null);
      }, 550);
      return () => clearTimeout(t);
    }
  }, [selLeft, selRight]);

  function tone(side: "L" | "R", pairIdx: number, selected: boolean) {
    if (matched.has(pairIdx)) return "border-wheat-500 bg-wheat-100 text-wood-400";
    if (wrong && ((side === "L" && wrong[0] === pairIdx) || (side === "R" && wrong[1] === pairIdx)))
      return "border-barn-500 bg-barn-100";
    if (selected) return "border-sky-500 bg-sky-100";
    return "border-wood-200 bg-white hover:border-sky-400 hover:bg-sky-50";
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-wood-800">{exercise.prompt}</h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Deitsh column */}
        <div className="flex flex-col gap-3">
          {leftOrder.map((pairIdx) => {
            const done = matched.has(pairIdx);
            const p = exercise.pairs[pairIdx];
            const ph = phoneticFor(p.deitsh);
            return (
              <button
                key={pairIdx}
                type="button"
                disabled={checked || done}
                onClick={() => setSelLeft(pairIdx)}
                className={`rounded-chunky border-4 px-4 py-3 text-left font-body text-lg font-semibold text-wood-800 shadow-pop-sm transition active:translate-y-0.5 ${tone("L", pairIdx, selLeft === pairIdx)}`}
              >
                {p.deitsh}
                {ph && <span className="mt-0.5 block text-sm font-normal text-wood-400">{ph}</span>}
              </button>
            );
          })}
        </div>

        {/* English column */}
        <div className="flex flex-col gap-3">
          {rightOrder.map((pairIdx) => {
            const done = matched.has(pairIdx);
            const p = exercise.pairs[pairIdx];
            return (
              <button
                key={pairIdx}
                type="button"
                disabled={checked || done}
                onClick={() => setSelRight(pairIdx)}
                className={`rounded-chunky border-4 px-4 py-3 text-left font-body text-lg font-semibold text-wood-800 shadow-pop-sm transition active:translate-y-0.5 ${tone("R", pairIdx, selRight === pairIdx)}`}
              >
                {p.english}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center font-body text-sm text-wood-400">
        {matched.size} / {exercise.pairs.length} paired
      </p>
    </div>
  );
}
