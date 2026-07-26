import { describe, expect, it } from "vitest";

import {
  getDailyWords,
  InvalidDailyCalendarError,
  validateDailyCalendar,
} from "./daily-calendar";

const DICTIONARY = [
  "BARCO",
  "PLUMA",
  "NOCHE",
  "ARBOL",
  "PERRO",
  "GATOS",
  "CAMPO",
  "LUNES",
];
const SEED = "a".repeat(64);

describe("daily calendar", () => {
  it("valida y recupera una partida por fecha", () => {
    const calendar = validateDailyCalendar(
      {
        version: 1,
        seed: SEED,
        games: {
          "2026-07-24": ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
          "2026-07-25": ["PERRO", "GATOS", "CAMPO", "LUNES"],
        },
      },
      DICTIONARY,
    );

    expect(getDailyWords(calendar, "2026-07-24")).toEqual([
      "BARCO",
      "PLUMA",
      "NOCHE",
      "ARBOL",
    ]);
    expect(getDailyWords(calendar, "2026-07-26")).toBeNull();
    expect(Object.isFrozen(calendar.games["2026-07-24"])).toBe(true);
  });

  it("rechaza fechas discontinuas y palabras repetidas", () => {
    expect(() =>
      validateDailyCalendar(
        {
          version: 1,
          seed: SEED,
          games: {
            "2026-07-24": ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
            "2026-07-26": ["PERRO", "GATOS", "CAMPO", "LUNES"],
          },
        },
        DICTIONARY,
      ),
    ).toThrow(InvalidDailyCalendarError);

    expect(() =>
      validateDailyCalendar(
        {
          version: 1,
          seed: SEED,
          games: {
            "2026-07-24": ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
            "2026-07-25": ["BARCO", "GATOS", "CAMPO", "LUNES"],
          },
        },
        DICTIONARY,
      ),
    ).toThrow("aparece más de una vez");
  });

  it("exige cubrir exactamente el diccionario completo", () => {
    expect(() =>
      validateDailyCalendar(
        {
          version: 1,
          seed: SEED,
          games: {
            "2026-07-24": ["BARCO", "PLUMA", "NOCHE", "ARBOL"],
          },
        },
        DICTIONARY,
      ),
    ).toThrow("exactamente todas las palabras");
  });
});
