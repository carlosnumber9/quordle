import { useCallback, useEffect, useRef, useState } from "react";

import { useGuessAnimation, useIntroAnimation } from "./animations";
import type { GameController, GameView } from "./definitions";
import { useGameInput } from "./use-game-input";
import { useGameLoader } from "./use-game-loader";
import { useGameResults } from "./use-game-results";

export function useGame(siteUrl: string): GameController {
  const [view, setView] = useState<GameView>({ status: "loading" });
  const [currentGuess, setCurrentGuess] = useState("");
  const [manualShareText, setManualShareText] = useState<string | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const manualShareRef = useRef<HTMLTextAreaElement>(null);
  const previousAttemptCount = useRef(0);
  const load = useGameLoader(setView, setCurrentGuess, previousAttemptCount);
  const input = useGameInput(view, currentGuess, setView, setCurrentGuess);
  const results = useGameResults(
    siteUrl,
    view,
    setView,
    setCurrentGuess,
    setManualShareText,
    setReplaying,
    manualShareText,
    manualShareRef,
    previousAttemptCount,
  );
  const game = view.status === "ready" ? view.game : null;
  const completeIntro = useCallback(() => setIntroFinished(true), []);

  useIntroAnimation(view, rootRef, titleRef, completeIntro);
  useGuessAnimation(
    game?.attempts.length ?? 0,
    rootRef,
    previousAttemptCount,
  );
  useEffect(() => {
    setResultOpen(
      introFinished && game !== null && game.status !== "playing",
    );
  }, [game?.gameId, game?.status, introFinished]);

  return {
    ...input,
    ...results,
    currentGuess,
    introFinished,
    load,
    manualShareRef,
    manualShareText,
    replaying,
    resultOpen,
    rootRef,
    setManualShareText,
    setResultOpen,
    titleRef,
    view,
  };
}
