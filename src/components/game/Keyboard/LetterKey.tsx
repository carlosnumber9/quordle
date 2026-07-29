import { Button } from "@/components/ui/button";
import { isLetterAbsentFromAllBoards } from "@/game/keyboard";
import { cn } from "@/lib/utils";

import { DOT_CLASSES, type LetterKeyProps } from "./definitions";

export function LetterKey({
  disabled,
  keyboardState,
  letter,
  onLetter,
}: LetterKeyProps) {
  const isAbsentFromAllBoards = isLetterAbsentFromAllBoards(
    keyboardState,
    letter,
  );

  return (
    <Button
      aria-label={`Letra ${letter}`}
      className={cn(
        "h-[clamp(2.75rem,6svh,3rem)] min-w-0 flex-1 flex-col gap-0 rounded-lg px-0 text-sm sm:text-base",
        isAbsentFromAllBoards &&
          "border-muted bg-muted/70 text-muted-foreground hover:bg-muted/80 hover:text-muted-foreground dark:bg-muted/40 dark:hover:bg-muted/50",
      )}
      disabled={disabled}
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
                status === undefined ? "bg-border" : DOT_CLASSES[status],
              )}
              key={boardIndex}
            />
          );
        })}
      </span>
    </Button>
  );
}
