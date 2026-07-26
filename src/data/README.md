# Dictionary

The production dictionary must be stored in `src/data/words.json`.

The versioned production schedule is stored in `daily-games.json`. Its imported
historical dates are immutable, and newly added dictionary words may only be
appended after the final scheduled date.

## Contract

- The content is a JSON array of strings.
- Each entry is normalized to uppercase.
- Accented vowels are normalized to their unaccented form.
- `Ñ` is preserved.
- Each normalized word contains exactly five characters from `A-Z` or
  `Ñ`.
- There can be no duplicates after normalization.
- Every word can be used both as a guess and as a solution.

Run `npm run validate:data` after changing either data file.
