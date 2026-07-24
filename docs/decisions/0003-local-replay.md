# ADR-0003: partidas repetibles solo en local

## Estado

Aceptada.

## Decisión

Desarrollo local tiene una sesión activa por fecha, guardada en Local Storage.
Recargar conserva esa partida. Después de terminar, una acción explícita
“Volver a jugar” puede sustituirla por cuatro palabras nuevas del JSON.

El endpoint local no consulta Supabase. Cada partida recibe un `gameId` único
para impedir que se restaure progreso de otra repetición del mismo día.

## Motivo

Permite probar victorias, derrotas, persistencia y diálogos repetidamente sin
contaminar el historial compartido ni preparar datos en Supabase.

## Consecuencias

- Las soluciones se guardan localmente solo durante desarrollo.
- `POST /api/game/today` existe únicamente en modo DEV.
- Producción mantiene una sola partida diaria y nunca muestra replay.
- La futura UI debe reemplazar la sesión antes de crear el nuevo estado.
