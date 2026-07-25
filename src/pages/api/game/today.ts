import type { APIRoute } from "astro";

import { dictionary } from "@/game/dictionary";
import { getCurrentGameDate } from "@/lib/game-date";
import { createLocalGame } from "@/services/local-game";

import { productionGameResponse } from "./today/production";
import { gameResponse, noStoreHeaders } from "./today/utils";

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
