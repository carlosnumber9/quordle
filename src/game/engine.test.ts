import { describe, expect, it } from "vitest";

import { createGame, submitGuess } from "./engine";
import { deriveKeyboardState } from "./keyboard";

const solutions = ["BARCO", "PLUMA", "NOCHE", "ARBOL"] as const;
const acceptedWords = new Set([
  ...solutions,
  "PERRO",
  "GATOS",
  "CAMPO",
  "LUNES",
  "SALTO",
  "VELAS",
  "PARED",
  "LIBRO",
  "MUNDO",
]);

describe("game engine", () => {
  it("crea un estado inmutable con cuatro tableros", () => {
    const state = createGame("2026-07-24", solutions);

    expect(state.status).toBe("playing");
    expect(state.gameId).toBe("2026-07-24");
    expect(state.boards).toHaveLength(4);
    expect(Object.isFrozen(state)).toBe(true);
    expect(Object.isFrozen(state.boards)).toBe(true);
  });

  it("admite una identidad distinta para partidas locales sucesivas", () => {
    const state = createGame(
      "2026-07-24",
      solutions,
      "local:partida-segunda",
    );

    expect(state.gameId).toBe("local:partida-segunda");
    expect(state.gameDate).toBe("2026-07-24");
  });

  it("un intento afecta a cada tablero no resuelto", () => {
    const initial = createGame("2026-07-24", solutions);
    const result = submitGuess(initial, "barco", acceptedWords);

    expect(result.accepted).toBe(true);
    if (!result.accepted) {
      return;
    }

    expect(result.state).not.toBe(initial);
    expect(initial.attempts).toHaveLength(0);
    expect(result.state.attempts[0]?.boards).toHaveLength(4);
    expect(result.state.boards[0]?.solvedAtAttempt).toBe(1);
  });

  it("deja inactivo un tablero ya resuelto", () => {
    let state = createGame("2026-07-24", solutions);
    const first = submitGuess(state, "BARCO", acceptedWords);
    expect(first.accepted).toBe(true);
    if (!first.accepted) {
      return;
    }
    state = first.state;

    const second = submitGuess(state, "PLUMA", acceptedWords);
    expect(second.accepted).toBe(true);
    if (!second.accepted) {
      return;
    }

    expect(second.state.attempts[1]?.boards[0]).toBeNull();
    expect(second.state.boards[0]?.solvedAtAttempt).toBe(1);
    expect(second.state.boards[1]?.solvedAtAttempt).toBe(2);
  });

  it("no consume intentos inválidos", () => {
    const initial = createGame("2026-07-24", solutions);

    const tooShort = submitGuess(initial, "SOL", acceptedWords);
    const unknown = submitGuess(initial, "ABCDE", acceptedWords);

    expect(tooShort).toMatchObject({
      accepted: false,
      error: "invalid-length",
    });
    expect(unknown).toMatchObject({
      accepted: false,
      error: "unknown-word",
    });
    expect(initial.attempts).toHaveLength(0);
  });

  it("gana al resolver los cuatro tableros", () => {
    let state = createGame("2026-07-24", solutions);

    for (const solution of solutions) {
      const result = submitGuess(state, solution, acceptedWords);
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
    let state = createGame("2026-07-24", solutions);
    const guesses = [
      "PERRO",
      "GATOS",
      "CAMPO",
      "LUNES",
      "SALTO",
      "VELAS",
      "PARED",
      "LIBRO",
      "MUNDO",
    ];

    for (const guess of guesses) {
      const result = submitGuess(state, guess, acceptedWords);
      expect(result.accepted).toBe(true);
      if (!result.accepted) {
        return;
      }
      state = result.state;
    }

    expect(state.status).toBe("lost");
    expect(state.attempts).toHaveLength(9);
    expect(submitGuess(state, "BARCO", acceptedWords)).toMatchObject({
      accepted: false,
      error: "game-finished",
    });
  });

  it("mantiene el mejor estado de cada tecla por tablero", () => {
    let state = createGame("2026-07-24", solutions);
    for (const guess of ["PERRO", "BARCO"]) {
      const result = submitGuess(state, guess, acceptedWords);
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
