import { describe, expect, it, vi } from "vitest";

import {
  GAME_STORAGE_KEY,
  type StorageLike,
} from "./persistence";
import {
  getOrCreateLocalSession,
  replayLocalGame,
} from "./local-game-client";
import { LOCAL_SESSION_STORAGE_KEY } from "./local-session";

const payload = {
  gameId: "local:new",
  gameDate: "2026-07-24",
  words: ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
  mode: "local",
  replayAllowed: true,
} as const;

describe("local game client", () => {
  it("reutiliza la sesión diaria local sin pedir otra partida", async () => {
    const storage = createMemoryStorage();
    storage.setItem(
      LOCAL_SESSION_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        gameId: "local:existing",
        gameDate: "2026-07-24",
        words: payload.words,
      }),
    );
    const fetchGame = vi.fn();

    const session = await getOrCreateLocalSession(
      storage,
      "2026-07-24",
      fetchGame,
    );

    expect(session.gameId).toBe("local:existing");
    expect(fetchGame).not.toHaveBeenCalled();
  });

  it("solicita y persiste la primera partida si no existe sesión", async () => {
    const storage = createMemoryStorage();
    const fetchGame = vi.fn().mockResolvedValue(response(payload));

    const session = await getOrCreateLocalSession(
      storage,
      "2026-07-24",
      fetchGame,
    );

    expect(session.gameId).toBe("local:new");
    expect(fetchGame).toHaveBeenCalledWith("/api/game/today", {
      method: "GET",
    });
  });

  it("el replay usa POST, sustituye la sesión y guarda estado vacío", async () => {
    const storage = createMemoryStorage();
    const fetchGame = vi.fn().mockResolvedValue(response(payload));

    const state = await replayLocalGame(storage, fetchGame);

    expect(fetchGame).toHaveBeenCalledWith("/api/game/today", {
      method: "POST",
    });
    expect(state.gameId).toBe("local:new");
    expect(state.attempts).toHaveLength(0);
    expect(storage.getItem(LOCAL_SESSION_STORAGE_KEY)).toContain("local:new");
    expect(storage.getItem(GAME_STORAGE_KEY)).toContain("local:new");
  });

  it("propaga un error si replay no está disponible", async () => {
    const storage = createMemoryStorage();
    const fetchGame = vi.fn().mockResolvedValue(
      response({ error: true }, false, 405),
    );

    await expect(replayLocalGame(storage, fetchGame)).rejects.toThrow(
      /405/,
    );
  });
});

function response(
  body: unknown,
  ok = true,
  status = 200,
): Pick<Response, "ok" | "status" | "json"> {
  return {
    ok,
    status,
    json: async () => body,
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
