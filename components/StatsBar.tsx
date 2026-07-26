"use client";

import { ProgressState } from "@/lib/progress";
import { MAX_HOOVES, msUntilNextHoof, formatCountdown } from "@/lib/energy";
import { displayStreak } from "@/lib/streak";
import { Horseshoe } from "@/components/Horseshoe";

export function StatsBar({ state }: { state: ProgressState }) {
  const streak = displayStreak(state.streak);
  const regenMs = msUntilNextHoof(state.energy);

  return (
    <div className="flex shrink-0 items-center gap-2 font-body text-wood-800 sm:gap-4">
      {/* Streak */}
      <div className="flex items-center gap-1" title="Daily streak">
        <span className="text-lg sm:text-xl">🔥</span>
        <span className="font-display text-base sm:text-lg">{streak}</span>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1" title="Total XP">
        <span className="text-lg sm:text-xl">🌾</span>
        <span className="font-display text-base sm:text-lg">{state.xp}</span>
      </div>

      {/* Hooves */}
      <div className="flex items-center gap-1" title="Hooves (energy)">
        <div className="flex">
          {Array.from({ length: MAX_HOOVES }).map((_, i) => (
            <Horseshoe key={i} filled={i < state.energy.hooves} size={18} />
          ))}
        </div>
        {state.energy.hooves < MAX_HOOVES && (
          <span className="ml-1 hidden text-xs font-medium text-wood-500 sm:inline">
            +1 in {formatCountdown(regenMs)}
          </span>
        )}
      </div>
    </div>
  );
}
