import rawWords from "@/data/words.json";

import { BOARD_COUNT, WORD_LENGTH } from "./types";

const ENYE_SENTINEL = "\u0000";
const VALID_WORD_PATTERN = /^[A-ZÑ]+$/u;

export class DictionaryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DictionaryValidationError";
  }
}

export class InsufficientWordsError extends Error {
  constructor(readonly available: number, readonly required: number) {
    super(
      `No hay suficientes palabras sin usar: ${available} disponibles, ${required} necesarias.`,
    );
    this.name = "InsufficientWordsError";
  }
}

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
