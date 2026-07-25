import { describe, expect, it } from "vitest";

import {
  getDayInitialLabel,
  getStreakMessage,
  getWinMarkerSize,
} from "./utils";

describe("streak timeline presentation", () => {
  it("reduce el tamaño del punto entre los turnos cuatro y nueve", () => {
    const sizes = [4, 5, 6, 7, 8, 9].map((attempt) =>
      Number.parseFloat(getWinMarkerSize(attempt)),
    );

    expect(sizes).toEqual([2, 1.85, 1.7, 1.55, 1.4, 1.25]);
  });

  it("muestra el mensaje correspondiente a la racha actual", () => {
    expect(getStreakMessage(0)).toBe(
      "No te preocupes, siempre puedes comenzar a ganar mañana :)",
    );
    expect(getStreakMessage(1)).toBe(
      "Hoy comienza una nueva racha. ¡Vamos!",
    );
    expect(getStreakMessage(3)).toBe(
      "Racha de 3 días. ¡Que el ritmo no pare!",
    );
  });

  it("etiqueta cada punto con la inicial española del día", () => {
    expect(getDayInitialLabel("2026-07-20")).toBe("L");
    expect(getDayInitialLabel("2026-07-21")).toBe("M");
    expect(getDayInitialLabel("2026-07-22")).toBe("X");
    expect(getDayInitialLabel("2026-07-23")).toBe("J");
    expect(getDayInitialLabel("2026-07-24")).toBe("V");
    expect(getDayInitialLabel("2026-07-25")).toBe("S");
    expect(getDayInitialLabel("2026-07-26")).toBe("D");
  });
});
