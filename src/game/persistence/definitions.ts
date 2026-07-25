import { GAME_STATE_VERSION } from "../definitions";

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
