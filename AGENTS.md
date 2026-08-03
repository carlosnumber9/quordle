# AGENTS.md

## Project

Daily Spanish-language Quordle built with Astro, TypeScript, React islands,
shadcn/ui, CSS Modules, GSAP, and Vercel.

Read `docs/README.md` before making significant changes.

## Commands

- `npm run dev`: local server. Do not start it unless explicitly requested by
  the owner.
- `npm run check`: Astro type checking and diagnostics.
- `npm test`: unit tests.
- `npm run validate:dictionary`: validates `src/data/words.json`.
- `npm run build`: checks and creates the production build.

## Architecture rules

- `src/game/` is independent of Astro, React, GSAP, and the DOM,
  except for `clipboard.ts`, which is an explicitly client-side utility.
- The UI renders state and dispatches actions; it does not reimplement rules.
- Solutions and the game date come from `/api/game/today`.
- Under `import.meta.env.DEV`, that API must not load the production calendar:
  it selects four words from the dictionary and allows replay after the game
  ends.
- A local session persists across reloads. Only the explicit “Volver a jugar”
  (“Play again”) action may replace it on the same day.
- The production calendar is immutable and loaded only by server code.
- The game day is calculated exclusively through `src/lib/game-date.ts`.
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
- The complete daily schedule lives in `src/data/daily-games.json`.
- `.env` is never committed; `.env.example` must reflect all variables.
- Public errors must not include credentials, queries, or solutions.

## Version control

- Use Git over SSH for remote operations. The `origin` URL must use the
  `git@github.com:owner/repository.git` form, and normal fetch, pull, and push
  operations must not depend on GitHub CLI authentication.
- Publish completed work to `main` unless the owner explicitly requests a
  different branch.
- Commit messages follow `<type>: <description>`, with the English description
  written in the simple past. Example: `feat: Added reduced boards gameplay`.
- Use an appropriate conventional type such as `feat`, `fix`, `refactor`,
  `docs`, `test`, or `chore`.

## Minimum required changes

- Rule changes: update tests and `docs/features/gameplay.md`.
- Calendar changes: preserve existing dates, validate full dictionary coverage,
  and update the calendar ADR.
- Date changes: update CET/CEST tests and the corresponding ADR.
- Shared-format changes: update the snapshot/expectations and
  `docs/features/result-sharing.md`.
- Local-mode/replay changes: update `docs/features/gameplay.md`, ADR-0003, and
  the local-session tests.
