import { isValidWordShape, normalizeWord } from "./dictionary";
import { evaluateGuess, isCorrectEvaluation } from "./evaluator";
import {
  BOARD_COUNT,
  GAME_STATE_VERSION,
  MAX_ATTEMPTS,
  type Attempt,
  type BoardState,
  type GameState,
  type SubmitGuessResult,
} from "./types";

const GAME_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function createGame(
  gameDate: string,
  solutions: ReadonlyArray<string>,
  gameId: string = gameDate,
): GameState {
  if (!GAME_DATE_PATTERN.test(gameDate)) {
    throw new TypeError("La fecha de juego debe usar el formato YYYY-MM-DD.");
  }

  if (solutions.length !== BOARD_COUNT) {
    throw new RangeError(`El juego necesita exactamente ${BOARD_COUNT} palabras.`);
  }

  if (gameId.trim().length === 0) {
    throw new TypeError("El identificador de partida no puede estar vacío.");
  }

  const normalizedSolutions = solutions.map(normalizeWord);
  if (
    normalizedSolutions.some((solution) => !isValidWordShape(solution)) ||
    new Set(normalizedSolutions).size !== BOARD_COUNT
  ) {
    throw new TypeError(
      "Las soluciones deben ser cuatro palabras válidas y diferentes.",
    );
  }

  return freezeGameState({
    version: GAME_STATE_VERSION,
    gameId,
    gameDate,
    status: "playing",
    boards: normalizedSolutions.map((solution) => ({
      solution,
      solvedAtAttempt: null,
    })),
    attempts: [],
  });
}

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
    if (
      board.solvedAtAttempt === null &&
      evaluation !== null &&
      evaluation !== undefined &&
      isCorrectEvaluation(evaluation)
    ) {
      return {
        ...board,
        solvedAtAttempt: attemptNumber,
      };
    }

    return board;
  });
  const attempt: Attempt = {
    guess,
    boards: evaluations,
  };
  const attempts = [...state.attempts, attempt];
  const allSolved = boards.every((board) => board.solvedAtAttempt !== null);
  const status = allSolved
    ? "won"
    : attempts.length >= MAX_ATTEMPTS
      ? "lost"
      : "playing";

  return {
    accepted: true,
    state: freezeGameState({
      ...state,
      status,
      boards,
      attempts,
    }),
  };
}

function rejected(
  state: GameState,
  error: Exclude<SubmitGuessResult, { accepted: true }>["error"],
): SubmitGuessResult {
  return {
    accepted: false,
    error,
    state,
  };
}

function freezeGameState(state: GameState): GameState {
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
