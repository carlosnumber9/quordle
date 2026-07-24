import { describe, expect, it } from "vitest";

import {
  getCurrentGameDate,
  getMadridCalendarDate,
  getMadridDateTime,
} from "./game-date";

describe("game day in Europe/Madrid", () => {
  it("cambia a las 05:00 durante el horario de invierno", () => {
    expect(getCurrentGameDate(new Date("2026-01-15T03:59:59Z"))).toBe(
      "2026-01-14",
    );
    expect(getCurrentGameDate(new Date("2026-01-15T04:00:00Z"))).toBe(
      "2026-01-15",
    );
  });

  it("cambia a las 05:00 durante el horario de verano", () => {
    expect(getCurrentGameDate(new Date("2026-07-24T02:59:59Z"))).toBe(
      "2026-07-23",
    );
    expect(getCurrentGameDate(new Date("2026-07-24T03:00:00Z"))).toBe(
      "2026-07-24",
    );
  });

  it("funciona el día del cambio a horario de verano", () => {
    expect(getCurrentGameDate(new Date("2026-03-29T02:59:59Z"))).toBe(
      "2026-03-28",
    );
    expect(getCurrentGameDate(new Date("2026-03-29T03:00:00Z"))).toBe(
      "2026-03-29",
    );
  });

  it("funciona el día del cambio a horario de invierno", () => {
    expect(getCurrentGameDate(new Date("2026-10-25T03:59:59Z"))).toBe(
      "2026-10-24",
    );
    expect(getCurrentGameDate(new Date("2026-10-25T04:00:00Z"))).toBe(
      "2026-10-25",
    );
  });

  it("expone por separado la fecha civil de Madrid para el cron", () => {
    const instant = new Date("2026-01-15T03:00:00Z");

    expect(getMadridCalendarDate(instant)).toBe("2026-01-15");
    expect(getMadridDateTime(instant).hour).toBe(4);
    expect(getCurrentGameDate(instant)).toBe("2026-01-14");
  });
});
