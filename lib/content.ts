/**
 * Static content loader. Content authors add lessons/vocab by dropping JSON in
 * /content - they register the file here (the one code touch), and everything
 * else (path, player, SRS) picks it up automatically.
 */

import type { Lesson, VocabEntry } from "./types";
import { normalize } from "./answerCheck";

import greetings1 from "@/content/lessons/greetings-1.json";
import greetings2 from "@/content/lessons/greetings-2.json";
import greetings3 from "@/content/lessons/greetings-3.json";
import greetings4 from "@/content/lessons/greetings-4.json";
import greetings5 from "@/content/lessons/greetings-5.json";
import greetings6 from "@/content/lessons/greetings-6.json";
import greetingsVocab from "@/content/vocab/greetings.json";

import familyHome1 from "@/content/lessons/family-home-1.json";
import familyHome2 from "@/content/lessons/family-home-2.json";
import familyHome3 from "@/content/lessons/family-home-3.json";
import familyHome4 from "@/content/lessons/family-home-4.json";
import familyHome5 from "@/content/lessons/family-home-5.json";
import familyHome6 from "@/content/lessons/family-home-6.json";
import familyHome7 from "@/content/lessons/family-home-7.json";
import familyHome8 from "@/content/lessons/family-home-8.json";
import familyHome9 from "@/content/lessons/family-home-9.json";
import familyHomeVocab from "@/content/vocab/family-home.json";

import farmAnimals1 from "@/content/lessons/farm-animals-1.json";
import farmAnimals2 from "@/content/lessons/farm-animals-2.json";
import farmAnimals3 from "@/content/lessons/farm-animals-3.json";
import farmAnimals4 from "@/content/lessons/farm-animals-4.json";
import farmAnimals5 from "@/content/lessons/farm-animals-5.json";
import farmAnimals6 from "@/content/lessons/farm-animals-6.json";
import farmAnimals7 from "@/content/lessons/farm-animals-7.json";
import farmAnimals8 from "@/content/lessons/farm-animals-8.json";
import farmAnimals9 from "@/content/lessons/farm-animals-9.json";
import farmAnimalsVocab from "@/content/vocab/farm-animals.json";

import numbersTime1 from "@/content/lessons/numbers-time-1.json";
import numbersTime2 from "@/content/lessons/numbers-time-2.json";
import numbersTime3 from "@/content/lessons/numbers-time-3.json";
import numbersTime4 from "@/content/lessons/numbers-time-4.json";
import numbersTime5 from "@/content/lessons/numbers-time-5.json";
import numbersTime6 from "@/content/lessons/numbers-time-6.json";
import numbersTime7 from "@/content/lessons/numbers-time-7.json";
import numbersTime8 from "@/content/lessons/numbers-time-8.json";
import numbersTime9 from "@/content/lessons/numbers-time-9.json";
import numbersTimeVocab from "@/content/vocab/numbers-time.json";

import food1 from "@/content/lessons/food-1.json";
import food2 from "@/content/lessons/food-2.json";
import food3 from "@/content/lessons/food-3.json";
import food4 from "@/content/lessons/food-4.json";
import food5 from "@/content/lessons/food-5.json";
import food6 from "@/content/lessons/food-6.json";
import food7 from "@/content/lessons/food-7.json";
import food8 from "@/content/lessons/food-8.json";
import food9 from "@/content/lessons/food-9.json";
import foodVocab from "@/content/vocab/food.json";

import weatherSeasons1 from "@/content/lessons/weather-seasons-1.json";
import weatherSeasons2 from "@/content/lessons/weather-seasons-2.json";
import weatherSeasons3 from "@/content/lessons/weather-seasons-3.json";
import weatherSeasons4 from "@/content/lessons/weather-seasons-4.json";
import weatherSeasons5 from "@/content/lessons/weather-seasons-5.json";
import weatherSeasons6 from "@/content/lessons/weather-seasons-6.json";
import weatherSeasons7 from "@/content/lessons/weather-seasons-7.json";
import weatherSeasons8 from "@/content/lessons/weather-seasons-8.json";
import weatherSeasons9 from "@/content/lessons/weather-seasons-9.json";
import weatherSeasonsVocab from "@/content/vocab/weather-seasons.json";

import marketDay1 from "@/content/lessons/market-day-1.json";
import marketDay2 from "@/content/lessons/market-day-2.json";
import marketDay3 from "@/content/lessons/market-day-3.json";
import marketDay4 from "@/content/lessons/market-day-4.json";
import marketDay5 from "@/content/lessons/market-day-5.json";
import marketDay6 from "@/content/lessons/market-day-6.json";
import marketDay7 from "@/content/lessons/market-day-7.json";
import marketDay8 from "@/content/lessons/market-day-8.json";
import marketDay9 from "@/content/lessons/market-day-9.json";
import marketDayVocab from "@/content/vocab/market-day.json";

import faithCommunity1 from "@/content/lessons/faith-community-1.json";
import faithCommunity2 from "@/content/lessons/faith-community-2.json";
import faithCommunity3 from "@/content/lessons/faith-community-3.json";
import faithCommunity4 from "@/content/lessons/faith-community-4.json";
import faithCommunity5 from "@/content/lessons/faith-community-5.json";
import faithCommunity6 from "@/content/lessons/faith-community-6.json";
import faithCommunity7 from "@/content/lessons/faith-community-7.json";
import faithCommunity8 from "@/content/lessons/faith-community-8.json";
import faithCommunity9 from "@/content/lessons/faith-community-9.json";
import faithCommunityVocab from "@/content/vocab/faith-community.json";

const LESSONS: Lesson[] = [
  greetings1,
  greetings2,
  greetings3,
  greetings4,
  greetings5,
  greetings6,
  familyHome1,
  familyHome2,
  familyHome3,
  familyHome4,
  familyHome5,
  familyHome6,
  familyHome7,
  familyHome8,
  familyHome9,
  farmAnimals1,
  farmAnimals2,
  farmAnimals3,
  farmAnimals4,
  farmAnimals5,
  farmAnimals6,
  farmAnimals7,
  farmAnimals8,
  farmAnimals9,
  numbersTime1,
  numbersTime2,
  numbersTime3,
  numbersTime4,
  numbersTime5,
  numbersTime6,
  numbersTime7,
  numbersTime8,
  numbersTime9,
  food1,
  food2,
  food3,
  food4,
  food5,
  food6,
  food7,
  food8,
  food9,
  weatherSeasons1,
  weatherSeasons2,
  weatherSeasons3,
  weatherSeasons4,
  weatherSeasons5,
  weatherSeasons6,
  weatherSeasons7,
  weatherSeasons8,
  weatherSeasons9,
  marketDay1,
  marketDay2,
  marketDay3,
  marketDay4,
  marketDay5,
  marketDay6,
  marketDay7,
  marketDay8,
  marketDay9,
  faithCommunity1,
  faithCommunity2,
  faithCommunity3,
  faithCommunity4,
  faithCommunity5,
  faithCommunity6,
  faithCommunity7,
  faithCommunity8,
  faithCommunity9,
] as Lesson[];

const VOCAB: VocabEntry[] = [
  ...(greetingsVocab.entries as VocabEntry[]),
  ...(familyHomeVocab.entries as VocabEntry[]),
  ...(farmAnimalsVocab.entries as VocabEntry[]),
  ...(numbersTimeVocab.entries as VocabEntry[]),
  ...(foodVocab.entries as VocabEntry[]),
  ...(weatherSeasonsVocab.entries as VocabEntry[]),
  ...(marketDayVocab.entries as VocabEntry[]),
  ...(faithCommunityVocab.entries as VocabEntry[]),
];

const lessonById = new Map(LESSONS.map((l) => [l.lesson_id, l]));
const vocabById = new Map(VOCAB.map((v) => [v.id, v]));

// Lookup phonetic respellings by the displayed Deitsh text (normalized), so any
// UI showing a known vocab word can append its pronunciation guide.
const phoneticByText = new Map(VOCAB.map((v) => [normalize(v.deitsh), v.phonetic]));

/**
 * Phonetic respelling for a displayed Deitsh word/phrase, or undefined if it
 * isn't a known vocab item (e.g. a single word-bank token). Shown in place of
 * audio - see PRD Section 6.2.
 */
export function phoneticFor(deitshText: string): string | undefined {
  return phoneticByText.get(normalize(deitshText));
}

export function getLesson(id: string): Lesson | undefined {
  return lessonById.get(id);
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  return LESSONS.filter((l) => l.unit === unitId);
}

export function getVocab(id: string): VocabEntry | undefined {
  return vocabById.get(id);
}

/** All vocab ids taught in a unit (drives unlock-accuracy gating). */
export function vocabIdsForUnit(unitId: string): string[] {
  const ids = new Set<string>();
  for (const lesson of getLessonsForUnit(unitId)) {
    for (const ex of lesson.exercises) {
      for (const v of ex.vocab ?? []) ids.add(v);
    }
  }
  return [...ids];
}

export { LESSONS, VOCAB };
