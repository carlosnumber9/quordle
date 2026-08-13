import { useCallback, useEffect, useRef, useState } from "react";

import { solvedBoardAnimationDuration } from "../Board/animations";
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
  const sawPlayingGame = useRef(false);
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
  useGuessAnimation(game?.attempts.length ?? 0, rootRef, previousAttemptCount);
  useEffect(() => {
    if (game === null) {
      sawPlayingGame.current = false;
      setResultOpen(false);
      return;
    }
    if (game.status === "playing") {
      sawPlayingGame.current = true;
      setResultOpen(false);
      return;
    }
    if (!introFinished) {
      return;
    }

    const solvedOnLastAttempt = game.boards.some(
      (board) => board.solvedAtAttempt === game.attempts.length,
    );
    const shouldWait =
      sawPlayingGame.current &&
      solvedOnLastAttempt &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!shouldWait) {
      sawPlayingGame.current = false;
      setResultOpen(true);
      return;
    }

    const delay = solvedBoardAnimationDuration(game.attempts.length) * 1_000;
    const timer = window.setTimeout(() => {
      sawPlayingGame.current = false;
      setResultOpen(true);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [game, introFinished]);

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
