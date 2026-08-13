import { RiCloseLine } from "@remixicon/react";
import { useRef } from "react";

import { Board } from "../Board";
import { CompletedGamePanel } from "../CompletedGamePanel";
import { Keyboard } from "../Keyboard";
import { shouldShowSolutionWatermark } from "../Board/utils";
import { ResultDialog } from "../ResultDialog";
import type { ReadyGameProps } from "./definitions";
import styles from "./styles.module.css";
import { useBoardZoom } from "./use-board-zoom";

export function ReadyGame({ controller, view }: ReadyGameProps) {
  const boardsRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { focusedBoardIndex, layoutBoardIndex, restoreBoards, zoomBoard } =
    useBoardZoom(boardsRef, closeButtonRef);
  const toggleBoardZoom = (boardIndex: number) => {
    if (focusedBoardIndex === boardIndex) {
      restoreBoards();
      return;
    }
    zoomBoard(boardIndex);
  };

  return (
    <>
      <section
        aria-label="Tableros de juego"
        className={styles.boards}
        data-intro-reveal
        data-zoom-active={layoutBoardIndex !== null || undefined}
        ref={boardsRef}
      >
        {view.game.boards.map((_, boardIndex) => (
          <Board
            boardIndex={boardIndex}
            currentGuess={controller.currentGuess}
            isZoomObscured={
              focusedBoardIndex !== null && focusedBoardIndex !== boardIndex
            }
            isZoomed={layoutBoardIndex === boardIndex}
            key={boardIndex}
            onZoomRequest={() => toggleBoardZoom(boardIndex)}
            showSolutionWatermark={shouldShowSolutionWatermark(
              import.meta.env.DEV,
              view.mode,
            )}
            state={view.game}
          />
        ))}
        <button
          aria-hidden={focusedBoardIndex === null}
          aria-label="Cerrar tablero ampliado"
          className={styles.zoomClose}
          disabled={layoutBoardIndex === null}
          onClick={restoreBoards}
          ref={closeButtonRef}
          type="button"
        >
          <RiCloseLine aria-hidden="true" />
        </button>
      </section>
      {view.game.status === "playing" ? (
        <section className={styles.keyboard} data-intro-reveal>
          <Keyboard
            disabled={false}
            keyboardState={controller.keyboardState}
            onBackspace={controller.removeLetter}
            onEnter={controller.submitCurrentGuess}
            onLetter={controller.addLetter}
            selectedBoardIndex={focusedBoardIndex}
          />
        </section>
      ) : (
        <>
          <CompletedGamePanel
            onReset={controller.load}
            onShowResults={() => controller.setResultOpen(true)}
          />
          <ResultDialog
            game={view.game}
            mode={view.mode}
            onOpenChange={controller.setResultOpen}
            onReplay={controller.replay}
            onShare={controller.share}
            open={controller.resultOpen}
            replaying={controller.replaying}
          />
        </>
      )}
    </>
  );
}
