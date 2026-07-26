import { describe, expect, it } from "vitest";

import {
  getCurrentGameDate,
  getNextGameResetAt,
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

  it("calcula el siguiente reinicio en horario de invierno", () => {
    expect(
      getNextGameResetAt(new Date("2026-01-15T03:59:59Z")).toISOString(),
    ).toBe("2026-01-15T04:00:00.000Z");
    expect(
      getNextGameResetAt(new Date("2026-01-15T04:00:00Z")).toISOString(),
    ).toBe("2026-01-16T04:00:00.000Z");
  });

  it("calcula el siguiente reinicio en horario de verano", () => {
    expect(
      getNextGameResetAt(new Date("2026-07-24T02:59:59Z")).toISOString(),
    ).toBe("2026-07-24T03:00:00.000Z");
    expect(
      getNextGameResetAt(new Date("2026-07-24T03:00:00Z")).toISOString(),
    ).toBe("2026-07-25T03:00:00.000Z");
  });

  it("ajusta el reinicio al cambio a horario de verano", () => {
    expect(
      getNextGameResetAt(new Date("2026-03-28T05:00:00Z")).toISOString(),
    ).toBe("2026-03-29T03:00:00.000Z");
  });

  it("ajusta el reinicio al cambio a horario de invierno", () => {
    expect(
      getNextGameResetAt(new Date("2026-10-24T05:00:00Z")).toISOString(),
    ).toBe("2026-10-25T04:00:00.000Z");
  });
});
