import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type { GameController } from "./definitions";

export function ManualShareDialog({
  manualShareRef,
  manualShareText,
  setManualShareText,
}: Pick<
  GameController,
  "manualShareRef" | "manualShareText" | "setManualShareText"
>) {
  return (
    <Dialog
      onOpenChange={(open) => !open && setManualShareText(null)}
      open={manualShareText !== null}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copia tu resultado</DialogTitle>
          <DialogDescription>
            El navegador no ha permitido copiarlo automáticamente. El texto ya
            está seleccionado para que puedas copiarlo.
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
  );
}
