import { RiCornerDownLeftLine, RiDeleteBack2Line } from "@remixicon/react";
import { useRef } from "react";

import { ActionKey } from "./ActionKey";
import { useKeyboardModeAnimation } from "./animations";
import { LETTER_ROWS, type KeyboardProps } from "./definitions";
import { LetterKey } from "./LetterKey";

export function Keyboard(props: KeyboardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useKeyboardModeAnimation(props.selectedBoardIndex, rootRef);

  return (
    <div
      aria-label={
        props.selectedBoardIndex === null
          ? "Teclado del juego"
          : `Teclado del juego, mostrando el tablero ${props.selectedBoardIndex + 1}`
      }
      className="grid gap-1"
      ref={rootRef}
      role="group"
    >
      <span aria-live="polite" className="sr-only">
        {props.selectedBoardIndex === null
          ? "Teclado general"
          : `Mostrando pistas del tablero ${props.selectedBoardIndex + 1}`}
      </span>
      {LETTER_ROWS.map((row, rowIndex) => (
        <div className="flex justify-center gap-1" key={rowIndex}>
          {rowIndex === 2 ? (
            <ActionKey
              ariaLabel="Enviar palabra"
              className="flex-2"
              disabled={props.disabled}
              onClick={props.onEnter}
            >
              <RiCornerDownLeftLine />
              <span className="hidden sm:inline">Enviar</span>
            </ActionKey>
          ) : null}
          {row.map((letter) => (
            <LetterKey key={letter} letter={letter} {...props} />
          ))}
          {rowIndex === 2 ? (
            <ActionKey
              ariaLabel="Borrar letra"
              className="flex-1"
              disabled={props.disabled}
              onClick={props.onBackspace}
            >
              <RiDeleteBack2Line />
            </ActionKey>
          ) : null}
        </div>
      ))}
    </div>
  );
}
