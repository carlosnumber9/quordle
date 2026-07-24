import type { GameState, LetterStatus } from "./types";

export type KeyboardBoardState = Readonly<Record<string, LetterStatus>>;
export type KeyboardState = ReadonlyArray<KeyboardBoardState>;

const STATUS_PRIORITY: Readonly<Record<LetterStatus, number>> = {
  absent: 0,
  present: 1,
  correct: 2,
};

export function deriveKeyboardState(state: GameState): KeyboardState {
  const boards: Array<Record<string, LetterStatus>> = state.boards.map(() => ({}));

  for (const attempt of state.attempts) {
    const letters = Array.from(attempt.guess);

    attempt.boards.forEach((evaluation, boardIndex) => {
      if (evaluation === null) {
        return;
      }

      const board = boards[boardIndex];
      if (board === undefined) {
        return;
      }

      evaluation.forEach((status, letterIndex) => {
        const letter = letters[letterIndex];
        if (letter === undefined) {
          return;
        }

        const previous = board[letter];
        if (
          previous === undefined ||
          STATUS_PRIORITY[status] > STATUS_PRIORITY[previous]
        ) {
          board[letter] = status;
        }
      });
    });
  }

  return Object.freeze(
    boards.map((board) => Object.freeze({ ...board })),
  );
}
