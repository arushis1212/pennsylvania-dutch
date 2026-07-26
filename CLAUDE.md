# CLAUDE.md — Project Guide for "Deitsh" (PA Dutch Learning App)

This file gives Claude Code persistent context about this project. Read it before making changes.

## What this project is
A gamified web app for learning Pennsylvania Dutch (Deitsh), starting with Amish-community-themed vocabulary. Think "Duolingo mechanics, original everything else." Full spec lives in `PRD.md` — read that first for product intent before implementing features.

## Tech stack
- **Framework**: Next.js (React), TypeScript
- **Styling**: Tailwind CSS
- **Content**: static JSON/YAML lesson files under `/content/lessons/` — no database in v1
- **Progress/state**: browser localStorage (no auth/backend in v1)
- **Audio**: FUTURE PHASE — no recordings yet; pronunciation is taught via the `phonetic` respelling field, not playback. `/public/audio/` reserved for later native-speaker clips.
- **Deployment target**: Vercel (or similar static/SSR host)

## Repo structure (target)
```
/app                  → Next.js routes/pages
/components            → reusable UI components (LessonCard, ExerciseX, Mascot, StreakBar, etc.)
/content/lessons/       → lesson definition files (see schema below)
/content/vocab/         → shared vocab/audio metadata referenced by lessons
/public/audio/           → audio clips, named to match vocab IDs
/lib/                   → progress tracking, spaced repetition logic, scoring
/PRD.md                 → product spec (source of truth for scope/features)
/CLAUDE.md              → this file
```

## Lesson content schema (draft — adjust as needed, keep consistent)
**Pedagogy rule — teach before testing (PRD 6.2):** every new word/phrase gets an `"type": "introduce"` step (plain presentation, no quiz) before it ever appears in a quiz exercise. A word's FIRST appearance anywhere in the app must be an Introduce step, never a cold quiz question. Introduce and quiz steps are interleaved (introduce word 1 → quiz word 1 → introduce word 2 → quiz word 1+2 → …), not front-loaded.

```json
{
  "unit": "family-home",
  "lesson_id": "family-home-1",
  "title": "Family Members",
  "exercises": [
    {
      "type": "introduce",
      "word": "Mudder",
      "meaning": "mother",
      "phonetic": "MUD-der",
      "vocab": ["mudder"]
    },
    {
      "type": "multiple_choice",
      "prompt": "Select the word for 'mother'",
      "options": ["Mudder", "Vadder", "Bruder", "Schweschder"],
      "answer": "Mudder",
      "vocab": ["mudder"]
    }
  ]
}
```
Keep exercise types consistent with those defined in PRD.md Section 6.2. **Active types: `introduce` (presentation, ungraded), `multiple_choice`, `translate`, `word_bank`.** Audio-dependent types (`listen_select`, `listen_type`) are **disabled until native-speaker recordings exist** — no audio play buttons ship. Do not add an `audio` field to exercises for now. A pedagogy unit test (`lib/__tests__/pedagogy.test.ts`) enforces the introduce-before-quiz invariant across all lessons.

**Vocab schema — `phonetic` is a required field.** Every vocab entry must carry a simple phonetic respelling shown alongside the written word (pronunciation guide in place of audio):
```json
{
  "id": "hallo",
  "deitsh": "Hallo",
  "english": "Hello",
  "phonetic": "HAH-loh",
  "needsReview": false
}
```
Display it throughout the app as `Hallo (HAH-loh)`. Audio is a future phase; when real recordings land, re-enable the listen exercises and add clip paths back.

## Terminology (always use correctly)
- The language is **Pennsylvania Dutch (Deitsh)** — never call it "Amish" in code, copy, filenames, or comments. "Amish" is the community, not the language.
- Never write or generate marketing/UI copy implying users will become "fluent." Framing is "learn the basics" / "build a real feel for the language." See PRD.md Section 1b.

## Pacing & retention (do not let content be consumable in a day)
- The app's core design goal is **days-per-week opened**, not speed-to-completion. See PRD.md Section 3 (Goal 5) and 6.3 for full detail.
- When implementing the energy/Hooves system: regeneration must be time-based (hours), not near-instant. This is the primary lever preventing a user from finishing everything in one sitting.
- When implementing unit unlocks: gate new units behind review-accuracy thresholds on prior material (spaced repetition), not just "lesson complete" checkboxes.
- Do **not** implement paywalls, arbitrary cooldown timers, or padded/busywork exercises as a way to extend playtime — pacing should come from the energy system, spaced-repetition gating, and genuine content depth, not artificial friction.
- When adding content, prefer depth (sub-units, grammar progression, milestone passages per PRD.md Section 6.1) over shallow breadth.

## Art direction (REVISED v2 — based on mockup references, supersedes prior flat-clipart note)
Target style: **warm illustrated storybook-flat style** — richer and more painterly than plain clipart, but still rounded, friendly, and uncomplicated. Soft shading, warm golden-hour palette, inviting farm-scenery backdrops (barns, fences, quilts on the line, rolling hills). Think "charming indie farm-life game" over "corporate app icon" or "realistic."
- **Dobbin the horse**: real illustrated PNG artwork (NOT hand-coded SVG), stored in `/public/images/dobbin/` and rendered via the `<img>`-based `components/Dobbin.tsx` (mood → pose-file map). Warm brown coat, felt hat, blue button-up shirt, brown suspenders — **keep this exact outfit/character consistent** across any future art or references. Poses available: wave, thumbsup, sad, disappointed, happy-wave, jump, thinking, running, walking, neutral. **Future mascot work = add new pose PNGs to `/public/images/dobbin/` and map them in `Dobbin.tsx`, never draw new SVG.** All other cultural/thematic flavor comes from the surrounding scenery and object motifs.
- **Recurring motifs**: horse-drawn buggies, barns, silos, windmills, waterwheels, quilt patterns (on clotheslines, as decorative borders), **hex signs** (traditional PA Dutch barn star patterns — great as a recurring decorative and gameplay element), butter churns, hay bales, farm fences, gardens/crop rows.
- **Palette**: warm golden/orange sunset tones, barn red, sky blue, wood brown, cream/parchment background tones for UI cards — bright and inviting, not muted or "serious brand."
- **Layout patterns to use**:
  - **Path-based unit map**: lessons/units shown as stops along a winding path with distinct icon+label per stop (e.g. "Barn," "Garden," "Loom," "Waterwheel") rather than a flat vertical list — gives the learning journey a sense of place. **The connecting trail is a curvy, meandering line (a wagon trail winding across a field), NOT a straight vertical/horizontal segment.** Stops are offset left/right in a loose zigzag (varied magnitudes, not a rigid geometric wave), and the dashed wheel-track line is an SVG bezier `<path>` that snakes between them with organic bends (see `TrailCurve` in `components/LearningPath.tsx`). The **buggy trail grows as the learner progresses**: the packed-earth road with wheel ruts is drawn only between a completed stop and the next one; gaps not yet reached show a faint dotted "road ahead," never the whole trail pre-drawn.
  - **Card-based lesson tiles** on the home dashboard, each with a small illustrated icon, title, and progress indicator.
- **Typography**: rounded, friendly display font for headers/app name; clean simple sans for body text.
- Tone stays silly/tongue-in-cheek — playful, never mocking, and the cuteness/humor lives in Dobbin's personality and the scenery, not in any depiction of Amish people or their dress.

## Additional exercise/feature types (from mockup references — see PRD Section 6.2 and 6.4)
- **Vocabulary Matching** (`matching`): two-column tap-to-pair exercise (word ↔ translation).
- **True/False grammar check** (`true_false`): short statement, user selects True or False.
- **Daily Hex**: the spaced-repetition daily review, reskinned as a hex-sign building activity — each correct review answer completes a segment of the hex; finishing that day's review completes the hex. This IS the review system (PRD 6.4), not a separate unrelated mini-game. Completed hexes are saved to a small personal collection.

## Branding & design constraints (do not violate)
- **Palette**: barn red, wood brown, wheat gold, sky blue. **Never** use Duolingo's green or copy their icon/owl designs.
- **Mascot**: a horse named "Dobbin." No cartoon human/Amish-person mascots or characters — keep imagery to the horse, farm objects, buggies, barns, quilts, tools, landscapes.
- **Naming**: never use "Duolingo" in any user-facing copy, metadata, filenames, or marketing strings.
- If asked to add features "just like Duolingo does X," implement the underlying mechanic (streaks, hearts-equivalent, leaderboard, etc.) but always translate visuals/wording into this app's own theme — don't reference or mimic Duolingo's specific assets.

## Gamification terms (use these, not generic Duolingo terms)
- Lives/hearts → **Energy (Hooves)** 🐴
- Streak → **Streak** (same word is fine, it's generic)
- Skill tree → **Learning Path**
- Leaderboard leagues → keep simple weekly leaderboard, name TBD (avoid copying Duolingo's league names like "Bronze/Sapphire" tiers verbatim — invent our own, e.g. barn-themed tiers: Barnyard, Farmstead, Homestead, Township)

## Coding conventions
- TypeScript strict mode on.
- Functional React components, hooks-based state.
- Keep lesson/content logic decoupled from UI components — content authors should be able to add a new lesson by only touching `/content/lessons/`, not component code.
- Write small, composable exercise components (one component per exercise type), not one giant switch-statement component.
- Add basic unit tests for scoring/streak/spaced-repetition logic in `/lib`.

## What to check before implementing a new feature
1. Is it in scope for MVP per `PRD.md` Section 6? If not, flag it as a "future idea" (Section 7) rather than building it now.
2. Does it require new content? If so, use the lesson schema above and note if the content still needs native-speaker review.
3. Does it touch branding/mascot/visuals? Re-check the constraints above before generating any art direction or copy.

## Commands
- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build (also runs the TypeScript type check)
- `npm start` — serve the production build
- `npm run lint` — Next.js/ESLint
- `npm run test` — run the Vitest unit tests in `/lib/__tests__` (`npm run test:watch` for watch mode)

## Current status
Scaffolded (Next.js 15 App Router + TS strict + Tailwind) and the **Greetings** unit is built end-to-end as a working vertical slice:
- Content: `/content/vocab/greetings.json` + `/content/lessons/greetings-1..6.json` (mixed exercise types; unreviewed items flagged `needsReview` / `reviewStatus: "pending"`).
- Exercise components (text-only) under `/components/exercises`: `introduce` (presentation), `multiple_choice`, `translate`, `word_bank`, `matching` (two-column tap-to-pair), `true_false` (grammar check). Pronunciation shown via the `phonetic` respelling (`phoneticFor` in `lib/content.ts`).
- Engines in `/lib` (pure + unit-tested): `energy` (time-based Hooves regen), `streak`, `xp`, `spacedRepetition`, `review` (Daily Hex session builder), `grade`/`answerCheck`; persisted to localStorage via `progress.ts` + `useProgress.ts`.
- Mascot: `/components/Dobbin.tsx` (warm illustrated storybook horse — brown coat, straw hat, shirt/suspenders; moods idle/correct/incorrect/streak/sleepy/wave). Motifs: `/components/Motifs.tsx` (storybook icons incl. barn/garden/loom/waterwheel/windmill + the `HexSign` barn star + quilt bands).
- Home (`/components/LearningPath.tsx`): **path-based unit map** — a winding trail of illustrated lesson stops + locked future-unit signposts with the review-accuracy gate. Daily Hex entry card on `/app/page.tsx`.
- **Daily Hex** (`/app/review/page.tsx` + `lib/review.ts`): the spaced-repetition daily review (PRD 6.4), where each correct answer colors a hex segment; finishing completes + saves the hex to a collection, awards XP, records streak. No Hooves at stake.

**Multi-unit path (built):** `LearningPath.tsx` renders every unit in order as a continuous gated trail. A unit computes LIVE availability (`unitAvailability`): a theme with lessons opens once the learner clears its `unlockAfter` unit's unlock gate (`unlockAccuracy`, default 0.7); themes with no lessons show "coming soon". Lessons carry `subUnit` (used to organize content only — ordinary sub-unit labels are **not** chipped onto the map, to keep the trail uncluttered) and `milestone` (a hex node **and** the only labeled signpost drawn on the trail). Daily Hex distractors only pull from vocab the learner has a card for (no forward-referencing).

**Unlock gate — 70% mastery of the whole prior unit (PRD 6.3):** a unit unlocks only once the learner reaches `unlockAccuracy` (default 0.7 = 70%) *mastery* of the **entire** prior unit, computed by `unitMastery` in `lib/progress.ts` and checked in `LearningPath.tsx`'s `gateMet`/`gateProgress`. `unitMastery` = the average per-word review accuracy across **all** of the prior unit's vocab, with words never reviewed counting as 0 — so ~70% of the unit's words must actually be answered correctly; you cannot unlock the next unit by getting a single word right. Mastery accrues from both lesson practice and the Daily Hex (both record SRS card results). (`accuracyFor` — accuracy over *seen* cards only — is kept for other uses but is deliberately **not** the gate; using it let a unit open after one word.)

**Units built:** Greetings (6 lessons), **Family & Home** (9 lessons across 4 sub-units — Immediate Family, Extended Family, Around the House, Chores & Home Life — plus a milestone; grammar woven in: `mei` possessive, `sell is`, `wer/was is sell?`, `Kind→Kinner` plural; `/content/vocab/family-home.json` + `/content/lessons/family-home-1..9.json`), and **Farm & Animals** (9 lessons across 4 sub-units — Barnyard Animals, More Critters, Around the Farm, Farm Life & Chores — plus a milestone; grammar woven in: plurals `Gaul→Gäul`/`Kuh→Kieh`, definite article `der`, verb `hawwe` "to have", adjectives `groß`/`glee`, `Der Gaul is groß` sentence building; `/content/vocab/farm-animals.json` + `/content/lessons/farm-animals-1..9.json`), and **Numbers & Time** (9 lessons across 4 sub-units — Counting (1–10), Bigger Numbers (11–100 + counting things), Telling Time, Days & the Week — plus a milestone; grammar woven in: cardinals as modifiers on plural nouns (`zwee Gäul`, `drei Kieh`, reusing Farm plurals), the teen/tens patterns (`-zeh`/`-zich`), the `wie viel` question word, telling time with `Wie viel Uhr is es?` / `Es is X Uhr`, and calendar sentences (`Heit is Freidaag`); `/content/vocab/numbers-time.json` + `/content/lessons/numbers-time-1..9.json`), and **Food** (9 lessons across 4 sub-units — Meals & Mealtimes, Common Dishes, Sweets & Baking, At the Table — plus a milestone; grammar woven in: the verbs `esse`/`trinke` conjugated in 1st person (`Ich ess`, `Ich drink`), food adjectives in predicate sentences (`Der Kaffi is warm`, extending Farm's `der … is [adj]` pattern), and the polite request `Ich hätt gern ___` with `Ich bin hungrich` and `Sei so gut` (please, reused from Greetings); `/content/vocab/food.json` + `/content/lessons/food-1..9.json`), and **Weather & Seasons** (9 lessons across 4 sub-units — Weather & Sky, Describing the Weather, The Four Seasons, Seasonal Farm Life — plus a milestone; grammar woven in: impersonal weather clauses (`Es regert`, `Es schneet`, `Es is sunnich`), the comparative `adjective+er` + `as` = "than" (`Der Winder is kelter as der Summer`, reusing `warm`/`kalt` from Food), and the becoming/near-future `Es watt kalt` (it will get cold); `/content/vocab/weather-seasons.json` + `/content/lessons/weather-seasons-1..9.json`), and **Market Day** (9 lessons across 4 sub-units — At the Market, Money & Prices, Market Goods, Making a Sale — plus a milestone dialogue; grammar woven in: the price question `Wie viel koscht sell?` (reusing `wie viel` from Numbers & Time + `sell` from Family & Home) answered with numbers + money (`Sell koscht drei Daaler`), the buy/sell verbs `kaafe`/`verkaafe` conjugated (`Ich kaaf`), price comparison reusing the Weather comparative (`billicher as`/`deierer as`), and transactional phrases (`Noch eppes?`, `Wie viel macht sell zamme?`) with reused `Ich hätt gern` / `Danki` / `Gern gschehne`; `/content/vocab/market-day.json` + `/content/lessons/market-day-1..9.json`). All content is AI-drafted and flagged `needsReview`; each unit is registered in `lib/content.ts` and `content/units.ts` and gated to the prior unit at 70% mastery.

**Remaining themes** (Faith & Community, Barn Raising) are `coming_soon` stubs in `content/units.ts` with the unlock chain pre-wired — build one theme per session following the Family & Home / Farm & Animals pattern (vocab file → lesson files → register in `lib/content.ts` → set lessonIds + flip `status` off `coming_soon`). All authored content is AI-drafted and MUST be native/heritage-speaker reviewed before wide release (PRD §10).

**Future phase:** native-speaker audio + re-enabled listen exercises (see `/public/audio/README.md`).
