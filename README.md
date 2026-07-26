# Quordle

A daily Spanish-language Quordle created as a gift. Every day at 05:00 in
`Europe/Madrid`, everyone receives the same four words and has nine guesses.

## Status

The technical foundation, game engine, local persistence, daily calendar,
result-sharing format, and game interface are ready. The UI uses the shadcn/ui
preset `b1aJEHx6e` as its sole visual system.

Local development keeps a random game from the dictionary and enables “Volver
a jugar” (“Play again”) after the game ends. Production reads the shared game
from an immutable, versioned JSON calendar.

## Getting started

1. Install dependencies with `npm install`.
2. Optionally copy `.env.example` to `.env` to configure the shared-result URL.
3. Run `npm run validate:data`.
4. Start the project with `npm run dev`.

The complete documentation is available in
[`docs/README.md`](docs/README.md).
