export const GAME_TIME_ZONE = "Europe/Madrid";
export const RESET_HOUR = 5;

interface ZonedDateTimeParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
}

const madridFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: GAME_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function getMadridDateTime(
  instant: Date = new Date(),
): ZonedDateTimeParts {
  const parts = madridFormatter.formatToParts(instant);
  const values = new Map(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  const year = values.get("year");
  const month = values.get("month");
  const day = values.get("day");
  const hour = values.get("hour");
  const minute = values.get("minute");
  const second = values.get("second");

  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    hour === undefined ||
    minute === undefined ||
    second === undefined
  ) {
    throw new Error("No se pudo calcular la fecha de Europe/Madrid.");
  }

  return { year, month, day, hour, minute, second };
}

export function getMadridCalendarDate(instant: Date = new Date()): string {
  return toIsoDate(getMadridDateTime(instant));
}

export function getCurrentGameDate(instant: Date = new Date()): string {
  const madrid = getMadridDateTime(instant);
  return madrid.hour >= RESET_HOUR
    ? toIsoDate(madrid)
    : previousCalendarDate(madrid);
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

function previousCalendarDate(parts: ZonedDateTimeParts): string {
  return toIsoDate(shiftCalendarDate(parts, -1));
}

function shiftCalendarDate(
  parts: ZonedDateTimeParts,
  days: number,
): ZonedDateTimeParts {
  const shifted = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day + days),
  );

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

function madridDateTimeToInstant(parts: ZonedDateTimeParts): Date {
  const targetAsUtc = partsAsUtc(parts);
  let candidate = targetAsUtc;

  // Iterate from a UTC guess until its Madrid fields match the requested
  // wall-clock time. This lets Intl account for CET, CEST, and DST changes.
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const observed = getMadridDateTime(new Date(candidate));
    const adjustment = targetAsUtc - partsAsUtc(observed);
    candidate += adjustment;

    if (adjustment === 0) {
      return new Date(candidate);
    }
  }

  throw new Error("No se pudo calcular el próximo reinicio de la partida.");
}

function partsAsUtc(parts: ZonedDateTimeParts): number {
  return Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
}

function toIsoDate(parts: ZonedDateTimeParts): string {
  return [
    String(parts.year).padStart(4, "0"),
    String(parts.month).padStart(2, "0"),
    String(parts.day).padStart(2, "0"),
  ].join("-");
}
