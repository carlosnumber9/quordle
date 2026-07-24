import { RiDeleteBack2Line, RiCornerDownLeftLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { KeyboardState } from "@/game/keyboard";
import type { LetterStatus } from "@/game/types";

interface KeyboardProps {
  readonly disabled: boolean;
  readonly keyboardState: KeyboardState;
  readonly onBackspace: () => void;
  readonly onEnter: () => void;
  readonly onLetter: (letter: string) => void;
}

const LETTER_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
] as const;

const DOT_CLASSES: Readonly<Record<LetterStatus, string>> = {
  correct: "bg-primary",
  present: "bg-secondary-foreground",
  absent: "bg-muted-foreground/40",
};

export function Keyboard({
  disabled,
  keyboardState,
  onBackspace,
  onEnter,
  onLetter,
}: KeyboardProps) {
  return (
    <div aria-label="Teclado del juego" className="grid gap-1" role="group">
      {LETTER_ROWS.map((row, rowIndex) => (
        <div className="flex justify-center gap-1" key={rowIndex}>
          {rowIndex === 2 ? (
            <Button
              aria-label="Enviar palabra"
              className="h-[clamp(2rem,5.5svh,2.25rem)] flex-2 rounded-lg px-1"
              disabled={disabled}
              onClick={onEnter}
              type="button"
              variant="secondary"
            >
              <RiCornerDownLeftLine />
              <span className="hidden sm:inline">Enviar</span>
            </Button>
          ) : null}
          {row.map((letter) => (
            <Button
              aria-label={`Letra ${letter}`}
              className="h-[clamp(2rem,5.5svh,2.25rem)] min-w-0 flex-1 flex-col gap-0 rounded-lg px-0 text-xs sm:text-sm"
              disabled={disabled}
              key={letter}
              onClick={() => onLetter(letter)}
              type="button"
              variant="outline"
            >
              <span>{letter}</span>
              <span aria-hidden="true" className="grid grid-cols-4 gap-0.5">
                {keyboardState.map((board, boardIndex) => {
                  const status = board[letter];
                  return (
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        status === undefined
                          ? "bg-border"
                          : DOT_CLASSES[status],
                      )}
                      key={boardIndex}
                    />
                  );
                })}
              </span>
            </Button>
          ))}
          {rowIndex === 2 ? (
            <Button
              aria-label="Borrar letra"
              className="h-[clamp(2rem,5.5svh,2.25rem)] flex-1 rounded-lg px-1"
              disabled={disabled}
              onClick={onBackspace}
              type="button"
              variant="secondary"
            >
              <RiDeleteBack2Line />
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
