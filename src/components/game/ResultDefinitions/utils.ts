import type { WordCategory, WordReading } from "@/types/api";

const CATEGORY_LABELS: Readonly<Record<WordCategory, string>> = {
  adjective: "Adjetivo",
  adverb: "Adverbio",
  article: "Artículo",
  conjunction: "Conjunción",
  interjection: "Interjección",
  noun: "Sustantivo",
  preposition: "Preposición",
  pronoun: "Pronombre",
  verb: "Verbo",
};

export function getBoardResultText(solvedAtAttempt: number | null): string {
  if (solvedAtAttempt === null) {
    return "No resuelta";
  }
  return `Resuelta en ${solvedAtAttempt} ${solvedAtAttempt === 1 ? "turno" : "turnos"}`;
}

export function getReadingDescriptor(reading: WordReading): string {
  if (reading.grammaticalForms.length === 0) {
    return CATEGORY_LABELS[reading.category];
  }
  return capitalize(formatDisjunction(reading.grammaticalForms));
}

export function getDefinitionPrefix(reading: WordReading): string | null {
  return reading.category === "verb" && reading.grammaticalForms.length > 0
    ? `Del verbo ${reading.lemma}:`
    : null;
}

export function formatDisjunction(values: ReadonlyArray<string>): string {
  if (values.length < 2) {
    return values[0] ?? "";
  }
  if (values.length === 2) {
    return `${values[0]} o ${values[1]}`;
  }
  return `${values.slice(0, -1).join(", ")} o ${values.at(-1)}`;
}

function capitalize(value: string): string {
  return value.length === 0
    ? value
    : `${value[0]?.toLocaleUpperCase("es-ES")}${value.slice(1)}`;
}
