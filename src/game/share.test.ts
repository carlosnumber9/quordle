import { describe, expect, it } from "vitest";

import { createGame, submitGuess } from "./engine";
import { createShareText } from "./share";
import {
  ACCEPTED_WORDS,
  SOLUTIONS,
} from "./share/test/definitions";

describe("createShareText", () => {
  it("crea cuatro cuadrículas, puntuaciones y enlace sin revelar palabras", () => {
    let state = createGame("2026-07-24", SOLUTIONS);
    for (const solution of SOLUTIONS) {
      const result = submitGuess(state, solution, ACCEPTED_WORDS);
      expect(result.accepted).toBe(true);
      if (!result.accepted) {
        return;
      }
      state = result.state;
    }

    const text = createShareText(state, "https://quordle.example/");

    expect(text).toContain("Quordle · 2026-07-24");
    expect(text).toContain("1️⃣ 2️⃣");
    expect(text).toContain("3️⃣ 4️⃣");
    expect(text).toContain("🟩🟩🟩🟩🟩");
    expect(text).toContain("⬜⬜⬜⬜⬜");
    expect(text.endsWith("https://quordle.example")).toBe(true);
    for (const solution of SOLUTIONS) {
      expect(text).not.toContain(solution);
    }
  });

  it("solo permite compartir partidas terminadas", () => {
    const state = createGame("2026-07-24", SOLUTIONS);

    expect(() => createShareText(state, "https://quordle.example")).toThrow(
      /sin terminar/,
    );
  });
});
