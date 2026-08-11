import { describe, expect, it } from "vitest";

import type { StorageLike } from "@/game/persistence";
import type { WordDefinitionPayload } from "@/types/api";

import {
  loadWordDefinitions,
  saveWordDefinition,
  WORD_DEFINITIONS_STORAGE_KEY,
} from "./word-definitions-storage";

const WORDS = ["CANTO", "VIVIR", "CASAS", "ARBOL"];

describe("word definitions storage", () => {
  it("guarda y restaura las definiciones obtenidas", () => {
    const storage = createMemoryStorage();
    const canto = createPayload("CANTO");
    const vivir = createPayload("VIVIR");

    saveWordDefinition(storage, "daily:2026-08-11", "2026-08-11", WORDS, canto);
    saveWordDefinition(storage, "daily:2026-08-11", "2026-08-11", WORDS, vivir);

    expect(
      loadWordDefinitions(
        storage,
        "daily:2026-08-11",
        "2026-08-11",
        WORDS,
      ),
    ).toEqual({ CANTO: canto, VIVIR: vivir });
  });

  it("descarta la caché de otra partida o de otro día", () => {
    const storage = createMemoryStorage();
    saveWordDefinition(
      storage,
      "local:first",
      "2026-08-11",
      WORDS,
      createPayload("CANTO"),
    );

    expect(
      loadWordDefinitions(storage, "local:second", "2026-08-11", WORDS),
    ).toEqual({});
    expect(storage.getItem(WORD_DEFINITIONS_STORAGE_KEY)).toBeNull();
  });

  it("descarta datos corruptos o definiciones ajenas a las soluciones", () => {
    const storage = createMemoryStorage();
    storage.setItem(
      WORD_DEFINITIONS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        gameId: "daily:2026-08-11",
        gameDate: "2026-08-11",
        words: WORDS,
        definitions: { EXTRA: createPayload("EXTRA") },
      }),
    );

    expect(
      loadWordDefinitions(
        storage,
        "daily:2026-08-11",
        "2026-08-11",
        WORDS,
      ),
    ).toEqual({});
    expect(storage.getItem(WORD_DEFINITIONS_STORAGE_KEY)).toBeNull();
  });

  it("no guarda payloads que no pertenecen a la partida", () => {
    const storage = createMemoryStorage();

    saveWordDefinition(
      storage,
      "daily:2026-08-11",
      "2026-08-11",
      WORDS,
      createPayload("EXTRA"),
    );

    expect(storage.getItem(WORD_DEFINITIONS_STORAGE_KEY)).toBeNull();
  });
});

function createPayload(word: string): WordDefinitionPayload {
  return {
    word,
    readings: [
      {
        displayedForm: word.toLocaleLowerCase("es-ES"),
        lemma: word.toLocaleLowerCase("es-ES"),
        category: "noun",
        homonymIndex: null,
        grammaticalForms: [],
        definition: `Definición de ${word}.`,
        labels: [],
      },
    ],
  };
}

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}
