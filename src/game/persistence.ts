import { createGame, submitGuess } from "./engine";
import { GAME_STATE_VERSION, type GameState } from "./definitions";
import {
  GAME_STORAGE_KEY,
  type PersistedGame,
  type StorageLike,
} from "./persistence/definitions";
import { parsePersistedGame } from "./persistence/utils";
import { recordCompletedGame } from "./streak";

export {
  GAME_STORAGE_KEY,
  type PersistedGame,
  type StorageLike,
} from "./persistence/definitions";

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
  } else {
    recordCompletedGame(storage, restored);
  }

  return restored;
}

export function saveGame(storage: StorageLike, state: GameState): void {
  storage.setItem(GAME_STORAGE_KEY, serializeGame(state));
  recordCompletedGame(storage, state);
}
