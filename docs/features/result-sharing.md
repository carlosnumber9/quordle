# Result sharing

Only a completed game can be shared.

## Content

- Game name and date.
- Result per board: the number emoji for the solving guess or `❌`.
- Four grids arranged in two rows and two columns.
- `🟩`, `🟨`, and `⬛` for evaluations.
- `⬜` for guesses made after a board was solved.
- Canonical URL without a trailing slash.

No letters, words, or solutions are included.

## Clipboard

The UI calls `createShareText` and then `copyTextToClipboard`. If the Clipboard
API is unavailable or blocked by the browser, the helper returns `false` and a
dialog displays the selected text so the user can copy it manually.

The URL comes from `PUBLIC_SITE_URL`; during development, the browser's current
origin may be used.
