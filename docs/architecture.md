# Architecture

## Layers

1. `src/game/`: pure domain code. It normalizes, evaluates, and transforms
   state.
2. `src/lib/`: shared infrastructure-independent utilities.
3. `src/services/`: daily calendar lookup and local game creation.
4. `src/pages/api/`: HTTP transport and error codes.
5. `src/pages/` and `src/components/`: Astro/React composition.

Large areas expose a small entry point and keep their implementation in a
same-named local directory. Component contracts and constants live in
`definitions.ts`, helpers in `utils.ts`, and GSAP integration in
`animations.ts`. This keeps presentation details close to their owner without
leaking React or GSAP into the domain.

Dependencies point toward the domain. The domain has no knowledge of Astro,
React, or GSAP.

## Loading flow

1. The page requests `GET /api/game/today`.
2. The server calculates the Madrid game date.
3. In production, the server-only service retrieves four words from the
   immutable calendar.
4. In development, it selects four words from the dictionary without loading
   the production calendar.
5. The client receives the ID, date, solutions, mode, and replay permission.
6. The React island creates the state or reconstructs it from Local Storage.
7. Each guess is processed with `submitGuess`.
8. The UI persists the new state and animates the resulting evaluation.

## State

The repository stores the complete solution calendar. Player progress remains
in Local Storage and is reconstructed by replaying guesses through the engine;
persisted evaluations are not trusted. Completed outcomes and final turn counts
are kept under a separate versioned Local Storage key, indexed by game date.
The streak derivation remains domain code and treats losses or missing dates as
breaks.

Local development also stores the active session—its ID and four solutions—so
reloading does not grant a new game. Each replay receives a new ID and removes
the previous progress without clearing streak history.

## UI integration

The page mounts the `Game` React island through the stable facade
`src/components/game/Game.tsx`; its implementation lives in the adjacent
`Game/` directory. Button, Card, Badge, Alert, Dialog, Textarea, Separator,
Skeleton, and Sonner come from the shadcn preset. Composition components use
Tailwind utilities and component-local CSS Modules tied to the preset tokens;
they do not introduce global colors or variables.

The island renders the engine's immutable state, loads and restores the
session, dispatches guesses, and delegates rules to `src/game/`. Each component
owns its GSAP code in a local `animations.ts`: the title entrance and evaluated
tiles belong to `Game`, collapsing solved boards to `Board`, and result reveal
and the left-to-right streak markers to `ResultDialog`. All animations are skipped when
`prefers-reduced-motion` is enabled.

The boards are arranged in two independent columns: 1 above 3 and 2 above 4.
The columns remain anchored to the top so that the upper boards do not move
when they collapse and each lower board rises as the board above it shrinks.
