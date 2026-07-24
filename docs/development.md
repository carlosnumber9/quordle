# Local development

## Requirements

- Node.js 22.12 or later.
- A Supabase project.
- Variables based on `.env.example`.

## Setup

1. `npm install`
2. Create `.env`.
3. Run `npm run db:link` to link the project specified by `SUPABASE_URL`.
4. Run `npm run db:migrate` to apply pending migrations.
5. Replace and validate the dictionary.
6. `npm run dev`

Agents must not start the development server or open the application in a local
browser unless the owner explicitly requests it.

On first use, authenticate the CLI with `npx supabase login`. `db:status`
compares the local and remote migration histories without modifying the
database. `db:verify` checks the Data API connection and verifies that
`daily_words` rejects the public key.

## Variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Server | Supabase Data API |
| `SUPABASE_SECRET_KEY` | Secret | Administrative read/write access |
| `SUPABASE_PUBLISHABLE_KEY` | Server | Session renewal in middleware |
| `CRON_SECRET` | Secret | Vercel Cron authentication |
| `PUBLIC_SITE_URL` | Public | Link included in shared results |

The project can build without real values to simplify initial setup, but the
game APIs will respond as unavailable.

Supabase credentials are not required to play while `npm run dev` is running.
The API selects four words from the JSON file and the browser maintains one
local session per date. After the game ends, another can be generated with
“Volver a jugar” (“Play again”). This behavior is removed from the production
build.

## shadcn/ui

The project uses preset `b1aJEHx6e` with the Luma style, zinc base, lime theme,
Figtree font, large radius, and Remix icons. `components.json` is the source of
configuration and must not be reconfigured manually.

Before adding a custom component, reuse those available in
`src/components/ui/`. Composition may use Tailwind utilities based on the
preset tokens, but it must not introduce its own colors, global variables, or
style sheets.
