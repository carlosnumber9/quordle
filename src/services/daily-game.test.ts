import { describe, expect, it } from "vitest";

import {
  CorruptDailyGameError,
  ensureDailyGame,
  type DailyGameRepository,
} from "./daily-game";
import { DICTIONARY, GAME_DATE } from "./daily-game/test/definitions";
import { createRepository, row } from "./daily-game/test/utils";

describe("ensureDailyGame", () => {
  it("devuelve un juego existente ordenado por posición", async () => {
    const repository = createRepository({
      existing: [
        row("NOCHE", 2),
        row("BARCO", 0),
        row("ARBOL", 3),
        row("PLUMA", 1),
      ],
    });

    await expect(
      ensureDailyGame(repository, GAME_DATE, DICTIONARY),
    ).resolves.toEqual({
      gameDate: GAME_DATE,
      words: ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
      created: false,
    });
    expect(repository.inserted).toHaveLength(0);
  });

  it("crea cuatro palabras sin repetir el historial", async () => {
    const repository = createRepository({
      used: ["BARCO", "PLUMA"],
    });

    const result = await ensureDailyGame(
      repository,
      GAME_DATE,
      DICTIONARY,
      () => 0.999,
    );

    expect(result.created).toBe(true);
    expect(result.words).toEqual(["NOCHE", "ARBOL", "PERRO", "GATOS"]);
    expect(repository.inserted).toHaveLength(4);
    expect(repository.inserted.map((item) => item.position)).toEqual([0, 1, 2, 3]);
  });

  it("relee al ganador si otra ejecución inserta primero", async () => {
    const winner = [
      row("PERRO", 0),
      row("GATOS", 1),
      row("CAMPO", 2),
      row("LUNES", 3),
    ];
    let reads = 0;
    const repository: DailyGameRepository = {
      findByDate: async () => {
        reads += 1;
        return reads === 1 ? [] : winner;
      },
      listUsedWords: async () => [],
      insertWords: async () => {
        throw new Error("unique violation");
      },
    };

    await expect(
      ensureDailyGame(repository, GAME_DATE, DICTIONARY),
    ).resolves.toEqual({
      gameDate: GAME_DATE,
      words: ["PERRO", "GATOS", "CAMPO", "LUNES"],
      created: false,
    });
  });

  it("rechaza estados parciales o posiciones inválidas", async () => {
    const partial = createRepository({
      existing: [row("BARCO", 0)],
    });
    const invalidPositions = createRepository({
      existing: [
        row("BARCO", 0),
        row("PLUMA", 1),
        row("NOCHE", 2),
        row("ARBOL", 2),
      ],
    });

    await expect(
      ensureDailyGame(partial, GAME_DATE, DICTIONARY),
    ).rejects.toBeInstanceOf(CorruptDailyGameError);
    await expect(
      ensureDailyGame(invalidPositions, GAME_DATE, DICTIONARY),
    ).rejects.toBeInstanceOf(CorruptDailyGameError);
  });
});
