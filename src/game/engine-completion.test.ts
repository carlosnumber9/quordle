import { describe, expect, it } from "vitest";

import { createGame, submitGuess } from "./engine";
import {
  ACCEPTED_WORDS,
  LOSING_GUESSES,
  SOLUTIONS,
} from "./engine/test/definitions";
import { deriveKeyboardState } from "./keyboard";

describe("game completion", () => {
  it("gana al resolver los cuatro tableros", () => {
    let state = createGame("2026-07-24", SOLUTIONS);
    for (const solution of SOLUTIONS) {
      const result = submitGuess(state, solution, ACCEPTED_WORDS);
      expect(result.accepted).toBe(true);
      if (!result.accepted) {
        return;
      }
      state = result.state;
    }

    expect(state.status).toBe("won");
    expect(state.boards.map((board) => board.solvedAtAttempt)).toEqual([
      1, 2, 3, 4,
    ]);
  });

  it("pierde al gastar los nueve intentos", () => {
    let state = createGame("2026-07-24", SOLUTIONS);
    for (const guess of LOSING_GUESSES) {
      const result = submitGuess(state, guess, ACCEPTED_WORDS);
      expect(result.accepted).toBe(true);
      if (!result.accepted) {
        return;
      }
      state = result.state;
    }

    expect(state.status).toBe("lost");
    expect(state.attempts).toHaveLength(9);
    expect(submitGuess(state, "BARCO", ACCEPTED_WORDS)).toMatchObject({
      accepted: false,
      error: "game-finished",
    });
  });

  it("mantiene el mejor estado de cada tecla por tablero", () => {
    let state = createGame("2026-07-24", SOLUTIONS);
    for (const guess of ["PERRO", "BARCO"]) {
      const result = submitGuess(state, guess, ACCEPTED_WORDS);
      expect(result.accepted).toBe(true);
      if (!result.accepted) {
        return;
      }
      state = result.state;
    }

    const keyboard = deriveKeyboardState(state);
    expect(keyboard[0]?.B).toBe("correct");
    expect(keyboard[0]?.R).toBe("correct");
    expect(keyboard).toHaveLength(4);
  });
});
