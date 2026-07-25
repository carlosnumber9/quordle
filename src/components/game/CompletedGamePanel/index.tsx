import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import type { CompletedGamePanelProps } from "./definitions";
import styles from "./styles.module.css";
import { useCountdown } from "./use-countdown";

export function CompletedGamePanel({
  onReset,
  onShowResults,
}: CompletedGamePanelProps) {
  const countdown = useCountdown(onReset);

  return (
    <Card className={styles.panel} size="sm">
      <CardContent className={styles.content}>
        <div className={styles.summary}>
          <CardTitle aria-level={2} role="heading">
            Partida terminada
          </CardTitle>
          <CardDescription>
            <span>Nueva partida en</span>
            <time
              aria-label={`Faltan ${countdown.hours} horas, ${countdown.minutes} minutos y ${countdown.seconds} segundos`}
              className={styles.countdown}
              dateTime={`PT${countdown.hours}H${countdown.minutes}M${countdown.seconds}S`}
            >
              {countdown.formatted}
            </time>
          </CardDescription>
        </div>
        <Button
          onClick={onShowResults}
          size="sm"
          type="button"
          variant="outline"
        >
          Resultados
        </Button>
      </CardContent>
    </Card>
  );
}
