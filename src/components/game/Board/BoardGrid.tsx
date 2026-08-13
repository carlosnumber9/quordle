import { useRef } from "react";

import { MAX_ATTEMPTS, WORD_LENGTH } from "@/game/definitions";
import { cn } from "@/lib/utils";

import { useSolvedBoardAnimation } from "./animations";
import { TILE_STATUS_CLASSES, type BoardGridProps } from "./definitions";
import styles from "./styles.module.css";
import { tileLabel } from "./utils";

export function BoardGrid({ boardIndex, currentGuess, state }: BoardGridProps) {
  const board = state.boards[boardIndex];
  const gridRef = useRef<HTMLDivElement>(null);
  const solvedAtAttempt = board?.solvedAtAttempt ?? null;
  useSolvedBoardAnimation(solvedAtAttempt, gridRef);

  return (
    <div
      aria-label={`Intentos del tablero ${boardIndex + 1}`}
      className={styles.grid}
      data-board-grid
      ref={gridRef}
      role="grid"
    >
      {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
        const attempt = state.attempts[rowIndex];
        const evaluation = attempt?.boards[boardIndex] ?? null;
        const isCurrentRow =
          rowIndex === state.attempts.length &&
          state.status === "playing" &&
          board?.solvedAtAttempt === null;
        const letters =
          evaluation === null && attempt !== undefined
            ? []
            : Array.from(attempt?.guess ?? (isCurrentRow ? currentGuess : ""));

        return (
          <div
            aria-hidden={
              solvedAtAttempt !== null && rowIndex + 1 > solvedAtAttempt
                ? true
                : undefined
            }
            className={styles.row}
            data-board-row={rowIndex + 1}
            data-solved-row={
              solvedAtAttempt === rowIndex + 1 ? true : undefined
            }
            key={rowIndex}
            role="row"
          >
            {Array.from({ length: WORD_LENGTH }, (_, letterIndex) => {
              const letter = letters[letterIndex] ?? "";
              const status = evaluation?.[letterIndex];

              return (
                <div
                  aria-label={tileLabel(letter, status)}
                  className={cn(
                    styles.tile,
                    status === undefined
                      ? letter.length > 0
                        ? styles.currentTile
                        : styles.emptyTile
                      : TILE_STATUS_CLASSES[status],
                  )}
                  data-clue-attempt={
                    status === undefined ? undefined : rowIndex + 1
                  }
                  data-letter-status={status}
                  key={letterIndex}
                  role="gridcell"
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
