import type { UnitMeta } from "@/lib/types";

/**
 * The Learning Path (skill tree), in order. Each theme (PRD 6.1) splits into
 * sub-units of real depth (tagged per lesson via `subUnit`).
 *
 * Unlock gating: a unit with `unlockAfter` opens once the learner's rolling
 * review accuracy on that prior unit's vocab clears `unlockAccuracy` (PRD 6.3),
 * rather than a plain "lessons done" checkbox. The path computes live
 * availability; `status: "coming_soon"` marks themes with no lessons authored yet.
 */
export const UNITS: UnitMeta[] = [
  {
    id: "greetings",
    title: "Greetings",
    blurb: "Hello, goodbye, and meeting folks on the way.",
    motif: "buggy",
    status: "available",
    lessonIds: [
      "greetings-1",
      "greetings-2",
      "greetings-3",
      "greetings-4",
      "greetings-5",
      "greetings-6",
    ],
  },
  {
    id: "family-home",
    title: "Family & Home",
    blurb: "Mudder, Vadder, and life around the farmhouse.",
    motif: "loom",
    status: "locked",
    lessonIds: [
      "family-home-1",
      "family-home-2",
      "family-home-3",
      "family-home-4",
      "family-home-5",
      "family-home-6",
      "family-home-7",
      "family-home-8",
      "family-home-9",
    ],
    unlockAfter: "greetings",
    unlockAccuracy: 0.7,
  },
  {
    id: "farm-animals",
    title: "Farm & Animals",
    blurb: "Horses, cows, chickens, and the barnyard.",
    motif: "barn",
    status: "locked",
    lessonIds: [
      "farm-animals-1",
      "farm-animals-2",
      "farm-animals-3",
      "farm-animals-4",
      "farm-animals-5",
      "farm-animals-6",
      "farm-animals-7",
      "farm-animals-8",
      "farm-animals-9",
    ],
    unlockAfter: "family-home",
    unlockAccuracy: 0.7,
  },
  {
    id: "numbers-time",
    title: "Numbers & Time",
    blurb: "Counting, days, and telling the time.",
    motif: "waterwheel",
    status: "locked",
    lessonIds: [
      "numbers-time-1",
      "numbers-time-2",
      "numbers-time-3",
      "numbers-time-4",
      "numbers-time-5",
      "numbers-time-6",
      "numbers-time-7",
      "numbers-time-8",
      "numbers-time-9",
    ],
    unlockAfter: "farm-animals",
    unlockAccuracy: 0.7,
  },
  {
    id: "food",
    title: "Food",
    blurb: "Bread, butter, pie, and the supper table.",
    motif: "churn",
    status: "coming_soon",
    lessonIds: [],
    unlockAfter: "numbers-time",
    unlockAccuracy: 0.7,
  },
  {
    id: "weather-seasons",
    title: "Weather & Seasons",
    blurb: "Sun, snow, and the turning year.",
    motif: "windmill",
    status: "coming_soon",
    lessonIds: [],
    unlockAfter: "food",
    unlockAccuracy: 0.7,
  },
  {
    id: "market-day",
    title: "Market Day",
    blurb: "Buying, selling, and greetings at the stand.",
    motif: "silo",
    status: "coming_soon",
    lessonIds: [],
    unlockAfter: "weather-seasons",
    unlockAccuracy: 0.7,
  },
  {
    id: "faith-community",
    title: "Faith & Community",
    blurb: "Church, neighbors, and helping hands.",
    motif: "quilt",
    status: "coming_soon",
    lessonIds: [],
    unlockAfter: "market-day",
    unlockAccuracy: 0.7,
  },
  {
    id: "barn-raising",
    title: "Barn Raising",
    blurb: "Working together, tools, and a job well done.",
    motif: "barn",
    status: "coming_soon",
    lessonIds: [],
    unlockAfter: "faith-community",
    unlockAccuracy: 0.7,
  },
];

export function getUnit(id: string): UnitMeta | undefined {
  return UNITS.find((u) => u.id === id);
}
