import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BOARD_COUNT, WORD_LENGTH } from "@/game/definitions";
import { cn } from "@/lib/utils";

import boardStyles from "../Board/styles.module.css";

export function GameSkeleton() {
  return (
    <div
      aria-label="Cargando partida"
      className="grid flex-1 content-center gap-1.5"
    >
      {Array.from({ length: BOARD_COUNT }, (_, boardIndex) => (
        <Card
          className="mx-auto w-full max-w-md gap-0 rounded-xl py-1.5 [--card-spacing:--spacing(2)]"
          key={boardIndex}
          size="sm"
        >
          <CardContent className={boardStyles.wordContent}>
            <Skeleton className="size-6 rounded-full" />
            <div className={boardStyles.positionGrid}>
              {Array.from({ length: WORD_LENGTH }, (_, tileIndex) => (
                <Skeleton
                  className={cn(boardStyles.tile, "rounded-xl")}
                  key={tileIndex}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
