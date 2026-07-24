import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  MAX_ATTEMPTS,
  WORD_LENGTH,
  type GameState,
  type LetterStatus,
} from "@/game/types";

import styles from "./Game.module.css";

interface BoardProps {
  readonly boardIndex: number;
  readonly currentGuess: string;
  readonly state: GameState;
}

const TILE_STATUS_CLASSES: Readonly<Record<LetterStatus, string>> = {
  correct: "border-primary bg-primary text-primary-foreground",
  present: "border-ring bg-secondary text-secondary-foreground ring-1 ring-ring/30",
  absent: "border-muted bg-muted text-muted-foreground",
};

export function Board({ boardIndex, currentGuess, state }: BoardProps) {
  const board = state.boards[boardIndex];
  const solvedAtAttempt = board?.solvedAtAttempt ?? null;
  const [visibleRowCount, setVisibleRowCount] = useState(
    () => solvedAtAttempt ?? MAX_ATTEMPTS,
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const previousSolvedAtAttempt = useRef(solvedAtAttempt);

  useLayoutEffect(() => {
    const previousSolved = previousSolvedAtAttempt.current;
    previousSolvedAtAttempt.current = solvedAtAttempt;

    if (solvedAtAttempt === null) {
      setVisibleRowCount(MAX_ATTEMPTS);
      return;
    }

    if (previousSolved !== null) {
      setVisibleRowCount(solvedAtAttempt);
      return;
    }

    const card = cardRef.current;
    if (
      card === null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisibleRowCount(solvedAtAttempt);
      return;
    }

    const grid = card.querySelector<HTMLElement>("[data-board-grid]");
    const solvedRow = grid?.querySelector<HTMLElement>(
      `[data-row-index="${solvedAtAttempt - 1}"]`,
    );

    if (grid === null || solvedRow === undefined || solvedRow === null) {
      setVisibleRowCount(solvedAtAttempt);
      return;
    }

    const cardBounds = card.getBoundingClientRect();
    const gridBounds = grid.getBoundingClientRect();
    const solvedRowBounds = solvedRow.getBoundingClientRect();
    const compactHeight =
      cardBounds.height - (gridBounds.bottom - solvedRowBounds.bottom);
    let clearHeightFrame: number | null = null;

    const context = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          height: cardBounds.height,
          willChange: "height",
        },
        {
          duration: 1,
          ease: "power2.inOut",
          height: compactHeight,
          onComplete: () => {
            setVisibleRowCount(solvedAtAttempt);
            clearHeightFrame = window.requestAnimationFrame(() => {
              gsap.set(card, { clearProps: "height,willChange" });
            });
          },
        },
      );
    }, card);

    return () => {
      if (clearHeightFrame !== null) {
        window.cancelAnimationFrame(clearHeightFrame);
      }
      context.revert();
    };
  }, [solvedAtAttempt]);

  if (board === undefined) {
    return null;
  }

  const solved = board.solvedAtAttempt !== null;
  const visibleSolution = state.status === "lost" ? board.solution : null;

  return (
    <Card
      size="sm"
      aria-label={`Tablero ${boardIndex + 1}`}
      className={cn(
        "relative w-fit gap-0 rounded-xl py-1 [--card-spacing:--spacing(1)]",
        solved && "ring-primary/50",
      )}
      ref={cardRef}
    >
      <span className="sr-only">
        {visibleSolution === null
          ? solved
            ? `Resuelto en ${board.solvedAtAttempt} intentos`
            : "Cinco letras"
          : `La palabra era ${visibleSolution}`}
      </span>
      <CardContent>
        <div className="grid gap-0.5" data-board-grid role="grid">
          {Array.from({ length: visibleRowCount }, (_, rowIndex) => {
            const attempt = state.attempts[rowIndex];
            const isCurrentRow =
              rowIndex === state.attempts.length && state.status === "playing";
            const evaluation = attempt?.boards[boardIndex] ?? null;
            const letters =
              evaluation === null && attempt !== undefined
                ? []
                : Array.from(
                    attempt?.guess ?? (isCurrentRow ? currentGuess : ""),
                  );

            return (
              <div
                className="grid grid-cols-5 gap-0.5"
                data-attempt={
                  attempt === undefined || evaluation === null
                    ? undefined
                    : rowIndex
                }
                data-row-index={rowIndex}
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
                        "flex items-center justify-center rounded-md border text-[clamp(0.625rem,calc(var(--tile-size)*0.45),1.125rem)] font-semibold uppercase",
                        status === undefined
                          ? letter.length > 0
                            ? "border-foreground/30 bg-background text-foreground"
                            : "border-border bg-background"
                          : TILE_STATUS_CLASSES[status],
                      )}
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
      </CardContent>
      {visibleSolution !== null ? (
        <p className="px-1 text-center text-xs font-semibold uppercase">
          {visibleSolution}
        </p>
      ) : null}
    </Card>
  );
}

function tileLabel(letter: string, status: LetterStatus | undefined): string {
  if (letter.length === 0) {
    return "Casilla vacía";
  }

  if (status === undefined) {
    return letter;
  }

  const statusLabel: Readonly<Record<LetterStatus, string>> = {
    correct: "posición correcta",
    present: "presente en otra posición",
    absent: "no está en la palabra",
  };

  return `${letter}: ${statusLabel[status]}`;
}
