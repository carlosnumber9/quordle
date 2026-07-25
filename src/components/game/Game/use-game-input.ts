import { useCallback, useEffect, type Dispatch } from "react";
import { toast } from "sonner";

import { dictionarySet, normalizeWord } from "@/game/dictionary";
import { submitGuess } from "@/game/engine";
import { saveGame } from "@/game/persistence";
import { WORD_LENGTH } from "@/game/definitions";

import { ERROR_MESSAGES, type GameView } from "./definitions";

export function useGameInput(
  view: GameView,
  currentGuess: string,
  setView: Dispatch<React.SetStateAction<GameView>>,
  setCurrentGuess: Dispatch<React.SetStateAction<string>>,
) {
  const submitCurrentGuess = useCallback(() => {
    if (view.status !== "ready") {
      return;
    }
    const result = submitGuess(view.game, currentGuess, dictionarySet);
    if (!result.accepted) {
      toast.error(ERROR_MESSAGES[result.error]);
      return;
    }

    saveGame(window.localStorage, result.state);
    setView({ ...view, game: result.state });
    setCurrentGuess("");
    if (result.state.status === "won") {
      toast.success("¡Has resuelto los cuatro tableros!");
    } else if (result.state.status === "lost") {
      toast.error("La partida ha terminado.");
    }
  }, [currentGuess, setCurrentGuess, setView, view]);

  const addLetter = useCallback((letter: string) => {
    if (view.status !== "ready" || view.game.status !== "playing") {
      return;
    }
    setCurrentGuess((guess) =>
      Array.from(guess).length >= WORD_LENGTH ? guess : `${guess}${letter}`,
    );
  }, [setCurrentGuess, view]);

  const removeLetter = useCallback(() => {
    setCurrentGuess((guess) => Array.from(guess).slice(0, -1).join(""));
  }, [setCurrentGuess]);
  const status = view.status === "ready" ? view.game.status : null;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        status !== "playing" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }
      if (event.key === "Enter" || event.key === "Backspace") {
        event.preventDefault();
        event.key === "Enter" ? submitCurrentGuess() : removeLetter();
        return;
      }
      const letter = normalizeWord(event.key);
      if (Array.from(letter).length === 1 && /^[A-ZÑ]$/u.test(letter)) {
        addLetter(letter);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [addLetter, removeLetter, status, submitCurrentGuess]);

  return { addLetter, removeLetter, submitCurrentGuess };
}
