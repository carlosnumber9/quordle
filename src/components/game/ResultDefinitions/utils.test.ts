import { describe, expect, it } from "vitest";

import {
  formatDisjunction,
  getBoardResultText,
  getDefinitionPrefix,
  getReadingDescriptor,
} from "./utils";

describe("result definitions", () => {
  it("describe el resultado con singular y plural", () => {
    expect(getBoardResultText(null)).toBe("No resuelta");
    expect(getBoardResultText(1)).toBe("Resuelta en 1 turno");
    expect(getBoardResultText(6)).toBe("Resuelta en 6 turnos");
  });

  it("formatea lecturas simples y formas verbales ambiguas", () => {
    expect(
      getReadingDescriptor({
        displayedForm: "canto",
        lemma: "canto",
        category: "noun",
        homonymIndex: null,
        grammaticalForms: [],
        definition: "Acción de cantar.",
        labels: [],
      }),
    ).toBe("Sustantivo");

    const verb = {
      displayedForm: "cante",
      lemma: "cantar",
      category: "verb" as const,
      homonymIndex: null,
      grammaticalForms: [
        "primera persona del singular del presente de subjuntivo",
        "tercera persona del singular del imperativo",
      ],
      definition: "Producir sonidos.",
      labels: [],
    };
    expect(getReadingDescriptor(verb)).toBe(
      "Primera persona del singular del presente de subjuntivo o tercera persona del singular del imperativo",
    );
    expect(getDefinitionPrefix(verb)).toBe("Del verbo cantar:");
  });

  it("une tres opciones mediante disyunción española", () => {
    expect(formatDisjunction(["uno", "dos", "tres"])).toBe(
      "uno, dos o tres",
    );
  });
});
