import {
  isValidWordShape,
  normalizeWord,
} from "@/game/dictionary";
import { BOARD_COUNT } from "@/game/definitions";
import type { GamePayload } from "@/types/api";

export async function requestGame(): Promise<GamePayload> {
  const response = await fetch("/api/game/today", { method: "GET" });
  const value: unknown = await response.json();

  if (!response.ok) {
    throw new Error(publicApiError(value));
  }
  if (!isGamePayload(value)) {
    throw new TypeError("La API no devolvió una partida válida.");
  }
  return value;
}

function isGamePayload(value: unknown): value is GamePayload {
  if (
    typeof value !== "object" ||
    value === null ||
    !("gameId" in value) ||
    typeof value.gameId !== "string" ||
    !("gameDate" in value) ||
    typeof value.gameDate !== "string" ||
    !("words" in value) ||
    !Array.isArray(value.words) ||
    value.words.length !== BOARD_COUNT ||
    !value.words.every(
      (word) =>
        typeof word === "string" &&
        word === normalizeWord(word) &&
        isValidWordShape(word),
    ) ||
    !("mode" in value) ||
    (value.mode !== "daily" && value.mode !== "local") ||
    !("replayAllowed" in value) ||
    typeof value.replayAllowed !== "boolean"
  ) {
    return false;
  }

  return new Set(value.words).size === BOARD_COUNT;
}

function publicApiError(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "object" &&
    value.error !== null &&
    "message" in value.error &&
    typeof value.error.message === "string"
  ) {
    return value.error.message;
  }
  return "No se pudo cargar la partida.";
}
