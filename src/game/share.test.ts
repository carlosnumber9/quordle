import { describe, expect, it } from "vitest";

import { createGame, submitGuess } from "./engine";
import { createShareText } from "./share";

const solutions = ["BARCO", "PLUMA", "NOCHE", "ARBOL"] as const;
const acceptedWords = new Set(solutions);

describe("createShareText", () => {
  it("crea cuatro cuadrículas, puntuaciones y enlace sin revelar palabras", () => {
    let state = createGame("2026-07-24", solutions);
    for (const solution of solutions) {
      const result = submitGuess(state, solution, acceptedWords);
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
    for (const solution of solutions) {
      expect(text).not.toContain(solution);
    }
  });

  it("solo permite compartir partidas terminadas", () => {
    const state = createGame("2026-07-24", solutions);

    expect(() => createShareText(state, "https://quordle.example")).toThrow(
      /sin terminar/,
    );
  });
});
