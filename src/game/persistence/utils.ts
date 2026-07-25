import { GAME_STATE_VERSION } from "../definitions";
import type { PersistedGame } from "./definitions";

export function parsePersistedGame(
  serialized: string,
): PersistedGame | null {
  try {
    const value: unknown = JSON.parse(serialized);
    if (
      !isRecord(value) ||
      value.version !== GAME_STATE_VERSION ||
      typeof value.gameId !== "string" ||
      value.gameId.length === 0 ||
      typeof value.gameDate !== "string" ||
      !Array.isArray(value.guesses) ||
      !value.guesses.every((guess) => typeof guess === "string") ||
      typeof value.completed !== "boolean"
    ) {
      return null;
    }

    return {
      version: GAME_STATE_VERSION,
      gameId: value.gameId,
      gameDate: value.gameDate,
      guesses: value.guesses,
      completed: value.completed,
    };
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
