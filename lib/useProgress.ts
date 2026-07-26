"use client";

/**
 * React binding for the progress store. Holds the ProgressState in component
 * state, persists every mutation to localStorage, and re-resolves time-based
 * Hoof regen on a light interval so the UI countdown stays live.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ProgressState,
  loadProgress,
  saveProgress,
  applyMistake,
  applyVocabResult,
  completeLesson,
  completeDailyReview,
  setDailyGoal,
  resetProgress,
  defaultProgress,
} from "./progress";
import { resolveEnergy } from "./energy";
import type { LessonResult } from "./xp";

export function useProgress() {
  // Start from a deterministic default so server + first client render match;
  // hydrate from localStorage in an effect to avoid SSR mismatch.
  const [state, setState] = useState<ProgressState>(() => defaultProgress());
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    setState(loadProgress());
    setHydrated(true);
  }, []);

  // Commit helper: apply a pure transition, persist, and re-render.
  const commit = useCallback((next: ProgressState) => {
    stateRef.current = next;
    saveProgress(next);
    setState(next);
  }, []);

  // Keep Hoof regen fresh: re-resolve energy once a minute.
  useEffect(() => {
    if (!hydrated) return;
    const tick = () => {
      const cur = stateRef.current;
      const energy = resolveEnergy(cur.energy);
      if (energy.hooves !== cur.energy.hooves || energy.updatedAt !== cur.energy.updatedAt) {
        commit({ ...cur, energy });
      }
    };
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [hydrated, commit]);

  const actions = {
    mistake: () => commit(applyMistake(stateRef.current)),
    recordVocab: (vocabId: string, correct: boolean) =>
      commit(applyVocabResult(stateRef.current, vocabId, correct)),
    finishLesson: (lessonId: string, result: LessonResult) =>
      commit(completeLesson(stateRef.current, lessonId, result)),
    finishReview: (segments: number) =>
      commit(completeDailyReview(stateRef.current, segments)),
    setGoal: (target: number) => commit(setDailyGoal(stateRef.current, target)),
    reset: () => commit(resetProgress()),
  };

  return { state, hydrated, actions };
}

export type ProgressActions = ReturnType<typeof useProgress>["actions"];
