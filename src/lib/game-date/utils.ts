import {
  DATE_TIME_PARTS,
  madridFormatter,
  type ZonedDateTimeParts,
} from "./definitions";

export function getMadridDateTime(
  instant: Date = new Date(),
): ZonedDateTimeParts {
  const values = new Map(
    madridFormatter
      .formatToParts(instant)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  const [year, month, day, hour, minute, second] =
    DATE_TIME_PARTS.map((part) => values.get(part));

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

export function shiftCalendarDate(
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

export function madridDateTimeToInstant(parts: ZonedDateTimeParts): Date {
  const targetAsUtc = partsAsUtc(parts);
  let candidate = targetAsUtc;

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

export function toIsoDate(parts: ZonedDateTimeParts): string {
  return [
    String(parts.year).padStart(4, "0"),
    String(parts.month).padStart(2, "0"),
    String(parts.day).padStart(2, "0"),
  ].join("-");
}
