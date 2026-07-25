import { describe, expect, it } from "vitest";

import { createGame } from "./engine";
import {
  GAME_STORAGE_KEY,
  loadGame,
  saveGame,
} from "./persistence";
import {
  ACCEPTED_WORDS,
  SOLUTIONS,
} from "./persistence/test/definitions";
import { createMemoryStorage } from "./persistence/test/utils";

describe("game storage", () => {
  it("elimina una partida que no puede restaurarse", () => {
    const storage = createMemoryStorage();
    storage.setItem(GAME_STORAGE_KEY, "invalid-json");

    expect(
      loadGame(storage, "2026-07-24", SOLUTIONS, ACCEPTED_WORDS),
    ).toBeNull();
    expect(storage.getItem(GAME_STORAGE_KEY)).toBeNull();
  });

  it("guarda usando una clave versionada", () => {
    const storage = createMemoryStorage();
    saveGame(storage, createGame("2026-07-24", SOLUTIONS));
    expect(storage.getItem(GAME_STORAGE_KEY)).toContain('"version":1');
  });
});
