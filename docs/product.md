# Product and scope

## Goal

Provide a simple, fast, polished daily Quordle game for a small group of people.
The product prioritizes clarity and maintainability over scalability.

## MVP

- Four simultaneous boards.
- A single submitted word affects all four boards.
- Nine total guesses.
- The same game for everyone.
- Daily rollover at 05:00 in `Europe/Madrid`.
- Progress restoration in the same browser.
- A browser-local seven-day result timeline and current winning streak.
- Replays blocked after the game ends.
- A copyable final result containing an emoji grid and a link.
- Final cards for all four solutions with their first RAE definitions.
- Restrained, accessible GSAP animations.
- An explicit replay after the game ends in local development to make testing
  easier.

## Out of scope

- Authentication, accounts, and profiles.
- Account-level or server-synchronized statistics.
- Multiplayer.
- A playable game history.
- Hard mode.
- Configurable themes.
- Multiple languages.
- PWA.
- Server-side player persistence.

Support for letters, Enter, and Backspace from a physical keyboard is basic
input and accessibility, not a configurable shortcut system.

The option to play again does not exist in production. The daily lock remains
in place there even after the game ends.

## Visible states

The UI represents loading, an active game, an incomplete word, an unknown word,
a win, a loss, restoration, and a temporary service failure. It never displays
a blank screen when an error occurs.
