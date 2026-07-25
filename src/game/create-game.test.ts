import { describe, expect, it } from "vitest";

import { createGame } from "./engine";
import { SOLUTIONS } from "./engine/test/definitions";

describe("createGame", () => {
  it("crea un estado inmutable con cuatro tableros", () => {
    const state = createGame("2026-07-24", SOLUTIONS);

    expect(state.status).toBe("playing");
    expect(state.gameId).toBe("2026-07-24");
    expect(state.boards).toHaveLength(4);
    expect(Object.isFrozen(state)).toBe(true);
    expect(Object.isFrozen(state.boards)).toBe(true);
  });

  it("admite una identidad distinta para partidas locales sucesivas", () => {
    const state = createGame(
      "2026-07-24",
      SOLUTIONS,
      "local:partida-segunda",
    );

    expect(state.gameId).toBe("local:partida-segunda");
    expect(state.gameDate).toBe("2026-07-24");
  });
});
