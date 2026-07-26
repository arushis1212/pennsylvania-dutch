"use client";

import Link from "next/link";
import { ProgressState } from "@/lib/progress";
import { StatsBar } from "@/components/StatsBar";
import { Dobbin } from "@/components/Dobbin";

export function AppHeader({ state }: { state: ProgressState }) {
  return (
    <header className="sticky top-0 z-20 border-b-4 border-wood-300 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <Link href="/" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <Dobbin mood="idle" size={40} variant="bust" className="shrink-0" />
          <span className="truncate font-display text-base text-barn-600 sm:text-2xl">DeitschLingo</span>
        </Link>
        <StatsBar state={state} />
      </div>
    </header>
  );
}
