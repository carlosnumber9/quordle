import type { GamePayload } from "@/types/api";

import { createGame } from "./engine";
import {
  loadLocalSession,
  replaceLocalSession,
  type LocalGameSession,
} from "./local-session";
import {
  saveGame,
  type StorageLike,
} from "./persistence";
import type { GameState } from "./types";

type FetchGame = (
  input: string,
  init?: RequestInit,
) => Promise<Pick<Response, "ok" | "status" | "json">>;

export async function getOrCreateLocalSession(
  storage: StorageLike,
  gameDate: string,
  fetchGame: FetchGame = fetch,
): Promise<LocalGameSession> {
  const existing = loadLocalSession(storage, gameDate);
  if (existing !== null) {
    return existing;
  }

  const payload = await requestLocalGame("GET", fetchGame);
  return replaceLocalSession(storage, payload);
}

export async function replayLocalGame(
  storage: StorageLike,
  fetchGame: FetchGame = fetch,
): Promise<GameState> {
  const payload = await requestLocalGame("POST", fetchGame);
  const session = replaceLocalSession(storage, payload);
  const state = createGame(
    session.gameDate,
    session.words,
    session.gameId,
  );
  saveGame(storage, state);
  return state;
}

async function requestLocalGame(
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
