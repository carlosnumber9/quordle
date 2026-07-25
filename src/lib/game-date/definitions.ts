export const GAME_TIME_ZONE = "Europe/Madrid";
export const RESET_HOUR = 5;
export const DATE_TIME_PARTS = [
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
] as const;

export interface ZonedDateTimeParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
}

export const madridFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: GAME_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
