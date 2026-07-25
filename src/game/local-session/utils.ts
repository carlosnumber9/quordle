import { isValidWordShape, normalizeWord } from "../dictionary";
import { BOARD_COUNT, GAME_STATE_VERSION } from "../definitions";
import type {
  LocalGameSession,
  LocalGameSessionInput,
} from "./definitions";

export function parseLocalSession(
  serialized: string,
): LocalGameSession | null {
  try {
    const value: unknown = JSON.parse(serialized);
    if (
      typeof value !== "object" ||
      value === null ||
      !("version" in value) ||
      !("gameId" in value) ||
      !("gameDate" in value) ||
      !("words" in value)
    ) {
      return null;
    }
    return validateLocalSession(value);
  } catch {
    return null;
  }
}

export function validateLocalSession(
  value: LocalGameSessionInput,
): LocalGameSession {
  if (
    value.version !== GAME_STATE_VERSION ||
    typeof value.gameId !== "string" ||
    value.gameId.length === 0 ||
    typeof value.gameDate !== "string" ||
    !Array.isArray(value.words) ||
    value.words.length !== BOARD_COUNT ||
    !value.words.every(
      (word) =>
        typeof word === "string" &&
        word === normalizeWord(word) &&
        isValidWordShape(word),
    ) ||
    new Set(value.words).size !== BOARD_COUNT
  ) {
    throw new TypeError("La sesión local no es válida.");
  }

  return Object.freeze({
    version: GAME_STATE_VERSION,
    gameId: value.gameId,
    gameDate: value.gameDate,
    words: Object.freeze([...value.words]),
  });
}
