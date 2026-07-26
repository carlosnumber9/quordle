# Dictionary

## Location

The complete file must replace `src/data/words.json`. It is not configured
through an environment variable because it must be included in the Vercel
function bundle.

## Normalization

Leading and trailing spaces are removed, letters are converted to uppercase,
diacritics are removed, and `Ñ` is preserved. For example:

- `árbol` → `ARBOL`
- `niñez` → `NIÑEZ`

Duplicates are checked after this transformation.

## Requirements

- Valid JSON.
- An array of strings.
- Exactly five normalized letters.
- Only `A-Z` and `Ñ`.
- No duplicates.
- At least four entries.

Run `npm run validate:data` before every deployment that changes the word list.
Every dictionary word must appear exactly once in the daily calendar. New words
must be added in groups of four and appended with `npm run calendar:generate`;
existing dates are never reassigned.
