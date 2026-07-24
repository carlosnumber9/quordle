# Area map

| Area | Entry point | Responsibility |
| --- | --- | --- |
| Rules | `src/game/engine.ts` | Apply guesses and end games |
| Evaluation | `src/game/evaluator.ts` | Wordle colors and duplicate letters |
| Dictionary | `src/game/dictionary.ts` | Normalize, validate, and select |
| Persistence | `src/game/persistence.ts` | Save and reconstruct progress |
| Local session | `src/game/local-session.ts` | Keep or replace the local puzzle |
| Local client | `src/game/local-game-client.ts` | Load the session and run replays |
| Local replay | `src/game/replay.ts` | Visibility after a win or loss |
| Sharing | `src/game/share.ts` | Solution-free emoji text |
| Date | `src/lib/game-date.ts` | Madrid game day |
| Daily use case | `src/services/daily-game.ts` | Idempotency and concurrency |
| Local game | `src/services/local-game.ts` | Random selection without Supabase |
| Supabase | `src/services/*supabase*` | Server-only adapter |
| HTTP | `src/pages/api/` | Input and output contracts |
| Database | `supabase/migrations/` | History and constraints |
| Interface | `src/components/game/Game.tsx` | Loading, interaction, and rendering with the shadcn preset |

When investigating an issue, start with the area's entry point and its
corresponding `*.test.ts` file.
