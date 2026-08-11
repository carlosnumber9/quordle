import type { ResultDefinitionsProps } from "./definitions";
import { ResultWordCard } from "./ResultWordCard";
import styles from "./styles.module.css";

export function ResultDefinitions({
  boards,
  definitionStates,
}: ResultDefinitionsProps) {
  return (
    <section
      aria-label="Palabras y definiciones del juego"
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Las palabras eran</h2>
      <div className={styles.wordList}>
        {boards.map((board) => (
          <ResultWordCard
            board={board}
            definitionState={
              definitionStates[board.solution] ?? { status: "loading" }
            }
            key={board.solution}
          />
        ))}
      </div>
    </section>
  );
}
