import { selectUnusedWords } from "@/game/dictionary";
import { BOARD_COUNT } from "@/game/definitions";
import type { GamePayload } from "@/types/api";

export function createLocalGame(
  gameDate: string,
  dictionary: ReadonlyArray<string>,
  random: () => number = Math.random,
  createId: () => string = () => crypto.randomUUID(),
): GamePayload {
  const words = selectUnusedWords(
    dictionary,
    new Set<string>(),
    BOARD_COUNT,
    random,
  );

  return Object.freeze({
    gameId: `local:${createId()}`,
    gameDate,
    words,
    mode: "local",
    replayAllowed: true,
  });
}
