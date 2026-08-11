import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { BoardGrid } from "./BoardGrid";
import type { BoardProps } from "./definitions";
import styles from "./styles.module.css";

export function Board(props: BoardProps) {
  const { boardIndex, onInputRequest, showSolutionWatermark, state } = props;
  const board = state.boards[boardIndex];

  if (board === undefined) {
    return null;
  }

  const solved = board.solvedAtAttempt !== null;
  const visibleSolution = state.status === "lost" ? board.solution : null;

  return (
    <Card
      className={cn(
        styles.board,
        "relative w-fit gap-0 rounded-lg py-1 [--card-spacing:--spacing(1)]",
        solved && "ring-2 ring-primary/60",
      )}
      size="sm"
    >
      <button
        aria-label={`Tablero ${boardIndex + 1}. Tocar para escribir una palabra`}
        className={styles.boardSelector}
        onClick={onInputRequest}
        type="button"
      />
      <span className="sr-only">
        {visibleSolution !== null
          ? `La palabra era ${board.solution}`
          : solved
            ? `Resuelta en ${board.solvedAtAttempt} intentos`
            : "Nueve intentos para descubrir cinco letras"}
      </span>
      {showSolutionWatermark ? (
        <span aria-hidden="true" className={styles.solutionWatermark}>
          {board.solution}
        </span>
      ) : null}
      <CardContent>
        <BoardGrid
          boardIndex={boardIndex}
          currentGuess={props.currentGuess}
          state={state}
        />
      </CardContent>
      {visibleSolution !== null ? (
        <p className={styles.revealedSolution}>{visibleSolution}</p>
      ) : null}
    </Card>
  );
}
