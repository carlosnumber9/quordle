import wordStyles from "./words.module.css";
import type { ResultWordsProps } from "./definitions";

export function ResultWords({
  resolvedWords,
  revealedWords,
}: ResultWordsProps) {
  if (resolvedWords.length === 0 && revealedWords.length === 0) {
    return null;
  }

  return (
    <span aria-hidden="true" className={wordStyles.words}>
      {resolvedWords.length > 0 ? (
        <span className={wordStyles.solved} data-result-word>
          {resolvedWords.join(" · ")}
        </span>
      ) : null}
      {revealedWords.length > 0 ? (
        <span className={wordStyles.missed} data-result-word>
          <span className={wordStyles.missedLabel}>Sin resolver</span>
          <span>{revealedWords.join(" · ")}</span>
        </span>
      ) : null}
    </span>
  );
}
