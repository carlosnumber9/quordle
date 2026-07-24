import type { GameMode } from "@/types/api";
import type { GameStatus } from "@/game/types";
import { canReplayGame } from "@/game/replay";

interface LocalReplayButtonProps {
  readonly mode: GameMode;
  readonly status: GameStatus;
  readonly pending?: boolean;
  readonly onReplay: () => void | Promise<void>;
}

export function LocalReplayButton({
  mode,
  status,
  pending = false,
  onReplay,
}: LocalReplayButtonProps) {
  if (!canReplayGame(mode, status)) {
    return null;
  }

  return (
    <button
      type="button"
      disabled={pending}
      aria-busy={pending}
      onClick={() => void onReplay()}
    >
      {pending ? "Preparando partida…" : "Volver a jugar"}
    </button>
  );
}
