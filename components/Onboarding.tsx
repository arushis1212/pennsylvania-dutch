"use client";

import { useState } from "react";
import { Dobbin } from "@/components/Dobbin";
import { HexSign } from "@/components/Motifs";
import { Horseshoe } from "@/components/Horseshoe";

/**
 * First-run onboarding: a short 3-screen intro shown once to brand-new learners
 * before the dashboard, explaining the streak / XP / Hooves loop and the Daily
 * Hex. Dismissal is persisted by the caller (localStorage flag).
 */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const last = 2;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-wood-800/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full min-w-0 max-w-md rounded-chunky border-4 border-wood-300 bg-cream p-6 shadow-card">
        {step === 0 && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Dobbin mood="wave" size={128} />
            <h2 className="break-words font-display text-2xl leading-tight text-barn-600">Willkumm to DeitschLingo!</h2>
            <p className="font-body text-wood-600">
              You&apos;re about to pick up real Pennsylvania Dutch (Deitsch), a few minutes a day.
              Here&apos;s how it works.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-center font-display text-2xl text-wood-800">The daily loop</h2>
            <Row emoji="🔥" title="Streak">
              Learn a little every day to grow your streak. Days opened matters more than speed.
            </Row>
            <Row emoji="🌾" title="XP">
              Earn XP for every answer and aim for your daily goal.
            </Row>
            <div className="flex items-start gap-3 rounded-chunky border-2 border-wood-200 bg-white px-4 py-3">
              <div className="flex shrink-0">
                <Horseshoe filled size={24} />
                <Horseshoe filled size={24} />
                <Horseshoe filled size={24} />
              </div>
              <p className="font-body text-sm text-wood-600">
                <span className="font-display text-wood-800">Hooves</span> are your energy. A wrong
                answer costs one, and they refill slowly over a few hours, so you can&apos;t binge the
                whole barn in one sitting.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center gap-4 text-center">
            <HexSign segments={6} filled={4} size={130} />
            <h2 className="font-display text-2xl text-wood-800">The Daily Hex</h2>
            <p className="font-body text-wood-600">
              Each day, the words you&apos;ve learned come back as the Daily Hex. Answer a few review
              questions to color in the hex sign. It&apos;s how the words actually stick.
            </p>
          </div>
        )}

        {/* progress dots */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${i === step ? "bg-barn-500" : "bg-wood-200"}`}
            />
          ))}
        </div>

        {/* actions */}
        <div className="mt-5 flex items-center justify-between gap-3">
          {step === 0 ? (
            <button
              type="button"
              onClick={onDone}
              className="font-body text-sm text-wood-400 underline-offset-2 hover:underline"
            >
              Skip
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="font-body text-sm font-semibold text-wood-500 hover:text-wood-700"
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={() => (step === last ? onDone() : setStep((s) => s + 1))}
            className="rounded-chunky border-4 border-barn-700 bg-barn-500 px-7 py-3 font-display text-lg text-white shadow-pop transition active:translate-y-1 active:shadow-none"
          >
            {step === last ? "Los geht's!" : "Next"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

function Row({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-chunky border-2 border-wood-200 bg-white px-4 py-3">
      <span className="text-2xl leading-none">{emoji}</span>
      <p className="font-body text-sm text-wood-600">
        <span className="font-display text-wood-800">{title}</span> {children}
      </p>
    </div>
  );
}
