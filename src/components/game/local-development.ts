import type { GameMode } from "@/types/api";

export function shouldShowSolutionWatermark(
  isDevelopment: boolean,
  mode: GameMode,
): boolean {
  return isDevelopment && mode === "local";
}
