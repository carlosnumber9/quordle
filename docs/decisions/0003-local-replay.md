# ADR-0003: replayable games in local development only

## Status

Accepted.

## Decision

Local development has one active session per date, stored in Local Storage.
Reloading preserves that game. After it ends, an explicit “Volver a jugar”
(“Play again”) action can replace it with four new words from the JSON file.

The local endpoint does not query Supabase. Each game receives a unique
`gameId` to prevent progress from another replay on the same day from being
restored.

## Rationale

This makes it possible to test wins, losses, persistence, and dialogs repeatedly
without polluting the shared history or preparing data in Supabase.

## Consequences

- Solutions are stored locally only during development.
- The interface may display them as watermarks only when
  `import.meta.env.DEV` and `local` mode both apply.
- `POST /api/game/today` exists only in DEV mode.
- Production keeps a single daily game and never shows replay controls.
- The future UI must replace the session before creating the new state.
- Replacing the session clears only active progress. Browser-local streak
  history remains available, and the latest completed replay replaces the
  result for that date.
