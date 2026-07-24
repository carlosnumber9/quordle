import type { GamePayload } from "@/types/api";

import { isValidWordShape, normalizeWord } from "./dictionary";
import { GAME_STORAGE_KEY, type StorageLike } from "./persistence";
import { BOARD_COUNT, GAME_STATE_VERSION } from "./types";

export const LOCAL_SESSION_STORAGE_KEY = `quordle:local-session:v${GAME_STATE_VERSION}`;

export interface LocalGameSession {
  readonly version: typeof GAME_STATE_VERSION;
  readonly gameId: string;
  readonly gameDate: string;
  readonly words: ReadonlyArray<string>;
}

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

function parseLocalSession(serialized: string): LocalGameSession | null {
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

    return validateLocalSession({
      version: value.version,
      gameId: value.gameId,
      gameDate: value.gameDate,
      words: value.words,
    });
  } catch {
    return null;
  }
}

function validateLocalSession(value: {
  readonly version: unknown;
  readonly gameId: unknown;
  readonly gameDate: unknown;
  readonly words: unknown;
}): LocalGameSession {
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
