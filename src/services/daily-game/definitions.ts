import { BOARD_COUNT } from "@/game/definitions";

export interface DailyWordRow {
  readonly word: string;
  readonly gameDate: string;
  readonly position: number;
}

export interface NewDailyWordRow {
  readonly word: string;
  readonly gameDate: string;
  readonly position: number;
}

export interface DailyGameRepository {
  findByDate(gameDate: string): Promise<ReadonlyArray<DailyWordRow>>;
  listUsedWords(): Promise<ReadonlyArray<string>>;
  insertWords(rows: ReadonlyArray<NewDailyWordRow>): Promise<void>;
}

export interface DailyGameResult {
  readonly gameDate: string;
  readonly words: ReadonlyArray<string>;
  readonly created: boolean;
}

export class CorruptDailyGameError extends Error {
  constructor(readonly gameDate: string, readonly rowCount: number) {
    super(
      `La partida ${gameDate} contiene ${rowCount} filas en lugar de ${BOARD_COUNT}.`,
    );
    this.name = "CorruptDailyGameError";
  }
}
