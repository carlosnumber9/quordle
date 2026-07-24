# Deployment

## Supabase

1. Create the project.
2. Authenticate the CLI and run `npm run db:link`.
3. Apply `supabase/migrations/0001_create_daily_words.sql` with
   `npm run db:migrate`.
4. Create a dedicated secret key for the backend.
5. Confirm that `anon` and `authenticated` cannot access `daily_words`.

The automated `npm run db:verify` check must complete successfully. For the cron
job to work, `SUPABASE_SECRET_KEY` must be configured in Vercel with a backend
secret key; it is neither retrieved nor committed through the CLI.

## Vercel

1. Connect the repository.
2. Configure all five variables from `.env.example`.
3. Keep Node.js 24 aligned between `.nvmrc` and `engines.node`. Vercel
   guarantees only the configured major version (`24.x`) and updates minor and
   patch versions automatically.
4. Install with `npm ci` using the committed `package-lock.json`. If a Vercel
   installation fails inside npm, retry the first deployment without reusing
   the Build Cache.
5. Deploy with the official Astro adapter.
6. Verify `/api/health`.
7. Confirm that Vercel has registered the cron job from `vercel.json`.
8. Invoke the cron job manually with the Bearer token and verify that a second
   call returns `created: false`.

## Before production

- Replace the sample dictionary.
- Set `PUBLIC_SITE_URL` to the final domain.
- Add the shadcn preset and complete the interface.
- Run the validation suite described in `testing.md`.

This repository does not deploy automatically during the pre-interface phase.
