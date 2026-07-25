import { describe, expect, it } from "vitest";

import { createGame, submitGuess } from "./engine";
import {
  ACCEPTED_WORDS,
  LOSING_GUESSES,
  SOLUTIONS,
} from "./engine/test/definitions";
import {
  GAME_STORAGE_KEY,
  loadGame,
  saveGame,
  serializeGame,
} from "./persistence";
import { createMemoryStorage } from "./persistence/test/utils";
import {
  getStreakSummary,
  loadStreakHistory,
  recordCompletedGame,
  STREAK_STORAGE_KEY,
  type CompletedGameResult,
} from "./streak";

describe("game streak", () => {
  it("guarda una victoria al persistir una partida terminada", () => {
    const storage = createMemoryStorage();
    const game = winGame("2026-07-25", 5);

    saveGame(storage, game);

    expect(loadStreakHistory(storage)).toEqual([
      {
        attempts: 5,
        gameDate: "2026-07-25",
        outcome: "won",
      },
    ]);
  });

  it("reemplaza el resultado de la misma fecha sin duplicarlo", () => {
    const storage = createMemoryStorage();

    recordCompletedGame(storage, loseGame("2026-07-25"));
    recordCompletedGame(storage, winGame("2026-07-25", 4));

    expect(loadStreakHistory(storage)).toEqual([
      {
        attempts: 4,
        gameDate: "2026-07-25",
        outcome: "won",
      },
    ]);
  });

  it("repara el historial al restaurar una partida terminada", () => {
    const storage = createMemoryStorage();
    const game = winGame("2026-07-25", 6);
    storage.setItem(GAME_STORAGE_KEY, serializeGame(game));

    expect(
      loadGame(
        storage,
        game.gameDate,
        SOLUTIONS,
        ACCEPTED_WORDS,
        game.gameId,
      ),
    ).toEqual(game);
    expect(loadStreakHistory(storage)).toEqual([
      {
        attempts: 6,
        gameDate: "2026-07-25",
        outcome: "won",
      },
    ]);
  });

  it("deriva los últimos siete días con victorias, derrotas y huecos", () => {
    const results: CompletedGameResult[] = [
      { attempts: 6, gameDate: "2026-07-18", outcome: "won" },
      { attempts: 5, gameDate: "2026-07-19", outcome: "won" },
      { attempts: 9, gameDate: "2026-07-20", outcome: "lost" },
      { attempts: 7, gameDate: "2026-07-22", outcome: "won" },
      { attempts: 6, gameDate: "2026-07-23", outcome: "won" },
      { attempts: 5, gameDate: "2026-07-24", outcome: "won" },
      { attempts: 4, gameDate: "2026-07-25", outcome: "won" },
    ];

    const summary = getStreakSummary(results, "2026-07-25");

    expect(summary.currentStreak).toBe(4);
    expect(summary.days.map((day) => day.gameDate)).toEqual([
      "2026-07-19",
      "2026-07-20",
      "2026-07-21",
      "2026-07-22",
      "2026-07-23",
      "2026-07-24",
      "2026-07-25",
    ]);
    expect(summary.days.map((day) => day.outcome)).toEqual([
      "won",
      "lost",
      "unplayed",
      "won",
      "won",
      "won",
      "won",
    ]);
  });

  it("cuenta una racha más larga que la ventana visible", () => {
    const results = Array.from({ length: 8 }, (_, index) => ({
      attempts: 4,
      gameDate: `2026-07-${String(index + 18).padStart(2, "0")}`,
      outcome: "won" as const,
    }));

    expect(getStreakSummary(results, "2026-07-25").currentStreak).toBe(8);
  });

  it("una derrota o un día sin jugar interrumpen la racha", () => {
    expect(
      getStreakSummary(
        [{ attempts: 9, gameDate: "2026-07-25", outcome: "lost" }],
        "2026-07-25",
      ).currentStreak,
    ).toBe(0);
    expect(
      getStreakSummary(
        [{ attempts: 4, gameDate: "2026-07-24", outcome: "won" }],
        "2026-07-25",
      ).currentStreak,
    ).toBe(0);
  });

  it("descarta un historial corrupto", () => {
    const storage = createMemoryStorage();
    storage.setItem(STREAK_STORAGE_KEY, '{"version":1,"results":"invalid"}');

    expect(loadStreakHistory(storage)).toEqual([]);
    expect(storage.getItem(STREAK_STORAGE_KEY)).toBeNull();
  });
});

function winGame(gameDate: string, attempts: number) {
  let state = createGame(gameDate, SOLUTIONS);
  const guesses = [
    ...Array.from({ length: attempts - SOLUTIONS.length }, () => "PERRO"),
    ...SOLUTIONS,
  ];

  for (const guess of guesses) {
    const result = submitGuess(state, guess, ACCEPTED_WORDS);
    if (!result.accepted) {
      throw new Error(`No se pudo jugar ${guess}.`);
    }
    state = result.state;
  }

  return state;
}

function loseGame(gameDate: string) {
  let state = createGame(gameDate, SOLUTIONS);
  for (const guess of LOSING_GUESSES) {
    const result = submitGuess(state, guess, ACCEPTED_WORDS);
    if (!result.accepted) {
      throw new Error(`No se pudo jugar ${guess}.`);
    }
    state = result.state;
  }

  return state;
}
