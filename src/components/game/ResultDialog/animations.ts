import { gsap } from "gsap";
import { useLayoutEffect, type RefObject } from "react";

export function useResultAnimation(
  contentRef: RefObject<HTMLDivElement | null>,
  open: boolean,
  won: boolean,
) {
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (content === null || !open) {
      return;
    }
    const turns = content.querySelectorAll("[data-result-turn]");
    const connectors = content.querySelectorAll("[data-result-connector]");
    const words = content.querySelectorAll("[data-result-word]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(content, { clearProps: "opacity,scale,transform" });
      gsap.set(turns, { clearProps: "opacity,transform" });
      gsap.set(connectors, { clearProps: "transform" });
      gsap.set(words, { clearProps: "opacity,transform" });
      return;
    }

    const context = gsap.context(() => {
      gsap.set(turns, { opacity: 0, x: -10 });
      gsap.set(connectors, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(words, { opacity: 0, scale: 0.8 });
      const timeline = gsap.timeline();

      if (won) {
        timeline
          .set(content, { opacity: 0, scale: 0 })
          .to(content, { opacity: 1, duration: 0.18, ease: "power1.out" })
          .to(
            content,
            { duration: 0.72, ease: "elastic.out(1, 0.45)", scale: 1 },
            "<",
          );
      } else {
        timeline.fromTo(
          content,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power1.out" },
        );
      }

      turns.forEach((turn) => {
        timeline.to(turn, {
          opacity: 1,
          x: 0,
          duration: 0.16,
          ease: "power1.out",
        });
        const turnWords = turn.querySelectorAll("[data-result-word]");
        if (turnWords.length > 0) {
          timeline.to(
            turnWords,
            {
              opacity: 1,
              scale: 1,
              duration: 0.22,
              ease: "back.out(1.7)",
              stagger: 0.06,
            },
            "<",
          );
        }
        const connector = turn.querySelector("[data-result-connector]");
        if (connector !== null) {
          timeline.to(connector, {
            scaleY: 1,
            duration: 0.12,
            ease: "none",
          });
        }
      });
    }, content);

    return () => context.revert();
  }, [contentRef, open, won]);
}
