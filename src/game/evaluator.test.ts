import { describe, expect, it } from "vitest";

import { evaluateGuess } from "./evaluator";

describe("evaluateGuess", () => {
  it("marca una solución exacta", () => {
    expect(evaluateGuess("BARCO", "BARCO")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("consume cada letra disponible una sola vez", () => {
    expect(evaluateGuess("ARBOL", "ALALA")).toEqual([
      "correct",
      "present",
      "absent",
      "absent",
      "absent",
    ]);
  });

  it("maneja varias letras repetidas en solución e intento", () => {
    expect(evaluateGuess("LLAMA", "MAMAS")).toEqual([
      "present",
      "present",
      "absent",
      "present",
      "absent",
    ]);
  });

  it("prioriza coincidencias exactas antes de las presentes", () => {
    expect(evaluateGuess("CASAS", "SACOS")).toEqual([
      "present",
      "correct",
      "present",
      "absent",
      "correct",
    ]);
  });
});
