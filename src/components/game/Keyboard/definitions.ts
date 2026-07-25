import type { KeyboardState } from "@/game/keyboard";
import type { LetterStatus } from "@/game/definitions";

export interface KeyboardProps {
  readonly disabled: boolean;
  readonly keyboardState: KeyboardState;
  readonly onBackspace: () => void;
  readonly onEnter: () => void;
  readonly onLetter: (letter: string) => void;
}

export interface ActionKeyProps {
  readonly ariaLabel: string;
  readonly children: ReactNode;
  readonly className: string;
  readonly disabled: boolean;
  readonly onClick: () => void;
}

export interface LetterKeyProps
  extends Pick<KeyboardProps, "disabled" | "keyboardState" | "onLetter"> {
  readonly letter: string;
}

export const LETTER_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
] as const;

export const DOT_CLASSES: Readonly<Record<LetterStatus, string>> = {
  correct: "bg-primary",
  present: "bg-sky-300",
  absent: "bg-muted-foreground/40",
};
import type { ReactNode } from "react";
