import { gsap } from "gsap";
import { useLayoutEffect, type RefObject } from "react";

import type { Bounds, GameView } from "./definitions";
import { calculateFlipTransform } from "./utils";

const BOARD_SELECTOR = "[data-game-board]";
const boardTimelines = new WeakMap<HTMLElement, gsap.core.Timeline>();

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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
    if (prefersReducedMotion()) {
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
      prefersReducedMotion()
    ) {
      previousAttemptCount.current = attemptCount;
      return;
    }

    const row = `[data-clue-attempt="${attemptCount}"]`;
    const context = gsap.context(() => {
      const correct = `${row}[data-letter-status="correct"]`;
      const present = `${row}[data-letter-status="present"]`;
      gsap.fromTo(
        correct,
        { scale: 1 },
        {
          duration: 0.16,
          ease: "power2.out",
          repeat: 1,
          scale: 1.16,
          stagger: 0.04,
          yoyo: true,
        },
      );
      gsap.fromTo(
        present,
        {
          rotationY: 180,
          transformPerspective: 420,
        },
        {
          duration: 0.72,
          ease: "elastic.out(1, 0.48)",
          rotationY: 0,
          stagger: 0.04,
        },
      );
    }, rootRef);

    previousAttemptCount.current = attemptCount;
    return () => context.revert();
  }, [attemptCount, previousAttemptCount, rootRef]);
}

function getBoards(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(BOARD_SELECTOR));
}

function killBoardTimeline(root: HTMLElement): void {
  boardTimelines.get(root)?.kill();
  boardTimelines.delete(root);
}

function positionCloseButton(
  root: HTMLElement,
  boardIndex: number,
  closeButton: HTMLButtonElement,
): void {
  const boards = getBoards(root);
  const selected = boards[boardIndex];
  if (selected === undefined) {
    return;
  }

  const selectedBounds = selected.getBoundingClientRect();
  const rootBounds = root.getBoundingClientRect();
  const closeInset = 4;
  gsap.set(closeButton, {
    left:
      selectedBounds.right -
      rootBounds.left -
      closeButton.offsetWidth -
      closeInset,
    top: selectedBounds.top - rootBounds.top + closeInset,
  });
}

export function playBoardZoom(
  root: HTMLElement,
  boardIndex: number,
  closeButton: HTMLButtonElement,
  firstBounds: Bounds,
): void {
  const boards = getBoards(root);
  const selected = boards[boardIndex];
  if (selected === undefined) {
    return;
  }
  const obscured = boards.filter((board) => board !== selected);
  const reducedMotion = prefersReducedMotion();

  killBoardTimeline(root);
  gsap.killTweensOf([...boards, closeButton]);
  const transform = calculateFlipTransform(
    firstBounds,
    selected.getBoundingClientRect(),
  );
  if (transform === null) {
    return;
  }

  positionCloseButton(root, boardIndex, closeButton);
  gsap.set(selected, {
    ...transform,
    transformOrigin: "center center",
    willChange: "transform",
    zIndex: 30,
  });
  gsap.set(obscured, { willChange: "opacity" });
  gsap.set(closeButton, {
    autoAlpha: 0,
    willChange: "opacity",
  });
  let timeline: gsap.core.Timeline;
  timeline = gsap.timeline({
    onComplete: () => {
      gsap.set(selected, {
        clearProps: "transform,willChange,zIndex",
      });
      gsap.set(obscured, { clearProps: "willChange" });
      gsap.set(closeButton, { clearProps: "willChange" });
      if (boardTimelines.get(root) === timeline) {
        boardTimelines.delete(root);
      }
    },
  });
  boardTimelines.set(root, timeline);
  timeline
    .to(
      obscured,
      {
        autoAlpha: 0,
        duration: reducedMotion ? 0 : 0.14,
        ease: "power1.out",
      },
      0,
    )
    .to(
      selected,
      {
        duration: reducedMotion ? 0 : 0.28,
        ease: "power3.inOut",
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
      },
      0,
    )
    .to(
      closeButton,
      {
        autoAlpha: 1,
        duration: reducedMotion ? 0 : 0.14,
        ease: "power2.out",
      },
      reducedMotion ? 0 : 0.14,
    );
}

export function playBoardRestore(
  root: HTMLElement,
  boardIndex: number,
  closeButton: HTMLButtonElement,
  firstBounds: Bounds,
  onComplete: () => void,
): void {
  const boards = getBoards(root);
  const selected = boards[boardIndex];
  if (selected === undefined) {
    onComplete();
    return;
  }
  const obscured = boards.filter((board) => board !== selected);
  const reducedMotion = prefersReducedMotion();
  const transform = calculateFlipTransform(
    firstBounds,
    selected.getBoundingClientRect(),
  );
  if (transform === null) {
    onComplete();
    return;
  }

  killBoardTimeline(root);
  gsap.killTweensOf([...boards, closeButton]);
  gsap.set(selected, {
    ...transform,
    transformOrigin: "center center",
    willChange: "transform",
    zIndex: 30,
  });
  gsap.set(obscured, { willChange: "opacity" });
  gsap.set(closeButton, { willChange: "opacity" });
  let timeline: gsap.core.Timeline;
  timeline = gsap.timeline({
    onComplete: () => {
      gsap.set(boards, {
        clearProps: "opacity,transform,visibility,willChange,zIndex",
      });
      gsap.set(closeButton, {
        clearProps: "left,opacity,top,visibility,willChange",
      });
      if (boardTimelines.get(root) === timeline) {
        boardTimelines.delete(root);
      }
      onComplete();
    },
  });
  boardTimelines.set(root, timeline);
  timeline
    .to(
      closeButton,
      {
        autoAlpha: 0,
        duration: reducedMotion ? 0 : 0.1,
        ease: "power1.out",
      },
      0,
    )
    .to(
      selected,
      {
        duration: reducedMotion ? 0 : 0.24,
        ease: "power3.inOut",
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
      },
      0,
    )
    .to(
      obscured,
      {
        autoAlpha: 1,
        duration: reducedMotion ? 0 : 0.15,
        ease: "power1.out",
      },
      reducedMotion ? 0 : 0.09,
    );
}

export function refreshBoardZoom(
  root: HTMLElement,
  boardIndex: number,
  closeButton: HTMLButtonElement,
): void {
  const boards = getBoards(root);
  killBoardTimeline(root);
  gsap.killTweensOf([...boards, closeButton]);
  gsap.set(boards[boardIndex] ?? [], {
    clearProps: "transform,willChange,zIndex",
  });
  positionCloseButton(root, boardIndex, closeButton);
  gsap.set(
    boards.filter((_, index) => index !== boardIndex),
    { autoAlpha: 0 },
  );
  gsap.set(closeButton, { autoAlpha: 1 });
}

export function clearBoardZoom(
  root: HTMLElement,
  closeButton: HTMLButtonElement,
): void {
  const boards = getBoards(root);
  killBoardTimeline(root);
  gsap.killTweensOf([...boards, closeButton]);
  gsap.set(boards, {
    clearProps: "opacity,transform,visibility,willChange,zIndex",
  });
  gsap.set(closeButton, {
    clearProps: "left,opacity,top,visibility,willChange",
  });
}
