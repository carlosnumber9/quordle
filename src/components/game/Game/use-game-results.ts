import {
  useCallback,
  useEffect,
  type Dispatch,
  type RefObject,
} from "react";
import { toast } from "sonner";

import { copyTextToClipboard } from "@/game/clipboard";
import { replayLocalGame } from "@/game/local-game-client";
import { createShareText } from "@/game/share";

import type { GameView } from "./definitions";

export function useGameResults(
  siteUrl: string,
  view: GameView,
  setView: Dispatch<React.SetStateAction<GameView>>,
  setCurrentGuess: Dispatch<React.SetStateAction<string>>,
  setManualShareText: Dispatch<React.SetStateAction<string | null>>,
  setReplaying: Dispatch<React.SetStateAction<boolean>>,
  manualShareText: string | null,
  manualShareRef: RefObject<HTMLTextAreaElement | null>,
  previousAttemptCount: RefObject<number>,
) {
  useEffect(() => {
    if (manualShareText !== null) {
      manualShareRef.current?.focus();
      manualShareRef.current?.select();
    }
  }, [manualShareRef, manualShareText]);

  const share = useCallback(async () => {
    if (view.status !== "ready" || view.game.status === "playing") {
      return;
    }
    const text = createShareText(view.game, siteUrl);
    if (await copyTextToClipboard(text)) {
      toast.success("Resultado copiado.");
    } else {
      setManualShareText(text);
    }
  }, [setManualShareText, siteUrl, view]);

  const replay = useCallback(async () => {
    if (view.status !== "ready" || !view.replayAllowed) {
      return;
    }
    setReplaying(true);
    try {
      const nextGame = await replayLocalGame(window.localStorage);
      previousAttemptCount.current = 0;
      setCurrentGuess("");
      setView({ ...view, game: nextGame });
      toast.success("Nueva partida preparada.");
    } catch {
      toast.error("No se pudo preparar otra partida.");
    } finally {
      setReplaying(false);
    }
  }, [
    previousAttemptCount,
    setCurrentGuess,
    setReplaying,
    setView,
    view,
  ]);

  return { replay, share };
}
