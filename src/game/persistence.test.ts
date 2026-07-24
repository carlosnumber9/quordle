import { describe, expect, it } from "vitest";

import { createGame, submitGuess } from "./engine";
import {
  GAME_STORAGE_KEY,
  loadGame,
  restoreGame,
  saveGame,
  serializeGame,
  type StorageLike,
} from "./persistence";

const solutions = ["BARCO", "PLUMA", "NOCHE", "ARBOL"] as const;
const acceptedWords = new Set([...solutions, "PERRO"]);

describe("game persistence", () => {
  it("restaura el estado reproduciendo los intentos", () => {
    const initial = createGame("2026-07-24", solutions);
    const result = submitGuess(initial, "PERRO", acceptedWords);
    expect(result.accepted).toBe(true);
    if (!result.accepted) {
      return;
    }

    const restored = restoreGame(
      serializeGame(result.state),
      "2026-07-24",
      solutions,
      acceptedWords,
    );

    expect(restored).toEqual(result.state);
  });

  it("rechaza datos corruptos, de otra fecha o incoherentes", () => {
    expect(
      restoreGame("{", "2026-07-24", solutions, acceptedWords),
    ).toBeNull();
    expect(
      restoreGame(
        JSON.stringify({
          version: 1,
          gameId: "2026-07-23",
          gameDate: "2026-07-23",
          guesses: [],
          completed: false,
        }),
        "2026-07-24",
        solutions,
        acceptedWords,
      ),
    ).toBeNull();
    expect(
      restoreGame(
        JSON.stringify({
          version: 1,
          gameId: "2026-07-24",
          gameDate: "2026-07-24",
          guesses: [],
          completed: true,
        }),
        "2026-07-24",
        solutions,
        acceptedWords,
      ),
    ).toBeNull();
  });

  it("no restaura el progreso de otra partida local del mismo día", () => {
    const first = createGame("2026-07-24", solutions, "local:first");
    const result = submitGuess(first, "PERRO", acceptedWords);
    expect(result.accepted).toBe(true);
    if (!result.accepted) {
      return;
    }

    expect(
      restoreGame(
        serializeGame(result.state),
        "2026-07-24",
        solutions,
        acceptedWords,
        "local:second",
      ),
    ).toBeNull();
  });

  it("elimina del storage una partida que no puede restaurarse", () => {
    const storage = createMemoryStorage();
    storage.setItem(GAME_STORAGE_KEY, "invalid-json");

    expect(
      loadGame(storage, "2026-07-24", solutions, acceptedWords),
    ).toBeNull();
    expect(storage.getItem(GAME_STORAGE_KEY)).toBeNull();
  });

  it("guarda usando una clave versionada", () => {
    const storage = createMemoryStorage();
    const state = createGame("2026-07-24", solutions);

    saveGame(storage, state);

    expect(storage.getItem(GAME_STORAGE_KEY)).toContain('"version":1');
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
