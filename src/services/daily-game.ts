import { selectUnusedWords } from "@/game/dictionary";
import { BOARD_COUNT } from "@/game/definitions";
import {
  type DailyGameRepository,
  type DailyGameResult,
} from "./daily-game/definitions";
import { existingGameResult } from "./daily-game/utils";

export {
  CorruptDailyGameError,
  type DailyGameRepository,
  type DailyGameResult,
  type DailyWordRow,
  type NewDailyWordRow,
} from "./daily-game/definitions";

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
