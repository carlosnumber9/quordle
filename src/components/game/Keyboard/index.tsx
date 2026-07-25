import { RiCornerDownLeftLine, RiDeleteBack2Line } from "@remixicon/react";

import { ActionKey } from "./ActionKey";
import { LETTER_ROWS, type KeyboardProps } from "./definitions";
import { LetterKey } from "./LetterKey";

export function Keyboard(props: KeyboardProps) {
  return (
    <div aria-label="Teclado del juego" className="grid gap-1" role="group">
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
