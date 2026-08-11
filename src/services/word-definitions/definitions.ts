import type { WordCategory } from "@/types/api";

export const APERTIUM_ANALYZE_URL =
  "https://www.apertium.org/apy/analyze";
export const RAE_API_BASE_URL = "https://rae-api.com/api/words";
export const UPSTREAM_TIMEOUT_MS = 10_000;

export interface MorphologicalReading {
  readonly displayedForm: string;
  readonly lemma: string;
  readonly category: WordCategory;
  readonly grammaticalForm: string | null;
}

export interface RaeSense {
  readonly category: WordCategory;
  readonly description: string;
  readonly labels: ReadonlyArray<string>;
}

export interface RaeMeaning {
  readonly homonymIndex: number | null;
  readonly senses: ReadonlyArray<RaeSense>;
}

export interface RaeEntry {
  readonly word: string;
  readonly meanings: ReadonlyArray<RaeMeaning>;
}

export interface WordDefinitionDependencies {
  readonly apiKey?: string;
  readonly fetch: typeof globalThis.fetch;
}

export class WordDefinitionUnavailableError extends Error {
  constructor() {
    super("No hay ninguna definición disponible para la palabra.");
    this.name = "WordDefinitionUnavailableError";
  }
}
