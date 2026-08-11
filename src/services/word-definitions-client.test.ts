import { describe, expect, it, vi } from "vitest";

import { fetchWordDefinition } from "./word-definitions-client";

describe("word definitions client", () => {
  it("valida y devuelve la definición", async () => {
    const request = vi.fn<typeof fetch>(async () =>
      Response.json({
        word: "CANTO",
        readings: [
          {
            displayedForm: "canto",
            lemma: "canto",
            category: "noun",
            homonymIndex: null,
            grammaticalForms: [],
            definition: "Acción de cantar.",
            labels: [],
          },
        ],
      }),
    );

    await expect(fetchWordDefinition("CANTO", request)).resolves.toMatchObject({
      word: "CANTO",
    });
    expect(request).toHaveBeenCalledWith("/api/definitions/CANTO", {
      method: "GET",
      signal: null,
    });
  });

  it("rechaza errores HTTP y payloads inválidos", async () => {
    const unavailable = vi.fn<typeof fetch>(async () =>
      new Response(null, { status: 503 }),
    );
    const invalid = vi.fn<typeof fetch>(async () => Response.json({ ok: true }));

    await expect(fetchWordDefinition("CANTO", unavailable)).rejects.toThrow();
    await expect(fetchWordDefinition("CANTO", invalid)).rejects.toThrow();
  });
});
