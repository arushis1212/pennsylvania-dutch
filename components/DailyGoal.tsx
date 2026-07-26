"use client";

import { ProgressState } from "@/lib/progress";
import { DAILY_GOAL_PRESETS } from "@/lib/xp";
import type { ProgressActions } from "@/lib/useProgress";

/**
 * Daily XP goal + today's progress toward it. Framing centers on "days opened
 * per week," not finishing fast (PRD 6.3).
 */
export function DailyGoal({ state, actions }: { state: ProgressState; actions: ProgressActions }) {
  const pct = Math.min(100, state.dailyGoalTarget > 0 ? (state.dailyXp / state.dailyGoalTarget) * 100 : 0);
  const met = state.dailyXp >= state.dailyGoalTarget;

  return (
    <div className="rounded-chunky border-4 border-wheat-500 bg-wheat-50 px-5 py-4 shadow-pop-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-wood-800">Today&apos;s goal</h3>
        <span className="font-body text-sm font-semibold text-wood-600">
          {state.dailyXp} / {state.dailyGoalTarget} XP {met && "🎉"}
        </span>
      </div>

      <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-2 border-wheat-500 bg-white">
        <div className="h-full rounded-full bg-wheat-400 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {DAILY_GOAL_PRESETS.map((g) => (
          <button
            key={g.target}
            type="button"
            onClick={() => actions.setGoal(g.target)}
            className={`rounded-full border-2 px-3 py-1 font-body text-sm font-semibold transition ${
              state.dailyGoalTarget === g.target
                ? "border-barn-600 bg-barn-500 text-white"
                : "border-wood-300 bg-white text-wood-600 hover:border-barn-400"
            }`}
          >
            {g.label} · {g.target}
          </button>
        ))}
      </div>
    </div>
  );
}
