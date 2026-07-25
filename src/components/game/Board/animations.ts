import { gsap } from "gsap";
import { useLayoutEffect, type RefObject } from "react";

import { MAX_ATTEMPTS } from "@/game/definitions";

export function useBoardCollapseAnimation(
  solvedAtAttempt: number | null,
  cardRef: RefObject<HTMLDivElement | null>,
  previousSolvedAtAttempt: RefObject<number | null>,
  setVisibleRowCount: (count: number) => void,
) {
  useLayoutEffect(() => {
    const previousSolved = previousSolvedAtAttempt.current;
    previousSolvedAtAttempt.current = solvedAtAttempt;
    if (solvedAtAttempt === null) {
      setVisibleRowCount(MAX_ATTEMPTS);
      return;
    }
    if (previousSolved !== null) {
      setVisibleRowCount(solvedAtAttempt);
      return;
    }

    const card = cardRef.current;
    const grid = card?.querySelector<HTMLElement>("[data-board-grid]");
    const solvedRow = grid?.querySelector<HTMLElement>(
      `[data-row-index="${solvedAtAttempt - 1}"]`,
    );
    if (
      card === null ||
      card === undefined ||
      grid === null ||
      grid === undefined ||
      solvedRow === null ||
      solvedRow === undefined ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisibleRowCount(solvedAtAttempt);
      return;
    }

    const cardBounds = card.getBoundingClientRect();
    const gridBounds = grid.getBoundingClientRect();
    const rowBounds = solvedRow.getBoundingClientRect();
    const compactHeight =
      cardBounds.height - (gridBounds.bottom - rowBounds.bottom);
    let clearHeightFrame: number | null = null;
    const context = gsap.context(() => {
      gsap.fromTo(
        card,
        { height: cardBounds.height, willChange: "height" },
        {
          duration: 1,
          ease: "power2.inOut",
          height: compactHeight,
          onComplete: () => {
            setVisibleRowCount(solvedAtAttempt);
            clearHeightFrame = window.requestAnimationFrame(() => {
              gsap.set(card, { clearProps: "height,willChange" });
            });
          },
        },
      );
    }, card);

    return () => {
      if (clearHeightFrame !== null) {
        window.cancelAnimationFrame(clearHeightFrame);
      }
      context.revert();
    };
  }, [
    cardRef,
    previousSolvedAtAttempt,
    setVisibleRowCount,
    solvedAtAttempt,
  ]);
}
