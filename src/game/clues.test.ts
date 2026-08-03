import { describe, expect, it } from "vitest";

import { deriveBoardClues } from "./clues";
import { createGame, submitGuess } from "./engine";

const SOLUTIONS = ["CASAS", "PLUMA", "NOCHE", "ARBOL"] as const;
const WORDS = new Set(["SACOS", "CASAS"]);

describe("deriveBoardClues", () => {
  it("separa las posiciones confirmadas de las letras sin colocar", () => {
    const initial = createGame("2026-08-03", SOLUTIONS);
    const result = submitGuess(initial, "SACOS", WORDS);
    expect(result.accepted).toBe(true);
    if (!result.accepted) {
      return;
    }

    const clues = deriveBoardClues(result.state, 0);

    expect(clues.positions.map((clue) => clue?.letter ?? null)).toEqual([
      null,
      "A",
      null,
      null,
      "S",
    ]);
    expect(clues.misplaced.map((clue) => clue.letter)).toEqual(["C", "S"]);
  });

  it("mueve una letra de la bandeja a su posición cuando se descubre", () => {
    const initial = createGame("2026-08-03", SOLUTIONS);
    const first = submitGuess(initial, "SACOS", WORDS);
    expect(first.accepted).toBe(true);
    if (!first.accepted) {
      return;
    }
    const second = submitGuess(first.state, "CASAS", WORDS);
    expect(second.accepted).toBe(true);
    if (!second.accepted) {
      return;
    }

    const clues = deriveBoardClues(second.state, 0);

    expect(clues.positions.map((clue) => clue?.letter)).toEqual([
      "C",
      "A",
      "S",
      "A",
      "S",
    ]);
    expect(clues.misplaced).toEqual([]);
    expect(clues.positions[0]?.discoveredAtAttempt).toBe(2);
  });

  it("conserva la cantidad confirmada de letras repetidas", () => {
    const initial = createGame("2026-08-03", SOLUTIONS);
    const result = submitGuess(initial, "SACOS", WORDS);
    expect(result.accepted).toBe(true);
    if (!result.accepted) {
      return;
    }

    expect(
      deriveBoardClues(result.state, 0).misplaced.filter(
        ({ letter }) => letter === "S",
      ),
    ).toHaveLength(1);
  });

  it("rechaza índices de tablero inexistentes", () => {
    const state = createGame("2026-08-03", SOLUTIONS);
    expect(() => deriveBoardClues(state, 4)).toThrow(RangeError);
  });
});
