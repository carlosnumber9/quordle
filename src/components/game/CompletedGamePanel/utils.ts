import type { Countdown } from "./definitions";

export function formatCountdown(milliseconds: number): Countdown {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1_000));
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return {
    formatted: [hours, minutes, seconds]
      .map((part) => String(part).padStart(2, "0"))
      .join(":"),
    hours,
    minutes,
    seconds,
  };
}
