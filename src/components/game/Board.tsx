import { RiCheckboxCircleLine } from "@remixicon/react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MAX_ATTEMPTS,
  WORD_LENGTH,
  type GameState,
  type LetterStatus,
} from "@/game/types";

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
  if (board === undefined) {
    return null;
  }

  const solved = board.solvedAtAttempt !== null;
  const visibleSolution = state.status === "lost" ? board.solution : null;

  return (
    <Card size="sm" aria-label={`Tablero ${boardIndex + 1}`}>
      <CardHeader>
        <CardTitle>Tablero {boardIndex + 1}</CardTitle>
        <CardDescription>
          {visibleSolution === null
            ? solved
              ? `Resuelto en ${board.solvedAtAttempt} intentos`
              : "Cinco letras"
            : `La palabra era ${visibleSolution}`}
        </CardDescription>
        {solved ? (
          <CardAction>
            <Badge>
              <RiCheckboxCircleLine data-icon="inline-start" />
              Resuelto
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="grid gap-1.5" role="grid">
          {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
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
                className="grid grid-cols-5 gap-1.5"
                data-attempt={
                  attempt === undefined || evaluation === null
                    ? undefined
                    : rowIndex
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
                        "flex aspect-square items-center justify-center rounded-xl border text-base font-semibold uppercase sm:text-lg",
                        status === undefined
                          ? letter.length > 0
                            ? "border-foreground/30 bg-background text-foreground"
                            : "border-border bg-background"
                          : TILE_STATUS_CLASSES[status],
                      )}
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
