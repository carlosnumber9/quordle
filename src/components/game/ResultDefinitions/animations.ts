import { gsap } from "gsap";
import { useLayoutEffect, useRef, type RefObject } from "react";

import type { WordDefinitionState } from "./definitions";

export function useDefinitionTransition(
  cardRef: RefObject<HTMLElement | null>,
  bodyRef: RefObject<HTMLDivElement | null>,
  skeletonRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  status: WordDefinitionState["status"],
) {
  const previousStatus = useRef(status);
  const loadingHeight = useRef<number | null>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const body = bodyRef.current;
    const skeleton = skeletonRef.current;
    const content = contentRef.current;
    if (card === null || body === null || skeleton === null) {
      return;
    }

    const priorStatus = previousStatus.current;
    previousStatus.current = status;
    if (status === "loading") {
      loadingHeight.current = card.offsetHeight;
      return;
    }

    if (priorStatus !== "loading") {
      gsap.set(skeleton, { display: "none" });
      if (status === "unavailable") {
        gsap.set(body, { display: "none" });
      }
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      gsap.set(skeleton, { display: "none" });
      if (status === "unavailable") {
        gsap.set(body, { display: "none" });
      } else if (content !== null) {
        gsap.set(content, { clearProps: "opacity" });
      }
      return;
    }

    const startHeight = loadingHeight.current ?? card.offsetHeight;
    const context = gsap.context(() => {
      if (status === "ready" && content !== null) {
        gsap.set(content, { opacity: 0 });
        gsap.set(skeleton, { display: "none" });
        gsap.set(card, { clearProps: "height,overflow" });
        const targetHeight = card.offsetHeight;
        gsap.set(skeleton, { display: "grid", opacity: 1 });
        gsap.set(card, { height: startHeight, overflow: "hidden" });

        gsap
          .timeline({
            onComplete: () => {
              gsap.set(skeleton, { display: "none", clearProps: "opacity" });
              gsap.set(content, { clearProps: "opacity" });
              gsap.set(card, { clearProps: "height,overflow" });
            },
          })
          .to(skeleton, { opacity: 0, duration: 0.15, ease: "power1.out" })
          .to(
            card,
            { height: targetHeight, duration: 0.22, ease: "power1.out" },
            0,
          )
          .to(
            content,
            { opacity: 1, duration: 0.18, ease: "power1.out" },
            0.08,
          );
        return;
      }

      gsap.set(body, { display: "none" });
      gsap.set(card, { clearProps: "height,overflow" });
      const targetHeight = card.offsetHeight;
      gsap.set(body, { display: "grid" });
      gsap.set(skeleton, { opacity: 1 });
      gsap.set(card, { height: startHeight, overflow: "hidden" });

      gsap
        .timeline({
          onComplete: () => {
            gsap.set(body, { display: "none" });
            gsap.set(card, { clearProps: "height,overflow" });
          },
        })
        .to(skeleton, { opacity: 0, duration: 0.15, ease: "power1.out" })
        .set(body, { display: "none" })
        .to(card, {
          height: targetHeight,
          duration: 0.22,
          ease: "power1.out",
        });
    }, card);

    return () => context.revert();
  }, [bodyRef, cardRef, contentRef, skeletonRef, status]);
}
