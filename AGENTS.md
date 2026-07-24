# AGENTS.md

## Project

Daily Spanish-language Quordle built with Astro, TypeScript, React islands,
shadcn/ui, CSS Modules, GSAP, Supabase, and Vercel.

Read `docs/README.md` before making significant changes.

## Commands

- `npm run dev`: local server. Do not start it unless explicitly requested by
  the owner.
- `npm run check`: Astro type checking and diagnostics.
- `npm test`: unit tests.
- `npm run validate:dictionary`: validates `src/data/words.json`.
- `npm run build`: checks and creates the production build.

## Architecture rules

- `src/game/` is independent of Astro, React, GSAP, Supabase, and the DOM,
  except for `clipboard.ts`, which is an explicitly client-side utility.
- The UI renders state and dispatches actions; it does not reimplement rules.
- Solutions and the game date come from `/api/game/today`.
- Under `import.meta.env.DEV`, that API must not import or query Supabase: it
  selects four words from the JSON file and allows replay after the game ends.
- A local session persists across reloads. Only the explicit “Volver a jugar”
  (“Play again”) action may replace it on the same day.
- Every Supabase connection is server-only. Never import
  `SUPABASE_SECRET_KEY` from client code.
- The game day is calculated exclusively through `src/lib/game-date.ts`.
- Do not silently complete a partial daily game in the database.
- Do not distinguish between accepted guesses and possible solutions.
- Keep state immutable and functions small, typed, and testable.

## shadcn/ui and styles

- The owner will provide a shadcn/ui preset later.
- Do not run `shadcn init` without that preset.
- Do not replace or reconfigure `components.json` once it has been added.
- Reuse components from `src/components/ui/` before creating equivalents.
- Use CSS Modules for custom composition and preserve the global tokens created
  by the preset.
- GSAP must respect `prefers-reduced-motion` and must not slow down gameplay.

## Data and secrets

- The complete dictionary lives in `src/data/words.json`.
- `.env` is never committed; `.env.example` must reflect all variables.
- `SUPABASE_SECRET_KEY` and `CRON_SECRET` are server secrets.
- Public errors must not include credentials, queries, or solutions.

## Minimum required changes

- Rule changes: update tests and `docs/features/gameplay.md`.
- Schema changes: add a migration; never edit one that has already been
  deployed.
- Cron/date changes: update CET/CEST tests and the corresponding ADR.
- Shared-format changes: update the snapshot/expectations and
  `docs/features/result-sharing.md`.
- Local-mode/replay changes: update `docs/features/gameplay.md`, ADR-0003, and
  the local-session tests.
