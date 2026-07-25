export type GameMode = "daily" | "local";

export interface GamePayload {
  readonly gameId: string;
  readonly gameDate: string;
  readonly words: ReadonlyArray<string>;
  readonly mode: GameMode;
  readonly replayAllowed: boolean;
}
