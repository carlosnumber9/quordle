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
so.

The active interface renders four nine-by-five grids in the original Quordle
two-by-two layout. Every accepted guess remains visible in each unresolved
board with its full `correct`, `present`, and `absent` evaluation. The current
five-letter input appears simultaneously in the active row of every unresolved
board. When a board is solved, its tiles pulse in a quick bottom-to-top wave,
starting at row nine and ending at the solving row. Half a second later, the
unused rows fade out in the same order, excluding the solving row. The hidden
rows keep their layout space, so every board retains the same nine-row
footprint and the four-board layout does not move. Both transitions are
skipped when the player prefers reduced motion. If the guess ends the game,
the results dialog waits for this sequence to finish.

Double-clicking or double-tapping a board quickly enlarges it over the complete
four-board area while the other boards fade out. A transparent close control in
the enlarged board's upper-right corner reverses the animation at any time;
double-clicking or double-tapping the enlarged board or pressing Escape
provides the same action. While a board is enlarged, the help control shifts
left so it does not cover the close control. Both transitions become immediate
under `prefers-reduced-motion`. The enlarged layout renders tiles and text at
their final dimensions; transforms exist only during each transition so the
resting board remains sharp.

At the end, both a win and a loss open a centered results dialog. The dialog
always shows the four solutions in board order; it does not show the previous
turn-by-turn timeline. Each solution has a borderless card with a lightly green
background when solved and a lightly grey background when unresolved. A small
footer reports `Resuelta en 1 turno`, `Resuelta en N turnos`, or `No resuelta`.
A win uses a prominent trophy heading, while a loss shows one randomly selected
encouragement message.

Each solution card requests its dictionary information independently after the
game has ended. The word and result footer render immediately, while a skeleton
reserves the definition area. A successful request replaces that skeleton with
every valid lexical reading and the first matching RAE sense. An inflected verb
first reports its possible person, number, tense, and mood, then the first sense
of its infinitive. Because game words do not preserve vowel diacritics, all
valid accented and unaccented readings are retained. If a definition cannot be
loaded, the skeleton fades out and the card contracts to the word and result
footer. Successful definitions are stored locally for that game and restored
without another API request after closing or reloading the site. Failed
lookups remain retryable on a later visit. Both transitions are skipped under
`prefers-reduced-motion`.

The dialog also shows a horizontal timeline for the last seven game dates.
Victories display the final turn number in a green marker whose size decreases
from turn four through turn nine. Consecutive victories join with a green
segment; losses use a grey marker with an `X`, and dates without a completed
game remain neutral. The markers enter from left to right with a short elastic
scale animation, which is skipped under `prefers-reduced-motion`. A subtitle
reports no active streak, the first victory in a new streak, or the full number
of consecutive victories ending on the current game date.

The result dialog retains the separate seven-day streak timeline. After closing
the dialog, a compact finished-game panel keeps the results
available and counts down to the next 05:00 rollover in Madrid; reaching zero
reloads the daily game.

## Input

The interface renders a three-row Spanish virtual keyboard with letter,
Backspace, and Enter controls. Physical keyboard input remains available.

Without an enlarged board, the keyboard hides per-board `correct` and `present`
colours. It only greys a letter after the player has tried it and every board
confirms that the letter is absent. The key remains enabled.

While a board is enlarged, the keyboard reflects only that board's accumulated
`correct`, `present`, and `absent` evaluations. Restoring the four-board layout
returns the keyboard to its global absent-only mode. Keyboard colour changes
are immediate under `prefers-reduced-motion`.

Letters are normalized and rendered simultaneously in the active row of every
unresolved board. Backspace removes one letter, and Enter submits the current
word.

## Persistence

The version, date, guess list, and whether the game has ended are stored. On
load, guesses are replayed from scratch. A corrupt, inconsistent, or
different-date payload is removed.

Completed games are also stored by game date in a separate, versioned Local
Storage history. Each entry contains only the outcome and final attempt count.
This history is used for the seven-day timeline and for calculating a streak
that may be longer than the visible window. Missing dates and losses break the
current streak. Corrupt history is discarded, and restoring a completed game
repairs its entry.

## Local development

- Only one local session is active: reloading restores the same solutions and
  progress.
- The initial session gets four random words directly from the JSON file.
- The production calendar is not loaded.
- Each board displays its solution as a watermark to simplify manual checks.
  The UI requires both a `DEV` build and `local` mode; the watermark is never
  rendered in production.
- “Volver a jugar” (“Play again”) appears only after a win or loss.
- The button requests `POST /api/game/today`, replaces the local session,
  removes the previous progress, and creates state with the new `gameId`.
- Replaying does not clear streak history. A later completed replay on the same
  local game date replaces that date's result instead of creating a duplicate.
- In production, POST returns `405` and the button is not rendered.

The integration must use `getOrCreateLocalSession` during local startup and
`replayLocalGame` in the `LocalReplayButton` callback.
