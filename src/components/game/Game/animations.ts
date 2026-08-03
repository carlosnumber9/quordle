import { gsap } from "gsap";
import { useLayoutEffect, type RefObject } from "react";

import type { GameView } from "./definitions";

export function useIntroAnimation(
  view: GameView,
  rootRef: RefObject<HTMLElement | null>,
  titleRef: RefObject<HTMLHeadingElement | null>,
  onComplete: () => void,
) {
  useLayoutEffect(() => {
    if (view.status !== "ready") {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    const title = titleRef.current;
    const root = rootRef.current;
    if (title === null || root === null) {
      onComplete();
      return;
    }

    const bounds = title.getBoundingClientRect();
    const scale = Math.max(
      1.1,
      Math.min(2.25, (window.innerWidth - 32) / bounds.width),
    );
    const x = window.innerWidth / 2 - (bounds.left + bounds.width / 2);
    const y = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
    const revealElements = root.querySelectorAll("[data-intro-reveal]");
    const context = gsap.context(() => {
      gsap
        .timeline({ onComplete })
        .set(revealElements, { autoAlpha: 0 })
        .set(title, {
          autoAlpha: 0,
          scale,
          transformOrigin: "center center",
          x,
          y,
        })
        .to(title, { autoAlpha: 1, duration: 0.5, ease: "power2.out" })
        .to(
          title,
          { duration: 0.75, ease: "power3.inOut", scale: 1, x: 0, y: 0 },
          "+=1",
        )
        .to(
          revealElements,
          { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
          "-=0.25",
        );
    }, root);

    return () => context.revert();
  }, [onComplete, rootRef, titleRef, view.status]);
}

export function useGuessAnimation(
  attemptCount: number,
  rootRef: RefObject<HTMLElement | null>,
  previousAttemptCount: RefObject<number>,
) {
  useLayoutEffect(() => {
    if (
      attemptCount <= previousAttemptCount.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      previousAttemptCount.current = attemptCount;
      return;
    }

    const row = `[data-clue-attempt="${attemptCount}"]`;
    const context = gsap.context(() => {
      const correct = `${row}[data-letter-status="correct"]`;
      const present = `${row}[data-letter-status="present"]`;
      gsap.fromTo(correct, { scale: 1 }, {
        duration: 0.16, ease: "power2.out", repeat: 1,
        scale: 1.16, stagger: 0.04, yoyo: true,
      });
      gsap.fromTo(present, {
        rotationY: 180, transformPerspective: 420,
      }, {
        duration: 0.72, ease: "elastic.out(1, 0.48)",
        rotationY: 0, stagger: 0.04,
      });
    }, rootRef);

    previousAttemptCount.current = attemptCount;
    return () => context.revert();
  }, [attemptCount, previousAttemptCount, rootRef]);
}
