import { GAME_STATE_VERSION } from "../definitions";

export const LOCAL_SESSION_STORAGE_KEY =
  `quordle:local-session:v${GAME_STATE_VERSION}`;

export interface LocalGameSession {
  readonly version: typeof GAME_STATE_VERSION;
  readonly gameId: string;
  readonly gameDate: string;
  readonly words: ReadonlyArray<string>;
}

export interface LocalGameSessionInput {
  readonly version: unknown;
  readonly gameId: unknown;
  readonly gameDate: unknown;
  readonly words: unknown;
}
