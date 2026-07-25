import { isValidWordShape, normalizeWord } from "../dictionary";
import {
  MAX_ATTEMPTS,
  type Attempt,
  type BoardState,
  type GameState,
  type SubmitGuessResult,
} from "../definitions";
import { evaluateGuess, isCorrectEvaluation } from "../evaluator";
import { freezeGameState, rejected } from "./utils";

export function submitGuess(
  state: GameState,
  rawGuess: string,
  acceptedWords: ReadonlySet<string>,
): SubmitGuessResult {
  if (state.status !== "playing") {
    return rejected(state, "game-finished");
  }

  const guess = normalizeWord(rawGuess);
  if (Array.from(guess).length !== 5) {
    return rejected(state, "invalid-length");
  }
  if (!isValidWordShape(guess)) {
    return rejected(state, "invalid-characters");
  }
  if (!acceptedWords.has(guess)) {
    return rejected(state, "unknown-word");
  }

  const attemptNumber = state.attempts.length + 1;
  const evaluations = state.boards.map((board) =>
    board.solvedAtAttempt === null
      ? evaluateGuess(board.solution, guess)
      : null,
  );
  const boards: BoardState[] = state.boards.map((board, index) => {
    const evaluation = evaluations[index];
    const newlySolved =
      board.solvedAtAttempt === null &&
      evaluation !== null &&
      evaluation !== undefined &&
      isCorrectEvaluation(evaluation);
    return newlySolved
      ? { ...board, solvedAtAttempt: attemptNumber }
      : board;
  });
  const attempt: Attempt = { guess, boards: evaluations };
  const attempts = [...state.attempts, attempt];
  const allSolved = boards.every((board) => board.solvedAtAttempt !== null);
  const status = allSolved
    ? "won"
    : attempts.length >= MAX_ATTEMPTS
      ? "lost"
      : "playing";

  return {
    accepted: true,
    state: freezeGameState({ ...state, status, boards, attempts }),
  };
}
