import type { LetterStatus } from "../definitions";

export type KeyboardBoardState = Readonly<Record<string, LetterStatus>>;
export type KeyboardState = ReadonlyArray<KeyboardBoardState>;

export const STATUS_PRIORITY: Readonly<Record<LetterStatus, number>> = {
  absent: 0,
  present: 1,
  correct: 2,
};
