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
import type { GameState } from "./definitions";
import type { FetchGame } from "./local-game-client/definitions";
import { requestLocalGame } from "./local-game-client/utils";

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
