import { RiQuestionLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { Legend } from "./Legend";

export function HelpDialog() {
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
          <p className="text-sm text-muted-foreground">
            Cada intento aparece en los cuatro tableros. El verde marca una
            letra en su posición, el azul una letra en otra posición y el gris
            una letra ausente de esa palabra.
          </p>
          <div className="grid gap-2">
            <Legend variant="correct">Letra y posición correctas</Legend>
            <Legend variant="present">Letra correcta en otra posición</Legend>
            <Legend variant="absent">La letra no está en esa palabra</Legend>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Usa el teclado en pantalla o el teclado físico. Sin ampliar ningún
            tablero, solo se apagan las letras descartadas en las cuatro
            palabras.
          </p>
          <p className="text-sm text-muted-foreground">
            Haz doble clic o doble toque sobre un tablero para ampliarlo. El
            teclado mostrará entonces solo sus pistas verdes, azules y grises.
          </p>
          <p className="text-sm text-muted-foreground">
            Para volver a los cuatro tableros, haz doble clic o doble toque
            sobre el tablero ampliado, pulsa el aspa de cierre o usa Escape.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
