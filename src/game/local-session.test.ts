import { describe, expect, it } from "vitest";

import {
  clearLocalSession,
  loadLocalSession,
  LOCAL_SESSION_STORAGE_KEY,
  replaceLocalSession,
} from "./local-session";
import { PAYLOAD } from "./local-session/test/definitions";
import { createMemoryStorage } from "./local-session/test/utils";
import { GAME_STORAGE_KEY } from "./persistence";

describe("local game session", () => {
  it("mantiene la misma partida local durante el día", () => {
    const storage = createMemoryStorage();
    replaceLocalSession(storage, PAYLOAD);

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

    replaceLocalSession(storage, PAYLOAD);

    expect(storage.getItem(GAME_STORAGE_KEY)).toBeNull();
  });

  it("descarta sesiones de otro día o corruptas", () => {
    const storage = createMemoryStorage();
    replaceLocalSession(storage, PAYLOAD);

    expect(loadLocalSession(storage, "2026-07-25")).toBeNull();
    expect(storage.getItem(LOCAL_SESSION_STORAGE_KEY)).toBeNull();

    storage.setItem(LOCAL_SESSION_STORAGE_KEY, "{");
    expect(loadLocalSession(storage, "2026-07-24")).toBeNull();
  });

  it("solo acepta payloads marcados como locales", () => {
    const storage = createMemoryStorage();

    expect(() =>
      replaceLocalSession(storage, {
        ...PAYLOAD,
        mode: "daily",
        replayAllowed: false,
      }),
    ).toThrow(/desarrollo local/);
  });

  it("permite borrar sesión y progreso juntos", () => {
    const storage = createMemoryStorage();
    replaceLocalSession(storage, PAYLOAD);
    storage.setItem(GAME_STORAGE_KEY, "progress");

    clearLocalSession(storage);

    expect(storage.getItem(LOCAL_SESSION_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(GAME_STORAGE_KEY)).toBeNull();
  });
});
