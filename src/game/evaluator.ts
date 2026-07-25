import type { LetterStatus, WordEvaluation } from "./definitions";
import { WORD_LENGTH } from "./definitions";

export function evaluateGuess(
  solution: string,
  guess: string,
): WordEvaluation {
  const solutionLetters = Array.from(solution);
  const guessLetters = Array.from(guess);

  if (
    solutionLetters.length !== WORD_LENGTH ||
    guessLetters.length !== WORD_LENGTH
  ) {
    throw new RangeError(
      `La solución y el intento deben contener ${WORD_LENGTH} letras.`,
    );
  }

  const evaluation: Array<LetterStatus | undefined> = Array.from({
    length: WORD_LENGTH,
  });
  const remaining = new Map<string, number>();

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    const solutionLetter = solutionLetters[index];
    const guessLetter = guessLetters[index];

    if (solutionLetter === undefined || guessLetter === undefined) {
      throw new RangeError("No se pudo evaluar la palabra.");
    }

    if (solutionLetter === guessLetter) {
      evaluation[index] = "correct";
    } else {
      remaining.set(
        solutionLetter,
        (remaining.get(solutionLetter) ?? 0) + 1,
      );
    }
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (evaluation[index] === "correct") {
      continue;
    }

    const guessLetter = guessLetters[index];
    if (guessLetter === undefined) {
      throw new RangeError("No se pudo evaluar la palabra.");
    }

    const available = remaining.get(guessLetter) ?? 0;
    if (available > 0) {
      evaluation[index] = "present";
      remaining.set(guessLetter, available - 1);
    } else {
      evaluation[index] = "absent";
    }
  }

  return Object.freeze(evaluation as LetterStatus[]);
}

export function isCorrectEvaluation(evaluation: WordEvaluation): boolean {
  return evaluation.every((status) => status === "correct");
}
