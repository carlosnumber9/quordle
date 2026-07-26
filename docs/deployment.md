# Deployment

## Vercel

1. Connect the repository.
2. Optionally configure `PUBLIC_SITE_URL` from `.env.example`.
3. Keep Node.js 24 aligned between `.nvmrc` and `engines.node`. Vercel
   guarantees only the configured major version (`24.x`) and updates minor and
   patch versions automatically.
4. Install with `npm ci` using the committed `package-lock.json`. If a Vercel
   installation fails inside npm, retry the first deployment without reusing
   the Build Cache.
5. Deploy with the official Astro adapter.
6. Verify `/api/health`.
7. Request `/api/game/today` and verify its date and `daily` mode.

The production build runs both dictionary and calendar validation. Deployment
must stop if either file is invalid or they do not contain exactly the same
word set.

## Before production

- Set `PUBLIC_SITE_URL` to the final domain.
- Add the shadcn preset and complete the interface.
- Run the validation suite described in `testing.md`.

This repository does not deploy automatically during the pre-interface phase.
