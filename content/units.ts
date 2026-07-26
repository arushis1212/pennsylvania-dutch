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
    status: "coming_soon",
    lessonIds: [],
    unlockAfter: "family-home",
    unlockAccuracy: 0.7,
  },
  {
    id: "numbers-time",
    title: "Numbers & Time",
    blurb: "Counting, days, and telling the time.",
    motif: "waterwheel",
    status: "coming_soon",
    lessonIds: [],
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
