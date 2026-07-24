import { describe, expect, it } from "vitest";

import {
  DictionaryValidationError,
  InsufficientWordsError,
  normalizeWord,
  prepareDictionary,
  selectUnusedWords,
} from "./dictionary";

describe("normalizeWord", () => {
  it("normaliza mayúsculas y tildes sin perder la ñ", () => {
    expect(normalizeWord("  árbol ")).toBe("ARBOL");
    expect(normalizeWord("niñez")).toBe("NIÑEZ");
  });
});

describe("prepareDictionary", () => {
  it("valida y congela un diccionario", () => {
    const result = prepareDictionary(["árbol", "niñez", "barco", "pluma"]);

    expect(result).toEqual(["ARBOL", "NIÑEZ", "BARCO", "PLUMA"]);
    expect(Object.isFrozen(result)).toBe(true);
  });

  it("rechaza duplicados después de normalizar", () => {
    expect(() =>
      prepareDictionary(["ÁRBOL", "ARBOL", "BARCO", "PLUMA"]),
    ).toThrow(DictionaryValidationError);
  });

  it("rechaza caracteres y longitudes no válidas", () => {
    expect(() =>
      prepareDictionary(["SOL", "BARCO", "PLUMA", "NOCHE"]),
    ).toThrow(/cinco letras/);
  });
});

describe("selectUnusedWords", () => {
  it("excluye el historial y permite un random inyectable", () => {
    const words = ["BARCO", "PLUMA", "NOCHE", "ARBOL", "PERRO"];
    const selected = selectUnusedWords(
      words,
      new Set(["BARCO"]),
      4,
      () => 0.999,
    );

    expect(selected).toEqual(["PLUMA", "NOCHE", "ARBOL", "PERRO"]);
    expect(selected).not.toContain("BARCO");
  });

  it("falla sin insertar nada si no quedan suficientes palabras", () => {
    expect(() =>
      selectUnusedWords(
        ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
        new Set(["BARCO"]),
      ),
    ).toThrow(InsufficientWordsError);
  });
});
