import { describe, expect, it } from "vitest";

import {
  buildOrthographicCandidates,
  createWordReadings,
  parseApertiumResponse,
  parseRaeResponse,
} from "./utils";

describe("word definition utilities", () => {
  it("genera variantes con tilde y diéresis sin perder la forma base", () => {
    const candidates = buildOrthographicCandidates("ARGUI");

    expect(candidates[0]).toBe("argui");
    expect(candidates).toContain("argüí");
    expect(candidates).toContain("árgui");
  });

  it("analiza homógrafos y tiempos verbales de Apertium", () => {
    const readings = parseApertiumResponse([
      ["canto/canto<n><m><sg>/cantar<vblex><pri><p1><sg>", "canto "],
      ["cantó/cantar<vblex><ifi><p3><sg>", "cantó"],
      ["vivir/vivir<vblex><inf>", "vivir"],
    ]);

    expect(readings).toEqual([
      {
        displayedForm: "canto",
        lemma: "canto",
        category: "noun",
        grammaticalForm: null,
      },
      {
        displayedForm: "canto",
        lemma: "cantar",
        category: "verb",
        grammaticalForm:
          "primera persona del singular del presente de indicativo",
      },
      {
        displayedForm: "cantó",
        lemma: "cantar",
        category: "verb",
        grammaticalForm:
          "tercera persona del singular del pretérito perfecto simple de indicativo",
      },
      {
        displayedForm: "vivir",
        lemma: "vivir",
        category: "verb",
        grammaticalForm: null,
      },
    ]);
  });

  it("selecciona la primera acepción compatible y conserva etiquetas", () => {
    const nounEntry = parseRaeResponse({
      data: {
        word: "canto",
        meanings: [
          {
            homonym_index: 1,
            senses: [
              {
                category: "noun",
                description: "Acción y efecto de cantar.",
                usage: "common",
              },
              {
                category: "noun",
                description: "Arte de cantar.",
              },
            ],
          },
        ],
      },
    });
    const verbEntry = parseRaeResponse({
      data: {
        word: "cantar",
        meanings: [
          {
            senses: [
              {
                category: "verb",
                description: "Producir sonidos melodiosos.",
                fields: ["Música"],
                regions: [{ name: "España" }],
              },
            ],
          },
        ],
      },
    });
    expect(nounEntry).not.toBeNull();
    expect(verbEntry).not.toBeNull();

    const readings = createWordReadings(
      [
        {
          displayedForm: "canto",
          lemma: "canto",
          category: "noun",
          grammaticalForm: null,
        },
        {
          displayedForm: "canto",
          lemma: "cantar",
          category: "verb",
          grammaticalForm:
            "primera persona del singular del presente de indicativo",
        },
      ],
      new Map([
        ["canto", nounEntry!],
        ["cantar", verbEntry!],
      ]),
      "CANTO",
    );

    expect(readings).toEqual([
      {
        displayedForm: "canto",
        lemma: "canto",
        category: "noun",
        homonymIndex: 1,
        grammaticalForms: [],
        definition: "Acción y efecto de cantar.",
        labels: [],
      },
      {
        displayedForm: "canto",
        lemma: "cantar",
        category: "verb",
        homonymIndex: null,
        grammaticalForms: [
          "primera persona del singular del presente de indicativo",
        ],
        definition: "Producir sonidos melodiosos.",
        labels: ["Música", "España"],
      },
    ]);
  });
});
