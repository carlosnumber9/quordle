import type { WordCategory, WordReading } from "@/types/api";

import type {
  MorphologicalReading,
  RaeEntry,
  RaeMeaning,
  RaeSense,
} from "./definitions";

const ACUTE_VOWELS: Readonly<Record<string, string>> = {
  a: "á",
  e: "é",
  i: "í",
  o: "ó",
  u: "ú",
};

const APERTIUM_CATEGORIES: Readonly<Record<string, WordCategory>> = {
  adj: "adjective",
  adv: "adverb",
  cnjadv: "conjunction",
  cnjcoo: "conjunction",
  cnjsub: "conjunction",
  det: "article",
  ij: "interjection",
  n: "noun",
  pr: "preposition",
  prn: "pronoun",
  vbex: "verb",
  vbhaver: "verb",
  vblex: "verb",
  vbmod: "verb",
  vbser: "verb",
};

const VERB_TENSES: Readonly<Record<string, string>> = {
  cni: "condicional simple de indicativo",
  fti: "futuro simple de indicativo",
  fts: "futuro simple de subjuntivo",
  ifi: "pretérito perfecto simple de indicativo",
  pii: "pretérito imperfecto de indicativo",
  pis: "pretérito imperfecto de subjuntivo",
  pri: "presente de indicativo",
  prs: "presente de subjuntivo",
};

const PERSONS: Readonly<Record<string, string>> = {
  p1: "primera persona",
  p2: "segunda persona",
  p3: "tercera persona",
};

const NUMBERS: Readonly<Record<string, string>> = {
  pl: "plural",
  sg: "singular",
};

const RAE_CATEGORIES = new Set<WordCategory>([
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

const USAGE_LABELS: Readonly<Record<string, string>> = {
  colloquial: "Coloquial",
  obsolete: "Desusado",
  outdated: "Anticuado",
  rare: "Poco usado",
};

export function buildOrthographicCandidates(word: string): ReadonlyArray<string> {
  const base = word.toLocaleLowerCase("es-ES");
  const candidates = new Set<string>([base]);
  const characters = Array.from(base);

  characters.forEach((character, index) => {
    const acute = ACUTE_VOWELS[character];
    if (acute !== undefined) {
      candidates.add(replaceCharacter(characters, index, acute));
    }
  });

  characters.forEach((character, diaeresisIndex) => {
    if (character !== "u") {
      return;
    }
    const withDiaeresis = replaceCharacter(characters, diaeresisIndex, "ü");
    candidates.add(withDiaeresis);
    Array.from(withDiaeresis).forEach((accentCharacter, accentIndex) => {
      const acute = ACUTE_VOWELS[accentCharacter];
      if (acute !== undefined) {
        candidates.add(
          replaceCharacter(Array.from(withDiaeresis), accentIndex, acute),
        );
      }
    });
  });

  return Array.from(candidates);
}

export function parseApertiumResponse(input: unknown): ReadonlyArray<MorphologicalReading> {
  if (!Array.isArray(input)) {
    return [];
  }

  const readings: MorphologicalReading[] = [];
  for (const item of input) {
    if (
      !Array.isArray(item) ||
      typeof item[0] !== "string" ||
      typeof item[1] !== "string"
    ) {
      continue;
    }
    const displayedForm = item[1].trim();
    for (const analysis of item[0].split("/").slice(1)) {
      const match = /^([^<]+)((?:<[^>]+>)+)$/u.exec(analysis);
      if (match === null) {
        continue;
      }
      const lemma = match[1]?.trim();
      const tags = Array.from(match[2]?.matchAll(/<([^>]+)>/gu) ?? []).map(
        (tag) => tag[1] ?? "",
      );
      const category = tags
        .map((tag) => APERTIUM_CATEGORIES[tag])
        .find((value) => value !== undefined);
      if (lemma === undefined || lemma.length === 0 || category === undefined) {
        continue;
      }
      readings.push({
        displayedForm,
        lemma,
        category,
        grammaticalForm:
          category === "verb" ? formatVerbForm(tags) : null,
      });
    }
  }

  return deduplicateMorphologicalReadings(readings);
}

export function parseRaeResponse(input: unknown): RaeEntry | null {
  if (!isRecord(input) || !isRecord(input.data)) {
    return null;
  }
  const word = input.data.word;
  const meanings = input.data.meanings;
  if (typeof word !== "string" || !Array.isArray(meanings)) {
    return null;
  }

  return {
    word,
    meanings: meanings.flatMap(parseRaeMeaning),
  };
}

export function createWordReadings(
  morphology: ReadonlyArray<MorphologicalReading>,
  entries: ReadonlyMap<string, RaeEntry>,
  normalizedWord: string,
): ReadonlyArray<WordReading> {
  const grouped = new Map<string, WordReading>();

  for (const reading of morphology) {
    const entry = entries.get(reading.lemma);
    if (entry === undefined) {
      continue;
    }
    addMatchingMeanings(grouped, entry, reading);
  }

  const baseEntry = entries.get(normalizedWord.toLocaleLowerCase("es-ES"));
  if (baseEntry !== undefined) {
    for (const meaning of baseEntry.meanings) {
      const sense = meaning.senses[0];
      if (sense === undefined) {
        continue;
      }
      addWordReading(grouped, {
        displayedForm: baseEntry.word,
        lemma: baseEntry.word,
        category: sense.category,
        homonymIndex: meaning.homonymIndex,
        grammaticalForms: [],
        definition: sense.description,
        labels: sense.labels,
      });
    }
  }

  return Array.from(grouped.values());
}

function replaceCharacter(
  characters: ReadonlyArray<string>,
  index: number,
  replacement: string,
): string {
  return characters
    .map((character, characterIndex) =>
      characterIndex === index ? replacement : character,
    )
    .join("");
}

function formatVerbForm(tags: ReadonlyArray<string>): string | null {
  if (tags.includes("inf")) {
    return null;
  }
  if (tags.includes("ger")) {
    return "gerundio";
  }
  if (tags.includes("pp")) {
    return "participio";
  }

  const person = tags.map((tag) => PERSONS[tag]).find(Boolean);
  const number = tags.map((tag) => NUMBERS[tag]).find(Boolean);
  const tense = tags.map((tag) => VERB_TENSES[tag]).find(Boolean);
  const mood = tags.includes("imp") ? "imperativo" : tense;
  const parts = [person, number === undefined ? undefined : `del ${number}`];
  if (mood !== undefined) {
    parts.push(`del ${mood}`);
  }
  const result = parts.filter(Boolean).join(" ");
  return result.length === 0 ? null : result;
}

function deduplicateMorphologicalReadings(
  readings: ReadonlyArray<MorphologicalReading>,
): ReadonlyArray<MorphologicalReading> {
  const unique = new Map<string, MorphologicalReading>();
  for (const reading of readings) {
    const key = [
      reading.displayedForm,
      reading.lemma,
      reading.category,
      reading.grammaticalForm ?? "",
    ].join("|");
    unique.set(key, reading);
  }
  return Array.from(unique.values());
}

function parseRaeMeaning(input: unknown): ReadonlyArray<RaeMeaning> {
  if (!isRecord(input) || !Array.isArray(input.senses)) {
    return [];
  }
  const senses = input.senses.flatMap(parseRaeSense);
  if (senses.length === 0) {
    return [];
  }
  return [
    {
      homonymIndex:
        typeof input.homonym_index === "number" ? input.homonym_index : null,
      senses,
    },
  ];
}

function parseRaeSense(input: unknown): ReadonlyArray<RaeSense> {
  if (
    !isRecord(input) ||
    typeof input.category !== "string" ||
    !RAE_CATEGORIES.has(input.category as WordCategory) ||
    typeof input.description !== "string" ||
    input.description.length === 0
  ) {
    return [];
  }

  const labels = new Set<string>();
  if (typeof input.usage === "string") {
    const usage = USAGE_LABELS[input.usage];
    if (usage !== undefined) {
      labels.add(usage);
    }
  }
  addStringLabels(labels, input.fields);
  if (Array.isArray(input.regions)) {
    for (const region of input.regions) {
      if (isRecord(region) && typeof region.name === "string") {
        labels.add(region.name);
      }
    }
  }

  return [
    {
      category: input.category as WordCategory,
      description: input.description,
      labels: Array.from(labels),
    },
  ];
}

function addStringLabels(labels: Set<string>, input: unknown): void {
  if (!Array.isArray(input)) {
    return;
  }
  for (const value of input) {
    if (typeof value === "string" && value.length > 0) {
      labels.add(value);
    }
  }
}

function addMatchingMeanings(
  grouped: Map<string, WordReading>,
  entry: RaeEntry,
  morphology: MorphologicalReading,
): void {
  for (const meaning of entry.meanings) {
    const sense = meaning.senses.find(
      (candidate) => candidate.category === morphology.category,
    );
    if (sense === undefined) {
      continue;
    }
    addWordReading(grouped, {
      displayedForm: morphology.displayedForm,
      lemma: morphology.lemma,
      category: morphology.category,
      homonymIndex: meaning.homonymIndex,
      grammaticalForms:
        morphology.grammaticalForm === null
          ? []
          : [morphology.grammaticalForm],
      definition: sense.description,
      labels: sense.labels,
    });
  }
}

function addWordReading(
  grouped: Map<string, WordReading>,
  reading: WordReading,
): void {
  const key = [
    reading.displayedForm,
    reading.lemma,
    reading.category,
    reading.homonymIndex ?? "",
    reading.definition,
  ].join("|");
  const current = grouped.get(key);
  if (current === undefined) {
    grouped.set(key, reading);
    return;
  }
  grouped.set(key, {
    ...current,
    grammaticalForms: Array.from(
      new Set([...current.grammaticalForms, ...reading.grammaticalForms]),
    ),
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
