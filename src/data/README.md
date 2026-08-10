# Dictionary

The production dictionary must be stored in `src/data/words.json`.

The versioned production schedule is stored in `daily-games.json`. Its imported
and published dates are immutable. Routine additions are appended after the
final scheduled date; unpublished dates may be explicitly regenerated after a
chosen cutoff when the dictionary changes materially.

## Contract

- The content is a JSON array of strings.
- Each entry is normalized to uppercase.
- Accented vowels are normalized to their unaccented form.
- `Ñ` is preserved.
- Each normalized word contains exactly five characters from `A-Z` or
  `Ñ`.
- There can be no duplicates after normalization.
- Five-letter conjugated verb forms are included.
- Every word can be used both as a guess and as a solution.

Run `npm run validate:data` after changing either data file.
