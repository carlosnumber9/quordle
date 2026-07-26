# Development practices

## TypeScript

- Strict mode and `noUncheckedIndexedAccess`.
- `readonly` types in domain contracts.
- Discriminated results for expected errors.
- Infrastructure errors are caught at the HTTP boundary.

## Code design

- Explicit separation between domain, infrastructure, and presentation.
- Random generator injection for deterministic local-selection tests.
- No abstractions with only one implementation unless they define an external
  boundary.
- Derived state, such as the keyboard, is not persisted.
- Aim for source files of at most 100 lines; split by responsibility rather
  than compressing unrelated behavior.
- Keep interfaces, type aliases, and constants in the nearest
  `definitions.ts`.
- Keep auxiliary functions in the nearest `utils.ts`.
- Keep component animation hooks and GSAP timelines in that component's local
  `animations.ts`.

## Security

- Production calendar imports remain in `.server.ts` modules.
- Generated dates are immutable and validation rejects silent reassignment.
- Generic public messages do not reveal solutions outside the daily payload.

## Interface

- Semantic state in addition to color.
- Touch navigation and physical keyboard support.
- Visible focus and `aria-live` regions.
- `prefers-reduced-motion` disables nonessential movement.
- Animations are cleaned up when components unmount.
