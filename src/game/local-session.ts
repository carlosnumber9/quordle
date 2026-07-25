import type { GamePayload } from "@/types/api";

import { GAME_STATE_VERSION } from "./definitions";
import { GAME_STORAGE_KEY, type StorageLike } from "./persistence";
import {
  LOCAL_SESSION_STORAGE_KEY,
  type LocalGameSession,
} from "./local-session/definitions";
import {
  parseLocalSession,
  validateLocalSession,
} from "./local-session/utils";

export {
  LOCAL_SESSION_STORAGE_KEY,
  type LocalGameSession,
} from "./local-session/definitions";

export function loadLocalSession(
  storage: StorageLike,
  expectedGameDate: string,
): LocalGameSession | null {
  const serialized = storage.getItem(LOCAL_SESSION_STORAGE_KEY);
  if (serialized === null) {
    return null;
  }

  const session = parseLocalSession(serialized);
  if (session === null || session.gameDate !== expectedGameDate) {
    clearLocalSession(storage);
    return null;
  }

  return session;
}

export function replaceLocalSession(
  storage: StorageLike,
  payload: GamePayload,
): LocalGameSession {
  if (payload.mode !== "local" || !payload.replayAllowed) {
    throw new TypeError("Solo puede persistirse una partida de desarrollo local.");
  }

  const session = validateLocalSession({
    version: GAME_STATE_VERSION,
    gameId: payload.gameId,
    gameDate: payload.gameDate,
    words: payload.words,
  });

  storage.setItem(LOCAL_SESSION_STORAGE_KEY, JSON.stringify(session));
  storage.removeItem(GAME_STORAGE_KEY);
  return session;
}

export function clearLocalSession(storage: StorageLike): void {
  storage.removeItem(LOCAL_SESSION_STORAGE_KEY);
  storage.removeItem(GAME_STORAGE_KEY);
}
