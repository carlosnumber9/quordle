import {
  InsufficientWordsError,
} from "@/game/dictionary";
import { CorruptDailyGameError } from "@/services/daily-game";

import { errorResponse, gameResponse } from "./utils";

export async function productionGameResponse(
  gameDate: string,
): Promise<Response> {
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
