import { describe, expect, it, vi } from "vitest";

import {
  getWordDefinition,
  WordDefinitionUnavailableError,
} from "./word-definitions";

describe("word definitions service", () => {
  it("combina análisis morfológico y definiciones RAE", async () => {
    const request = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url.includes("apertium.org")) {
        return Response.json([
          ["canto/canto<n><m><sg>/cantar<vblex><pri><p1><sg>", "canto"],
          ["cantó/cantar<vblex><ifi><p3><sg>", "cantó"],
        ]);
      }
      if (url.endsWith("/canto")) {
        return Response.json({
          data: {
            word: "canto",
            meanings: [
              {
                senses: [
                  { category: "noun", description: "Acción de cantar." },
                ],
              },
            ],
          },
        });
      }
      if (url.endsWith("/cantar")) {
        return Response.json({
          data: {
            word: "cantar",
            meanings: [
              {
                senses: [
                  { category: "verb", description: "Producir sonidos." },
                ],
              },
            ],
          },
        });
      }
      return new Response(null, { status: 404 });
    });

    const payload = await getWordDefinition("CANTO", {
      apiKey: "secret",
      fetch: request,
    });

    expect(payload.word).toBe("CANTO");
    expect(payload.readings).toHaveLength(3);
    expect(request).toHaveBeenCalledTimes(3);
    expect(request.mock.calls[1]?.[1]?.headers).toEqual({
      Accept: "application/json",
      "X-API-Key": "secret",
    });
  });

  it("usa la lectura directa si falla Apertium", async () => {
    const request = vi.fn<typeof fetch>(async (input) => {
      if (String(input).includes("apertium.org")) {
        throw new Error("unavailable");
      }
      return Response.json({
        data: {
          word: "canto",
          meanings: [
            {
              senses: [
                { category: "noun", description: "Acción de cantar." },
              ],
            },
          ],
        },
      });
    });

    await expect(
      getWordDefinition("CANTO", { fetch: request }),
    ).resolves.toMatchObject({
      readings: [{ category: "noun", definition: "Acción de cantar." }],
    });
  });

  it("falla si ningún proveedor ofrece una definición", async () => {
    const request = vi.fn<typeof fetch>(async () =>
      new Response(null, { status: 503 }),
    );

    await expect(
      getWordDefinition("CANTO", { fetch: request }),
    ).rejects.toBeInstanceOf(WordDefinitionUnavailableError);
  });
});
