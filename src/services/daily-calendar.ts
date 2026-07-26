import { BOARD_COUNT } from "@/game/definitions";
import {
  DAILY_CALENDAR_VERSION,
  type DailyCalendar,
  type DailyCalendarValidationOptions,
  InvalidDailyCalendarError,
} from "./daily-calendar/definitions";
import { isIsoDate, isRecord, nextIsoDate } from "./daily-calendar/utils";

export {
  DAILY_CALENDAR_VERSION,
  type DailyCalendar,
  InvalidDailyCalendarError,
} from "./daily-calendar/definitions";

const SEED_PATTERN = /^[\da-f]{64}$/u;

export function validateDailyCalendar(
  value: unknown,
  dictionary: ReadonlyArray<string>,
  options: DailyCalendarValidationOptions = {},
): DailyCalendar {
  if (
    !isRecord(value) ||
    value.version !== DAILY_CALENDAR_VERSION ||
    typeof value.seed !== "string" ||
    !SEED_PATTERN.test(value.seed) ||
    !isRecord(value.games)
  ) {
    throw new InvalidDailyCalendarError("El calendario diario no tiene un formato válido.");
  }

  const dictionarySet = new Set(dictionary);
  const dates = Object.keys(value.games).sort();
  if (dates.length === 0 || dates.some((date) => !isIsoDate(date))) {
    throw new InvalidDailyCalendarError("El calendario diario no contiene fechas válidas.");
  }

  const games: Record<string, ReadonlyArray<string>> = {};
  const usedWords = new Set<string>();
  for (const [index, date] of dates.entries()) {
    if (index > 0 && date !== nextIsoDate(dates[index - 1] ?? "")) {
      throw new InvalidDailyCalendarError(`Falta una partida diaria antes de ${date}.`);
    }

    const words = value.games[date];
    if (
      !Array.isArray(words) ||
      words.length !== BOARD_COUNT ||
      words.some((word) => typeof word !== "string" || !dictionarySet.has(word)) ||
      new Set(words).size !== BOARD_COUNT
    ) {
      throw new InvalidDailyCalendarError(`La partida ${date} no contiene cuatro palabras válidas.`);
    }

    for (const word of words) {
      if (usedWords.has(word)) {
        throw new InvalidDailyCalendarError(`La palabra ${word} aparece más de una vez.`);
      }
      usedWords.add(word);
    }
    games[date] = Object.freeze([...words]);
  }

  if (
    options.requireCompleteDictionary !== false &&
    (usedWords.size !== dictionary.length ||
      dictionary.some((word) => !usedWords.has(word)))
  ) {
    throw new InvalidDailyCalendarError(
      "El calendario diario no utiliza exactamente todas las palabras del diccionario.",
    );
  }

  return Object.freeze({
    version: DAILY_CALENDAR_VERSION,
    seed: value.seed,
    games: Object.freeze(games),
  });
}

export function getDailyWords(
  calendar: DailyCalendar,
  gameDate: string,
): ReadonlyArray<string> | null {
  return calendar.games[gameDate] ?? null;
}
