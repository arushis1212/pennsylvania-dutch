# PRD: "Deitsh" — A Gamified Pennsylvania Dutch Learning App

## 1. Overview
Deitsh is a gamified language-learning web app teaching **Pennsylvania Dutch (Deitsh)**, starting with vocabulary and phrases rooted in **Amish community life** (family, farm, faith, market day, seasons). It borrows the proven *mechanics* of apps like Duolingo — skill trees, streaks, XP, spaced repetition, a mascot guide — while using **original branding, art, and theming** so it stands on its own as a product rather than a clone.

**Working title:** Deitsh
**Mascot:** Dobbin, a horse (buggy/plow horse — thematically authentic to Amish daily life)
**Tagline (draft):** "Learn the language of the Plain community, one lesson at a time."

## 1a. Naming Clarity
"Amish" refers to the religious community, not a language. The language is **Pennsylvania Dutch (Deitsh)**. All product copy, marketing, and in-app text should say "Learn Pennsylvania Dutch," never "Learn Amish" — this matters both for accuracy and for respecting the community the language comes from.

## 1b. What This App Promises (and doesn't)
This app is explicitly **not** a fluency claim. Framing should be "learn the basics / build a real feel for the language," not "become fluent." No language app, including Duolingo, produces fluency on its own (independent research and Duolingo's own materials put its outcomes around A1–A2 level) — and this app has a much smaller content library and no speech scoring in v1. Realistic outcome: basic conversational ability — greetings, core vocab, simple sentence patterns, and the ability to recognize spoken PA Dutch in context. Do not market or design toward "finish this app and you're fluent."

## 2. Problem / Opportunity
- Pennsylvania Dutch has no single standardized orthography and very little digitized learning content compared to major world languages.
- Existing resources (Talkpal, learn-dutch.org, PA Dutch 101, Berks History Center classes) are either general-purpose tutoring platforms, static dictionary/worksheet sites, or live human classes — none combine a gamified daily-habit loop with PA-Dutch-specific content.
- There's a real audience of heritage learners (descendants of PA Dutch families), former or adjacent Plain community members, linguists, and curious hobbyists who currently have no "just open the app for 5 minutes" option.

## 3. Goals
1. Ship a functional MVP: account-free or lightweight-auth web app with a skill tree covering beginner vocabulary/phrases.
2. Make the core loop (lesson → XP → streak → review) genuinely sticky, on par with mainstream language apps.
3. Build content that is respectful and accurate — ideally reviewed by native or heritage speakers before wide release.
4. Keep branding, mascot, and UI clearly original (see Section 8 — Legal & Ethical Guardrails).
5. **Pace the experience over weeks, not hours.** Success is measured by "days per week opened," not "time to complete the tree." A highly motivated user should not be able to exhaust the app in a single sitting even if they try. This is achieved through the mechanics in Section 6.3, not through artificial paywalls, cooldown timers, or busywork padding — those read as manipulative and should be avoided.

## 4. Non-Goals (for v1)
- Not building a full native mobile app yet (responsive web first).
- Not attempting to cover every PA Dutch dialect variant — pick one convention and note it transparently.
- Not doing speech recognition / pronunciation scoring in v1 (audio playback only).
- Not monetizing in v1 — focus on a working, lovable product first.

## 5. Target Users
- **Heritage learners**: descendants of PA Dutch families wanting to reconnect with the language.
- **Adjacent/curious learners**: linguists, genealogists, Pennsylvania locals, hobbyist language learners.
- **Former community members**: people who grew up Plain and want a refresher or want to teach their kids.

*(Note: practicing Amish/Old Order Mennonite speakers are native speakers, not the target learner audience — content should be built *about* and *informed by* the community, respectfully, not assume they are the customer.)*

## 6. Core Features (MVP)

### 6.1 Skill Tree
- Units organized by theme, each with real depth rather than one shallow pass per topic. Example: "Family & Home" splits into sub-units — Immediate Family, Extended Family, Around the House, Chores — rather than a single lesson covering all of it.
- Base theme list: Greetings, Family & Home, Farm & Animals, Numbers & Time, Food, Weather & Seasons, Market Day, Faith & Community, Barn Raising (cooperation/work vocab). Each expands into 3-5 sub-units as above.
- Each sub-unit = 4-6 short lessons (8-12 exercises each).
- **Grammar progression layered in**, not just vocab: sentence structure and word order, verb conjugation, question forms, and past tense should be introduced progressively across later units so the curve extends over weeks rather than front-loading everything as flat vocab drills.
- **Milestone passages**: periodically (e.g., every 2-3 units), include a short listening/reading passage or dialogue that recombines vocab and grammar from prior units, rather than only introducing new isolated words.

### 6.2 Exercise Types
**Pedagogy rule — teach before testing:** every new word or phrase must be *introduced* before it is ever quizzed. A lesson should never open cold with "what does X mean?" for a word the user hasn't seen yet. Each lesson follows this pattern:
1. **Introduce**: a simple presentation card/screen showing the new word or phrase, its English meaning, and its phonetic respelling (e.g. big card: "Guder Mariye — Good morning — GOO-der MAH-ree-yeh"). No quiz, just exposure. Dobbin can present these.
2. **Practice**: only *after* introduction, quiz on that same word — multiple choice, translate, word bank, etc.
3. **Mix in review**: later exercises in the lesson (and later lessons) can re-quiz previously introduced words to reinforce them, but a word's *first* appearance in the entire app must always be an Introduce step, never a cold quiz question.

This applies per new vocab item, not per lesson — a lesson introduces several new words/phrases in sequence, each getting its own Introduce step before being quizzed, typically interleaved (introduce word 1 → quiz word 1 → introduce word 2 → quiz word 1+2 → etc.) rather than front-loading all introductions then all quizzes.

Note: no audio recordings exist yet (no native speaker on hand). Audio-dependent exercise types are disabled/removed until real recordings are available — do not ship non-functional audio buttons.

- Multiple choice (word/image match)
- Translate the sentence (typed input)
- Word bank sentence building (tap words in order)
- ~~Listen and select / listen and type~~ — disabled until audio exists. Convert these into text-based variants (e.g. "match the word to its meaning" instead of "listen and select") rather than showing a non-functional play button.
- Speak-back (optional, no scoring in v1 — just self-practice prompt) — remains fine since it doesn't require playback, just prompts the user to say the word aloud themselves.

**Phonetic respelling in place of audio**: every vocab item should include a simple phonetic respelling (e.g. "Hallo (HAH-loh)", "Ade (AH-deh)") shown alongside the written word, so learners have a pronunciation guide even without audio. This becomes a required field in the vocab schema (see CLAUDE.md).

### 6.3 Gamification Layer
- **XP** per exercise, bonus for streaks/perfect lessons.
- **Streak counter** for daily use.
- **Energy system** (reskinned "hearts"): "Hooves" — lose one per mistake. Hooves **regenerate slowly over real time** (e.g., one every few hours), not instantly and not just by waiting a few seconds. This is the primary pacing lever: even a highly motivated user cannot binge the entire tree in one sitting, because running out of Hooves forces a natural break. Avoid making regen so slow it feels punitive — tune during testing.
- **Spaced-repetition review gating**: new units require review accuracy on prior material to stay above a threshold before unlocking, creating a natural "come back and reinforce" loop rather than a straight sprint through new content.
- **Daily XP goal**: user sets a daily goal; product framing centers on "days opened per week," not speed of completion.
- **Weekly leaderboard** (league-style, opt-in, anonymized display names, barn-themed tiers — e.g. Barnyard, Farmstead, Homestead, Township — not copied from Duolingo's tier names).
- **Dobbin the horse** reacts to correct/incorrect answers and narrates encouragement/tips (short text bark, not chat).

**Explicitly avoid**: artificial paywalls, arbitrary lesson cooldown timers unrelated to the energy system, or padding lessons with repetitive non-instructive busywork purely to extend playtime. Pacing should come from the mechanics above and from genuine content depth (Section 6.1), not from friction for its own sake.

### 6.4 Review / Spaced Repetition (Daily Hex)
- Missed/weak words resurface in a daily review deck using simple spaced-repetition scheduling.
- This review is presented as **"Daily Hex"**: a hex-sign pattern with several segments, where each correct review answer colors in/completes one segment. Finishing that day's review completes the hex — a visual, satisfying wrapper around real reinforcement, not a disconnected mini-game or bare flashcard deck.
- Completed hexes can be saved to a small personal collection over time, doubling as a streak/history visual.

### 6.5 Content Admin (internal tool)
- Simple JSON/YAML-based lesson authoring format so content can be added without touching app code (details in CLAUDE.md).

## 7. Out of Scope for MVP (Future Ideas)
- Native iOS/Android apps
- Speech recognition scoring
- User accounts with cloud sync (v1 can use local storage per browser)
- Community-submitted content/crowdsourcing
- Partnerships with existing PA Dutch resource sites for content licensing

## 8. Legal & Ethical Guardrails
These are hard constraints, not suggestions:
- **No Duolingo trade dress**: do not use their green color, owl silhouette, font, or icon set. Original palette (barn red / wood brown / wheat gold / sky blue) and original mascot art only.
- **No "Duolingo for X" branding** anywhere public-facing (app store listing, marketing, UI).
- **No cartoon depictions of Amish people** as mascots or characters, in deference to the community's own norms around humility and self-imagery. The horse mascot (Dobbin) and scenery/objects (barns, buggies, quilts, farm tools) carry the visual theme instead.
- **Dialect transparency**: clearly state in-app which PA Dutch variant/orthography is being taught and that it's one of several regional forms.
- **Source accuracy**: flag any content not yet reviewed by a native/heritage speaker as "community-reviewed pending" until verified.

## 9. Tech Stack (proposed)
- **Frontend**: React + Next.js, Tailwind CSS
- **Content storage**: local JSON/YAML lesson files (no DB needed for MVP)
- **State/progress**: browser localStorage for v1 (no backend/auth yet)
- **Audio**: static hosted audio clips per vocab item
- **Deployment**: Vercel or similar static/SSR host

## 10. Success Metrics (MVP)
- A user can complete the full "Greetings" + "Family & Home" units end-to-end without bugs.
- Streak/XP/energy systems function correctly across a session and persist on reload.
- At least one native/heritage speaker has reviewed the first 2 units for accuracy.

## 11. Open Questions
- Which orthography convention to standardize on (there are a few in competing use — e.g. Buffington-Barba vs. more phonetic "Deitsh" spellings used by sites like learn-dutch.org).
- Whether to eventually seek input/blessing from PA Dutch cultural organizations (e.g. Berks History Center) before wide release.
- Long-term content sourcing plan — hire a heritage speaker as content consultant?
