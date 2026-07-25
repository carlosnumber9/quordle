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
import { cn } from "@/lib/utils";

import { LocalReplayButton } from "../LocalReplayButton";
import { ResultTimeline } from "../ResultTimeline";
import { useResultAnimation } from "./animations";
import { LOSS_MESSAGES, type ResultDialogProps } from "./definitions";
import { ResultSolutions } from "./ResultSolutions";
import styles from "./styles.module.css";
import { summarizeResult } from "./utils";

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
  const summary = useMemo(() => summarizeResult(game), [game]);
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
        {summary.showTimeline ? (
          <ResultTimeline game={game} won={won} {...summary} />
        ) : (
          <ResultSolutions words={summary.unresolvedWords} />
        )}
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
