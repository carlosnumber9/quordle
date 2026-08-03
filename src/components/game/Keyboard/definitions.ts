import type { ReactNode } from "react";

import type { KeyboardState } from "@/game/keyboard";
import type { LetterStatus } from "@/game/definitions";

export interface KeyboardProps {
  readonly disabled: boolean;
  readonly keyboardState: KeyboardState;
  readonly onBackspace: () => void;
  readonly onEnter: () => void;
  readonly onLetter: (letter: string) => void;
  readonly selectedBoardIndex: number | null;
}

export interface ActionKeyProps {
  readonly ariaLabel: string;
  readonly children: ReactNode;
  readonly className: string;
  readonly disabled: boolean;
  readonly onClick: () => void;
}

export interface LetterKeyProps
  extends Pick<
    KeyboardProps,
    "disabled" | "keyboardState" | "onLetter" | "selectedBoardIndex"
  > {
  readonly letter: string;
}

export const LETTER_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
] as const;

export const KEY_STATUS_CLASSES: Readonly<Record<LetterStatus, string>> = {
  correct:
    "border-primary bg-primary text-primary-foreground hover:bg-primary/85",
  present:
    "border-sky-300 bg-sky-300 text-sky-950 hover:bg-sky-200 hover:text-sky-950",
  absent:
    "border-muted-foreground/30 bg-muted-foreground/20 text-muted-foreground shadow-none hover:bg-muted-foreground/30 hover:text-foreground",
};
