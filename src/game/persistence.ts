import { createGame, submitGuess } from "./engine";
import type { GameState } from "./types";
import { GAME_STATE_VERSION } from "./types";

export const GAME_STORAGE_KEY = `quordle:game:v${GAME_STATE_VERSION}`;

export interface PersistedGame {
  readonly version: typeof GAME_STATE_VERSION;
  readonly gameId: string;
  readonly gameDate: string;
  readonly guesses: ReadonlyArray<string>;
  readonly completed: boolean;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function serializeGame(state: GameState): string {
  const persisted: PersistedGame = {
    version: GAME_STATE_VERSION,
    gameId: state.gameId,
    gameDate: state.gameDate,
    guesses: state.attempts.map((attempt) => attempt.guess),
    completed: state.status !== "playing",
  };

  return JSON.stringify(persisted);
}

export function restoreGame(
  serialized: string,
  expectedGameDate: string,
  solutions: ReadonlyArray<string>,
  acceptedWords: ReadonlySet<string>,
  expectedGameId: string = expectedGameDate,
): GameState | null {
  const persisted = parsePersistedGame(serialized);
  if (
    persisted === null ||
    persisted.gameId !== expectedGameId ||
    persisted.gameDate !== expectedGameDate ||
    persisted.guesses.length > 9
  ) {
    return null;
  }

  let state = createGame(expectedGameDate, solutions, expectedGameId);
  for (const guess of persisted.guesses) {
    const result = submitGuess(state, guess, acceptedWords);
    if (!result.accepted) {
      return null;
    }
    state = result.state;
  }

  if ((state.status !== "playing") !== persisted.completed) {
    return null;
  }

  return state;
}

export function loadGame(
  storage: StorageLike,
  expectedGameDate: string,
  solutions: ReadonlyArray<string>,
  acceptedWords: ReadonlySet<string>,
  expectedGameId: string = expectedGameDate,
): GameState | null {
  const serialized = storage.getItem(GAME_STORAGE_KEY);
  if (serialized === null) {
    return null;
  }

  const restored = restoreGame(
    serialized,
    expectedGameDate,
    solutions,
    acceptedWords,
    expectedGameId,
  );
  if (restored === null) {
    storage.removeItem(GAME_STORAGE_KEY);
  }

  return restored;
}

export function saveGame(storage: StorageLike, state: GameState): void {
  storage.setItem(GAME_STORAGE_KEY, serializeGame(state));
}

function parsePersistedGame(serialized: string): PersistedGame | null {
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
