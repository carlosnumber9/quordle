# ADR-0001: Madrid game day

## Status

Accepted.

## Decision

The date changes at 05:00 in `Europe/Madrid`. The public API calculates the
active game date and reads it from the immutable calendar. Once a game has
ended, the client calculates the next 05:00 Madrid instant with the same shared
date utility, shows a countdown, and reloads the game when that instant is
reached.

## Rationale

Resolving Madrid wall-clock time through `Intl.DateTimeFormat` follows CET,
CEST, and both transitions without fixed UTC offsets. Because every game is
pregenerated, the rollover does not depend on a scheduled task completing.

## Consequence

Every generated date already exists in the deployed calendar but the API only
serves the active one. Countdown calculations use the same date rules as the
server.
