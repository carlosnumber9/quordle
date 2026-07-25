import { cn } from "@/lib/utils";

import { HelpDialog } from "../HelpDialog";
import type { GameController } from "./definitions";
import styles from "./styles.module.css";

export function GameHeader({
  introFinished,
  titleRef,
  view,
}: Pick<GameController, "introFinished" | "titleRef" | "view">) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4">
      <h1
        className={cn(
          "font-heading text-2xl font-semibold tracking-tight sm:text-3xl",
          view.status === "loading" && styles.titleWaiting,
          view.status === "ready" && !introFinished && styles.introTitle,
        )}
        ref={titleRef}
      >
        Quordle para Mamá
      </h1>
      <div data-intro-reveal>
        <HelpDialog />
      </div>
    </header>
  );
}
