# Daily puzzle

## Dates

The visible date changes at 05:00 in `Europe/Madrid`. The calculation uses local
fields produced by `Intl.DateTimeFormat`; it does not subtract a fixed number
of hours, so it works in CET, CEST, and during transitions between them.

## Calendar

`src/data/daily-games.json` is the immutable source of production solutions.
It contains a format version, a reproducibility seed, and four ordered words
for every game date. The calendar is validated against the complete dictionary
during the production build.

Every date must be consecutive, every game must contain four distinct
dictionary words, and every dictionary word must appear exactly once across the
calendar. Published dates are never reassigned.

`GET /api/game/today` calculates the active Madrid game date and reads that
entry. The response is not cached. Dates outside the generated range return
`503 game-unavailable`.

## Generation and extension

The initial generator imports `word`, `game_date`, and `position` from a legacy
CSV export, preserves those games, and orders them by position. It then ranks
unused dictionary words with SHA-256 using the stored seed, groups them in
blocks of four, and assigns consecutive dates.

`npm run calendar:generate -- --history <csv>` creates the first calendar.
Once the file exists, `npm run calendar:generate` may only append newly added
dictionary words after the last existing date. It never accepts a new history
or seed and never overwrites an existing date.

For a material dictionary update,
`npm run calendar:generate -- --regenerate-after <YYYY-MM-DD>` preserves every
game through the cutoff date and replaces all later games. The unused words
from the current dictionary are ranked together with the existing seed, so new
and previously scheduled words are distributed across the rebuilt future. The
command rejects a cutoff outside the existing calendar and rejects removal of
a word that has already been published.

## Local development branch

With `import.meta.env.DEV`, `GET /api/game/today` selects four distinct words
from the JSON file and returns:

- a unique `gameId` with the `local:` prefix
- `gameDate`
- `words`
- `mode: "local"`
- `replayAllowed: true`

The production calendar is not loaded. The client persists this response so it
can be reused after a reload. Once the game ends, `POST /api/game/today`
generates another local game. In production, GET returns `mode: "daily"` and
`replayAllowed: false`, and POST is disabled.

## Operational failures

- Date outside the calendar: `503`; extend the dictionary and calendar.
- Invalid calendar: the data validation or production build fails.
