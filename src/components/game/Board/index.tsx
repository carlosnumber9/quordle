import { useRef, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { MAX_ATTEMPTS } from "@/game/definitions";
import { cn } from "@/lib/utils";

import { useBoardCollapseAnimation } from "./animations";
import { BoardGrid } from "./BoardGrid";
import type { BoardProps } from "./definitions";
import styles from "./styles.module.css";

export function Board(props: BoardProps) {
  const { boardIndex, showSolutionWatermark, state } = props;
  const board = state.boards[boardIndex];
  const solvedAtAttempt = board?.solvedAtAttempt ?? null;
  const [visibleRowCount, setVisibleRowCount] = useState(
    () => solvedAtAttempt ?? MAX_ATTEMPTS,
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const previousSolvedAtAttempt = useRef(solvedAtAttempt);
  useBoardCollapseAnimation(
    solvedAtAttempt,
    cardRef,
    previousSolvedAtAttempt,
    setVisibleRowCount,
  );

  if (board === undefined) {
    return null;
  }
  const solved = board.solvedAtAttempt !== null;
  const visibleSolution = state.status === "lost" ? board.solution : null;

  return (
    <Card
      aria-label={`Tablero ${boardIndex + 1}`}
      className={cn(
        "relative w-fit gap-0 rounded-xl py-1 [--card-spacing:--spacing(1)]",
        solved && "ring-primary/50",
      )}
      ref={cardRef}
      size="sm"
    >
      <span className="sr-only">
        {visibleSolution === null
          ? solved
            ? `Resuelto en ${board.solvedAtAttempt} intentos`
            : "Cinco letras"
          : `La palabra era ${visibleSolution}`}
      </span>
      {showSolutionWatermark ? (
        <span aria-hidden="true" className={styles.solutionWatermark}>
          {board.solution}
        </span>
      ) : null}
      <CardContent>
        <BoardGrid {...props} visibleRowCount={visibleRowCount} />
      </CardContent>
      {visibleSolution !== null ? (
        <p className="px-1 text-center text-xs font-semibold uppercase">
          {visibleSolution}
        </p>
      ) : null}
    </Card>
  );
}
