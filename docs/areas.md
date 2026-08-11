# Area map

| Area | Entry point | Responsibility |
| --- | --- | --- |
| Rules | `src/game/engine.ts` | Apply guesses and end games |
| Evaluation | `src/game/evaluator.ts` | Wordle colors and duplicate letters |
| Dictionary | `src/game/dictionary.ts` | Normalize, validate, and select |
| Persistence | `src/game/persistence.ts` | Save and reconstruct progress |
| Streak | `src/game/streak.ts` | Store completed dates and derive the current streak |
| Local session | `src/game/local-session.ts` | Keep or replace the local puzzle |
| Local client | `src/game/local-game-client.ts` | Load the session and run replays |
| Local replay | `src/game/replay.ts` | Visibility after a win or loss |
| Sharing | `src/game/share.ts` | Solution-free emoji text |
| Date | `src/lib/game-date.ts` | Madrid game day |
| Daily calendar | `src/services/daily-calendar.ts` | Validate and read scheduled games |
| Local game | `src/services/local-game.ts` | Random selection for development |
| Definitions | `src/services/word-definitions.ts` | Combine morphology with dictionary senses |
| Definition cache | `src/services/word-definitions-storage.ts` | Persist successful final definitions for the current game |
| HTTP | `src/pages/api/` | Input and output contracts |
| Calendar data | `src/data/daily-games.json` | Immutable production schedule |
| Interface | `src/components/game/Game.tsx` | Stable facade for the game island implemented in `Game/` |
| Final definitions | `src/components/game/ResultDefinitions/` | Load and render final word cards |

When investigating an issue, start with the area's entry point and its
corresponding `*.test.ts` file.
