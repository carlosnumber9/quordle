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
    const streakPoints = content.querySelectorAll("[data-streak-point]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(content, { clearProps: "opacity,scale,transform" });
      gsap.set(streakPoints, { clearProps: "opacity,transform" });
      return;
    }

    const context = gsap.context(() => {
      gsap.set(streakPoints, { opacity: 0, scale: 0.35 });
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

      timeline.to(streakPoints, {
        opacity: 1,
        scale: 1,
        duration: 0.38,
        ease: "elastic.out(1, 0.55)",
        stagger: 0.07,
      });
    }, content);

    return () => context.revert();
  }, [contentRef, open, won]);
}
