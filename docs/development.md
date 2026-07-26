# Local development

## Requirements

- Node.js 24.
- Variables based on `.env.example` only when overriding the shared-result URL.

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

The project builds without an environment file. While `npm run dev` is
running, the API selects four words from the dictionary and the browser
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
