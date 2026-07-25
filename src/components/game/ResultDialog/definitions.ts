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

export interface ResultSummary {
  readonly resolvedWordsByAttempt: ReadonlyArray<ReadonlyArray<string>>;
  readonly showTimeline: boolean;
  readonly unresolvedWords: ReadonlyArray<string>;
}

export interface ResultTimelineProps {
  readonly game: GameState;
  readonly resolvedWordsByAttempt: ReadonlyArray<ReadonlyArray<string>>;
  readonly unresolvedWords: ReadonlyArray<string>;
  readonly won: boolean;
}

export interface ResultSolutionsProps {
  readonly words: ReadonlyArray<string>;
}

export const LOSS_MESSAGES = [
  "¡Otro día será!",
  "Esta vez no pudo ser...",
  "¡No esta vez!",
  "¡Mañana lo conseguirás!",
] as const;
