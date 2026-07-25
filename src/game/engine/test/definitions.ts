export const SOLUTIONS = ["BARCO", "PLUMA", "NOCHE", "ARBOL"] as const;

export const ACCEPTED_WORDS = new Set([
  ...SOLUTIONS,
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

export const LOSING_GUESSES = [
  "PERRO",
  "GATOS",
  "CAMPO",
  "LUNES",
  "SALTO",
  "VELAS",
  "PARED",
  "LIBRO",
  "MUNDO",
] as const;
