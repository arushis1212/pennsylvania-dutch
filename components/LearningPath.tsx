"use client";

import { Fragment } from "react";
import Link from "next/link";
import { UNITS } from "@/content/units";
import { getLessonsForUnit, vocabIdsForUnit } from "@/lib/content";
import { ProgressState, unitMastery } from "@/lib/progress";
import { MOTIF_ICONS, MotifKey, HexSign, QuiltBand } from "@/components/Motifs";
import type { Lesson, UnitMeta } from "@/lib/types";

// Place icons walked along a unit's trail (one per lesson stop, cycled).
const LESSON_STOP_ICONS: MotifKey[] = ["barn", "garden", "loom", "waterwheel", "windmill", "quilt", "churn"];

// Horizontal offset (px from center) per stop - a LOOSE zigzag with varied
// magnitudes so the trail meanders like a hand-drawn wagon road rather than a
// rigid geometric wave. Cycles if there are more stops than entries.
const STOP_OFFSETS = [-58, 66, -74, 44, -62, 78, -50, 70, -80, 52, -64, 72];
const stopOffset = (i: number) => STOP_OFFSETS[i % STOP_OFFSETS.length];

type Availability = "available" | "locked" | "coming_soon";

/** Live availability of a unit: content + the review-accuracy unlock gate. */
function unitAvailability(unit: UnitMeta, progress: ProgressState): Availability {
  if (getLessonsForUnit(unit.id).length === 0) return "coming_soon";
  if (!unit.unlockAfter) return "available";
  return gateMet(progress, unit.unlockAfter, unit.unlockAccuracy ?? 0) ? "available" : "locked";
}

/** Has the learner mastered the prior unit to the required threshold? */
function gateMet(progress: ProgressState, priorUnitId: string, threshold: number): boolean {
  return unitMastery(progress, vocabIdsForUnit(priorUnitId)) >= threshold;
}

/** Progress (0-1) toward a unit's unlock gate, for the locked-state meter. */
function gateProgress(progress: ProgressState, priorUnitId: string, threshold: number): number {
  const mastery = unitMastery(progress, vocabIdsForUnit(priorUnitId));
  return Math.min(1, mastery / (threshold || 1));
}

export function LearningPath({ progress }: { progress: ProgressState }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24">
      {UNITS.map((unit, i) => (
        <UnitSection key={unit.id} unit={unit} unitNumber={i + 1} progress={progress} />
      ))}

      {/* Tucked-away factual note (not a prominent callout) */}
      <p className="mx-auto mt-10 max-w-xl text-center font-body text-xs leading-relaxed text-wood-300">
        PA Dutch has no single standard spelling, so we teach one common phonetic version. The
        pronunciation guides in parentheses stand in for audio. Content is community-review pending.
      </p>
    </div>
  );
}

function UnitSection({
  unit,
  unitNumber,
  progress,
}: {
  unit: UnitMeta;
  unitNumber: number;
  progress: ProgressState;
}) {
  const avail = unitAvailability(unit, progress);
  const lessons = getLessonsForUnit(unit.id);
  const doneCount = lessons.filter((l) => progress.completedLessons.includes(l.lesson_id)).length;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const Icon = MOTIF_ICONS[unit.motif];

  return (
    <section className="mt-12 first:mt-6">
      {/* Unit banner */}
      <div
        className={`relative overflow-hidden rounded-chunky border-4 shadow-card ${
          avail === "available"
            ? "border-barn-700 bg-barn-500 text-white"
            : "border-wood-300 bg-wood-100 text-wood-500"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-chunky ${
              avail === "available" ? "bg-white/90" : "bg-white/70"
            }`}
          >
            <Icon size={42} />
          </div>
          <div className="flex-1">
            <p
              className={`font-body text-xs font-semibold uppercase tracking-widest ${
                avail === "available" ? "text-white/80" : "text-wood-400"
              }`}
            >
              Unit {unitNumber}
            </p>
            <h2 className="font-display text-2xl leading-tight">{unit.title}</h2>
          </div>
          {avail === "available" ? (
            <span className="font-display text-lg">{pct}%</span>
          ) : (
            <span className="text-xl">{avail === "coming_soon" ? "🚧" : "🔒"}</span>
          )}
        </div>
        {avail === "available" && (
          <div className="px-5 pb-4">
            <div className="h-3 w-full overflow-hidden rounded-full border-2 border-white/40 bg-white/25">
              <div className="h-full rounded-full bg-wheat-400 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
        <QuiltBand />
      </div>

      {avail === "available" ? (
        <UnitTrail lessons={lessons} progress={progress} />
      ) : avail === "locked" ? (
        <LockedNote unit={unit} progress={progress} />
      ) : (
        <ComingSoonNote blurb={unit.blurb} />
      )}
    </section>
  );
}

/**
 * The zigzag trail of lesson stops for one unit. The trail runs unbroken between
 * stops; only milestone lessons get a labeled signpost (ordinary sub-unit labels
 * are omitted to keep the path uncluttered - sub-units still organize content
 * via each lesson's `subUnit`, they're just not chipped onto the map).
 */
function UnitTrail({ lessons, progress }: { lessons: Lesson[]; progress: ProgressState }) {
  return (
    <ol className="relative mt-6 flex flex-col items-center">
      {lessons.map((lesson, i) => {
        const done = progress.completedLessons.includes(lesson.lesson_id);
        return (
          <Fragment key={lesson.lesson_id}>
            {i === 0 ? null : lesson.milestone ? (
              <MilestoneSignpost label={lesson.subUnit ?? "Milestone"} />
            ) : (
              <TrailCurve
                grown={progress.completedLessons.includes(lessons[i - 1].lesson_id)}
                fromOffset={stopOffset(i - 1)}
                toOffset={stopOffset(i)}
              />
            )}
            <li
              className="relative z-10 flex flex-col items-center"
              style={{ transform: `translateX(${stopOffset(i)}px)` }}
            >
              <LessonStop lesson={lesson} index={i} done={done} />
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}

function MilestoneSignpost({ label }: { label: string }) {
  return (
    <div className="relative z-10 mb-1 mt-4">
      <span className="rounded-full border-2 border-sky-300 bg-cream px-4 py-1 font-display text-sm uppercase tracking-wide text-sky-700 shadow-sm">
        {label}
      </span>
    </div>
  );
}

/**
 * The curvy connector between two stops. Draws an organic bezier "wagon trail"
 * from the previous stop's horizontal offset to the next's, so the road snakes
 * as the stops zigzag. `grown` (preceding lesson completed) → a packed-earth
 * road bed with two dashed wagon-wheel ruts; otherwise a faint dotted "road
 * ahead". The trail therefore grows behind the learner as they progress.
 */
function TrailCurve({
  grown,
  fromOffset,
  toOffset,
}: {
  grown: boolean;
  fromOffset: number;
  toOffset: number;
}) {
  const W = 300;
  const H = 108;
  const cx = W / 2;
  const x0 = cx + fromOffset;
  const x1 = cx + toOffset;
  const d = `M ${x0} 4 C ${x0} ${Math.round(H * 0.4)}, ${x1} ${Math.round(H * 0.62)}, ${x1} ${H - 4}`;

  return (
    <li aria-hidden="true" className="relative z-0 -my-3 flex w-full justify-center">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {grown ? (
          <g strokeLinecap="round" fill="none">
            <path d={d} stroke="#d8b98e" strokeWidth={16} />
            <path d={d} stroke="#9c6b38" strokeWidth={2.5} strokeDasharray="3 8" opacity="0.75" transform="translate(-5,0)" />
            <path d={d} stroke="#9c6b38" strokeWidth={2.5} strokeDasharray="3 8" opacity="0.75" transform="translate(5,0)" />
          </g>
        ) : (
          <path d={d} fill="none" stroke="#dcc7a3" strokeWidth={3.5} strokeDasharray="2 11" strokeLinecap="round" />
        )}
      </svg>
    </li>
  );
}

function LessonStop({ lesson, index, done }: { lesson: Lesson; index: number; done: boolean }) {
  const isMilestone = Boolean(lesson.milestone);
  const Icon = MOTIF_ICONS[LESSON_STOP_ICONS[index % LESSON_STOP_ICONS.length]];

  return (
    <Link href={`/lesson/${lesson.lesson_id}`} className="group flex flex-col items-center gap-1.5">
      <span
        className={`flex h-24 w-24 items-center justify-center rounded-full border-[6px] bg-cream shadow-pop transition group-active:translate-y-1 group-active:shadow-none ${
          done ? "border-wheat-500" : isMilestone ? "border-sky-600" : "border-barn-600"
        }`}
      >
        {isMilestone ? <HexSign segments={6} filled={done ? 6 : 3} size={64} /> : <Icon size={54} />}
      </span>
      <span
        className={`flex h-6 w-6 -mt-4 items-center justify-center rounded-full border-2 text-xs font-bold text-white ${
          done ? "border-wheat-600 bg-wheat-500" : "border-barn-700 bg-barn-500"
        }`}
      >
        {done ? "✓" : index + 1}
      </span>
      <span className="relative z-10 max-w-[11rem] rounded-full bg-cream px-3 py-0.5 text-center font-body text-sm font-semibold text-wood-700 shadow-sm">
        {lesson.title}
      </span>
    </Link>
  );
}

function LockedNote({ unit, progress }: { unit: UnitMeta; progress: ProgressState }) {
  const g = unit.unlockAfter ? gateProgress(progress, unit.unlockAfter, unit.unlockAccuracy ?? 0) : 0;
  const priorTitle = UNITS.find((u) => u.id === unit.unlockAfter)?.title ?? "the prior unit";
  return (
    <div className="mt-4 rounded-chunky border-4 border-dashed border-wood-200 bg-cream/70 px-5 py-5 text-center">
      <p className="font-body text-wood-600">
        Unlocks at {Math.round((unit.unlockAccuracy ?? 0) * 100)}% review accuracy on {priorTitle}.
      </p>
      <div className="mx-auto mt-3 h-3 w-full max-w-sm overflow-hidden rounded-full border-2 border-wood-300 bg-white">
        <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${Math.min(100, g * 100)}%` }} />
      </div>
      <p className="mt-2 font-body text-xs text-wood-400">
        Keep reviewing {priorTitle} in the Daily Hex to open this one.
      </p>
    </div>
  );
}

function ComingSoonNote({ blurb }: { blurb: string }) {
  return (
    <div className="mt-4 rounded-chunky border-4 border-dashed border-wood-200 bg-cream/60 px-5 py-5 text-center">
      <p className="font-body text-wood-500">{blurb}</p>
      <p className="mt-1 font-body text-xs text-wood-400">Lessons coming soon. Dobbin is still hitching up the buggy.</p>
    </div>
  );
}
