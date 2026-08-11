import { RiFileCopyLine, RiTrophyLine } from "@remixicon/react";
import { useMemo, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getStreakSummary, loadStreakHistory } from "@/game/streak";
import { cn } from "@/lib/utils";

import { LocalReplayButton } from "../LocalReplayButton";
import { ResultDefinitions } from "../ResultDefinitions";
import { useWordDefinitions } from "../ResultDefinitions/use-word-definitions";
import { StreakTimeline } from "../StreakTimeline";
import { useResultAnimation } from "./animations";
import { LOSS_MESSAGES, type ResultDialogProps } from "./definitions";
import styles from "./styles.module.css";

export function ResultDialog(props: ResultDialogProps) {
  const { game, mode, onOpenChange, onReplay, onShare, open, replaying } = props;
  const won = game.status === "won";
  const contentRef = useRef<HTMLDivElement>(null);
  const lossMessage = useMemo(
    () =>
      LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)] ??
      LOSS_MESSAGES[0],
    [game.gameId],
  );
  const words = useMemo(
    () => game.boards.map((board) => board.solution),
    [game.boards],
  );
  const definitionStates = useWordDefinitions(
    game.gameId,
    game.gameDate,
    words,
  );
  const streakSummary = useMemo(
    () =>
      getStreakSummary(
        typeof window === "undefined"
          ? []
          : loadStreakHistory(window.localStorage),
        game.gameDate,
      ),
    [game],
  );
  useResultAnimation(contentRef, open, won);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className={cn(styles.dialog, "gap-5 text-center sm:max-w-lg")}
        ref={contentRef}
      >
        <DialogHeader className="items-center text-center">
          <DialogTitle className={styles.title}>
            {won ? (
              <RiTrophyLine aria-hidden="true" className={styles.victoryIcon} />
            ) : null}
            <span>{won ? "Victoria" : lossMessage}</span>
          </DialogTitle>
          {!won ? (
            <DialogDescription>
              Mañana tendrás cuatro palabras nuevas.
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <ResultDefinitions
          boards={game.boards}
          definitionStates={definitionStates}
        />
        <StreakTimeline summary={streakSummary} />
        <Separator />
        <DialogFooter className="flex-col gap-2 sm:justify-center">
          <Button onClick={() => void onShare()} size="lg" type="button">
            <RiFileCopyLine data-icon="inline-start" />
            Copiar resultado
          </Button>
          <LocalReplayButton
            mode={mode}
            onReplay={onReplay}
            pending={replaying}
            status={game.status}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
