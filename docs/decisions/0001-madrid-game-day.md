# ADR-0001: día de juego de Madrid

## Estado

Aceptada.

## Decisión

La fecha cambia a las 05:00 de `Europe/Madrid`. Vercel Cron se programa una vez
al día a las 03:00 UTC y genera la fecha civil actual de Madrid. La API pública
calcula por separado la fecha de juego vigente.

## Motivo

Vercel usa UTC y una sola expresión no puede seguir CET/CEST. Ejecutar a las
03:00 UTC prepara el juego a tiempo en ambas estaciones sin requerir dos
ejecuciones diarias. La visibilidad sigue cambiando exactamente a las 05:00.

## Consecuencia

En invierno la fila del nuevo día existe una hora antes de ser servida. Esto no
afecta al juego y simplifica la operación en planes con un cron diario.
