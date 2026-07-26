"use client";

import { use } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { getLesson } from "@/lib/content";
import { LessonPlayer } from "@/components/LessonPlayer";
import { Dobbin } from "@/components/Dobbin";

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const { state, hydrated, actions } = useProgress();
  const lesson = getLesson(lessonId);

  if (!lesson) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-parchment px-6 text-center">
        <h1 className="font-display text-3xl text-wood-800">Lesson not found</h1>
        <p className="font-body text-wood-500">We couldn&apos;t find &ldquo;{lessonId}&rdquo;.</p>
        <Link
          href="/"
          className="rounded-chunky border-4 border-wheat-600 bg-wheat-500 px-6 py-3 font-display text-white shadow-pop"
        >
          Back to the path
        </Link>
      </div>
    );
  }

  // Wait for localStorage hydration so Hooves/streak reflect real progress
  // before the player makes its out-of-Hooves / scoring decisions.
  if (!hydrated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-parchment">
        <Dobbin mood="thinking" size={120} />
        <p className="animate-pulse font-display text-xl text-wood-400">Hitching up the buggy…</p>
      </div>
    );
  }

  return <LessonPlayer lesson={lesson} progress={state} actions={actions} />;
}
