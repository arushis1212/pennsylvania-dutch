"use client";

import type { TrueFalseExercise } from "@/lib/types";

/** True/False grammar check - a short statement, judged True or False. */
export function TrueFalse({
  exercise,
  value,
  onChange,
  checked,
}: {
  exercise: TrueFalseExercise;
  value: string | null;
  onChange: (v: string) => void;
  checked: boolean;
}) {
  const options: { label: string; val: string }[] = [
    { label: "Waahr (True)", val: "true" },
    { label: "Falsch (False)", val: "false" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-wood-800">{exercise.prompt}</h2>

      <div className="rounded-chunky border-4 border-wood-200 bg-white px-6 py-6 text-center shadow-pop-sm">
        <p className="font-display text-2xl text-wood-800">{exercise.statement}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => {
          const selected = value === o.val;
          const isAnswer = o.val === String(exercise.answer);
          let tone = "border-wood-200 bg-white hover:border-sky-400 hover:bg-sky-50";
          if (checked && selected && isAnswer) tone = "border-wheat-500 bg-wheat-100";
          else if (checked && selected && !isAnswer) tone = "border-barn-500 bg-barn-100";
          else if (checked && isAnswer) tone = "border-wheat-500 bg-wheat-50";
          else if (selected) tone = "border-sky-500 bg-sky-100";

          return (
            <button
              key={o.val}
              type="button"
              disabled={checked}
              onClick={() => onChange(o.val)}
              className={`rounded-chunky border-4 px-5 py-5 text-center font-display text-xl text-wood-800 shadow-pop-sm transition active:translate-y-0.5 ${tone}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
