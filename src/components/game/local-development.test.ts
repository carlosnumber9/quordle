import { describe, expect, it } from "vitest";

import { shouldShowSolutionWatermark } from "./Board/utils";

describe("local development helpers", () => {
  it("muestra soluciones solo en desarrollo local", () => {
    expect(shouldShowSolutionWatermark(true, "local")).toBe(true);
    expect(shouldShowSolutionWatermark(false, "local")).toBe(false);
    expect(shouldShowSolutionWatermark(true, "daily")).toBe(false);
    expect(shouldShowSolutionWatermark(false, "daily")).toBe(false);
  });
});
