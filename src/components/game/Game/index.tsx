import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import type { GameProps } from "./definitions";
import { GameError } from "./GameError";
import { GameHeader } from "./GameHeader";
import { GameSkeleton } from "./GameSkeleton";
import { ManualShareDialog } from "./ManualShareDialog";
import { ReadyGame } from "./ReadyGame";
import styles from "./styles.module.css";
import { useGame } from "./use-game";

export function Game({ siteUrl }: GameProps) {
  const controller = useGame(siteUrl);
  const { introFinished, rootRef, view } = controller;

  return (
    <main
      className={cn(
        styles.game,
        "mx-auto flex min-h-svh w-full max-w-4xl flex-col gap-[var(--game-gap)] px-2 py-2 sm:px-4 sm:py-3",
        view.status === "ready" && !introFinished && styles.introRunning,
        view.status === "ready" &&
          (view.game.status === "playing" ? styles.playing : styles.finished),
      )}
      ref={rootRef}
    >
      <Toaster position="top-center" />
      <GameHeader {...controller} />
      {view.status === "loading" ? <GameSkeleton /> : null}
      {view.status === "error" ? (
        <GameError load={controller.load} view={view} />
      ) : null}
      {view.status === "ready" ? (
        <ReadyGame controller={controller} view={view} />
      ) : null}
      <ManualShareDialog {...controller} />
    </main>
  );
}
