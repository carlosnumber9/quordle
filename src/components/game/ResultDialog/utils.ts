import type { GameState } from "@/game/definitions";

import type { ResultSummary } from "./definitions";

export function summarizeResult(game: GameState): ResultSummary {
  const resolvedWordsByAttempt = game.attempts.map((_, attemptIndex) =>
    game.boards
      .filter((board) => board.solvedAtAttempt === attemptIndex + 1)
      .map((board) => board.solution),
  );
  const unresolvedWords = game.boards
    .filter((board) => board.solvedAtAttempt === null)
    .map((board) => board.solution);

  return {
    resolvedWordsByAttempt,
    showTimeline:
      game.status === "won" || unresolvedWords.length < game.boards.length,
    unresolvedWords,
  };
}

export function accessibleTurnResult(
  resolvedWords: ReadonlyArray<string>,
  revealedWords: ReadonlyArray<string>,
): string {
  if (resolvedWords.length > 0 && revealedWords.length > 0) {
    return `palabra resuelta: ${resolvedWords.join(", ")}; palabras sin resolver: ${revealedWords.join(", ")}`;
  }
  if (resolvedWords.length > 0) {
    return `palabra resuelta: ${resolvedWords.join(", ")}`;
  }
  if (revealedWords.length > 0) {
    return `palabras sin resolver: ${revealedWords.join(", ")}`;
  }
  return "ninguna palabra resuelta";
}
