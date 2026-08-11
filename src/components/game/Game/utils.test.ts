import { describe, expect, it } from "vitest";

import { calculateFlipTransform } from "./utils";

const SMALL_BOARD = { height: 180, left: 0, top: 0, width: 100 } as const;
const LARGE_BOARD = { height: 370, left: 2, top: 0, width: 206 } as const;

describe("calculateFlipTransform", () => {
  it("invierte el cambio de tamaño y posición", () => {
    const transform = calculateFlipTransform(SMALL_BOARD, LARGE_BOARD);

    expect(transform).toEqual({
      scaleX: 100 / 206,
      scaleY: 180 / 370,
      x: -55,
      y: -95,
    });
  });

  it("calcula también la inversión de cierre", () => {
    const transform = calculateFlipTransform(LARGE_BOARD, SMALL_BOARD);

    expect(transform?.scaleX).toBe(206 / 100);
    expect(transform?.scaleY).toBe(370 / 180);
    expect(transform?.x).toBe(55);
    expect(transform?.y).toBe(95);
  });

  it("rechaza medidas sin tamaño", () => {
    expect(
      calculateFlipTransform(
        { height: 0, left: 0, top: 0, width: 100 },
        LARGE_BOARD,
      ),
    ).toBeNull();
  });
});
