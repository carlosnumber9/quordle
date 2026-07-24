import type { APIRoute } from "astro";
import { CRON_SECRET } from "astro:env/server";

import { getMadridCalendarDate } from "@/lib/game-date";
import { ensurePersistedDailyGame } from "@/services/daily-game.server";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (CRON_SECRET === undefined) {
    console.error("CRON_SECRET no está configurado.");
    return Response.json(
      { error: { code: "cron-not-configured" } },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return Response.json(
      { error: { code: "unauthorized" } },
      { status: 401 },
    );
  }

  const gameDate = getMadridCalendarDate();

  try {
    const game = await ensurePersistedDailyGame(gameDate);
    return Response.json({
      ok: true,
      gameDate: game.gameDate,
      created: game.created,
    });
  } catch (error) {
    console.error("No se pudo crear la partida diaria.", error);
    return Response.json(
      { error: { code: "daily-game-generation-failed" } },
      { status: 500 },
    );
  }
};
