import { useRef } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { useDefinitionTransition } from "./animations";
import type { ResultWordCardProps } from "./definitions";
import styles from "./styles.module.css";
import {
  getBoardResultText,
  getDefinitionPrefix,
  getReadingDescriptor,
} from "./utils";

export function ResultWordCard({
  board,
  definitionState,
}: ResultWordCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const skeletonRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useDefinitionTransition(
    cardRef,
    bodyRef,
    skeletonRef,
    contentRef,
    definitionState.status,
  );

  return (
    <article
      aria-busy={definitionState.status === "loading"}
      className={styles.wordCard}
      data-resolved={board.solvedAtAttempt !== null ? "" : undefined}
      ref={cardRef}
    >
      <h3 className={styles.word}>{board.solution}</h3>
      <div className={styles.definitionLayers} ref={bodyRef}>
        <div
          aria-hidden="true"
          className={styles.definitionSkeleton}
          ref={skeletonRef}
        >
          <Skeleton className={styles.skeletonLabel} />
          <Skeleton className={styles.skeletonLine} />
          <Skeleton className={styles.skeletonShortLine} />
        </div>
        {definitionState.status === "ready" ? (
          <div
            aria-live="polite"
            className={styles.definitionContent}
            ref={contentRef}
          >
            {definitionState.payload.readings.map((reading, index) => {
              const prefix = getDefinitionPrefix(reading);
              return (
                <div
                  className={styles.reading}
                  key={`${reading.displayedForm}-${reading.lemma}-${reading.homonymIndex ?? ""}-${index}`}
                >
                  <p className={styles.readingHeading}>
                    <span className={styles.displayedForm}>
                      {reading.displayedForm}
                    </span>
                    <span aria-hidden="true"> · </span>
                    <span>{getReadingDescriptor(reading)}</span>
                  </p>
                  {reading.labels.length > 0 ? (
                    <p className={styles.labels}>{reading.labels.join(" · ")}</p>
                  ) : null}
                  <p className={styles.definition}>
                    {prefix === null ? null : (
                      <strong className={styles.definitionPrefix}>
                        {prefix}{" "}
                      </strong>
                    )}
                    {reading.definition}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <p className={styles.resultText}>
        {getBoardResultText(board.solvedAtAttempt)}
      </p>
    </article>
  );
}
