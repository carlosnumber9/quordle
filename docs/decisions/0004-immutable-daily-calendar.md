# ADR-0004: immutable daily calendar

## Status

Accepted, amended 2026-08-10.

## Decision

Production solutions live in the versioned `src/data/daily-games.json` file.
It contains four ordered dictionary words for every consecutive game date and
is loaded only by server code. The build validates full, non-repeating
dictionary coverage before deployment.

The initial calendar preserves the legacy rows from 2026-07-24 through
2026-07-26. Remaining words are ranked reproducibly with SHA-256 and the stored
seed, then assigned in groups of four from 2026-07-27 onward. Routine extensions
append new words after the last existing date.

Published games are immutable. A material dictionary update may explicitly
regenerate only games after a supplied cutoff date. Regeneration keeps the
stored seed and ranks every unused current dictionary word together, preventing
new word categories from being concentrated at the end of the schedule. A word
used on or before the cutoff cannot be removed from the dictionary.

## Rationale

The product has no accounts or server-side player state. The removed backend
stored only the daily solution schedule and used-word history, both of which
are finite and immutable. Versioning that schedule removes a database, cron
execution, concurrency handling, and secret configuration without changing
gameplay.

## Consequence

Future solutions are visible to repository readers. Changing the dictionary
requires extending or explicitly regenerating and then validating the calendar.
A date outside the generated range is unavailable until the schedule is
extended. Regenerating unpublished dates creates a large data diff, but keeps
all player-visible history stable.
