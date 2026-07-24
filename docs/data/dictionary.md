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

The current file is a development sample. Run
`npm run validate:dictionary` before every deployment that changes the word
list. If fewer than four unused words remain, they are not recycled
automatically.
