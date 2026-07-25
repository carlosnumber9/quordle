import { describe, expect, it } from "vitest";

import { createGame, submitGuess } from "./engine";
import {
  ACCEPTED_WORDS,
  SOLUTIONS,
} from "./engine/test/definitions";

describe("submitGuess attempts", () => {
  it("un intento afecta a cada tablero no resuelto", () => {
    const initial = createGame("2026-07-24", SOLUTIONS);
    const result = submitGuess(initial, "barco", ACCEPTED_WORDS);

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
    const initial = createGame("2026-07-24", SOLUTIONS);
    const first = submitGuess(initial, "BARCO", ACCEPTED_WORDS);
    expect(first.accepted).toBe(true);
    if (!first.accepted) {
      return;
    }

    const second = submitGuess(first.state, "PLUMA", ACCEPTED_WORDS);
    expect(second.accepted).toBe(true);
    if (!second.accepted) {
      return;
    }
    expect(second.state.attempts[1]?.boards[0]).toBeNull();
    expect(second.state.boards[0]?.solvedAtAttempt).toBe(1);
    expect(second.state.boards[1]?.solvedAtAttempt).toBe(2);
  });

  it("no consume intentos inválidos", () => {
    const initial = createGame("2026-07-24", SOLUTIONS);
    expect(submitGuess(initial, "SOL", ACCEPTED_WORDS)).toMatchObject({
      accepted: false,
      error: "invalid-length",
    });
    expect(submitGuess(initial, "ABCDE", ACCEPTED_WORDS)).toMatchObject({
      accepted: false,
      error: "unknown-word",
    });
    expect(initial.attempts).toHaveLength(0);
  });
});
