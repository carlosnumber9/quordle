import { RESET_HOUR } from "./game-date/definitions";
import {
  getMadridDateTime,
  madridDateTimeToInstant,
  shiftCalendarDate,
  toIsoDate,
} from "./game-date/utils";

export { GAME_TIME_ZONE, RESET_HOUR } from "./game-date/definitions";
export { getMadridDateTime } from "./game-date/utils";

export function getMadridCalendarDate(instant: Date = new Date()): string {
  return toIsoDate(getMadridDateTime(instant));
}

export function getCurrentGameDate(instant: Date = new Date()): string {
  const madrid = getMadridDateTime(instant);
  return madrid.hour >= RESET_HOUR
    ? toIsoDate(madrid)
    : toIsoDate(shiftCalendarDate(madrid, -1));
}

export function getNextGameResetAt(instant: Date = new Date()): Date {
  const madrid = getMadridDateTime(instant);
  const targetDate =
    madrid.hour < RESET_HOUR ? madrid : shiftCalendarDate(madrid, 1);

  return madridDateTimeToInstant({
    ...targetDate,
    hour: RESET_HOUR,
    minute: 0,
    second: 0,
  });
}
