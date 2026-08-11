import { describe, expect, it } from "vitest";

import { calculateKeyboardInset } from "./use-native-keyboard";

describe("calculateKeyboardInset", () => {
  it("reserva el espacio oculto por el teclado", () => {
    expect(calculateKeyboardInset(844, 510)).toBe(334);
  });

  it("ignora crecimientos y diferencias subpíxel", () => {
    expect(calculateKeyboardInset(844, 844.4)).toBe(0);
    expect(calculateKeyboardInset(844.4, 510.2)).toBe(334);
  });
});
