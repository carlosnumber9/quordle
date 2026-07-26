import rawCalendar from "@/data/daily-games.json";
import { dictionary } from "@/game/dictionary";
import { getDailyWords, validateDailyCalendar } from "./daily-calendar";

const calendar = validateDailyCalendar(rawCalendar, dictionary);

export function getScheduledDailyWords(
  gameDate: string,
): ReadonlyArray<string> | null {
  return getDailyWords(calendar, gameDate);
}
