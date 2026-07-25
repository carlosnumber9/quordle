import type { ResultSolutionsProps } from "./definitions";
import styles from "./styles.module.css";

export function ResultSolutions({ words }: ResultSolutionsProps) {
  return (
    <div aria-label="Soluciones" className={styles.solutions}>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Las palabras eran
      </p>
      <ul className={styles.solutionList}>
        {words.map((word) => (
          <li className={styles.solutionWord} key={word}>
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}
