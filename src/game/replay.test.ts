import { describe, expect, it } from "vitest";

import { canReplayGame } from "./replay";

describe("canReplayGame", () => {
  it("solo muestra replay tras terminar una partida local", () => {
    expect(canReplayGame("local", "playing")).toBe(false);
    expect(canReplayGame("local", "won")).toBe(true);
    expect(canReplayGame("local", "lost")).toBe(true);
  });

  it("nunca permite replay en la partida diaria de producción", () => {
    expect(canReplayGame("daily", "won")).toBe(false);
    expect(canReplayGame("daily", "lost")).toBe(false);
  });
});
