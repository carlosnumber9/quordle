# Testing strategy

`npm test` runs Vitest.

## Critical coverage

- Duplicate letters and exact-position priority.
- State immutability and transitions.
- Solved boards remaining inactive.
- Wins, losses, and invalid guesses.
- An independent keyboard state for each board.
- Dictionary normalization and exhaustion.
- Local Storage restoration.
- Seven-day streak history, interruptions, and same-date replacement.
- Shared text without words.
- The 05:00 cutoff in winter, summer, and both daylight-saving transitions.
- Existing games, creation, races, and row corruption.
- Local selection without history, a new identity for each replay, and a stable
  session across reloads.
- The replay button being visible only after a win or loss in local mode.

## Before merging

1. `npm run validate:dictionary`
2. `npm test`
3. `npm run check`
4. `npm run build`

Once the UI exists, interaction tests and manual checks for responsive
behavior, keyboard support, and `prefers-reduced-motion` will be added.
