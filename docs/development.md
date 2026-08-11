# Local development

## Requirements

- Node.js 24.
- Variables based on `.env.example` when overriding the shared-result URL or
  testing definitions with an API key.

## Setup

1. `npm install`
2. Optionally create `.env`.
3. Run `npm run validate:data`.
4. `npm run dev`

Agents must not start the development server or open the application in a local
browser unless the owner explicitly requests it.

## Variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | Public | Link included in shared results |
| `RAE_API_KEY` | Server secret | Higher quota for final definitions; required in production |

The project builds without an environment file. Add `RAE_API_KEY` for local
definition testing: the anonymous tier allows only ten requests per minute,
while a single ambiguous word may require several lemma lookups. Without the
key, some definition cards can collapse after the provider returns `429`.
While `npm run dev` is running, the API selects four words from the dictionary and the browser
maintains one local session per date. After the game ends, another can be
generated with “Volver a jugar” (“Play again”). This behavior is removed from
the production build.

## shadcn/ui

The project uses preset `b1aJEHx6e` with the Luma style, zinc base, lime theme,
Figtree font, large radius, and Remix icons. `components.json` is the source of
configuration and must not be reconfigured manually.

Before adding a custom component, reuse those available in
`src/components/ui/`. Composition may use Tailwind utilities based on the
preset tokens, but it must not introduce its own colors, global variables, or
style sheets.
