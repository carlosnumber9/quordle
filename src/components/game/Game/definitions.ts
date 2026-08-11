import type { RefObject } from "react";

import type { GameState, SubmitGuessError } from "@/game/definitions";
import type { GameMode } from "@/types/api";

export interface GameProps {
  readonly siteUrl: string;
}

export interface ReadyGame {
  readonly game: GameState;
  readonly mode: GameMode;
  readonly replayAllowed: boolean;
}

export type GameView =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string }
  | ({ readonly status: "ready" } & ReadyGame);

export interface GameController {
  readonly currentGuess: string;
  readonly introFinished: boolean;
  readonly load: () => Promise<void>;
  readonly manualShareRef: RefObject<HTMLTextAreaElement | null>;
  readonly manualShareText: string | null;
  readonly replaceCurrentGuess: (value: string) => void;
  readonly replay: () => Promise<void>;
  readonly replaying: boolean;
  readonly resultOpen: boolean;
  readonly rootRef: RefObject<HTMLElement | null>;
  readonly setManualShareText: (text: string | null) => void;
  readonly setResultOpen: (open: boolean) => void;
  readonly share: () => Promise<void>;
  readonly submitCurrentGuess: () => void;
  readonly titleRef: RefObject<HTMLHeadingElement | null>;
  readonly view: GameView;
}

export interface ReadyGameProps {
  readonly controller: GameController;
  readonly view: ReadyGame;
}

export interface GameErrorProps {
  readonly load: () => Promise<void>;
  readonly view: Extract<GameView, { status: "error" }>;
}

export const ERROR_MESSAGES: Readonly<Record<SubmitGuessError, string>> = {
  "game-finished": "La partida ya ha terminado.",
  "invalid-length": "La palabra debe tener cinco letras.",
  "invalid-characters": "Usa únicamente letras de la A a la Z y la Ñ.",
  "unknown-word": "Esa palabra no está en el diccionario.",
};
