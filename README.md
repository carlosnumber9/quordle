# Quordle

A daily Spanish-language Quordle created as a gift. Every day at 05:00 in
`Europe/Madrid`, everyone receives the same four words and has nine guesses.

## Status

The technical foundation, game engine, local persistence, daily generation,
result-sharing format, and game interface are ready. The UI uses the shadcn/ui
preset `b1aJEHx6e` as its sole visual system.

Local development does not connect to Supabase: it keeps a random game from the
JSON file and enables “Volver a jugar” (“Play again”) after the game ends.
Production keeps a single shared daily game.

## Getting started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and add the credentials.
3. Replace `src/data/words.json` with the complete dictionary.
4. Run `npm run validate:dictionary`.
5. Apply `supabase/migrations/0001_create_daily_words.sql`.
6. Start the project with `npm run dev`.

The complete documentation is available in
[`docs/README.md`](docs/README.md).
