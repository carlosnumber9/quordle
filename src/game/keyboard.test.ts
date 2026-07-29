import { describe, expect, it } from "vitest";

import { isLetterAbsentFromAllBoards } from "./keyboard";
import type { KeyboardState } from "./keyboard/definitions";

describe("keyboard", () => {
  it("marca una letra como ausente cuando ningún tablero la contiene", () => {
    const keyboard: KeyboardState = [
      { A: "absent" },
      { A: "absent" },
      { A: "absent" },
      { A: "absent" },
    ];

    expect(isLetterAbsentFromAllBoards(keyboard, "A")).toBe(true);
  });

  it("mantiene la tecla activa si la letra aparece en algún tablero", () => {
    const keyboard: KeyboardState = [
      { A: "absent" },
      { A: "present" },
      { A: "absent" },
      { A: "correct" },
    ];

    expect(isLetterAbsentFromAllBoards(keyboard, "A")).toBe(false);
  });

  it("no marca las letras que todavía no se han evaluado", () => {
    const keyboard: KeyboardState = [{}, {}, {}, {}];

    expect(isLetterAbsentFromAllBoards(keyboard, "A")).toBe(false);
  });
});
