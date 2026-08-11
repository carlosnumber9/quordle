import type { WordDefinitionPayload, WordReading } from "@/types/api";

const WORD_CATEGORIES = new Set([
  "adjective",
  "adverb",
  "article",
  "conjunction",
  "interjection",
  "noun",
  "preposition",
  "pronoun",
  "verb",
]);

export function isWordDefinitionPayload(
  value: unknown,
): value is WordDefinitionPayload {
  return (
    isRecord(value) &&
    typeof value.word === "string" &&
    Array.isArray(value.readings) &&
    value.readings.every(isWordReading)
  );
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWordReading(value: unknown): value is WordReading {
  return (
    isRecord(value) &&
    typeof value.displayedForm === "string" &&
    typeof value.lemma === "string" &&
    typeof value.category === "string" &&
    WORD_CATEGORIES.has(value.category) &&
    (typeof value.homonymIndex === "number" ||
      value.homonymIndex === null) &&
    Array.isArray(value.grammaticalForms) &&
    value.grammaticalForms.every((item) => typeof item === "string") &&
    typeof value.definition === "string" &&
    Array.isArray(value.labels) &&
    value.labels.every((item) => typeof item === "string")
  );
}
