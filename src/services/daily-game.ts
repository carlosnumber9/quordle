import { selectUnusedWords } from "@/game/dictionary";
import { BOARD_COUNT } from "@/game/types";

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

export async function ensureDailyGame(
  repository: DailyGameRepository,
  gameDate: string,
  dictionary: ReadonlyArray<string>,
  random: () => number = Math.random,
): Promise<DailyGameResult> {
  const existing = await repository.findByDate(gameDate);
  if (existing.length > 0) {
    return existingGameResult(gameDate, existing);
  }

  const usedWords = new Set(await repository.listUsedWords());
  const selected = selectUnusedWords(
    dictionary,
    usedWords,
    BOARD_COUNT,
    random,
  );
  const rows = selected.map((word, position) => ({
    word,
    gameDate,
    position,
  }));

  try {
    await repository.insertWords(rows);
    return {
      gameDate,
      words: selected,
      created: true,
    };
  } catch (insertError) {
    // Another invocation may have won the unique (game_date, position) race.
    const winner = await repository.findByDate(gameDate);
    if (winner.length === BOARD_COUNT) {
      return existingGameResult(gameDate, winner);
    }

    throw insertError;
  }
}

function existingGameResult(
  gameDate: string,
  rows: ReadonlyArray<DailyWordRow>,
): DailyGameResult {
  if (rows.length !== BOARD_COUNT) {
    throw new CorruptDailyGameError(gameDate, rows.length);
  }

  const ordered = [...rows].sort(
    (left, right) => left.position - right.position,
  );
  const positions = new Set(ordered.map((row) => row.position));
  const words = new Set(ordered.map((row) => row.word));
  const validPositions = ordered.every((row, index) => row.position === index);

  if (
    positions.size !== BOARD_COUNT ||
    words.size !== BOARD_COUNT ||
    !validPositions
  ) {
    throw new CorruptDailyGameError(gameDate, rows.length);
  }

  return {
    gameDate,
    words: Object.freeze(ordered.map((row) => row.word)),
    created: false,
  };
}
