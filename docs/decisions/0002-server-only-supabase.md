# ADR-0002: Supabase solo desde servidor

## Estado

Aceptada.

## Decisión

El navegador llama a Astro API Routes y no crea clientes Supabase. Los módulos
`.server.ts` crean el cliente administrativo con secret key. El middleware
Astro puede crear por petición un cliente SSR con publishable key para renovar
cookies de Supabase Auth, sin exponer ese cliente al navegador.

## Motivo

No hay necesidad de acceso directo a datos desde el cliente. Mantener la tabla
detrás del servidor reduce políticas públicas, evita escrituras anónimas y
protege la clave administrativa. El cliente SSR de sesiones no se reutiliza
entre peticiones y no concede acceso administrativo.

## Consecuencia

La respuesta de `/api/game/today` contiene las cuatro soluciones necesarias
para jugar y puede inspeccionarse desde el navegador. Esto es inherente a un
juego evaluado localmente y se acepta para el alcance del proyecto.
