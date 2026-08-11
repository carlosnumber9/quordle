import type { BoardState } from "@/game/definitions";
import type { WordDefinitionPayload } from "@/types/api";

export type WordDefinitionState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly payload: WordDefinitionPayload }
  | { readonly status: "unavailable" };

export type WordDefinitionStates = Readonly<Record<string, WordDefinitionState>>;

export interface ResultDefinitionsProps {
  readonly boards: ReadonlyArray<BoardState>;
  readonly definitionStates: WordDefinitionStates;
}

export interface ResultWordCardProps {
  readonly board: BoardState;
  readonly definitionState: WordDefinitionState;
}
