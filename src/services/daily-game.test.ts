import { describe, expect, it } from "vitest";

import {
  CorruptDailyGameError,
  ensureDailyGame,
  type DailyGameRepository,
  type DailyWordRow,
  type NewDailyWordRow,
} from "./daily-game";

const gameDate = "2026-07-24";
const dictionary = [
  "BARCO",
  "PLUMA",
  "NOCHE",
  "ARBOL",
  "PERRO",
  "GATOS",
  "CAMPO",
  "LUNES",
] as const;

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
      ensureDailyGame(repository, gameDate, dictionary),
    ).resolves.toEqual({
      gameDate,
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
      gameDate,
      dictionary,
      () => 0.999,
    );

    expect(result.created).toBe(true);
    expect(result.words).toEqual(["NOCHE", "ARBOL", "PERRO", "GATOS"]);
    expect(repository.inserted).toHaveLength(4);
    expect(repository.inserted.map((item) => item.position)).toEqual([
      0, 1, 2, 3,
    ]);
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
      ensureDailyGame(repository, gameDate, dictionary),
    ).resolves.toEqual({
      gameDate,
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
      ensureDailyGame(partial, gameDate, dictionary),
    ).rejects.toBeInstanceOf(CorruptDailyGameError);
    await expect(
      ensureDailyGame(invalidPositions, gameDate, dictionary),
    ).rejects.toBeInstanceOf(CorruptDailyGameError);
  });
});

function row(word: string, position: number): DailyWordRow {
  return { word, gameDate, position };
}

function createRepository(options: {
  existing?: ReadonlyArray<DailyWordRow>;
  used?: ReadonlyArray<string>;
}): DailyGameRepository & { inserted: NewDailyWordRow[] } {
  const inserted: NewDailyWordRow[] = [];
  return {
    inserted,
    findByDate: async () => options.existing ?? [],
    listUsedWords: async () => options.used ?? [],
    insertWords: async (rows) => {
      inserted.push(...rows);
    },
  };
}
