import type { ResultTimelineProps } from "../ResultDialog/definitions";
import { accessibleTurnResult } from "../ResultDialog/utils";
import { ResultWords } from "./ResultWords";
import styles from "./styles.module.css";

export function ResultTimeline({
  game,
  resolvedWordsByAttempt,
  unresolvedWords,
  won,
}: ResultTimelineProps) {
  return (
    <div aria-label="Cronología de la partida" className={styles.timeline}>
      <p className={styles.title}>Turnos jugados</p>
      <ol className={styles.list}>
        {game.attempts.map((_, attemptIndex) => {
          const attemptNumber = attemptIndex + 1;
          const resolvedWords = resolvedWordsByAttempt[attemptIndex] ?? [];
          const revealedWords =
            !won && attemptNumber === game.attempts.length
              ? unresolvedWords
              : [];

          return (
            <li
              aria-label={`Turno ${attemptNumber}, ${accessibleTurnResult(
                resolvedWords,
                revealedWords,
              )}`}
              className={styles.turn}
              data-result-turn
              key={attemptNumber}
            >
              <span aria-hidden="true" className={styles.axis}>
                <span
                  className={styles.marker}
                  data-revealed={revealedWords.length > 0 ? "" : undefined}
                  data-solved={resolvedWords.length > 0 ? "" : undefined}
                />
                {attemptNumber < game.attempts.length ? (
                  <span className={styles.connector} data-result-connector />
                ) : null}
              </span>
              <span aria-hidden="true" className={styles.turnNumber}>
                Turno {attemptNumber}
              </span>
              <ResultWords
                resolvedWords={resolvedWords}
                revealedWords={revealedWords}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
