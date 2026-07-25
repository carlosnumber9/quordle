import type { GameStatus } from "@/game/definitions";
import type { GameMode } from "@/types/api";

export interface LocalReplayButtonProps {
  readonly mode: GameMode;
  readonly onReplay: () => void | Promise<void>;
  readonly pending?: boolean;
  readonly status: GameStatus;
}
