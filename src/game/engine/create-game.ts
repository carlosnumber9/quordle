import { isValidWordShape, normalizeWord } from "../dictionary";
import {
  BOARD_COUNT,
  GAME_STATE_VERSION,
  type GameState,
} from "../definitions";
import { GAME_DATE_PATTERN } from "./definitions";
import { freezeGameState } from "./utils";

export function createGame(
  gameDate: string,
  solutions: ReadonlyArray<string>,
  gameId: string = gameDate,
): GameState {
  if (!GAME_DATE_PATTERN.test(gameDate)) {
    throw new TypeError("La fecha de juego debe usar el formato YYYY-MM-DD.");
  }
  if (solutions.length !== BOARD_COUNT) {
    throw new RangeError(
      `El juego necesita exactamente ${BOARD_COUNT} palabras.`,
    );
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
