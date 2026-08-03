import { describe, expect, it } from "vitest";

import type { KeyboardState } from "@/game/keyboard";

import { letterKeyLabel, visibleLetterStatus } from "./utils";

const STATE: KeyboardState = [
  { A: "correct", B: "absent", C: "absent" },
  { A: "present", B: "absent", C: "absent" },
  { A: "absent", B: "absent" },
  { B: "absent", C: "absent" },
];

describe("visibleLetterStatus", () => {
  it("solo colorea letras ausentes de todas las palabras en modo general", () => {
    expect(visibleLetterStatus(STATE, "A", null)).toBeUndefined();
    expect(visibleLetterStatus(STATE, "B", null)).toBe("absent");
    expect(visibleLetterStatus(STATE, "D", null)).toBeUndefined();
  });

  it("muestra únicamente el estado de la palabra seleccionada", () => {
    expect(visibleLetterStatus(STATE, "A", 0)).toBe("correct");
    expect(visibleLetterStatus(STATE, "A", 1)).toBe("present");
    expect(visibleLetterStatus(STATE, "A", 2)).toBe("absent");
    expect(visibleLetterStatus(STATE, "A", 3)).toBeUndefined();
  });
});

describe("letterKeyLabel", () => {
  it("explica el descarte global sin tratar la tecla como deshabilitada", () => {
    expect(letterKeyLabel("B", "absent", null)).toBe(
      "Letra B: no está en ninguna palabra",
    );
  });

  it("identifica la palabra filtrada", () => {
    expect(letterKeyLabel("A", "present", 1)).toBe(
      "Letra A: presente sin posición en la palabra 2",
    );
  });
});
