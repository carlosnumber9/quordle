import { BOARD_COUNT } from "../definitions";
import { InsufficientWordsError } from "./definitions";

export function selectUnusedWords(
  words: ReadonlyArray<string>,
  usedWords: ReadonlySet<string>,
  count = BOARD_COUNT,
  random: () => number = Math.random,
): ReadonlyArray<string> {
  const available = words.filter((word) => !usedWords.has(word));
  if (available.length < count) {
    throw new InsufficientWordsError(available.length, count);
  }

  for (let index = available.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    const current = available[index];
    const replacement = available[target];
    if (current === undefined || replacement === undefined) {
      throw new Error("No se pudo barajar el diccionario.");
    }
    available[index] = replacement;
    available[target] = current;
  }
  return Object.freeze(available.slice(0, count));
}
