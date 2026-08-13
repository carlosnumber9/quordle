import type { LetterStatus } from "@/game/definitions";
import {
  isLetterAbsentFromAllBoards,
  type KeyboardState,
} from "@/game/keyboard";

export function visibleLetterStatus(
  keyboardState: KeyboardState,
  letter: string,
  selectedBoardIndex: number | null,
): LetterStatus | undefined {
  if (selectedBoardIndex !== null) {
    return keyboardState[selectedBoardIndex]?.[letter];
  }

  return isLetterAbsentFromAllBoards(keyboardState, letter)
    ? "absent"
    : undefined;
}

export function letterKeyLabel(
  letter: string,
  status: LetterStatus | undefined,
  selectedBoardIndex: number | null,
): string {
  if (selectedBoardIndex === null) {
    return status === "absent"
      ? `Letra ${letter}: no está en ninguna palabra`
      : `Letra ${letter}`;
  }

  const board = selectedBoardIndex + 1;
  if (status === "correct") {
    return `Letra ${letter}: posición correcta en el tablero ${board}`;
  }
  if (status === "present") {
    return `Letra ${letter}: presente sin posición en el tablero ${board}`;
  }
  if (status === "absent") {
    return `Letra ${letter}: no está en el tablero ${board}`;
  }
  return `Letra ${letter}: sin pistas en el tablero ${board}`;
}
