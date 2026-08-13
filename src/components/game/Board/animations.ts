import { gsap } from "gsap";
import { useLayoutEffect, useRef, type RefObject } from "react";

import { MAX_ATTEMPTS } from "@/game/definitions";

const WAVE_HALF_DURATION = 0.065;
const WAVE_ROW_INTERVAL = 0.09;
const WAVE_SCALE = 1.18;
const UNUSED_ROW_DELAY = 0.5;
const ROW_FADE_DURATION = 0.1;

export function solvedBoardAnimationDuration(solvedAtAttempt: number): number {
  const waveRowCount = MAX_ATTEMPTS - solvedAtAttempt + 1;
  const unusedRowCount = MAX_ATTEMPTS - solvedAtAttempt;
  const waveDuration =
    (waveRowCount - 1) * WAVE_ROW_INTERVAL + WAVE_HALF_DURATION * 2;
  return unusedRowCount === 0
    ? waveDuration
    : waveDuration + UNUSED_ROW_DELAY + unusedRowCount * ROW_FADE_DURATION;
}

function rowsFrom(grid: HTMLElement): HTMLElement[] {
  return Array.from(grid.querySelectorAll<HTMLElement>("[data-board-row]"));
}

function hideUnusedRows(rows: HTMLElement[], solvedAtAttempt: number): void {
  gsap.set(rows.slice(solvedAtAttempt), { autoAlpha: 0 });
}

export function useSolvedBoardAnimation(
  solvedAtAttempt: number | null,
  gridRef: RefObject<HTMLDivElement | null>,
) {
  const previousSolvedAtAttempt = useRef(solvedAtAttempt);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (grid === null) {
      return;
    }

    const rows = rowsFrom(grid);
    if (solvedAtAttempt === null) {
      previousSolvedAtAttempt.current = null;
      gsap.set(rows, { clearProps: "opacity,visibility" });
      return;
    }

    if (previousSolvedAtAttempt.current !== null) {
      hideUnusedRows(rows, solvedAtAttempt);
      return;
    }

    const unusedRows = rows.slice(solvedAtAttempt).reverse();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hideUnusedRows(rows, solvedAtAttempt);
      previousSolvedAtAttempt.current = solvedAtAttempt;
      return;
    }

    const waveRows = rows.slice(solvedAtAttempt - 1).reverse();
    const waveTiles = waveRows.flatMap((row) => Array.from(row.children));
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          previousSolvedAtAttempt.current = solvedAtAttempt;
          gsap.set(waveTiles, {
            clearProps: "transform,transformOrigin,willChange",
          });
          gsap.set(unusedRows, { clearProps: "willChange" });
        },
      });

      for (const [rowIndex, row] of waveRows.entries()) {
        timeline.fromTo(
          Array.from(row.children),
          { scale: 1 },
          {
            duration: WAVE_HALF_DURATION,
            ease: "power2.inOut",
            repeat: 1,
            scale: WAVE_SCALE,
            transformOrigin: "center center",
            willChange: "transform",
            yoyo: true,
          },
          rowIndex * WAVE_ROW_INTERVAL,
        );
      }

      if (unusedRows.length > 0) {
        timeline.set(
          unusedRows,
          { willChange: "opacity" },
          `+=${UNUSED_ROW_DELAY}`,
        );
        for (const row of unusedRows) {
          timeline.to(row, {
            autoAlpha: 0,
            duration: ROW_FADE_DURATION,
            ease: "power1.out",
          });
        }
      }
    }, grid);

    return () => context.revert();
  }, [gridRef, solvedAtAttempt]);
}
