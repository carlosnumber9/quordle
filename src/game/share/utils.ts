import type { BoardEvaluation } from "../definitions";
import { EMOJI_BY_STATUS, INACTIVE_ROW } from "./definitions";

export function evaluationToEmoji(evaluation: BoardEvaluation): string {
  return evaluation === null
    ? INACTIVE_ROW
    : evaluation.map((status) => EMOJI_BY_STATUS[status]).join("");
}

export function combineBoards(
  left: ReadonlyArray<string>,
  right: ReadonlyArray<string>,
): ReadonlyArray<string> {
  const rowCount = Math.max(left.length, right.length);
  return Array.from({ length: rowCount }, (_, index) => {
    const leftRow = left[index] ?? INACTIVE_ROW;
    const rightRow = right[index] ?? INACTIVE_ROW;
    return `${leftRow}  ${rightRow}`;
  });
}

export function normalizeSiteUrl(siteUrl: string): string {
  const value = siteUrl.trim().replace(/\/+$/, "");
  if (value.length === 0) {
    throw new Error("La URL pública es obligatoria para compartir.");
  }
  return value;
}
