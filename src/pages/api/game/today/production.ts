import { errorResponse, gameResponse } from "./utils";

export async function productionGameResponse(
  gameDate: string,
): Promise<Response> {
  try {
    const { getScheduledDailyWords } = await import(
      "@/services/daily-calendar.server"
    );
    const words = getScheduledDailyWords(gameDate);
    if (words === null) {
      return errorResponse(
        503,
        "game-unavailable",
        "La partida diaria todavía no está disponible.",
      );
    }

    return gameResponse({
      gameId: `daily:${gameDate}`,
      gameDate,
      words,
      mode: "daily",
      replayAllowed: false,
    });
  } catch (error) {
    console.error("No se pudo recuperar la partida diaria.", error);
    return errorResponse(
      500,
      "unexpected-error",
      "No se pudo cargar la partida diaria.",
    );
  }
}
