# Deitsh 🐴

A gamified web app for learning **Pennsylvania Dutch (Deitsh)** — Duolingo-style
mechanics, entirely original branding, art, and theming. Guided by Dobbin the
horse. See [`PRD.md`](./PRD.md) for product intent and [`CLAUDE.md`](./CLAUDE.md)
for the working guide.

> Framing note: this app helps you **learn the basics / build a real feel** for
> the language — it is not a fluency claim (PRD §1b).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run test`.

## What's built (v1 vertical slice)

- **Greetings unit** — 6 lessons (`greetings-1..6`), the last a milestone review
  dialogue that recombines earlier vocab. Mixed exercise types per PRD §6.2.
- **Exercise components** — `introduce` (teach-before-test presentation),
  multiple choice, translate (typed), word-bank sentence building, **vocabulary
  matching** (two-column tap-to-pair), and **true/false** grammar check.
  (Text-only: audio "listen" types stay disabled until real recordings exist —
  PRD §6.2. Pronunciation is taught via a `phonetic` respelling next to every word.)
- **Daily Hex** — the spaced-repetition daily review (PRD §6.4), reskinned so
  each correct answer colors in a segment of a PA Dutch hex sign; finishing the
  day's review completes the hex and saves it to a small collection.
- **Path-based unit map** — the home screen is a winding trail of illustrated
  lesson stops (barn, garden, loom, waterwheel, windmill…) with locked
  future-unit signposts, in a warm storybook art style.
- **Gamification** — XP, daily streak, and **Hooves** (energy) that regenerate
  slowly over real time (one per ~4h) as the core pacing lever. Daily XP goal +
  spaced-repetition review gating on unit unlocks. All persisted to
  `localStorage` (no backend/auth in v1).
- **Dobbin** — SVG mascot with idle / correct / incorrect / streak / sleepy
  states and short encouragement "barks."
- **Learning path** — Greetings playable; the other PRD theme units shown
  locked / coming-soon with the barn/buggy/quilt folk-art motifs.

## Project layout

```
app/                 Next.js App Router pages (home + /lesson/[lessonId])
components/           UI: Dobbin, exercises/, LessonPlayer, LearningPath, Motifs…
content/lessons/     Lesson JSON (add a lesson here, register it in lib/content.ts)
content/vocab/       Shared vocab (incl. required `phonetic` respelling)
lib/                 Pure engines (energy/streak/xp/spacedRepetition/grade) + store
lib/__tests__/       Vitest unit tests for the engines
public/audio/        Reserved for future native-speaker clips (none in v1)
```

## Content authoring

Add a lesson by dropping a JSON file in `content/lessons/` (schema in
`CLAUDE.md`) and registering it in `lib/content.ts`. Flag any content not yet
verified by a native/heritage speaker with `"needsReview": true` (and keep the
lesson's `reviewStatus: "pending"`) — see PRD §8.

## Known gaps / assumptions

- **Audio is a future phase.** No recordings exist yet (no native speaker on
  hand), and German TTS would teach wrong pronunciation. v1 ships no audio/play
  buttons; pronunciation is taught via the `phonetic` respelling on each word.
  Listen exercises re-enable once real clips land.
- **Orthography.** Content uses one common phonetic convention; this is
  surfaced in-app as a dialect-transparency note (PRD §8). Several greetings
  phrases are flagged `needsReview` pending speaker verification.
- Fonts load from Google Fonts via `<link>` with system-rounded fallbacks, so
  the build never fetches fonts at build time and works offline.
