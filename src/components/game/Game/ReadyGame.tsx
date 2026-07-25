import { Board } from "../Board";
import { CompletedGamePanel } from "../CompletedGamePanel";
import { Keyboard } from "../Keyboard";
import { shouldShowSolutionWatermark } from "../Board/utils";
import { ResultDialog } from "../ResultDialog";
import type { ReadyGameProps } from "./definitions";
import styles from "./styles.module.css";

export function ReadyGame({ controller, view }: ReadyGameProps) {
  const input = {
    onBackspace: controller.removeLetter,
    onEnter: controller.submitCurrentGuess,
    onLetter: controller.addLetter,
  };

  return (
    <>
      <section aria-label="Tableros de juego" className={styles.boards} data-intro-reveal>
        {Array.from({ length: 2 }, (_, columnIndex) => (
          <div className={styles.boardColumn} key={columnIndex}>
            {[columnIndex, columnIndex + 2].map((boardIndex) => (
              <Board
                boardIndex={boardIndex}
                currentGuess={controller.currentGuess}
                key={boardIndex}
                showSolutionWatermark={shouldShowSolutionWatermark(
                  import.meta.env.DEV,
                  view.mode,
                )}
                state={view.game}
              />
            ))}
          </div>
        ))}
      </section>
      {view.game.status === "playing" ? (
        <section className={styles.keyboard} data-intro-reveal>
          <Keyboard
            disabled={false}
            keyboardState={controller.keyboardState}
            {...input}
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
