import rawWords from "@/data/words.json";

import { BOARD_COUNT, WORD_LENGTH } from "./definitions";
import {
  DictionaryValidationError,
  ENYE_SENTINEL,
  VALID_WORD_PATTERN,
} from "./dictionary/definitions";

export { DictionaryValidationError };
export { InsufficientWordsError } from "./dictionary/definitions";
export { selectUnusedWords } from "./dictionary/select-unused";

export function normalizeWord(value: string): string {
  return value
    .trim()
    .toLocaleUpperCase("es-ES")
    .replaceAll("Ñ", ENYE_SENTINEL)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replaceAll(ENYE_SENTINEL, "Ñ");
}

export function isValidWordShape(value: string): boolean {
  return (
    Array.from(value).length === WORD_LENGTH && VALID_WORD_PATTERN.test(value)
  );
}

export function prepareDictionary(input: unknown): ReadonlyArray<string> {
  if (!Array.isArray(input)) {
    throw new DictionaryValidationError(
      "El diccionario debe ser un array JSON de strings.",
    );
  }

  const seen = new Set<string>();
  const words = input.map((entry, index) => {
    if (typeof entry !== "string") {
      throw new DictionaryValidationError(
        `La entrada ${index + 1} del diccionario no es un string.`,
      );
    }

    const normalized = normalizeWord(entry);
    if (!isValidWordShape(normalized)) {
      throw new DictionaryValidationError(
        `La entrada ${index + 1} (${JSON.stringify(entry)}) no es una palabra válida de cinco letras.`,
      );
    }

    if (seen.has(normalized)) {
      throw new DictionaryValidationError(
        `La palabra ${normalized} está duplicada después de normalizar.`,
      );
    }

    seen.add(normalized);
    return normalized;
  });

  if (words.length < BOARD_COUNT) {
    throw new DictionaryValidationError(
      `El diccionario debe contener al menos ${BOARD_COUNT} palabras.`,
    );
  }

  return Object.freeze(words);
}

export const dictionary = prepareDictionary(rawWords);
export const dictionarySet: ReadonlySet<string> = new Set(dictionary);
