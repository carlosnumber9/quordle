import { dictionary } from "@/game/dictionary";

import { ensureDailyGame, type DailyGameResult } from "./daily-game";
import { SupabaseDailyGameRepository } from "./supabase-daily-game.server";

export async function ensurePersistedDailyGame(
  gameDate: string,
): Promise<DailyGameResult> {
  return ensureDailyGame(
    new SupabaseDailyGameRepository(),
    gameDate,
    dictionary,
  );
}
