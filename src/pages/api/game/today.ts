import type { APIRoute } from "astro";

import { dictionary, InsufficientWordsError } from "@/game/dictionary";
import { getCurrentGameDate } from "@/lib/game-date";
import {
  CorruptDailyGameError,
} from "@/services/daily-game";
import { createLocalGame } from "@/services/local-game";
import type { GamePayload } from "@/types/api";

export const prerender = false;

export const GET: APIRoute = async () => {
  const gameDate = getCurrentGameDate();

  if (import.meta.env.DEV) {
    return gameResponse(createLocalGame(gameDate, dictionary));
  }

  return productionGameResponse(gameDate);
};

export const POST: APIRoute = async () => {
  if (!import.meta.env.DEV) {
    return Response.json(
      {
        error: {
          code: "replay-not-available",
          message: "Volver a jugar solo está disponible en desarrollo local.",
        },
      },
      {
        status: 405,
        headers: {
          ...noStoreHeaders(),
          Allow: "GET",
        },
      },
    );
  }

  return gameResponse(createLocalGame(getCurrentGameDate(), dictionary));
};

async function productionGameResponse(gameDate: string): Promise<Response> {
  const [{ ensurePersistedDailyGame }, { MissingServerConfigurationError }] =
    await Promise.all([
      import("@/services/daily-game.server"),
      import("@/services/supabase.server"),
    ]);

  try {
    const game = await ensurePersistedDailyGame(gameDate);
    return gameResponse({
      gameId: `daily:${game.gameDate}`,
      gameDate: game.gameDate,
      words: game.words,
      mode: "daily",
      replayAllowed: false,
    });
  } catch (error) {
    console.error("No se pudo recuperar la partida diaria.", error);

    if (
      error instanceof MissingServerConfigurationError ||
      error instanceof InsufficientWordsError
    ) {
      return errorResponse(
        503,
        "game-unavailable",
        "La partida diaria todavía no está disponible.",
      );
    }

    if (error instanceof CorruptDailyGameError) {
      return errorResponse(
        500,
        "invalid-daily-game",
        "La partida diaria necesita revisión.",
      );
    }

    return errorResponse(
      500,
      "unexpected-error",
      "No se pudo cargar la partida diaria.",
    );
  }
}

function gameResponse(game: GamePayload): Response {
  return Response.json(
    game,
    {
      headers: noStoreHeaders(),
    },
  );
}

function errorResponse(
  status: number,
  code: string,
  message: string,
): Response {
  return Response.json(
    {
      error: {
        code,
        message,
      },
    },
    {
      status,
      headers: noStoreHeaders(),
    },
  );
}

function noStoreHeaders(): HeadersInit {
  return {
    "Cache-Control": "private, no-store",
  };
}
