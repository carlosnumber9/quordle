import type { StreakDay } from "@/game/streak";

const MIN_WIN_ATTEMPT = 4;
const MAX_WIN_ATTEMPT = 9;
const LARGEST_MARKER_REM = 2;
const SMALLEST_MARKER_REM = 1.25;
const DAY_INITIALS = ["D", "L", "M", "X", "J", "V", "S"] as const;

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  weekday: "long",
});

export function getStreakMessage(currentStreak: number): string {
  if (currentStreak === 0) {
    return "No te preocupes, siempre puedes comenzar a ganar mañana :)";
  }
  if (currentStreak === 1) {
    return "Hoy comienza una nueva racha. ¡Vamos!";
  }

  return `Racha de ${currentStreak} días. ¡Que el ritmo no pare!`;
}

export function getWinMarkerSize(attempts: number): string {
  const clampedAttempts = Math.min(
    MAX_WIN_ATTEMPT,
    Math.max(MIN_WIN_ATTEMPT, attempts),
  );
  const progress =
    (clampedAttempts - MIN_WIN_ATTEMPT) /
    (MAX_WIN_ATTEMPT - MIN_WIN_ATTEMPT);
  const size =
    LARGEST_MARKER_REM -
    progress * (LARGEST_MARKER_REM - SMALLEST_MARKER_REM);

  return `${size}rem`;
}

export function getDayInitialLabel(gameDate: string): string {
  return DAY_INITIALS[toUtcDate(gameDate).getUTCDay()] ?? "";
}

export function getAccessibleDayLabel(day: StreakDay): string {
  const date = dateFormatter.format(toUtcDate(day.gameDate));
  if (day.outcome === "won") {
    return `${date}: victoria en el turno ${day.attempts}.`;
  }
  if (day.outcome === "lost") {
    return `${date}: derrota.`;
  }

  return `${date}: sin partida.`;
}

function toUtcDate(gameDate: string): Date {
  return new Date(`${gameDate}T00:00:00.000Z`);
}
