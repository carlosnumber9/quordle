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
