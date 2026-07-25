import { RiRestartLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { canReplayGame } from "@/game/replay";

import type { LocalReplayButtonProps } from "./definitions";

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
    <Button
      aria-busy={pending}
      disabled={pending}
      onClick={() => void onReplay()}
      size="lg"
      type="button"
      variant="outline"
    >
      <RiRestartLine data-icon="inline-start" />
      {pending ? "Preparando partida…" : "Volver a jugar"}
    </Button>
  );
}
