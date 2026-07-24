# AGENTS.md

## Proyecto

Quordle diario en español construido con Astro, TypeScript, React islands,
shadcn/ui, CSS Modules, GSAP, Supabase y Vercel.

Lee `docs/README.md` antes de realizar cambios relevantes.

## Comandos

- `npm run dev`: servidor local.
- `npm run check`: tipos y diagnóstico de Astro.
- `npm test`: pruebas unitarias.
- `npm run validate:dictionary`: valida `src/data/words.json`.
- `npm run build`: comprobación y build de producción.

## Reglas arquitectónicas

- `src/game/` es independiente de Astro, React, GSAP, Supabase y el DOM, salvo
  `clipboard.ts`, que es una utilidad explícitamente cliente.
- La UI representa estado y despacha acciones; no reimplementa reglas.
- Las soluciones y la fecha del juego proceden de `/api/game/today`.
- En `import.meta.env.DEV`, esa API no debe importar ni consultar Supabase:
  selecciona cuatro palabras del JSON y permite replay tras terminar.
- Una sesión local se conserva durante recargas. Solo la acción explícita
  “Volver a jugar” puede reemplazarla en el mismo día.
- Toda conexión a Supabase es server-only. Nunca importes
  `SUPABASE_SECRET_KEY` desde código cliente.
- El día de juego se calcula exclusivamente mediante `src/lib/game-date.ts`.
- No completes silenciosamente una partida diaria parcial en base de datos.
- No diferencies entre palabras aceptadas y posibles soluciones.
- Conserva estados inmutables y funciones pequeñas, tipadas y testeables.

## shadcn/ui y estilos

- El propietario proporcionará un preset de shadcn/ui más adelante.
- No ejecutes `shadcn init` sin ese preset.
- No sustituyas ni reconfigures `components.json` una vez incorporado.
- Reutiliza componentes de `src/components/ui/` antes de crear equivalentes.
- Usa CSS Modules para la composición propia y conserva los tokens globales
  creados por el preset.
- GSAP debe respetar `prefers-reduced-motion` y no ralentizar el juego.

## Datos y secretos

- El diccionario completo vive en `src/data/words.json`.
- `.env` nunca se versiona; `.env.example` debe reflejar todas las variables.
- `SUPABASE_SECRET_KEY` y `CRON_SECRET` son secretos de servidor.
- Los errores públicos no deben incluir credenciales, consultas ni soluciones.

## Cambios mínimos obligatorios

- Cambios en reglas: actualizar tests y `docs/features/gameplay.md`.
- Cambios de esquema: añadir migración, nunca editar una ya desplegada.
- Cambios de cron/fecha: actualizar tests de CET/CEST y el ADR correspondiente.
- Cambios en el formato compartido: actualizar snapshot/expectativas y
  `docs/features/result-sharing.md`.
- Cambios en modo local/replay: actualizar `docs/features/gameplay.md`, el
  ADR-0003 y las pruebas de sesión local.
