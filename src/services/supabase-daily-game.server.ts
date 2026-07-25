import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type DailyGameRepository,
  type DailyWordRow,
  type NewDailyWordRow,
} from "./daily-game";
import { getSupabaseAdmin } from "./supabase.server";
import {
  HISTORY_PAGE_SIZE,
  type DailyWordDatabaseRow,
} from "./supabase-daily-game/definitions";
import { mapDailyWord } from "./supabase-daily-game/utils";

export class SupabaseDailyGameRepository implements DailyGameRepository {
  constructor(private readonly client: SupabaseClient = getSupabaseAdmin()) {}

  async findByDate(gameDate: string): Promise<ReadonlyArray<DailyWordRow>> {
    const { data, error } = await this.client
      .from("daily_words")
      .select("word, game_date, position")
      .eq("game_date", gameDate)
      .order("position", { ascending: true });

    if (error !== null) {
      throw error;
    }

    return (data as DailyWordDatabaseRow[]).map(mapDailyWord);
  }

  async listUsedWords(): Promise<ReadonlyArray<string>> {
    const words: string[] = [];

    for (let offset = 0; ; offset += HISTORY_PAGE_SIZE) {
      const { data, error } = await this.client
        .from("daily_words")
        .select("word")
        .order("word", { ascending: true })
        .range(offset, offset + HISTORY_PAGE_SIZE - 1);

      if (error !== null) {
        throw error;
      }

      const page = data as Array<{ word: string }>;
      words.push(...page.map((row) => row.word));

      if (page.length < HISTORY_PAGE_SIZE) {
        return words;
      }
    }
  }

  async insertWords(rows: ReadonlyArray<NewDailyWordRow>): Promise<void> {
    const { error } = await this.client.from("daily_words").insert(
      rows.map((row) => ({
        word: row.word,
        game_date: row.gameDate,
        position: row.position,
      })),
    );

    if (error !== null) {
      throw error;
    }
  }
}
