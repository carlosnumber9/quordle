import type { GameState } from "@/game/definitions";

export interface BoardProps {
  readonly boardIndex: number;
  readonly onSelect: () => void;
  readonly selected: boolean;
  readonly showSolutionWatermark: boolean;
  readonly state: GameState;
}
