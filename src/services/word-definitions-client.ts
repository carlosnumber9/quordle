import type { WordDefinitionPayload } from "@/types/api";

import { isWordDefinitionPayload } from "./word-definitions-schema";

export async function fetchWordDefinition(
  word: string,
  request: typeof globalThis.fetch = globalThis.fetch,
  signal?: AbortSignal,
): Promise<WordDefinitionPayload> {
  const response = await request(
    `/api/definitions/${encodeURIComponent(word)}`,
    { method: "GET", signal: signal ?? null },
  );
  if (!response.ok) {
    throw new Error("No se pudo cargar la definición.");
  }
  const payload: unknown = await response.json();
  if (!isWordDefinitionPayload(payload)) {
    throw new Error("La respuesta de definiciones no es válida.");
  }
  return payload;
}
