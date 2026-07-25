import type { GamePayload } from "@/types/api";

import type { FetchGame } from "./definitions";

export async function requestLocalGame(
  method: "GET" | "POST",
  fetchGame: FetchGame,
): Promise<GamePayload> {
  const response = await fetchGame("/api/game/today", { method });
  if (!response.ok) {
    throw new Error(
      `No se pudo preparar la partida local (${response.status}).`,
    );
  }

  const payload: unknown = await response.json();
  if (!isGamePayload(payload) || payload.mode !== "local") {
    throw new TypeError("La API no devolvió una partida local válida.");
  }
  return payload;
}

function isGamePayload(value: unknown): value is GamePayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "gameId" in value &&
    typeof value.gameId === "string" &&
    "gameDate" in value &&
    typeof value.gameDate === "string" &&
    "words" in value &&
    Array.isArray(value.words) &&
    "mode" in value &&
    (value.mode === "local" || value.mode === "daily") &&
    "replayAllowed" in value &&
    typeof value.replayAllowed === "boolean"
  );
}
