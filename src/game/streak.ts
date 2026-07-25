import { MAX_ATTEMPTS, type GameState } from "./definitions";
import type { StorageLike } from "./persistence/definitions";

const HISTORY_VERSION = 1;
const VISIBLE_DAY_COUNT = 7;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;

export const STREAK_STORAGE_KEY = `quordle:streak:v${HISTORY_VERSION}`;

export type CompletedGameOutcome = "won" | "lost";
export type StreakDayOutcome = CompletedGameOutcome | "unplayed";

export interface CompletedGameResult {
  readonly attempts: number;
  readonly gameDate: string;
  readonly outcome: CompletedGameOutcome;
}

export interface StreakDay {
  readonly attempts: number | null;
  readonly gameDate: string;
  readonly outcome: StreakDayOutcome;
}

export interface StreakSummary {
  readonly currentStreak: number;
  readonly days: ReadonlyArray<StreakDay>;
}

interface PersistedStreakHistory {
  readonly results: ReadonlyArray<CompletedGameResult>;
  readonly version: typeof HISTORY_VERSION;
}

export function recordCompletedGame(
  storage: StorageLike,
  state: GameState,
): void {
  if (state.status === "playing") {
    return;
  }

  const result: CompletedGameResult = {
    attempts: state.attempts.length,
    gameDate: state.gameDate,
    outcome: state.status,
  };
  const byDate = new Map(
    loadStreakHistory(storage).map((entry) => [entry.gameDate, entry]),
  );
  byDate.set(result.gameDate, result);

  const history: PersistedStreakHistory = {
    version: HISTORY_VERSION,
    results: [...byDate.values()].sort((left, right) =>
      left.gameDate.localeCompare(right.gameDate),
    ),
  };
  storage.setItem(STREAK_STORAGE_KEY, JSON.stringify(history));
}

export function loadStreakHistory(
  storage: StorageLike,
): ReadonlyArray<CompletedGameResult> {
  const serialized = storage.getItem(STREAK_STORAGE_KEY);
  if (serialized === null) {
    return [];
  }

  const history = parseStreakHistory(serialized);
  if (history === null) {
    storage.removeItem(STREAK_STORAGE_KEY);
    return [];
  }

  return history.results;
}

export function getStreakSummary(
  results: ReadonlyArray<CompletedGameResult>,
  currentGameDate: string,
): StreakSummary {
  assertGameDate(currentGameDate);
  const byDate = new Map(results.map((result) => [result.gameDate, result]));
  const days = Array.from({ length: VISIBLE_DAY_COUNT }, (_, index) => {
    const gameDate = shiftGameDate(
      currentGameDate,
      index - (VISIBLE_DAY_COUNT - 1),
    );
    const result = byDate.get(gameDate);

    return result === undefined
      ? { attempts: null, gameDate, outcome: "unplayed" as const }
      : {
          attempts: result.attempts,
          gameDate,
          outcome: result.outcome,
        };
  });

  let currentStreak = 0;
  let cursor = currentGameDate;
  while (byDate.get(cursor)?.outcome === "won") {
    currentStreak += 1;
    cursor = shiftGameDate(cursor, -1);
  }

  return { currentStreak, days };
}

function parseStreakHistory(serialized: string): PersistedStreakHistory | null {
  try {
    const value: unknown = JSON.parse(serialized);
    if (
      !isRecord(value) ||
      value.version !== HISTORY_VERSION ||
      !Array.isArray(value.results)
    ) {
      return null;
    }

    const results: CompletedGameResult[] = [];
    const dates = new Set<string>();
    for (const candidate of value.results) {
      if (!isCompletedGameResult(candidate) || dates.has(candidate.gameDate)) {
        return null;
      }
      dates.add(candidate.gameDate);
      results.push(candidate);
    }

    return {
      version: HISTORY_VERSION,
      results: results.sort((left, right) =>
        left.gameDate.localeCompare(right.gameDate),
      ),
    };
  } catch {
    return null;
  }
}

function isCompletedGameResult(
  value: unknown,
): value is CompletedGameResult {
  if (
    !isRecord(value) ||
    typeof value.gameDate !== "string" ||
    !isGameDate(value.gameDate) ||
    (value.outcome !== "won" && value.outcome !== "lost") ||
    !Number.isInteger(value.attempts) ||
    typeof value.attempts !== "number"
  ) {
    return false;
  }

  return value.outcome === "won"
    ? value.attempts >= 4 && value.attempts <= MAX_ATTEMPTS
    : value.attempts === MAX_ATTEMPTS;
}

function shiftGameDate(gameDate: string, days: number): string {
  assertGameDate(gameDate);
  const [year, month, day] = gameDate.split("-").map(Number);
  const shifted = new Date(
    Date.UTC(year ?? 0, (month ?? 1) - 1, (day ?? 1) + days),
  );

  return [
    String(shifted.getUTCFullYear()).padStart(4, "0"),
    String(shifted.getUTCMonth() + 1).padStart(2, "0"),
    String(shifted.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function assertGameDate(gameDate: string): void {
  if (!isGameDate(gameDate)) {
    throw new TypeError("La fecha de juego debe usar el formato YYYY-MM-DD.");
  }
}

function isGameDate(gameDate: string): boolean {
  if (!ISO_DATE_PATTERN.test(gameDate)) {
    return false;
  }
  const [year, month, day] = gameDate.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
