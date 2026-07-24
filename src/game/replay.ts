import type { GameStatus } from "./types";
import type { GameMode } from "@/types/api";

export function canReplayGame(
  mode: GameMode,
  status: GameStatus,
): boolean {
  return mode === "local" && status !== "playing";
}
