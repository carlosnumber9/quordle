# Gameplay rules and flow

## Starting a game

A game contains four unique five-letter solutions and a `YYYY-MM-DD` date. It
also has a `gameId`: stable for the daily puzzle and unique for each local
replay. The engine exposes immutable state.

## Guesses

- They are normalized to uppercase, with accent marks removed and `Ñ`
  preserved.
- They must contain five characters from `A-Z` or `Ñ`.
- They must exist in the same dictionary used to choose solutions.
- An invalid guess does not consume a turn.
- A valid guess is evaluated against every board that is still active.

## Duplicate letters

Evaluation uses two passes:

1. Mark matches in the correct position.
2. Count the remaining letters in the solution and consume one for each match
   in another position.

This prevents more yellow occurrences from being marked than actually exist.

## Resolution

When a board is solved, the global guess number is recorded. Subsequent guesses
store `null` for that board and do not change its result. The player wins by
solving all four boards and loses by completing the ninth guess without doing
so. At the end, both a win and a loss open a centered dialog with an animated
turn-by-turn timeline. Every turn is represented and the solution appears on
the turn where its board was completed. The animation is skipped when the
player prefers reduced motion. A win uses a prominent trophy heading, while a
loss shows one randomly selected encouragement message. After closing the
dialog, a compact finished-game panel keeps the results available and counts
down to the next 05:00 rollover in Madrid; reaching zero reloads the daily
game.

## Keyboard

Each key can have four visual states, one per board. Within each board, the
priority is `correct > present > absent`, so a clue never degrades.

## Persistence

The version, date, guess list, and whether the game has ended are stored. On
load, guesses are replayed from scratch. A corrupt, inconsistent, or
different-date payload is removed.

## Local development

- Only one local session is active: reloading restores the same solutions and
  progress.
- The initial session gets four random words directly from the JSON file.
- The history is not queried and the Supabase client is not imported.
- Each board displays its solution as a watermark to simplify manual checks.
  The UI requires both a `DEV` build and `local` mode; the watermark is never
  rendered in production.
- “Volver a jugar” (“Play again”) appears only after a win or loss.
- The button requests `POST /api/game/today`, replaces the local session,
  removes the previous progress, and creates state with the new `gameId`.
- In production, POST returns `405` and the button is not rendered.

The integration must use `getOrCreateLocalSession` during local startup and
`replayLocalGame` in the `LocalReplayButton` callback.
