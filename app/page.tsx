"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { AppHeader } from "@/components/AppHeader";
import { DailyGoal } from "@/components/DailyGoal";
import { LearningPath } from "@/components/LearningPath";
import { Dobbin } from "@/components/Dobbin";
import { HexSign } from "@/components/Motifs";
import { Onboarding } from "@/components/Onboarding";
import { isReviewDoneToday } from "@/lib/progress";

const ONBOARDED_KEY = "deitsh.onboarded.v1";

export default function HomePage() {
  const { state, actions } = useProgress();
  const reviewDone = isReviewDoneToday(state);

  // Show the first-run onboarding once (client-only, to avoid SSR mismatch).
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDED_KEY)) setShowOnboarding(true);
    } catch {
      /* storage disabled - just skip onboarding */
    }
  }, []);
  const finishOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDED_KEY, "1");
    } catch {
      /* ignore */
    }
    setShowOnboarding(false);
  };

  // The Daily Hex only has something to review once the learner has met at
  // least one word (a card exists). Before that, show an empty/locked state
  // instead of an inviting "Start" that dead-ends on "Nothing to review yet".
  const canReview = Object.keys(state.cards).length > 0;

  return (
    <div className="min-h-[100dvh]">
      {showOnboarding && <Onboarding onDone={finishOnboarding} />}
      <AppHeader state={state} />

      <section className="mx-auto max-w-2xl px-4 pt-6">
        {/* Hero */}
        <div className="flex items-center gap-4 rounded-chunky border-4 border-sky-600 bg-sky-500 px-5 py-5 text-white shadow-card">
          <Dobbin mood="wave" size={104} className="shrink-0" />
          <div>
            <h1 className="font-display text-3xl leading-tight">Trot your way to Deitsch.</h1>
            <p className="mt-1 font-body text-white/90">
              Learn a little Pennsylvania Dutch every day. Guided by Dobbin, a horse who cannot
              speak Deitsch, but really wants you to.
            </p>
          </div>
        </div>

        {/* Daily Hex entry (the spaced-repetition review) */}
        {canReview ? (
          <Link
            href="/review"
            className="mt-4 flex items-center gap-4 rounded-chunky border-4 border-wheat-500 bg-wheat-50 px-5 py-4 shadow-pop-sm transition active:translate-y-0.5 hover:border-wheat-600"
          >
            <HexSign segments={6} filled={reviewDone ? 6 : 2} size={60} />
            <div className="flex-1">
              <h3 className="font-display text-xl text-wood-800">Daily Hex</h3>
              <p className="font-body text-sm text-wood-500">
                {reviewDone
                  ? "Today's hex is colored in. Nice! Come back tomorrow."
                  : "Color in today's hex by reviewing your words."}
              </p>
            </div>
            <span className="font-body text-sm font-semibold text-barn-600">
              {reviewDone ? "Done ✓" : "Start →"}
            </span>
          </Link>
        ) : (
          <div
            className="mt-4 flex items-center gap-4 rounded-chunky border-4 border-dashed border-wood-200 bg-cream/70 px-5 py-4"
            aria-disabled="true"
          >
            <div className="opacity-50 grayscale">
              <HexSign segments={6} filled={0} size={60} />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl text-wood-500">Daily Hex</h3>
              <p className="font-body text-sm text-wood-400">
                Complete a lesson first to unlock today&apos;s Hex.
              </p>
            </div>
            <span className="font-body text-sm font-semibold text-wood-400">🔒</span>
          </div>
        )}

        <div className="mt-4">
          <DailyGoal state={state} actions={actions} />
        </div>
      </section>

      <div className="mt-6">
        <LearningPath progress={state} />
      </div>
    </div>
  );
}
