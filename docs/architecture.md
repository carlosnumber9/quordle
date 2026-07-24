# Architecture

## Layers

1. `src/game/`: pure domain code. It normalizes, evaluates, and transforms
   state.
2. `src/lib/`: shared infrastructure-independent utilities.
3. `src/services/`: daily use cases and Supabase adapters.
4. `src/pages/api/`: HTTP transport, cron authentication, and error codes.
5. `src/pages/` and `src/components/`: Astro/React composition.

Dependencies point toward the domain. The domain has no knowledge of Astro,
Supabase, React, or GSAP.

## Loading flow

1. The page requests `GET /api/game/today`.
2. The server calculates the Madrid game date.
3. In production, the service retrieves four ordered rows or creates the game
   if it does not exist.
4. In development, it selects four words from the JSON file without loading
   the Supabase adapter.
5. The client receives the ID, date, solutions, mode, and replay permission.
6. The React island creates the state or reconstructs it from Local Storage.
7. Each guess is processed with `submitGuess`.
8. The UI persists the new state and animates the resulting evaluation.

## State

The server stores only the solution history. Player progress remains in Local
Storage and is reconstructed by replaying guesses through the engine; persisted
evaluations are not trusted.

Local development also stores the active session—its ID and four solutions—so
reloading does not grant a new game. Each replay receives a new ID and removes
the previous progress.

## UI integration

The page mounts a `Game` React island. Button, Card, Badge, Alert, Dialog,
Textarea, Separator, Skeleton, and Sonner come from the shadcn preset. The
`Board` and `Keyboard` composition components use only Tailwind utilities tied
to the preset tokens; they do not add their own style sheets, colors, or
variables.

The island renders the engine's immutable state, loads and restores the
session, dispatches guesses, and delegates rules to `src/game/`. GSAP
coordinates the title entrance, visual feedback for evaluated tiles, collapsing
solved boards, and revealing the result after a win or loss. All these
animations are skipped when `prefers-reduced-motion` is enabled.

The boards are arranged in two independent columns: 1 above 3 and 2 above 4.
The columns remain anchored to the top so that the upper boards do not move
when they collapse and each lower board rises as the board above it shrinks.
