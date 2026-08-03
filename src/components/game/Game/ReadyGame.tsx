import { useEffect, useState } from "react";

import { Board } from "../Board";
import { CompletedGamePanel } from "../CompletedGamePanel";
import { Keyboard } from "../Keyboard";
import { shouldShowSolutionWatermark } from "../Board/utils";
import { ResultDialog } from "../ResultDialog";
import { CurrentGuess } from "./CurrentGuess";
import type { ReadyGameProps } from "./definitions";
import styles from "./styles.module.css";

export function ReadyGame({ controller, view }: ReadyGameProps) {
  const [selectedBoardIndex, setSelectedBoardIndex] = useState<number | null>(
    null,
  );
  const input = {
    onBackspace: controller.removeLetter,
    onEnter: controller.submitCurrentGuess,
    onLetter: controller.addLetter,
  };

  useEffect(() => {
    setSelectedBoardIndex(null);
  }, [view.game.gameId]);

  const toggleBoard = (boardIndex: number) => {
    setSelectedBoardIndex((current) =>
      current === boardIndex ? null : boardIndex,
    );
  };

  return (
    <>
      <section
        aria-label="Palabras del juego"
        className={styles.boards}
        data-intro-reveal
      >
        {view.game.boards.map((_, boardIndex) => (
          <Board
            boardIndex={boardIndex}
            key={boardIndex}
            onSelect={() => toggleBoard(boardIndex)}
            selected={selectedBoardIndex === boardIndex}
            showSolutionWatermark={shouldShowSolutionWatermark(
              import.meta.env.DEV,
              view.mode,
            )}
            state={view.game}
          />
        ))}
      </section>
      {view.game.status === "playing" ? (
        <div className={styles.inputArea} data-intro-reveal>
          <CurrentGuess
            attemptNumber={view.game.attempts.length + 1}
            guess={controller.currentGuess}
          />
          <section className={styles.keyboard}>
            <Keyboard
              disabled={false}
              keyboardState={controller.keyboardState}
              selectedBoardIndex={selectedBoardIndex}
              {...input}
            />
          </section>
        </div>
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
