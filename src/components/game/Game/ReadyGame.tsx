import { useRef, type ChangeEvent } from "react";

import { WORD_LENGTH } from "@/game/definitions";

import { Board } from "../Board";
import { CompletedGamePanel } from "../CompletedGamePanel";
import { shouldShowSolutionWatermark } from "../Board/utils";
import { ResultDialog } from "../ResultDialog";
import type { ReadyGameProps } from "./definitions";
import styles from "./styles.module.css";

export function ReadyGame({ controller, view }: ReadyGameProps) {
  const nativeInputRef = useRef<HTMLInputElement>(null);

  const focusNativeInput = () => {
    const input = nativeInputRef.current;
    if (input === null) {
      return;
    }
    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
  };

  const updateNativeInput = (event: ChangeEvent<HTMLInputElement>) => {
    controller.replaceCurrentGuess(event.currentTarget.value);
  };

  return (
    <>
      <section
        aria-label="Tableros de juego"
        className={styles.boards}
        data-intro-reveal
      >
        {view.game.boards.map((_, boardIndex) => (
          <Board
            boardIndex={boardIndex}
            currentGuess={controller.currentGuess}
            key={boardIndex}
            onInputRequest={focusNativeInput}
            showSolutionWatermark={shouldShowSolutionWatermark(
              import.meta.env.DEV,
              view.mode,
            )}
            state={view.game}
          />
        ))}
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
          onChange={updateNativeInput}
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
