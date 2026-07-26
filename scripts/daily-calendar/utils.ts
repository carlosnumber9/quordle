import { createHash } from "node:crypto";

import {
  type DailyCalendar,
  DAILY_CALENDAR_VERSION,
  validateDailyCalendar,
} from "../../src/services/daily-calendar";
import { isIsoDate, nextIsoDate } from "../../src/services/daily-calendar/utils";
import type { DailyWordHistoryRow } from "./definitions";

export function parseHistoryCsv(csv: string): ReadonlyArray<DailyWordHistoryRow> {
  const lines = csv.trim().split(/\r?\n/u);
  const headers = parseCsvLine(lines.shift() ?? "").map((header) =>
    header.replace(/^\uFEFF/u, ""),
  );
  const wordIndex = headers.indexOf("word");
  const dateIndex = headers.indexOf("game_date");
  const positionIndex = headers.indexOf("position");
  if ([wordIndex, dateIndex, positionIndex].includes(-1)) {
    throw new Error("El CSV debe incluir word, game_date y position.");
  }

  return lines
    .filter((line) => line.trim().length > 0)
    .map((line, index) => {
      const values = parseCsvLine(line);
      const word = values[wordIndex];
      const gameDate = values[dateIndex];
      const rawPosition = values[positionIndex];
      const position = Number(rawPosition);
      if (
        word === undefined ||
        gameDate === undefined ||
        rawPosition === undefined ||
        !Number.isInteger(position)
      ) {
        throw new Error(`La fila ${index + 2} del CSV no es válida.`);
      }
      return { word, gameDate, position };
    });
}

export function createDailyCalendar(
  history: ReadonlyArray<DailyWordHistoryRow>,
  dictionary: ReadonlyArray<string>,
  seed: string,
): DailyCalendar {
  if (history.length === 0) {
    throw new Error("El histórico de partidas está vacío.");
  }

  const dictionarySet = new Set(dictionary);
  const grouped = new Map<string, DailyWordHistoryRow[]>();
  const usedWords = new Set<string>();
  for (const row of history) {
    if (!isIsoDate(row.gameDate) || !dictionarySet.has(row.word)) {
      throw new Error(`La fila histórica de ${row.gameDate} no es válida.`);
    }
    if (usedWords.has(row.word)) {
      throw new Error(`La palabra histórica ${row.word} está repetida.`);
    }
    usedWords.add(row.word);
    const rows = grouped.get(row.gameDate) ?? [];
    rows.push(row);
    grouped.set(row.gameDate, rows);
  }

  const games: Record<string, ReadonlyArray<string>> = {};
  const dates = [...grouped.keys()].sort();
  for (const [index, date] of dates.entries()) {
    if (index > 0 && date !== nextIsoDate(dates[index - 1] ?? "")) {
      throw new Error(`El histórico no es continuo antes de ${date}.`);
    }
    const rows = [...(grouped.get(date) ?? [])].sort(
      (left, right) => left.position - right.position,
    );
    if (
      rows.length !== 4 ||
      rows.some((row, position) => row.position !== position)
    ) {
      throw new Error(`La partida histórica ${date} no contiene las posiciones 0–3.`);
    }
    games[date] = rows.map((row) => row.word);
  }

  return extendDailyCalendar(
    { version: DAILY_CALENDAR_VERSION, seed, games },
    dictionary,
  );
}

export function extendDailyCalendar(
  input: unknown,
  dictionary: ReadonlyArray<string>,
): DailyCalendar {
  const calendar = validateDailyCalendar(input, dictionary, {
    requireCompleteDictionary: false,
  });
  const usedWords = new Set(Object.values(calendar.games).flat());
  const remaining = dictionary.filter((word) => !usedWords.has(word));
  if (remaining.length % 4 !== 0) {
    throw new Error("Las palabras pendientes no forman partidas completas de cuatro.");
  }

  const ranked = remaining
    .map((word) => ({ hash: rankWord(calendar.seed, word), word }))
    .sort(
      (left, right) =>
        left.hash.localeCompare(right.hash) || left.word.localeCompare(right.word),
    )
    .map(({ word }) => word);
  const games: Record<string, ReadonlyArray<string>> = { ...calendar.games };
  let date = nextIsoDate(Object.keys(games).sort().at(-1) ?? "");
  for (let index = 0; index < ranked.length; index += 4) {
    games[date] = ranked.slice(index, index + 4);
    date = nextIsoDate(date);
  }

  return validateDailyCalendar(
    { version: DAILY_CALENDAR_VERSION, seed: calendar.seed, games },
    dictionary,
  );
}

function rankWord(seed: string, word: string): string {
  return createHash("sha256").update(seed).update("\0").update(word).digest("hex");
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  if (quoted) {
    throw new Error("El CSV contiene una comilla sin cerrar.");
  }
  values.push(value);
  return values;
}
