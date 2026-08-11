import type { GameState } from "@/game/definitions";
import type { GameMode } from "@/types/api";

export interface ResultDialogProps {
  readonly game: GameState;
  readonly mode: GameMode;
  readonly onOpenChange: (open: boolean) => void;
  readonly onReplay: () => void | Promise<void>;
  readonly onShare: () => void | Promise<void>;
  readonly open: boolean;
  readonly replaying: boolean;
}

export const LOSS_MESSAGES = [
  "¡Otro día será!",
  "Esta vez no pudo ser...",
  "¡No esta vez!",
  "¡Mañana lo conseguirás!",
] as const;
