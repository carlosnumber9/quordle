import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { KEY_STATUS_CLASSES, type LetterKeyProps } from "./definitions";
import { letterKeyLabel, visibleLetterStatus } from "./utils";

export function LetterKey({
  disabled,
  keyboardState,
  letter,
  onLetter,
  selectedBoardIndex,
}: LetterKeyProps) {
  const status = visibleLetterStatus(
    keyboardState,
    letter,
    selectedBoardIndex,
  );

  return (
    <Button
      aria-label={letterKeyLabel(letter, status, selectedBoardIndex)}
      className={cn(
        "h-[clamp(2.75rem,6svh,3rem)] min-w-0 flex-1 rounded-lg px-0 text-sm sm:text-base",
        status !== undefined && KEY_STATUS_CLASSES[status],
      )}
      data-key-status={status}
      data-letter-key
      disabled={disabled}
      onClick={() => onLetter(letter)}
      type="button"
      variant="outline"
    >
      {letter}
    </Button>
  );
}
