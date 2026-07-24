# Development practices

## TypeScript

- Strict mode and `noUncheckedIndexedAccess`.
- `readonly` types in domain contracts.
- Discriminated results for expected errors.
- Infrastructure errors are caught at the HTTP boundary.

## Code design

- Explicit separation between domain, infrastructure, and presentation.
- Repository and random generator injection for testing without network access.
- No abstractions with only one implementation unless they define an external
  boundary, such as `DailyGameRepository`.
- Derived state, such as the keyboard, is not persisted.

## Security

- Least privilege in Supabase, with RLS enabled.
- Secret keys only in `.server.ts` modules.
- Cron authentication with a Bearer token.
- Generic public messages, with details only in server logs.

## Interface

- Semantic state in addition to color.
- Touch navigation and physical keyboard support.
- Visible focus and `aria-live` regions.
- `prefers-reduced-motion` disables nonessential movement.
- Animations are cleaned up when components unmount.
