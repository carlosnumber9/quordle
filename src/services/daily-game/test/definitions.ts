import type { DailyWordRow } from "../../daily-game";

export const GAME_DATE = "2026-07-24";

export const DICTIONARY = [
  "BARCO",
  "PLUMA",
  "NOCHE",
  "ARBOL",
  "PERRO",
  "GATOS",
  "CAMPO",
  "LUNES",
] as const;

export interface RepositoryOptions {
  readonly existing?: ReadonlyArray<DailyWordRow>;
  readonly used?: ReadonlyArray<string>;
}
