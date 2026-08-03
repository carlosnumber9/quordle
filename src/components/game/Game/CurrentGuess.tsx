import { MAX_ATTEMPTS, WORD_LENGTH } from "@/game/definitions";
import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

interface CurrentGuessProps {
  readonly attemptNumber: number;
  readonly guess: string;
}

export function CurrentGuess({ attemptNumber, guess }: CurrentGuessProps) {
  const letters = Array.from(guess);

  return (
    <section
      aria-label={`Intento actual, ${attemptNumber} de ${MAX_ATTEMPTS}`}
      className={styles.currentGuess}
    >
      <span className={styles.currentGuessLabel}>
        Intento {attemptNumber}/{MAX_ATTEMPTS}
      </span>
      <div
        aria-label="Palabra que estás escribiendo"
        className={styles.guessGrid}
        role="grid"
      >
        {Array.from({ length: WORD_LENGTH }, (_, index) => {
          const letter = letters[index] ?? "";
          return (
            <div
              aria-label={letter.length === 0 ? "Casilla vacía" : letter}
              className={cn(
                styles.guessTile,
                letter.length > 0 && styles.filledGuessTile,
              )}
              key={index}
              role="gridcell"
            >
              {letter}
            </div>
          );
        })}
      </div>
    </section>
  );
}
