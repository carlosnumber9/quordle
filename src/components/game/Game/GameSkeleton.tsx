import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BOARD_COUNT, WORD_LENGTH } from "@/game/definitions";
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
          className="gap-0 rounded-xl py-1 [--card-spacing:--spacing(1)]"
          key={boardIndex}
          size="sm"
        >
          <CardContent className="grid gap-px">
            {Array.from({ length: 9 }, (_, rowIndex) => (
              <div className="grid grid-cols-5 gap-px" key={rowIndex}>
                {Array.from({ length: WORD_LENGTH }, (_, tileIndex) => (
                  <Skeleton
                    className={cn(boardStyles.tile, "rounded-md")}
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
