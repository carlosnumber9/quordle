import type {
  DailyGameRepository,
  DailyWordRow,
  NewDailyWordRow,
} from "../../daily-game";
import { GAME_DATE, type RepositoryOptions } from "./definitions";

export function row(word: string, position: number): DailyWordRow {
  return { word, gameDate: GAME_DATE, position };
}

export function createRepository(
  options: RepositoryOptions,
): DailyGameRepository & { inserted: NewDailyWordRow[] } {
  const inserted: NewDailyWordRow[] = [];
  return {
    inserted,
    findByDate: async () => options.existing ?? [],
    listUsedWords: async () => options.used ?? [],
    insertWords: async (rows) => {
      inserted.push(...rows);
    },
  };
}
