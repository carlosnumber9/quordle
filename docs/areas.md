# Mapa de áreas

| Área | Punto de entrada | Responsabilidad |
| --- | --- | --- |
| Reglas | `src/game/engine.ts` | Aplicar intentos y finalizar partidas |
| Evaluación | `src/game/evaluator.ts` | Colores Wordle y duplicados |
| Diccionario | `src/game/dictionary.ts` | Normalizar, validar y seleccionar |
| Persistencia | `src/game/persistence.ts` | Guardar y reconstruir progreso |
| Sesión local | `src/game/local-session.ts` | Mantener o reemplazar el puzzle local |
| Cliente local | `src/game/local-game-client.ts` | Cargar sesión y ejecutar replay |
| Replay local | `src/game/replay.ts` | Visibilidad tras victoria/derrota |
| Compartir | `src/game/share.ts` | Texto emoji sin soluciones |
| Fecha | `src/lib/game-date.ts` | Día de juego de Madrid |
| Caso de uso diario | `src/services/daily-game.ts` | Idempotencia y concurrencia |
| Juego local | `src/services/local-game.ts` | Selección aleatoria sin Supabase |
| Supabase | `src/services/*supabase*` | Adaptador server-only |
| HTTP | `src/pages/api/` | Contratos de entrada y salida |
| Base de datos | `supabase/migrations/` | Historial y restricciones |
| Interfaz | `src/components/game/Game.tsx` | Carga, interacción y representación mediante el preset shadcn |

Ante una incidencia, empieza por el punto de entrada del área y su fichero
`*.test.ts` correspondiente.
