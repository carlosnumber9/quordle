import { RiAlertLine } from "@remixicon/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { GameErrorProps } from "./definitions";

export function GameError({
  load,
  view,
}: GameErrorProps) {
  return (
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
  );
}
