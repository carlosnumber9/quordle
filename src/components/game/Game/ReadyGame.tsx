import { RiCloseLine } from "@remixicon/react";
import { useRef, type ChangeEvent } from "react";

import { WORD_LENGTH } from "@/game/definitions";

import { Board } from "../Board";
import { CompletedGamePanel } from "../CompletedGamePanel";
import { shouldShowSolutionWatermark } from "../Board/utils";
import { ResultDialog } from "../ResultDialog";
import type { ReadyGameProps } from "./definitions";
import styles from "./styles.module.css";
import { useBoardZoom } from "./use-board-zoom";
import { useNativeKeyboard } from "./use-native-keyboard";

export function ReadyGame({ controller, view }: ReadyGameProps) {
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const boardsRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { focusedBoardIndex, layoutBoardIndex, restoreBoards, zoomBoard } =
    useBoardZoom(boardsRef, closeButtonRef);
  const { focusNativeInput, handleNativeInputBlur, handleNativeInputFocus } =
    useNativeKeyboard(
      nativeInputRef,
      boardsRef,
      controller.rootRef,
      view.game.status === "playing",
    );

  const updateNativeInput = (event: ChangeEvent<HTMLInputElement>) => {
    controller.replaceCurrentGuess(event.currentTarget.value);
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
            onInputRequest={focusNativeInput}
            onZoomRequest={() => zoomBoard(boardIndex)}
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
        <input
          aria-label="Palabra actual"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          className={styles.nativeInput}
          enterKeyHint="done"
          inputMode="text"
          maxLength={WORD_LENGTH}
          onBlur={handleNativeInputBlur}
          onChange={updateNativeInput}
          onFocus={handleNativeInputFocus}
          ref={nativeInputRef}
          spellCheck={false}
          type="text"
          value={controller.currentGuess}
        />
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
