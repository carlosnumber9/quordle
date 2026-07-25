import type { GameState, SubmitGuessResult } from "../definitions";

export function rejected(
  state: GameState,
  error: Exclude<SubmitGuessResult, { accepted: true }>["error"],
): SubmitGuessResult {
  return {
    accepted: false,
    error,
    state,
  };
}

export function freezeGameState(state: GameState): GameState {
  const boards = Object.freeze(
    state.boards.map((board) => Object.freeze({ ...board })),
  );
  const attempts = Object.freeze(
    state.attempts.map((attempt) =>
      Object.freeze({
        guess: attempt.guess,
        boards: Object.freeze(
          attempt.boards.map((evaluation) =>
            evaluation === null ? null : Object.freeze([...evaluation]),
          ),
        ),
      }),
    ),
  );

  return Object.freeze({
    ...state,
    boards,
    attempts,
  });
}
