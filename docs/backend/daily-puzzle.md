# Daily puzzle

## Dates

The visible date changes at 05:00 in `Europe/Madrid`. The calculation uses local
fields produced by `Intl.DateTimeFormat`; it does not subtract a fixed number
of hours, so it works in CET, CEST, and during transitions between them.

## Cron

Vercel runs `GET /api/cron/create-daily-game` at `03:00 UTC`. In summer this is
05:00 in Madrid; in winter it prepares that calendar day's game at 04:00, but
the game is not served until the 05:00 rollover.

The route requires `Authorization: Bearer <CRON_SECRET>` and never returns
words.

## Generation

1. Query rows for the target date.
2. If four valid rows exist, return immediately.
3. If one to three rows exist, fail because the data is corrupt.
4. Paginate through and load all previously used words.
5. Remove them from the dictionary.
6. Shuffle the remainder and choose four.
7. Insert all four in a single statement.

The `word` primary key prevents historical reuse. The unique
`(game_date, position)` constraint guarantees exactly one winner per position.
If one execution loses an insertion race, it reads again and accepts the
winner's complete game.

## Recovery

`GET /api/game/today` applies the same idempotent operation. If the cron job
failed, the first subsequent visit can create the game. The response is not
cached.

## Local development branch

With `import.meta.env.DEV`, `GET /api/game/today` selects four distinct words
from the JSON file and returns:

- a unique `gameId` with the `local:` prefix
- `gameDate`
- `words`
- `mode: "local"`
- `replayAllowed: true`

The Supabase adapter is not imported and the history is not queried. The client
persists this response so it can be reused after a reload. Once the game ends,
`POST /api/game/today` generates another local game. In production, GET returns
`mode: "daily"` and `replayAllowed: false`, and POST is disabled.

## Operational failures

- Exhausted dictionary: `503`; replace or expand the dictionary.
- Partial game: `500`; inspect the rows manually and do not fill the missing
  positions at random.
- Missing configuration: `503`; check the Vercel variables.
