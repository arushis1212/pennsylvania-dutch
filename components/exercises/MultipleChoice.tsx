"use client";

import type { MultipleChoiceExercise } from "@/lib/types";
import { phoneticFor } from "@/lib/content";

/** Controlled multiple-choice exercise (word/phrase match). Text-only. */
export function MultipleChoice({
  exercise,
  value,
  onChange,
  checked,
}: {
  exercise: MultipleChoiceExercise;
  value: string | null;
  onChange: (v: string) => void;
  checked: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-wood-800">{exercise.prompt}</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {exercise.options.map((opt) => {
          const selected = value === opt;
          const isAnswer = opt === exercise.answer;
          const phonetic = phoneticFor(opt); // pronunciation guide in place of audio
          let tone = "border-wood-200 bg-white hover:border-sky-400 hover:bg-sky-50";
          if (checked && selected && isAnswer) tone = "border-wheat-500 bg-wheat-100";
          else if (checked && selected && !isAnswer) tone = "border-barn-500 bg-barn-100";
          else if (checked && isAnswer) tone = "border-wheat-500 bg-wheat-50";
          else if (selected) tone = "border-sky-500 bg-sky-100";

          return (
            <button
              key={opt}
              type="button"
              disabled={checked}
              onClick={() => onChange(opt)}
              className={`rounded-chunky border-4 px-5 py-4 text-left font-body text-lg font-semibold text-wood-800 shadow-pop-sm transition active:translate-y-0.5 disabled:cursor-default ${tone}`}
            >
              {opt}
              {phonetic && (
                <span className="mt-0.5 block text-sm font-normal text-wood-400">{phonetic}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
