import type { GameState, LetterStatus } from "./definitions";
import {
  STATUS_PRIORITY,
  type KeyboardState,
} from "./keyboard/definitions";

export type {
  KeyboardBoardState,
  KeyboardState,
} from "./keyboard/definitions";

export function isLetterAbsentFromAllBoards(
  keyboardState: KeyboardState,
  letter: string,
): boolean {
  let hasAbsentEvaluation = false;

  for (const board of keyboardState) {
    const status = board[letter];

    if (status === "correct" || status === "present") {
      return false;
    }

    if (status === "absent") {
      hasAbsentEvaluation = true;
    }
  }

  return hasAbsentEvaluation;
}

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
