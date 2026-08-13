import { useRef, type MouseEvent, type PointerEvent } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { BoardGrid } from "./BoardGrid";
import type { BoardProps } from "./definitions";
import styles from "./styles.module.css";

export function Board(props: BoardProps) {
  const {
    boardIndex,
    isZoomObscured,
    isZoomed,
    onZoomRequest,
    showSolutionWatermark,
    state,
  } = props;
  const lastTouchRef = useRef(0);
  const board = state.boards[boardIndex];

  if (board === undefined) {
    return null;
  }

  const solved = board.solvedAtAttempt !== null;
  const visibleSolution = state.status === "lost" ? board.solution : null;

  const detectDoubleTap = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") {
      return;
    }
    const elapsed = event.timeStamp - lastTouchRef.current;
    if (lastTouchRef.current !== 0 && elapsed > 0 && elapsed <= 350) {
      lastTouchRef.current = 0;
      onZoomRequest();
      return;
    }
    lastTouchRef.current = event.timeStamp;
  };

  const handleKeyboardActivation = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) {
      onZoomRequest();
    }
  };

  return (
    <Card
      aria-hidden={isZoomObscured || undefined}
      className={cn(
        styles.board,
        "relative w-fit gap-0 overflow-visible rounded-none bg-transparent py-0 shadow-none ring-0 [--card-spacing:0px]",
      )}
      data-board-index={boardIndex}
      data-game-board
      data-zoomed={isZoomed || undefined}
      size="sm"
    >
      <button
        aria-label={
          isZoomed
            ? `Tablero ${boardIndex + 1}. Doble clic o doble toque para volver a los cuatro tableros`
            : `Tablero ${boardIndex + 1}. Doble clic o doble toque para ampliar`
        }
        aria-pressed={isZoomed}
        className={styles.boardSelector}
        disabled={isZoomObscured}
        onClick={handleKeyboardActivation}
        onDoubleClick={onZoomRequest}
        onPointerUp={detectDoubleTap}
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
    </Card>
  );
}
