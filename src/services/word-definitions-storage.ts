import type { StorageLike } from "@/game/persistence";
import type { WordDefinitionPayload } from "@/types/api";

import {
  isRecord,
  isWordDefinitionPayload,
} from "./word-definitions-schema";

const WORD_DEFINITIONS_STORAGE_VERSION = 1;

export const WORD_DEFINITIONS_STORAGE_KEY =
  `quordle:definitions:v${WORD_DEFINITIONS_STORAGE_VERSION}`;

interface PersistedWordDefinitions {
  readonly version: typeof WORD_DEFINITIONS_STORAGE_VERSION;
  readonly gameId: string;
  readonly gameDate: string;
  readonly words: ReadonlyArray<string>;
  readonly definitions: Readonly<Record<string, WordDefinitionPayload>>;
}

export function loadWordDefinitions(
  storage: StorageLike,
  gameId: string,
  gameDate: string,
  words: ReadonlyArray<string>,
): Readonly<Record<string, WordDefinitionPayload>> {
  const serialized = storage.getItem(WORD_DEFINITIONS_STORAGE_KEY);
  if (serialized === null) {
    return {};
  }

  const persisted = parseWordDefinitions(serialized);
  if (
    persisted === null ||
    persisted.gameId !== gameId ||
    persisted.gameDate !== gameDate ||
    !haveSameWords(persisted.words, words)
  ) {
    storage.removeItem(WORD_DEFINITIONS_STORAGE_KEY);
    return {};
  }

  return persisted.definitions;
}

export function saveWordDefinition(
  storage: StorageLike,
  gameId: string,
  gameDate: string,
  words: ReadonlyArray<string>,
  payload: WordDefinitionPayload,
): void {
  if (!words.includes(payload.word)) {
    return;
  }
  const current = loadWordDefinitions(storage, gameId, gameDate, words);
  const persisted: PersistedWordDefinitions = {
    version: WORD_DEFINITIONS_STORAGE_VERSION,
    gameId,
    gameDate,
    words,
    definitions: { ...current, [payload.word]: payload },
  };
  storage.setItem(
    WORD_DEFINITIONS_STORAGE_KEY,
    JSON.stringify(persisted),
  );
}

function parseWordDefinitions(
  serialized: string,
): PersistedWordDefinitions | null {
  try {
    const value: unknown = JSON.parse(serialized);
    if (
      !isRecord(value) ||
      value.version !== WORD_DEFINITIONS_STORAGE_VERSION ||
      typeof value.gameId !== "string" ||
      typeof value.gameDate !== "string" ||
      !Array.isArray(value.words) ||
      !value.words.every((word) => typeof word === "string") ||
      !isRecord(value.definitions)
    ) {
      return null;
    }

    const words: ReadonlyArray<string> = value.words;
    const definitions: Record<string, WordDefinitionPayload> = {};
    for (const [word, payload] of Object.entries(value.definitions)) {
      if (
        !words.includes(word) ||
        !isWordDefinitionPayload(payload) ||
        payload.word !== word
      ) {
        return null;
      }
      definitions[word] = payload;
    }

    return {
      version: WORD_DEFINITIONS_STORAGE_VERSION,
      gameId: value.gameId,
      gameDate: value.gameDate,
      words,
      definitions,
    };
  } catch {
    return null;
  }
}

function haveSameWords(
  stored: ReadonlyArray<string>,
  expected: ReadonlyArray<string>,
): boolean {
  return (
    stored.length === expected.length &&
    stored.every((word, index) => word === expected[index])
  );
}
