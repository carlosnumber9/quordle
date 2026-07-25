import { BOARD_COUNT } from "@/game/definitions";

import {
  CorruptDailyGameError,
  type DailyGameResult,
  type DailyWordRow,
} from "./definitions";

export function existingGameResult(
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
