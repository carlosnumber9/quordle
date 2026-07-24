import {
  RiAlertLine,
  RiCalendarLine,
  RiQuestionLine,
  RiShareLine,
  RiTrophyLine,
} from "@remixicon/react";
import { gsap } from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import {
  dictionarySet,
  isValidWordShape,
  normalizeWord,
} from "@/game/dictionary";
import { copyTextToClipboard } from "@/game/clipboard";
import { createGame, submitGuess } from "@/game/engine";
import { deriveKeyboardState } from "@/game/keyboard";
import {
  getOrCreateLocalSession,
  replayLocalGame,
} from "@/game/local-game-client";
import { loadGame, saveGame } from "@/game/persistence";
import { createShareText } from "@/game/share";
import {
  BOARD_COUNT,
  WORD_LENGTH,
  type GameState,
  type SubmitGuessError,
} from "@/game/types";
import type { GameMode, GamePayload } from "@/types/api";

import { Board } from "./Board";
import { Keyboard } from "./Keyboard";
import { LocalReplayButton } from "./LocalReplayButton";

interface GameProps {
  readonly siteUrl: string;
}

type ReadyGame = {
  readonly game: GameState;
  readonly mode: GameMode;
  readonly replayAllowed: boolean;
};

type GameView =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string }
  | ({ readonly status: "ready" } & ReadyGame);

const ERROR_MESSAGES: Readonly<Record<SubmitGuessError, string>> = {
  "game-finished": "La partida ya ha terminado.",
  "invalid-length": "La palabra debe tener cinco letras.",
  "invalid-characters": "Usa únicamente letras de la A a la Z y la Ñ.",
  "unknown-word": "Esa palabra no está en el diccionario.",
};

export function Game({ siteUrl }: GameProps) {
  const [view, setView] = useState<GameView>({ status: "loading" });
  const [currentGuess, setCurrentGuess] = useState("");
  const [manualShareText, setManualShareText] = useState<string | null>(null);
  const [replaying, setReplaying] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const manualShareRef = useRef<HTMLTextAreaElement>(null);
  const previousAttemptCount = useRef(0);

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
      const gameId = source.gameId;
      const gameDate = source.gameDate;
      const words = source.words;
      const restored = loadGame(
        window.localStorage,
        gameDate,
        words,
        dictionarySet,
        gameId,
      );
      const game = restored ?? createGame(gameDate, words, gameId);

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
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const game = view.status === "ready" ? view.game : null;
  const attemptCount = game?.attempts.length ?? 0;

  useLayoutEffect(() => {
    if (
      game === null ||
      attemptCount <= previousAttemptCount.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      previousAttemptCount.current = attemptCount;
      return;
    }

    const rowIndex = attemptCount - 1;
    const context = gsap.context(() => {
      const tiles =
        rootRef.current?.querySelectorAll(`[data-attempt="${rowIndex}"] > *`) ??
        [];
      gsap.fromTo(
        tiles,
        { opacity: 0.6, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.24,
          ease: "power2.out",
          stagger: 0.02,
        },
      );
    }, rootRef);

    previousAttemptCount.current = attemptCount;
    return () => context.revert();
  }, [attemptCount, game]);

  useEffect(() => {
    if (manualShareText !== null) {
      manualShareRef.current?.focus();
      manualShareRef.current?.select();
    }
  }, [manualShareText]);

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
  }, [currentGuess, view]);

  const addLetter = useCallback(
    (letter: string) => {
      if (view.status !== "ready" || view.game.status !== "playing") {
        return;
      }

      setCurrentGuess((guess) =>
        Array.from(guess).length >= WORD_LENGTH ? guess : `${guess}${letter}`,
      );
    },
    [view],
  );

  const removeLetter = useCallback(() => {
    setCurrentGuess((guess) => Array.from(guess).slice(0, -1).join(""));
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        submitCurrentGuess();
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        removeLetter();
        return;
      }

      const letter = normalizeWord(event.key);
      if (Array.from(letter).length === 1 && /^[A-ZÑ]$/u.test(letter)) {
        addLetter(letter);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [addLetter, removeLetter, submitCurrentGuess]);

  const share = useCallback(async () => {
    if (view.status !== "ready" || view.game.status === "playing") {
      return;
    }

    const text = createShareText(view.game, siteUrl);
    const copied = await copyTextToClipboard(text);
    if (copied) {
      toast.success("Resultado copiado.");
      return;
    }

    setManualShareText(text);
  }, [siteUrl, view]);

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
  }, [view]);

  const keyboardState = useMemo(
    () => (game === null ? [] : deriveKeyboardState(game)),
    [game],
  );

  return (
    <main
      className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:py-10"
      ref={rootRef}
    >
      <Toaster position="top-center" />
      <header className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Quordle
            </h1>
            <Badge variant="secondary">En español</Badge>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">
            Cuatro palabras. Nueve intentos. Un reto cada día.
          </p>
        </div>
        <HelpDialog />
      </header>

      {view.status === "loading" ? <GameSkeleton /> : null}

      {view.status === "error" ? (
        <Card>
          <CardHeader>
            <CardTitle>No hemos podido cargar la partida</CardTitle>
            <CardDescription>
              Puedes volver a intentarlo sin perder tu progreso guardado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <RiAlertLine />
              <AlertTitle>Servicio no disponible</AlertTitle>
              <AlertDescription>{view.message}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => void load()} type="button">
              Volver a intentar
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      {view.status === "ready" ? (
        <>
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                <RiCalendarLine data-icon="inline-start" />
                {formatGameDate(view.game.gameDate)}
              </Badge>
              <Badge variant="secondary">
                Intento {Math.min(view.game.attempts.length + 1, 9)} de 9
              </Badge>
              {view.mode === "local" ? (
                <Badge variant="outline">Modo local</Badge>
              ) : null}
            </div>
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {statusMessage(view.game)}
            </p>
          </section>

          <section
            aria-label="Tableros de juego"
            className="grid grid-cols-2 gap-3 lg:gap-5"
          >
            {Array.from({ length: BOARD_COUNT }, (_, boardIndex) => (
              <Board
                boardIndex={boardIndex}
                currentGuess={currentGuess}
                key={boardIndex}
                state={view.game}
              />
            ))}
          </section>

          {view.game.status === "playing" ? (
            <Card>
              <CardHeader>
                <CardTitle>Tu palabra</CardTitle>
                <CardDescription>
                  Escribe con el teclado o pulsa las letras.
                </CardDescription>
                <CardAction>
                  <Badge variant="outline">
                    {Array.from(currentGuess).length}/{WORD_LENGTH}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <Keyboard
                  disabled={view.game.status !== "playing"}
                  keyboardState={keyboardState}
                  onBackspace={removeLetter}
                  onEnter={submitCurrentGuess}
                  onLetter={addLetter}
                />
              </CardContent>
            </Card>
          ) : (
            <ResultCard
              game={view.game}
              mode={view.mode}
              onReplay={replay}
              onShare={share}
              replaying={replaying}
            />
          )}
        </>
      ) : null}

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setManualShareText(null);
          }
        }}
        open={manualShareText !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copia tu resultado</DialogTitle>
            <DialogDescription>
              El navegador no ha permitido copiarlo automáticamente. El texto
              ya está seleccionado para que puedas copiarlo.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            className="min-h-64 font-mono"
            onFocus={(event) => event.currentTarget.select()}
            readOnly
            ref={manualShareRef}
            value={manualShareText ?? ""}
          />
          <DialogFooter>
            <Button onClick={() => setManualShareText(null)} type="button">
              Listo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function ResultCard({
  game,
  mode,
  onReplay,
  onShare,
  replaying,
}: {
  readonly game: GameState;
  readonly mode: GameMode;
  readonly onReplay: () => void | Promise<void>;
  readonly onShare: () => void | Promise<void>;
  readonly replaying: boolean;
}) {
  const won = game.status === "won";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{won ? "¡Cuatro de cuatro!" : "Partida terminada"}</CardTitle>
        <CardDescription>
          {won
            ? `Has resuelto el reto en ${game.attempts.length} intentos.`
            : "Mañana tendrás cuatro palabras nuevas."}
        </CardDescription>
        <CardAction>
          <Badge variant={won ? "default" : "secondary"}>
            <RiTrophyLine data-icon="inline-start" />
            {won ? "Victoria" : "Completada"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {game.boards.map((board, index) => (
            <div
              className="rounded-2xl bg-muted p-3 text-center"
              key={index}
            >
              <p className="text-xs text-muted-foreground">
                Tablero {index + 1}
              </p>
              <p className="font-heading text-lg font-semibold">
                {board.solvedAtAttempt ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-wrap gap-2">
        <Button onClick={() => void onShare()} size="lg" type="button">
          <RiShareLine data-icon="inline-start" />
          Compartir resultado
        </Button>
        <LocalReplayButton
          mode={mode}
          onReplay={onReplay}
          pending={replaying}
          status={game.status}
        />
      </CardFooter>
    </Card>
  );
}

function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button aria-label="Cómo jugar" size="icon-lg" variant="outline" />
        }
      >
        <RiQuestionLine />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cómo jugar</DialogTitle>
          <DialogDescription>
            Cada palabra que envíes se prueba a la vez en los cuatro tableros.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <p>
            Tienes nueve intentos para descubrir cuatro palabras de cinco
            letras.
          </p>
          <div className="grid gap-2">
            <Legend variant="correct">Letra y posición correctas</Legend>
            <Legend variant="present">Letra correcta en otra posición</Legend>
            <Legend variant="absent">La letra no está en esa palabra</Legend>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Las cuatro marcas bajo cada tecla resumen su pista en cada tablero.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Legend({
  children,
  variant,
}: {
  readonly children: string;
  readonly variant: "correct" | "present" | "absent";
}) {
  const classes = {
    correct: "border-primary bg-primary text-primary-foreground",
    present: "border-ring bg-secondary text-secondary-foreground",
    absent: "border-muted bg-muted text-muted-foreground",
  } as const;

  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`flex size-9 items-center justify-center rounded-xl border font-semibold ${classes[variant]}`}
      >
        A
      </span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

function GameSkeleton() {
  return (
    <div aria-label="Cargando partida" className="grid gap-6">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:gap-5">
        {Array.from({ length: BOARD_COUNT }, (_, boardIndex) => (
          <Card key={boardIndex} size="sm">
            <CardHeader>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="grid gap-1.5">
              {Array.from({ length: 9 }, (_, rowIndex) => (
                <div className="grid grid-cols-5 gap-1.5" key={rowIndex}>
                  {Array.from({ length: WORD_LENGTH }, (_, tileIndex) => (
                    <Skeleton
                      className="aspect-square rounded-xl"
                      key={tileIndex}
                    />
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function requestGame(): Promise<GamePayload> {
  const response = await fetch("/api/game/today", { method: "GET" });
  const value: unknown = await response.json();

  if (!response.ok) {
    throw new Error(publicApiError(value));
  }

  if (!isGamePayload(value)) {
    throw new TypeError("La API no devolvió una partida válida.");
  }

  return value;
}

function isGamePayload(value: unknown): value is GamePayload {
  if (
    typeof value !== "object" ||
    value === null ||
    !("gameId" in value) ||
    typeof value.gameId !== "string" ||
    !("gameDate" in value) ||
    typeof value.gameDate !== "string" ||
    !("words" in value) ||
    !Array.isArray(value.words) ||
    value.words.length !== BOARD_COUNT ||
    !value.words.every(
      (word) =>
        typeof word === "string" &&
        word === normalizeWord(word) &&
        isValidWordShape(word),
    ) ||
    !("mode" in value) ||
    (value.mode !== "daily" && value.mode !== "local") ||
    !("replayAllowed" in value) ||
    typeof value.replayAllowed !== "boolean"
  ) {
    return false;
  }

  return new Set(value.words).size === BOARD_COUNT;
}

function publicApiError(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "object" &&
    value.error !== null &&
    "message" in value.error &&
    typeof value.error.message === "string"
  ) {
    return value.error.message;
  }

  return "No se pudo cargar la partida.";
}

function formatGameDate(gameDate: string): string {
  const date = new Date(`${gameDate}T12:00:00`);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
  }).format(date);
}

function statusMessage(game: GameState): string {
  if (game.status === "won") {
    return "Has resuelto los cuatro tableros.";
  }

  if (game.status === "lost") {
    return "Has completado los nueve intentos.";
  }

  const solved = game.boards.filter(
    (board) => board.solvedAtAttempt !== null,
  ).length;
  return solved === 0
    ? "Los cuatro tableros siguen en juego."
    : `${solved} de ${BOARD_COUNT} tableros resueltos.`;
}
