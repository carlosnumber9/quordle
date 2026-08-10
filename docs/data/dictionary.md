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

The dictionary includes five-letter verb forms as well as infinitives, nouns,
adjectives, and the other accepted words. Conjugated forms follow the same
normalization and validation rules as every other entry; the game does not
maintain a separate category or acceptance rule for them.

Run `npm run validate:data` before every deployment that changes the word list.
Every dictionary word must appear exactly once in the daily calendar. New words
must leave the unused dictionary divisible into groups of four. Small additions
can be appended with `npm run calendar:generate`. A material dictionary update
can instead regenerate unpublished games with
`npm run calendar:generate -- --regenerate-after <YYYY-MM-DD>`; the cutoff date
and every earlier published game remain unchanged.
