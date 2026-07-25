export const ENYE_SENTINEL = "\u0000";
export const VALID_WORD_PATTERN = /^[A-ZÑ]+$/u;

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
