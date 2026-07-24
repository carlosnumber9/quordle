import {
  RiAlertLine,
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
import { cn } from "@/lib/utils";
import {
  BOARD_COUNT,
  WORD_LENGTH,
  type GameState,
  type SubmitGuessError,
} from "@/game/types";
import type { GameMode, GamePayload } from "@/types/api";

import { Board } from "./Board";
import { shouldShowSolutionWatermark } from "./local-development";
import { Keyboard } from "./Keyboard";
import { LocalReplayButton } from "./LocalReplayButton";
import styles from "./Game.module.css";

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
  const [resultOpen, setResultOpen] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
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
  const gameId = game?.gameId ?? null;
  const gameStatus = game?.status ?? null;

  useEffect(() => {
    setResultOpen(
      introFinished && gameStatus !== null && gameStatus !== "playing",
    );
  }, [gameId, gameStatus, introFinished]);

  useLayoutEffect(() => {
    if (view.status !== "ready") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroFinished(true);
      return;
    }

    const title = titleRef.current;
    const root = rootRef.current;
    if (title === null || root === null) {
      setIntroFinished(true);
      return;
    }

    const bounds = title.getBoundingClientRect();
    const availableWidth = window.innerWidth - 32;
    const initialScale = Math.max(
      1.1,
      Math.min(2.25, availableWidth / bounds.width),
    );
    const startX = window.innerWidth / 2 - (bounds.left + bounds.width / 2);
    const startY = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
    const revealElements = root.querySelectorAll("[data-intro-reveal]");

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => setIntroFinished(true),
      });

      timeline
        .set(revealElements, { autoAlpha: 0 })
        .set(title, {
          autoAlpha: 0,
          scale: initialScale,
          transformOrigin: "center center",
          x: startX,
          y: startY,
        })
        .to(title, {
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(
          title,
          {
            duration: 0.75,
            ease: "power3.inOut",
            scale: 1,
            x: 0,
            y: 0,
          },
          "+=1",
        )
        .to(
          revealElements,
          {
            autoAlpha: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.25",
        );
    }, root);

    return () => context.revert();
  }, [view.status]);

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
      const correctTiles =
        rootRef.current?.querySelectorAll(
          `[data-attempt="${rowIndex}"] [data-letter-status="correct"]`,
        ) ?? [];
      const presentTiles =
        rootRef.current?.querySelectorAll(
          `[data-attempt="${rowIndex}"] [data-letter-status="present"]`,
        ) ?? [];

      gsap.fromTo(
        correctTiles,
        { scale: 1 },
        {
          duration: 0.16,
          ease: "power2.out",
          repeat: 1,
          scale: 1.16,
          stagger: 0.04,
          yoyo: true,
        },
      );
      gsap.fromTo(
        presentTiles,
        {
          rotationY: 180,
          transformPerspective: 420,
        },
        {
          duration: 0.72,
          ease: "elastic.out(1, 0.48)",
          rotationY: 0,
          stagger: 0.04,
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
      className={cn(
        styles.game,
        "mx-auto flex min-h-svh w-full max-w-4xl flex-col gap-[var(--game-gap)] px-2 py-2 sm:px-4 sm:py-3",
        view.status === "ready" &&
          !introFinished &&
          styles.introRunning,
        view.status === "ready" &&
          view.game.status === "playing" &&
          styles.playing,
      )}
      ref={rootRef}
    >
      <Toaster position="top-center" />
      <header className="flex shrink-0 items-center justify-between gap-4">
        <h1
          className={cn(
            "font-heading text-2xl font-semibold tracking-tight sm:text-3xl",
            view.status === "loading" && styles.titleWaiting,
            view.status === "ready" &&
              !introFinished &&
              styles.introTitle,
          )}
          ref={titleRef}
        >
          Quordle para Mamá
        </h1>
        <div data-intro-reveal>
          <HelpDialog />
        </div>
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
          <section
            aria-label="Tableros de juego"
            className={styles.boards}
            data-intro-reveal
          >
            {Array.from({ length: 2 }, (_, columnIndex) => (
              <div className={styles.boardColumn} key={columnIndex}>
                {[columnIndex, columnIndex + 2].map((boardIndex) => (
                  <Board
                    boardIndex={boardIndex}
                    currentGuess={currentGuess}
                    key={boardIndex}
                    showSolutionWatermark={shouldShowSolutionWatermark(
                      import.meta.env.DEV,
                      view.mode,
                    )}
                    state={view.game}
                  />
                ))}
              </div>
            ))}
          </section>

          {view.game.status === "playing" ? (
            <section className={styles.keyboard} data-intro-reveal>
              <Keyboard
                disabled={view.game.status !== "playing"}
                keyboardState={keyboardState}
                onBackspace={removeLetter}
                onEnter={submitCurrentGuess}
                onLetter={addLetter}
              />
            </section>
          ) : null}

          {view.game.status !== "playing" ? (
            <ResultDialog
              game={view.game}
              mode={view.mode}
              onOpenChange={setResultOpen}
              onReplay={replay}
              onShare={share}
              open={resultOpen}
              replaying={replaying}
            />
          ) : null}
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

function ResultDialog({
  game,
  mode,
  onOpenChange,
  onReplay,
  onShare,
  open,
  replaying,
}: {
  readonly game: GameState;
  readonly mode: GameMode;
  readonly onOpenChange: (open: boolean) => void;
  readonly onReplay: () => void | Promise<void>;
  readonly onShare: () => void | Promise<void>;
  readonly open: boolean;
  readonly replaying: boolean;
}) {
  const won = game.status === "won";
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (content === null || !open) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(content, { clearProps: "opacity,scale" });
      return;
    }

    const context = gsap.context(() => {
      if (won) {
        const timeline = gsap.timeline();
        timeline
          .set(content, { opacity: 0, scale: 0 })
          .to(content, {
            opacity: 1,
            duration: 0.18,
            ease: "power1.out",
          })
          .to(
            content,
            {
              duration: 0.72,
              ease: "elastic.out(1, 0.45)",
              scale: 1,
            },
            "<",
          );
        return;
      }

      gsap.fromTo(
        content,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.1,
          ease: "power1.out",
        },
      );
    }, content);

    return () => context.revert();
  }, [open, won]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className={cn(styles.resultDialog, "gap-5 text-center sm:max-w-lg")}
        ref={contentRef}
      >
        <DialogHeader className="items-center text-center">
          <Badge className="mb-2" variant={won ? "default" : "secondary"}>
            <RiTrophyLine data-icon="inline-start" />
            {won ? "Victoria" : "Completada"}
          </Badge>
          <DialogTitle className="text-2xl">
            {won ? "¡Cuatro de cuatro!" : "Partida terminada"}
          </DialogTitle>
          <DialogDescription>
            {won
              ? `Has resuelto el reto en ${game.attempts.length} intentos.`
              : "Mañana tendrás cuatro palabras nuevas."}
          </DialogDescription>
        </DialogHeader>

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

        <Separator />
        <DialogFooter className="flex-col gap-2 sm:justify-center">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    present: "border-transparent bg-sky-300 text-sky-950",
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
    <div
      aria-label="Cargando partida"
      className="grid flex-1 grid-cols-2 place-content-center place-items-center gap-1"
    >
      {Array.from({ length: BOARD_COUNT }, (_, boardIndex) => (
        <Card
          className="gap-0 rounded-xl py-1 [--card-spacing:--spacing(1)]"
          key={boardIndex}
          size="sm"
        >
          <CardContent className="grid gap-px">
            {Array.from({ length: 9 }, (_, rowIndex) => (
              <div className="grid grid-cols-5 gap-px" key={rowIndex}>
                {Array.from({ length: WORD_LENGTH }, (_, tileIndex) => (
                  <Skeleton
                    className={cn(styles.tile, "rounded-md")}
                    key={tileIndex}
                  />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
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
