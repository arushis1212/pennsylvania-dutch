"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { VOCAB } from "@/lib/content";
import { buildReviewSession, ReviewQuestion } from "@/lib/review";
import { dueReviewVocabIds, isReviewDoneToday } from "@/lib/progress";
import { Dobbin, DobbinMood } from "@/components/Dobbin";
import { HexSign, QuiltBand } from "@/components/Motifs";

export default function ReviewPage() {
  const { state, hydrated, actions } = useProgress();
  const [session, setSession] = useState<ReviewQuestion[] | null>(null);
  const built = useRef(false);

  const doneToday = isReviewDoneToday(state);

  // Build the day's session once, after hydration (skip if already done today).
  useEffect(() => {
    if (!hydrated || built.current || doneToday) return;
    built.current = true;
    const ids = dueReviewVocabIds(state, Date.now(), 6);
    // Distractors only pull from vocab the learner has already encountered (has
    // a card for), so review never forward-references unlearned content.
    const knownVocab = VOCAB.filter((v) => state.cards[v.id]);
    setSession(buildReviewSession(ids, knownVocab));
  }, [hydrated, doneToday, state]);

  return (
    <div className="min-h-[100dvh] bg-parchment">
      <header className="sticky top-0 z-10 border-b-4 border-wood-300 bg-cream/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link href="/" aria-label="Back home" className="text-2xl text-wood-500 hover:text-barn-500">
            ✕
          </Link>
          <h1 className="font-display text-2xl text-barn-600">Daily Hex</h1>
          <span className="ml-auto font-body text-sm text-wood-400">daily review</span>
        </div>
        <div className="mx-auto mt-3 max-w-2xl">
          <QuiltBand />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {!hydrated ? (
          <div className="flex flex-col items-center gap-3">
            <Dobbin mood="thinking" size={120} />
            <p className="animate-pulse text-center font-display text-xl text-wood-400">Fetching the hay…</p>
          </div>
        ) : doneToday ? (
          <DoneToday collection={state.hexCollection.length} />
        ) : session && session.length > 0 ? (
          <ReviewGame session={session} actions={actions} />
        ) : (
          <EmptyReview />
        )}
      </main>
    </div>
  );
}

function ReviewGame({
  session,
  actions,
}: {
  session: ReviewQuestion[];
  actions: ReturnType<typeof useProgress>["actions"];
}) {
  const total = session.length;
  const [queue, setQueue] = useState<ReviewQuestion[]>(session);
  const [selected, setSelected] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [phase, setPhase] = useState<"answering" | "feedback" | "done">("answering");
  const awarded = useRef(false);

  const filled = total - queue.length; // segments completed = cards cleared
  const current = queue[0];

  // Award + save the hex exactly once when the deck is cleared.
  useEffect(() => {
    if (phase === "done" && !awarded.current) {
      awarded.current = true;
      actions.finishReview(total);
    }
  }, [phase, total, actions]);

  function choose(opt: string) {
    if (phase !== "answering") return;
    const correct = opt === current.answer;
    setSelected(opt);
    setLastCorrect(correct);
    setPhase("feedback");
    actions.recordVocab(current.vocabId, correct);

    window.setTimeout(() => {
      setQueue((q) => {
        const [head, ...rest] = q;
        const nextQ = correct ? rest : [...rest, head]; // requeue if wrong
        if (nextQ.length === 0) setPhase("done");
        else setPhase("answering");
        return nextQ;
      });
      setSelected(null);
    }, 850);
  }

  if (phase === "done") {
    return <Completed total={total} />;
  }

  const mood: DobbinMood = phase === "feedback" ? (lastCorrect ? "correct" : "incorrect") : "idle";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <HexSign segments={total} filled={filled} size={140} />
        <div className="text-left">
          <Dobbin mood={mood} size={84} variant="bust" />
          <p className="font-display text-lg text-wood-700">
            {filled} / {total} segments
          </p>
        </div>
      </div>

      <div className="w-full rounded-chunky border-4 border-wood-200 bg-white px-6 py-5 text-center shadow-pop-sm">
        <p className="font-body text-sm uppercase tracking-wide text-wood-400">What does this mean?</p>
        <p className="mt-1 font-display text-3xl text-wood-800">{current.deitsh}</p>
        <p className="font-body text-wood-400">{current.phonetic}</p>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {current.options.map((opt) => {
          const isSel = selected === opt;
          const isAns = opt === current.answer;
          let tone = "border-wood-200 bg-white hover:border-sky-400 hover:bg-sky-50";
          if (phase === "feedback" && isSel && isAns) tone = "border-wheat-500 bg-wheat-100";
          else if (phase === "feedback" && isSel && !isAns) tone = "border-barn-500 bg-barn-100";
          else if (phase === "feedback" && isAns) tone = "border-wheat-500 bg-wheat-50";
          return (
            <button
              key={opt}
              type="button"
              disabled={phase !== "answering"}
              onClick={() => choose(opt)}
              className={`rounded-chunky border-4 px-5 py-4 text-center font-body text-lg font-semibold text-wood-800 shadow-pop-sm transition active:translate-y-0.5 disabled:cursor-default ${tone}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <p className="font-body text-sm text-wood-400">
        No Hooves at stake here. Wrong ones just come back around. 🌾
      </p>
    </div>
  );
}

function Completed({ total }: { total: number }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <HexSign segments={total} filled={total} size={200} className="animate-pop" />
      <Dobbin mood="complete" size={120} />
      <h2 className="font-display text-3xl text-wood-800">Hex complete! 🌟</h2>
      <p className="max-w-md font-body text-wood-600">
        You colored in every segment. That&apos;s today&apos;s review done and dusted. Fresh hex saved
        to your collection, and your streak thanks you.
      </p>
      <Link
        href="/"
        className="rounded-chunky border-4 border-wheat-600 bg-wheat-500 px-8 py-3 font-display text-lg text-white shadow-pop transition active:translate-y-1 active:shadow-none"
      >
        Back to the path
      </Link>
    </div>
  );
}

function DoneToday({ collection }: { collection: number }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <HexSign segments={6} filled={6} size={180} />
      <Dobbin mood="idle" size={110} />
      <h2 className="font-display text-3xl text-wood-800">Today&apos;s hex is done!</h2>
      <p className="max-w-md font-body text-wood-600">
        You&apos;ve already colored today&apos;s Daily Hex. That&apos;s {collection} in your collection so far. Come
        back tomorrow for a fresh one and keep the streak rolling.
      </p>
      <Link
        href="/"
        className="rounded-chunky border-4 border-wheat-600 bg-wheat-500 px-8 py-3 font-display text-lg text-white shadow-pop transition active:translate-y-1 active:shadow-none"
      >
        Back to the path
      </Link>
    </div>
  );
}

function EmptyReview() {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <HexSign segments={6} filled={0} size={180} />
      <Dobbin mood="idle" size={110} />
      <h2 className="font-display text-3xl text-wood-800">Nothing to review yet</h2>
      <p className="max-w-md font-body text-wood-600">
        Play a lesson or two first. The words you learn will start showing up here as Daily Hex
        segments to color in.
      </p>
      <Link
        href="/"
        className="rounded-chunky border-4 border-sky-700 bg-sky-500 px-8 py-3 font-display text-lg text-white shadow-pop transition active:translate-y-1 active:shadow-none"
      >
        Go learn some words
      </Link>
    </div>
  );
}
