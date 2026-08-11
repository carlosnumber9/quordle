import { RAE_API_KEY } from "astro:env/server";
import type { APIRoute } from "astro";

import { dictionarySet, isValidWordShape, normalizeWord } from "@/game/dictionary";
import {
  getWordDefinition,
  WordDefinitionUnavailableError,
} from "@/services/word-definitions";

export const prerender = false;

let warnedAboutAnonymousQuota = false;

export const GET: APIRoute = async ({ params }) => {
  const word = normalizeWord(params.word ?? "");
  if (!isValidWordShape(word) || !dictionarySet.has(word)) {
    return definitionError(
      404,
      "definition-not-found",
      "La definición no está disponible.",
    );
  }
  if (import.meta.env.PROD && RAE_API_KEY === undefined) {
    console.error("RAE_API_KEY no está configurada en producción.");
    return definitionError(
      503,
      "definition-unavailable",
      "No se pudo cargar la definición.",
    );
  }
  if (
    import.meta.env.DEV &&
    RAE_API_KEY === undefined &&
    !warnedAboutAnonymousQuota
  ) {
    warnedAboutAnonymousQuota = true;
    console.warn(
      "RAE_API_KEY no está configurada. La cuota anónima puede devolver 429 al cargar cuatro definiciones.",
    );
  }

  try {
    const payload = await getWordDefinition(word, {
      fetch: globalThis.fetch,
      ...(RAE_API_KEY === undefined ? {} : { apiKey: RAE_API_KEY }),
    });
    return Response.json(payload, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    if (!(error instanceof WordDefinitionUnavailableError)) {
      console.error("No se pudo recuperar una definición.", error);
    }
    return definitionError(
      503,
      "definition-unavailable",
      "No se pudo cargar la definición.",
    );
  }
};

function definitionError(
  status: number,
  code: string,
  message: string,
): Response {
  return Response.json(
    { error: { code, message } },
    { status, headers: { "Cache-Control": "private, no-store" } },
  );
}
