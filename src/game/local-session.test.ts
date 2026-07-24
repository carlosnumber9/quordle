import { describe, expect, it } from "vitest";

import type { GamePayload } from "@/types/api";

import {
  clearLocalSession,
  loadLocalSession,
  LOCAL_SESSION_STORAGE_KEY,
  replaceLocalSession,
} from "./local-session";
import {
  GAME_STORAGE_KEY,
  type StorageLike,
} from "./persistence";

const payload: GamePayload = {
  gameId: "local:one",
  gameDate: "2026-07-24",
  words: ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
  mode: "local",
  replayAllowed: true,
};

describe("local game session", () => {
  it("mantiene la misma partida local durante el día", () => {
    const storage = createMemoryStorage();
    replaceLocalSession(storage, payload);

    expect(loadLocalSession(storage, "2026-07-24")).toEqual({
      version: 1,
      gameId: "local:one",
      gameDate: "2026-07-24",
      words: ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
    });
  });

  it("reemplazar la sesión elimina el progreso de la partida anterior", () => {
    const storage = createMemoryStorage();
    storage.setItem(GAME_STORAGE_KEY, "old progress");

    replaceLocalSession(storage, payload);

    expect(storage.getItem(GAME_STORAGE_KEY)).toBeNull();
  });

  it("descarta sesiones de otro día o corruptas", () => {
    const storage = createMemoryStorage();
    replaceLocalSession(storage, payload);

    expect(loadLocalSession(storage, "2026-07-25")).toBeNull();
    expect(storage.getItem(LOCAL_SESSION_STORAGE_KEY)).toBeNull();

    storage.setItem(LOCAL_SESSION_STORAGE_KEY, "{");
    expect(loadLocalSession(storage, "2026-07-24")).toBeNull();
  });

  it("solo acepta payloads marcados como locales", () => {
    const storage = createMemoryStorage();

    expect(() =>
      replaceLocalSession(storage, {
        ...payload,
        mode: "daily",
        replayAllowed: false,
      }),
    ).toThrow(/desarrollo local/);
  });

  it("permite borrar sesión y progreso juntos", () => {
    const storage = createMemoryStorage();
    replaceLocalSession(storage, payload);
    storage.setItem(GAME_STORAGE_KEY, "progress");

    clearLocalSession(storage);

    expect(storage.getItem(LOCAL_SESSION_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(GAME_STORAGE_KEY)).toBeNull();
  });
});

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}
