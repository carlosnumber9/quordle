import type { BoardEvaluation, GameState, LetterStatus } from "./types";

const EMOJI_BY_STATUS: Readonly<Record<LetterStatus, string>> = {
  absent: "⬛",
  present: "🟨",
  correct: "🟩",
};
const INACTIVE_ROW = "⬜⬜⬜⬜⬜";
const NUMBER_EMOJI = [
  "",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
] as const;

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

function evaluationToEmoji(evaluation: BoardEvaluation): string {
  return evaluation === null
    ? INACTIVE_ROW
    : evaluation.map((status) => EMOJI_BY_STATUS[status]).join("");
}

function combineBoards(
  left: ReadonlyArray<string>,
  right: ReadonlyArray<string>,
): ReadonlyArray<string> {
  const rowCount = Math.max(left.length, right.length);
  return Array.from({ length: rowCount }, (_, index) => {
    const leftRow = left[index] ?? INACTIVE_ROW;
    const rightRow = right[index] ?? INACTIVE_ROW;
    return `${leftRow}  ${rightRow}`;
  });
}

function normalizeSiteUrl(siteUrl: string): string {
  const value = siteUrl.trim().replace(/\/+$/, "");
  if (value.length === 0) {
    throw new Error("La URL pública es obligatoria para compartir.");
  }

  return value;
}
