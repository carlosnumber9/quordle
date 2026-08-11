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
            En ordenador, escribe directamente con el teclado físico. En móvil,
            toca una vez cualquiera de los cuatro tableros para abrir el teclado
            nativo. Usa Intro o la tecla de envío para probar la palabra.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
