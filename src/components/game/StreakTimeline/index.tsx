import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import type { StreakTimelineProps } from "./definitions";
import styles from "./styles.module.css";
import {
  getAccessibleDayLabel,
  getDayInitialLabel,
  getStreakMessage,
  getWinMarkerSize,
} from "./utils";

type MarkerStyle = CSSProperties & {
  readonly "--streak-marker-size": string;
};

export function StreakTimeline({ summary }: StreakTimelineProps) {
  return (
    <section aria-label="Racha de los últimos siete días">
      <ol className={styles.timeline}>
        {summary.days.map((day, index) => {
          const nextDay = summary.days[index + 1];
          const continuesStreak =
            day.outcome === "won" && nextDay?.outcome === "won";
          const markerStyle =
            day.outcome === "won" && day.attempts !== null
              ? ({
                  "--streak-marker-size": getWinMarkerSize(day.attempts),
                } as MarkerStyle)
              : undefined;

          return (
            <li
              aria-label={getAccessibleDayLabel(day)}
              className={styles.day}
              key={day.gameDate}
            >
              {nextDay === undefined ? null : (
                <span
                  aria-hidden="true"
                  className={cn(
                    styles.connector,
                    continuesStreak && styles.activeConnector,
                  )}
                />
              )}
              <span
                aria-hidden="true"
                className={styles.pointMount}
                data-streak-point
              >
                <span
                  className={cn(styles.point, styles[day.outcome])}
                  style={markerStyle}
                >
                  {day.outcome === "won" ? day.attempts : null}
                  {day.outcome === "lost" ? "X" : null}
                </span>
              </span>
              <span aria-hidden="true" className={styles.dayLabel}>
                {getDayInitialLabel(day.gameDate)}
              </span>
            </li>
          );
        })}
      </ol>
      <p className={styles.subtitle}>
        {getStreakMessage(summary.currentStreak)}
      </p>
    </section>
  );
}
