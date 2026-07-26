# Audio clips — FUTURE PHASE (not in v1)

This folder is reserved for later native/heritage-speaker recordings. **v1 ships
no audio and no play buttons.**

## Why there's no audio yet

- No native speaker on hand to record, and there is no accurate text-to-speech
  voice for Pennsylvania Dutch (Deitsch) — German TTS would teach the *wrong*
  pronunciation, which conflicts with the accuracy guardrail in `PRD.md` §8.

Rather than ship non-functional "play" buttons, v1 teaches pronunciation with a
**phonetic respelling** on every vocab item (e.g. `Hallo (HAH-loh)`), shown next
to the written word throughout the app. See the `phonetic` field in
`content/vocab/*.json` and the vocab schema in `CLAUDE.md`.

## When audio arrives

Drop clips here named to match each vocab `id` (e.g. `hallo.mp3`), then
re-enable the audio-dependent exercise types (`listen_select`, `listen_type`)
that were removed from the schema and player in this phase.
