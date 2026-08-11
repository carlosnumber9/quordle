import { useEffect, useState } from "react";

import { fetchWordDefinition } from "@/services/word-definitions-client";
import {
  loadWordDefinitions,
  saveWordDefinition,
} from "@/services/word-definitions-storage";
import type { WordDefinitionPayload } from "@/types/api";

import type {
  WordDefinitionState,
  WordDefinitionStates,
} from "./definitions";

export function useWordDefinitions(
  gameId: string,
  gameDate: string,
  words: ReadonlyArray<string>,
): WordDefinitionStates {
  const [states, setStates] = useState<WordDefinitionStates>(() =>
    createLoadingStates(words),
  );

  useEffect(() => {
    const controller = new AbortController();
    const cached = loadWordDefinitions(
      window.localStorage,
      gameId,
      gameDate,
      words,
    );
    setStates(createStates(words, cached));

    for (const word of words) {
      if (cached[word] !== undefined) {
        continue;
      }
      void fetchWordDefinition(word, globalThis.fetch, controller.signal)
        .then((payload) => {
          if (payload.readings.length === 0) {
            setWordState(setStates, word, { status: "unavailable" });
            return;
          }
          saveWordDefinition(
            window.localStorage,
            gameId,
            gameDate,
            words,
            payload,
          );
          setWordState(setStates, word, { status: "ready", payload });
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          setWordState(setStates, word, { status: "unavailable" });
        });
    }

    return () => controller.abort();
  }, [gameDate, gameId, words]);

  return states;
}

function createStates(
  words: ReadonlyArray<string>,
  cached: Readonly<Record<string, WordDefinitionPayload>>,
): WordDefinitionStates {
  return Object.fromEntries(
    words.map((word) => [
      word,
      cached[word] === undefined
        ? { status: "loading" }
        : { status: "ready", payload: cached[word] },
    ]),
  ) as Record<string, WordDefinitionState>;
}

function createLoadingStates(
  words: ReadonlyArray<string>,
): WordDefinitionStates {
  return Object.fromEntries(
    words.map((word) => [word, { status: "loading" }]),
  ) as Record<string, WordDefinitionState>;
}

function setWordState(
  setStates: React.Dispatch<React.SetStateAction<WordDefinitionStates>>,
  word: string,
  state: WordDefinitionState,
): void {
  setStates((current) => ({ ...current, [word]: state }));
}
