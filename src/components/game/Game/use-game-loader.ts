import { useCallback, useEffect, type Dispatch, type RefObject } from "react";
import { toast } from "sonner";

import { dictionarySet } from "@/game/dictionary";
import { createGame } from "@/game/engine";
import { getOrCreateLocalSession } from "@/game/local-game-client";
import { loadGame, saveGame } from "@/game/persistence";

import type { GameView } from "./definitions";
import { requestGame } from "./utils";

export function useGameLoader(
  setView: Dispatch<React.SetStateAction<GameView>>,
  setCurrentGuess: Dispatch<React.SetStateAction<string>>,
  previousAttemptCount: RefObject<number>,
) {
  const load = useCallback(async () => {
    setView({ status: "loading" });
    setCurrentGuess("");

    try {
      const payload = await requestGame();
      const source =
        payload.mode === "local"
          ? await getOrCreateLocalSession(
              window.localStorage,
              payload.gameDate,
            )
          : payload;
      const restored = loadGame(
        window.localStorage,
        source.gameDate,
        source.words,
        dictionarySet,
        source.gameId,
      );
      const game =
        restored ??
        createGame(source.gameDate, source.words, source.gameId);

      if (restored === null) {
        saveGame(window.localStorage, game);
      }
      previousAttemptCount.current = game.attempts.length;
      setView({
        status: "ready",
        game,
        mode: payload.mode,
        replayAllowed: payload.replayAllowed,
      });
      if (restored !== null && restored.attempts.length > 0) {
        toast.info("Hemos restaurado tu partida.");
      }
    } catch (error) {
      setView({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo cargar la partida.",
      });
    }
  }, [previousAttemptCount, setCurrentGuess, setView]);

  useEffect(() => {
    void load();
  }, [load]);

  return load;
}
