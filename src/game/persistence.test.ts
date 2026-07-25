import { describe, expect, it } from "vitest";

import { createGame, submitGuess } from "./engine";
import {
  restoreGame,
  serializeGame,
} from "./persistence";
import {
  ACCEPTED_WORDS,
  SOLUTIONS,
} from "./persistence/test/definitions";

describe("game persistence", () => {
  it("restaura el estado reproduciendo los intentos", () => {
    const initial = createGame("2026-07-24", SOLUTIONS);
    const result = submitGuess(initial, "PERRO", ACCEPTED_WORDS);
    expect(result.accepted).toBe(true);
    if (!result.accepted) {
      return;
    }

    const restored = restoreGame(
      serializeGame(result.state),
      "2026-07-24",
      SOLUTIONS,
      ACCEPTED_WORDS,
    );

    expect(restored).toEqual(result.state);
  });

  it("rechaza datos corruptos, de otra fecha o incoherentes", () => {
    expect(
      restoreGame("{", "2026-07-24", SOLUTIONS, ACCEPTED_WORDS),
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
        SOLUTIONS,
        ACCEPTED_WORDS,
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
        SOLUTIONS,
        ACCEPTED_WORDS,
      ),
    ).toBeNull();
  });

  it("no restaura el progreso de otra partida local del mismo día", () => {
    const first = createGame("2026-07-24", SOLUTIONS, "local:first");
    const result = submitGuess(first, "PERRO", ACCEPTED_WORDS);
    expect(result.accepted).toBe(true);
    if (!result.accepted) {
      return;
    }

    expect(
      restoreGame(
        serializeGame(result.state),
        "2026-07-24",
        SOLUTIONS,
        ACCEPTED_WORDS,
        "local:second",
      ),
    ).toBeNull();
  });

});
