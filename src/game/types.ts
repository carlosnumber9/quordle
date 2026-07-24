export const BOARD_COUNT = 4;
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 9;
export const GAME_STATE_VERSION = 1;

export type LetterStatus = "absent" | "present" | "correct";
export type GameStatus = "playing" | "won" | "lost";

export type WordEvaluation = ReadonlyArray<LetterStatus>;
export type BoardEvaluation = WordEvaluation | null;

export interface Attempt {
  readonly guess: string;
  readonly boards: ReadonlyArray<BoardEvaluation>;
}

export interface BoardState {
  readonly solution: string;
  readonly solvedAtAttempt: number | null;
}

export interface GameState {
  readonly version: typeof GAME_STATE_VERSION;
  readonly gameId: string;
  readonly gameDate: string;
  readonly status: GameStatus;
  readonly boards: ReadonlyArray<BoardState>;
  readonly attempts: ReadonlyArray<Attempt>;
}

export type SubmitGuessError =
  | "game-finished"
  | "invalid-length"
  | "invalid-characters"
  | "unknown-word";

export type SubmitGuessResult =
  | {
      readonly accepted: true;
      readonly state: GameState;
    }
  | {
      readonly accepted: false;
      readonly error: SubmitGuessError;
      readonly state: GameState;
    };
