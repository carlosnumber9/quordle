export const DAILY_CALENDAR_VERSION = 1;

export interface DailyCalendar {
  readonly version: typeof DAILY_CALENDAR_VERSION;
  readonly seed: string;
  readonly games: Readonly<Record<string, ReadonlyArray<string>>>;
}

export interface DailyCalendarValidationOptions {
  readonly requireCompleteDictionary?: boolean;
}

export class InvalidDailyCalendarError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDailyCalendarError";
  }
}
