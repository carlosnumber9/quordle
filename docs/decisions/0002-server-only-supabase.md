# ADR-0002: Supabase solo desde servidor

## Estado

Aceptada.

## Decisión

El navegador llama a Astro API Routes. Solo módulos `.server.ts` crean un
cliente Supabase con secret key.

## Motivo

No hay autenticación ni necesidad de acceso directo desde el cliente. Mantener
la tabla detrás del servidor reduce políticas públicas, evita escrituras
anónimas y protege la clave administrativa.

## Consecuencia

La respuesta de `/api/game/today` contiene las cuatro soluciones necesarias
para jugar y puede inspeccionarse desde el navegador. Esto es inherente a un
juego evaluado localmente y se acepta para el alcance del proyecto.
