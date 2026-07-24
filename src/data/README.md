# Dictionary

The production dictionary must be stored in `src/data/words.json`.

The file included in the repository contains only sample words for development
and test execution. It must be replaced before the application is released.

## Contract

- The content is a JSON array of strings.
- Each entry is normalized to uppercase.
- Accented vowels are normalized to their unaccented form.
- `Ñ` is preserved.
- Each normalized word contains exactly five characters from `A-Z` or
  `Ñ`.
- There can be no duplicates after normalization.
- Every word can be used both as a guess and as a solution.

Run `npm run validate:dictionary` after replacing the file.
