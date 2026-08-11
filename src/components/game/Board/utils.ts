import type { LetterStatus } from "@/game/definitions";
import type { GameMode } from "@/types/api";

import { STATUS_LABELS } from "./definitions";

export function tileLabel(
  letter: string,
  status: LetterStatus | undefined,
): string {
  if (letter.length === 0) {
    return "Casilla vacía";
  }
  return status === undefined ? letter : `${letter}: ${STATUS_LABELS[status]}`;
}

export function shouldShowSolutionWatermark(
  isDevelopment: boolean,
  mode: GameMode,
): boolean {
  return isDevelopment && mode === "local";
}
