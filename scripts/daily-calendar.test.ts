import { describe, expect, it } from "vitest";

import {
  createDailyCalendar,
  extendDailyCalendar,
  parseHistoryCsv,
  regenerateDailyCalendarAfter,
} from "./daily-calendar/utils";

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
const SEED = "b".repeat(64);
const CSV = `word,game_date,position,created_at
NOCHE,2026-07-24,2,ignored
BARCO,2026-07-24,0,ignored
ARBOL,2026-07-24,3,ignored
PLUMA,2026-07-24,1,ignored`;

describe("daily calendar generation", () => {
  it("importa posiciones y genera el resto de forma determinista", () => {
    const history = parseHistoryCsv(CSV);
    const first = createDailyCalendar(history, DICTIONARY, SEED);
    const second = createDailyCalendar(history, DICTIONARY, SEED);

    expect(first).toEqual(second);
    expect(first.games["2026-07-24"]).toEqual([
      "BARCO",
      "PLUMA",
      "NOCHE",
      "ARBOL",
    ]);
    expect(first.games["2026-07-25"]).toHaveLength(4);
    expect(new Set(Object.values(first.games).flat()).size).toBe(8);
  });

  it("extiende sin modificar fechas existentes", () => {
    const existing = createDailyCalendar(
      parseHistoryCsv(CSV),
      DICTIONARY.slice(0, 4),
      SEED,
    );
    const extended = extendDailyCalendar(existing, DICTIONARY);

    expect(extended.games["2026-07-24"]).toEqual(
      existing.games["2026-07-24"],
    );
    expect(extended.games["2026-07-25"]).toHaveLength(4);
  });

  it("conserva las fechas publicadas y regenera todo el futuro", () => {
    const existing = createDailyCalendar(
      parseHistoryCsv(CSV),
      DICTIONARY,
      SEED,
    );
    const revisedDictionary = [
      ...DICTIONARY.slice(0, 4),
      "PERRO",
      "GATOS",
      "CIELO",
      "RATON",
    ];

    const first = regenerateDailyCalendarAfter(
      existing,
      revisedDictionary,
      "2026-07-24",
    );
    const second = regenerateDailyCalendarAfter(
      existing,
      revisedDictionary,
      "2026-07-24",
    );

    expect(first).toEqual(second);
    expect(first.games["2026-07-24"]).toEqual(
      existing.games["2026-07-24"],
    );
    expect(new Set(first.games["2026-07-25"])).toEqual(
      new Set(["PERRO", "GATOS", "CIELO", "RATON"]),
    );
  });

  it("rechaza históricos parciales y duplicados", () => {
    expect(() =>
      createDailyCalendar(parseHistoryCsv(CSV.replace(",3,", ",2,")), DICTIONARY, SEED),
    ).toThrow("posiciones 0–3");

    expect(() =>
      createDailyCalendar(
        parseHistoryCsv(CSV.replace("PLUMA", "BARCO")),
        DICTIONARY,
        SEED,
      ),
    ).toThrow("está repetida");
  });
});
