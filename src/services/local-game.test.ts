import { describe, expect, it } from "vitest";

import { createLocalGame } from "./local-game";

const dictionary = [
  "BARCO",
  "PLUMA",
  "NOCHE",
  "ARBOL",
  "PERRO",
  "GATOS",
] as const;

describe("createLocalGame", () => {
  it("elige cuatro palabras diferentes directamente del JSON", () => {
    const game = createLocalGame(
      "2026-07-24",
      dictionary,
      () => 0.999,
      () => "test-id",
    );

    expect(game).toEqual({
      gameId: "local:test-id",
      gameDate: "2026-07-24",
      words: ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
      mode: "local",
      replayAllowed: true,
    });
    expect(new Set(game.words).size).toBe(4);
  });

  it("genera una identidad nueva para cada replay", () => {
    let id = 0;
    const createId = () => String((id += 1));

    const first = createLocalGame(
      "2026-07-24",
      dictionary,
      () => 0.5,
      createId,
    );
    const second = createLocalGame(
      "2026-07-24",
      dictionary,
      () => 0.5,
      createId,
    );

    expect(first.gameId).not.toBe(second.gameId);
    expect(first.mode).toBe("local");
    expect(second.replayAllowed).toBe(true);
  });
});
