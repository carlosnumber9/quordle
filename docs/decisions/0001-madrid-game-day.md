# ADR-0001: Madrid game day

## Status

Accepted.

## Decision

The date changes at 05:00 in `Europe/Madrid`. Vercel Cron is scheduled once a
day at 03:00 UTC and generates the current Madrid calendar date. The public API
calculates the active game date separately.

## Rationale

Vercel uses UTC, and a single expression cannot track CET/CEST. Running at
03:00 UTC prepares the game on time in both seasons without requiring two daily
runs. Visibility still changes at exactly 05:00.

## Consequence

In winter, the row for the new day exists one hour before it is served. This
does not affect gameplay and simplifies operation on plans that allow one daily
cron job.
