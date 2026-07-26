import { describe, expect, it } from "vitest";

import { productionGameResponse } from "./production";

describe("production daily game response", () => {
  it("conserva la partida importada del 26 de julio", async () => {
    const response = await productionGameResponse("2026-07-26");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      gameId: "daily:2026-07-26",
      gameDate: "2026-07-26",
      words: ["BABLE", "NANAY", "SOLIO", "BANCO"],
      mode: "daily",
      replayAllowed: false,
    });
  });

  it("devuelve indisponible fuera del calendario", async () => {
    const response = await productionGameResponse("2030-01-01");

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "game-unavailable",
        message: "La partida diaria todavía no está disponible.",
      },
    });
  });
});
