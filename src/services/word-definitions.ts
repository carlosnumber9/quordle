import type { WordDefinitionPayload } from "@/types/api";

import {
  APERTIUM_ANALYZE_URL,
  RAE_API_BASE_URL,
  UPSTREAM_TIMEOUT_MS,
  WordDefinitionUnavailableError,
  type MorphologicalReading,
  type RaeEntry,
  type WordDefinitionDependencies,
} from "./word-definitions/definitions";
import {
  buildOrthographicCandidates,
  createWordReadings,
  parseApertiumResponse,
  parseRaeResponse,
} from "./word-definitions/utils";

export { WordDefinitionUnavailableError };

export async function getWordDefinition(
  word: string,
  dependencies: WordDefinitionDependencies,
): Promise<WordDefinitionPayload> {
  const normalizedWord = word.toLocaleLowerCase("es-ES");
  const morphology = await getMorphology(normalizedWord, dependencies.fetch);
  const lemmas = new Set<string>([
    normalizedWord,
    ...morphology.map((reading) => reading.lemma),
  ]);
  const entryResults = await getRaeEntries(Array.from(lemmas), dependencies);
  const entries = new Map<string, RaeEntry>(
    entryResults.filter(
      (result): result is readonly [string, RaeEntry] => result[1] !== null,
    ),
  );
  const readings = createWordReadings(morphology, entries, word);
  if (readings.length === 0) {
    throw new WordDefinitionUnavailableError();
  }

  return { word, readings };
}

async function getRaeEntries(
  lemmas: ReadonlyArray<string>,
  dependencies: WordDefinitionDependencies,
): Promise<ReadonlyArray<readonly [string, RaeEntry | null]>> {
  const results: Array<readonly [string, RaeEntry | null]> = [];
  const concurrency = 4;
  for (let index = 0; index < lemmas.length; index += concurrency) {
    const batch = lemmas.slice(index, index + concurrency);
    results.push(
      ...(await Promise.all(
        batch.map(async (lemma) => [
          lemma,
          await getRaeEntry(lemma, dependencies),
        ] as const),
      )),
    );
  }
  return results;
}

async function getMorphology(
  word: string,
  request: typeof globalThis.fetch,
): Promise<ReadonlyArray<MorphologicalReading>> {
  const url = new URL(APERTIUM_ANALYZE_URL);
  url.searchParams.set("lang", "spa");
  url.searchParams.set("q", buildOrthographicCandidates(word).join("\n"));
  try {
    const response = await request(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (!response.ok) {
      return [];
    }
    return parseApertiumResponse(await response.json());
  } catch {
    return [];
  }
}

async function getRaeEntry(
  lemma: string,
  dependencies: WordDefinitionDependencies,
): Promise<RaeEntry | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (dependencies.apiKey !== undefined && dependencies.apiKey.length > 0) {
      headers["X-API-Key"] = dependencies.apiKey;
    }
    const response = await dependencies.fetch(
      `${RAE_API_BASE_URL}/${encodeURIComponent(lemma)}`,
      {
        headers,
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      },
    );
    if (!response.ok) {
      return null;
    }
    return parseRaeResponse(await response.json());
  } catch {
    return null;
  }
}
