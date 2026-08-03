import { WORD_LENGTH, type GameState } from "./definitions";

export interface PositionedClue {
  readonly letter: string;
  readonly discoveredAtAttempt: number;
}

export interface MisplacedClue {
  readonly letter: string;
  readonly discoveredAtAttempt: number;
}

export interface BoardClues {
  readonly positions: ReadonlyArray<PositionedClue | null>;
  readonly misplaced: ReadonlyArray<MisplacedClue>;
}

export function deriveBoardClues(
  state: GameState,
  boardIndex: number,
): BoardClues {
  if (state.boards[boardIndex] === undefined) {
    throw new RangeError("No existe el tablero solicitado.");
  }

  const positions: Array<PositionedClue | null> = Array.from(
    { length: WORD_LENGTH },
    () => null,
  );
  const knownOccurrences = new Map<string, number[]>();

  state.attempts.forEach((attempt, attemptIndex) => {
    const evaluation = attempt.boards[boardIndex];
    if (evaluation === null || evaluation === undefined) {
      return;
    }

    const letters = Array.from(attempt.guess);
    const occurrencesInAttempt = new Map<string, number>();

    evaluation.forEach((status, letterIndex) => {
      const letter = letters[letterIndex];
      if (letter === undefined || status === "absent") {
        return;
      }

      occurrencesInAttempt.set(
        letter,
        (occurrencesInAttempt.get(letter) ?? 0) + 1,
      );

      if (status === "correct" && positions[letterIndex] === null) {
        positions[letterIndex] = Object.freeze({
          letter,
          discoveredAtAttempt: attemptIndex + 1,
        });
      }
    });

    occurrencesInAttempt.forEach((count, letter) => {
      const discoveries = knownOccurrences.get(letter) ?? [];
      while (discoveries.length < count) {
        discoveries.push(attemptIndex + 1);
      }
      knownOccurrences.set(letter, discoveries);
    });
  });

  const fixedCounts = new Map<string, number>();
  positions.forEach((clue) => {
    if (clue !== null) {
      fixedCounts.set(clue.letter, (fixedCounts.get(clue.letter) ?? 0) + 1);
    }
  });

  const misplaced = Array.from(knownOccurrences.entries())
    .sort(([left], [right]) => left.localeCompare(right, "es"))
    .flatMap(([letter, discoveries]) =>
      discoveries.slice(fixedCounts.get(letter) ?? 0).map(
        (discoveredAtAttempt): MisplacedClue =>
          Object.freeze({ letter, discoveredAtAttempt }),
      ),
    );

  return Object.freeze({
    positions: Object.freeze(positions),
    misplaced: Object.freeze(misplaced),
  });
}
