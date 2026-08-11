import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BOARD_COUNT, MAX_ATTEMPTS, WORD_LENGTH } from "@/game/definitions";
import { cn } from "@/lib/utils";

import boardStyles from "../Board/styles.module.css";

export function GameSkeleton() {
  return (
    <div
      aria-label="Cargando partida"
      className="grid flex-1 grid-cols-2 place-content-center place-items-center gap-1"
    >
      {Array.from({ length: BOARD_COUNT }, (_, boardIndex) => (
        <Card
          className="gap-0 rounded-lg py-1 [--card-spacing:--spacing(1)]"
          key={boardIndex}
          size="sm"
        >
          <CardContent className={boardStyles.grid}>
            {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => (
              <div className={boardStyles.row} key={rowIndex}>
                {Array.from({ length: WORD_LENGTH }, (_, tileIndex) => (
                  <Skeleton
                    className={cn(boardStyles.tile, "rounded-sm")}
                    key={tileIndex}
                  />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
