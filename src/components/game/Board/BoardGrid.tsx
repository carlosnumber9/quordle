import { WORD_LENGTH } from "@/game/definitions";
import { cn } from "@/lib/utils";

import {
  TILE_STATUS_CLASSES,
  type BoardGridProps,
} from "./definitions";
import styles from "./styles.module.css";
import { tileLabel } from "./utils";

export function BoardGrid({
  boardIndex,
  currentGuess,
  state,
  visibleRowCount,
}: BoardGridProps) {
  return (
    <div className="grid gap-px" data-board-grid role="grid">
      {Array.from({ length: visibleRowCount }, (_, rowIndex) => {
        const attempt = state.attempts[rowIndex];
        const current =
          rowIndex === state.attempts.length && state.status === "playing";
        const evaluation = attempt?.boards[boardIndex] ?? null;
        const letters =
          evaluation === null && attempt !== undefined
            ? []
            : Array.from(attempt?.guess ?? (current ? currentGuess : ""));

        return (
          <div
            className="grid grid-cols-5 gap-px"
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
                        ? "border-foreground/30 bg-muted text-foreground"
                        : "border-muted bg-muted"
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
  );
}
