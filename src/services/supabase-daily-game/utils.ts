import type { DailyWordRow } from "../daily-game";
import type { DailyWordDatabaseRow } from "./definitions";

export function mapDailyWord(
  row: DailyWordDatabaseRow,
): DailyWordRow {
  return {
    word: row.word,
    gameDate: row.game_date,
    position: row.position,
  };
}
