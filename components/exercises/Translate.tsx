"use client";

import type { TranslateExercise } from "@/lib/types";

/** Typed-answer translation exercise. Text-only (no audio). */
export function Translate({
  exercise,
  value,
  onChange,
  checked,
  onEnter,
}: {
  exercise: TranslateExercise;
  value: string | null;
  onChange: (v: string) => void;
  checked: boolean;
  onEnter?: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-wood-800">{exercise.prompt}</h2>

      <input
        type="text"
        autoFocus
        disabled={checked}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) onEnter();
        }}
        placeholder="Type your answer…"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full rounded-chunky border-4 border-wood-200 bg-white px-5 py-4 font-body text-lg text-wood-800 shadow-pop-sm outline-none focus:border-sky-500 disabled:bg-cream"
      />
    </div>
  );
}
