import { useEffect, useRef, useState } from "react";

import { getNextGameResetAt } from "@/lib/game-date";

import { formatCountdown } from "./utils";

export function useCountdown(onReset: () => void | Promise<void>) {
  const [resetAt] = useState(() => getNextGameResetAt());
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, resetAt.getTime() - Date.now()),
  );
  const resetTriggered = useRef(false);

  useEffect(() => {
    function updateCountdown() {
      const nextRemaining = Math.max(0, resetAt.getTime() - Date.now());
      setRemaining(nextRemaining);
      if (nextRemaining === 0 && !resetTriggered.current) {
        resetTriggered.current = true;
        void onReset();
      }
    }

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(interval);
  }, [onReset, resetAt]);

  return formatCountdown(remaining);
}
