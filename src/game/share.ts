import type { GameState } from "./definitions";
import { NUMBER_EMOJI } from "./share/definitions";
import {
  combineBoards,
  evaluationToEmoji,
  normalizeSiteUrl,
} from "./share/utils";

export function createShareText(state: GameState, siteUrl: string): string {
  if (state.status === "playing") {
    throw new Error("No se puede compartir una partida sin terminar.");
  }

  const scores = state.boards.map((board) =>
    board.solvedAtAttempt === null
      ? "❌"
      : (NUMBER_EMOJI[board.solvedAtAttempt] ?? String(board.solvedAtAttempt)),
  );
  const boardRows = state.boards.map((_, boardIndex) =>
    state.attempts.map((attempt) =>
      evaluationToEmoji(attempt.boards[boardIndex] ?? null),
    ),
  );

  return [
    `Quordle · ${state.gameDate}`,
    `${scores[0]} ${scores[1]}`,
    `${scores[2]} ${scores[3]}`,
    "",
    ...combineBoards(boardRows[0] ?? [], boardRows[1] ?? []),
    "",
    ...combineBoards(boardRows[2] ?? [], boardRows[3] ?? []),
    "",
    normalizeSiteUrl(siteUrl),
  ].join("\n");
}
