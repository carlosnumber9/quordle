# ADR-0002: server-only Supabase

## Status

Accepted.

## Decision

The browser calls Astro API Routes and does not create Supabase clients.
`.server.ts` modules create the administrative client with a secret key. Astro
middleware may create a per-request SSR client with a publishable key to renew
Supabase Auth cookies without exposing that client to the browser.

## Rationale

The client does not need direct data access. Keeping the table behind the server
reduces the number of public policies, prevents anonymous writes, and protects
the administrative key. The session SSR client is not reused across requests
and does not grant administrative access.

## Consequence

The `/api/game/today` response contains the four solutions required to play and
can be inspected from the browser. This is inherent to a locally evaluated game
and is accepted within the project's scope.
