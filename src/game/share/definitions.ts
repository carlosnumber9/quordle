import type { LetterStatus } from "../definitions";

export const EMOJI_BY_STATUS: Readonly<Record<LetterStatus, string>> = {
  absent: "⬛",
  present: "🟨",
  correct: "🟩",
};

export const INACTIVE_ROW = "⬜⬜⬜⬜⬜";

export const NUMBER_EMOJI = [
  "",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
] as const;
