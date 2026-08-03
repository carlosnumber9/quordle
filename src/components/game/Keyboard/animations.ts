import { gsap } from "gsap";
import { useLayoutEffect, useRef, type RefObject } from "react";

export function useKeyboardModeAnimation(
  selectedBoardIndex: number | null,
  rootRef: RefObject<HTMLDivElement | null>,
) {
  const previousSelection = useRef<number | null | undefined>(undefined);

  useLayoutEffect(() => {
    if (previousSelection.current === undefined) {
      previousSelection.current = selectedBoardIndex;
      return;
    }
    previousSelection.current = selectedBoardIndex;

    const root = rootRef.current;
    if (
      root === null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const keys = root.querySelectorAll<HTMLElement>("[data-letter-key]");
    const context = gsap.context(() => {
      gsap.fromTo(
        keys,
        { opacity: 0.5, scale: 0.88, y: 5 },
        {
          clearProps: "opacity,transform",
          duration: 0.24,
          ease: "back.out(1.8)",
          opacity: 1,
          scale: 1,
          stagger: { amount: 0.16, from: "center" },
          y: 0,
        },
      );
    }, root);

    return () => context.revert();
  }, [rootRef, selectedBoardIndex]);
}
