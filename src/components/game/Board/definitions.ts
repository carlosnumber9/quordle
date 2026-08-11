import type { GameState, LetterStatus } from "@/game/definitions";

export interface BoardProps {
  readonly boardIndex: number;
  readonly currentGuess: string;
  readonly isZoomObscured: boolean;
  readonly isZoomed: boolean;
  readonly onInputRequest: () => void;
  readonly onZoomRequest: () => void;
  readonly showSolutionWatermark: boolean;
  readonly state: GameState;
}

export type BoardGridProps = Pick<
  BoardProps,
  "boardIndex" | "currentGuess" | "state"
>;

export const TILE_STATUS_CLASSES: Readonly<Record<LetterStatus, string>> = {
  correct: "border-primary bg-primary text-primary-foreground",
  present: "border-sky-300 bg-sky-300 text-sky-950",
  absent: "border-muted bg-muted text-muted-foreground",
};

export const STATUS_LABELS: Readonly<Record<LetterStatus, string>> = {
  correct: "posición correcta",
  present: "presente en otra posición",
  absent: "no está en la palabra",
};
