import { Card, CardContent } from "@/components/ui/card";
import { deriveBoardClues } from "@/game/clues";
import { WORD_LENGTH } from "@/game/definitions";
import { cn } from "@/lib/utils";

import type { BoardProps } from "./definitions";
import styles from "./styles.module.css";

export function Board(props: BoardProps) {
  const { boardIndex, onSelect, selected, showSolutionWatermark, state } =
    props;
  const board = state.boards[boardIndex];

  if (board === undefined) {
    return null;
  }

  const clues = deriveBoardClues(state, boardIndex);
  const solved = board.solvedAtAttempt !== null;
  const revealed = state.status === "lost";
  const solutionLetters = Array.from(board.solution);
  const misplacedLabel = clues.misplaced.map(({ letter }) => letter).join(", ");

  return (
    <Card
      className={cn(
        styles.wordCard,
        "relative mx-auto w-full max-w-md cursor-pointer gap-0 rounded-xl py-1.5 [--card-spacing:--spacing(2)]",
        solved && "ring-2 ring-primary/60",
        selected && styles.selectedWordCard,
      )}
      size="sm"
    >
      <button
        aria-label={`Palabra ${boardIndex + 1}. ${selected ? "Quitar filtro del teclado" : "Mostrar sus pistas en el teclado"}`}
        aria-pressed={selected}
        className={styles.wordSelector}
        onClick={onSelect}
        type="button"
      />
      <span className="sr-only">
        {revealed
          ? `La palabra era ${board.solution}`
          : solved
            ? `Resuelta en ${board.solvedAtAttempt} intentos`
            : "Cinco letras por descubrir"}
      </span>
      {showSolutionWatermark ? (
        <span aria-hidden="true" className={styles.solutionWatermark}>
          {board.solution}
        </span>
      ) : null}
      <CardContent className={styles.wordContent}>
        <span
          aria-hidden="true"
          className={cn(
            styles.wordNumber,
            selected && styles.selectedWordNumber,
          )}
        >
          {boardIndex + 1}
        </span>
        <div className="min-w-0">
          <div
            aria-label={`Posiciones de la palabra ${boardIndex + 1}`}
            className={styles.positionGrid}
            role="grid"
          >
            {Array.from({ length: WORD_LENGTH }, (_, letterIndex) => {
              const clue = clues.positions[letterIndex] ?? null;
              const letter = revealed
                ? (solutionLetters[letterIndex] ?? "")
                : (clue?.letter ?? "");
              return (
                <div
                  aria-label={
                    letter.length === 0
                      ? `Posición ${letterIndex + 1}, por descubrir`
                      : revealed && clue === null
                        ? `Posición ${letterIndex + 1}: ${letter}, solución revelada`
                        : `Posición ${letterIndex + 1}: ${letter}, correcta`
                  }
                  className={cn(
                    styles.tile,
                    letter.length === 0 && styles.emptyTile,
                    clue !== null && styles.correctTile,
                    revealed && clue === null && styles.revealedTile,
                  )}
                  data-clue-attempt={clue?.discoveredAtAttempt}
                  data-letter-status={clue === null ? undefined : "correct"}
                  key={letterIndex}
                  role="gridcell"
                >
                  {letter}
                </div>
              );
            })}
          </div>
          <div className={styles.misplacedTray}>
            {clues.misplaced.length > 0 && !revealed ? (
              <>
                <span className={styles.misplacedLabel}>Sin colocar</span>
                <span className="sr-only">
                  Letras confirmadas sin posición: {misplacedLabel}
                </span>
                <span aria-hidden="true" className={styles.misplacedLetters}>
                  {clues.misplaced.map((clue, index) => (
                    <span
                      className={styles.misplacedLetter}
                      data-clue-attempt={clue.discoveredAtAttempt}
                      data-letter-status="present"
                      key={`${clue.letter}-${index}`}
                    >
                      {clue.letter}
                    </span>
                  ))}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
