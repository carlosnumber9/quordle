export const HISTORY_PAGE_SIZE = 1_000;

export interface DailyWordDatabaseRow {
  readonly word: string;
  readonly game_date: string;
  readonly position: number;
}
