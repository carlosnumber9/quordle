# Desarrollo local

## Requisitos

- Node.js 22.12 o posterior.
- Un proyecto Supabase.
- Variables basadas en `.env.example`.

## Preparación

1. `npm install`
2. Crear `.env`.
3. `npm run db:link` para enlazar el proyecto indicado por `SUPABASE_URL`.
4. `npm run db:migrate` para aplicar migraciones pendientes.
5. Sustituir y validar el diccionario.
6. `npm run dev`

Los agentes no deben iniciar el servidor de desarrollo, ni abrir la aplicación
en un navegador local, salvo que el propietario lo solicite explícitamente.

La primera vez, autentica la CLI con `npx supabase login`. `db:status` compara
el historial local y remoto sin modificar la base de datos. `db:verify`
comprueba la conexión Data API y que `daily_words` rechaza la clave pública.

## Variables

| Variable | Exposición | Uso |
| --- | --- | --- |
| `SUPABASE_URL` | Servidor | Data API de Supabase |
| `SUPABASE_SECRET_KEY` | Secreto | Lectura/escritura administrativa |
| `SUPABASE_PUBLISHABLE_KEY` | Servidor | Renovación de sesiones en middleware |
| `CRON_SECRET` | Secreto | Autenticación de Vercel Cron |
| `PUBLIC_SITE_URL` | Pública | Enlace del resultado compartido |

El proyecto puede compilar sin valores reales para facilitar la preparación,
pero las API de juego responderán como no disponibles.

Durante `npm run dev`, las credenciales de Supabase no son necesarias para
jugar. La API selecciona cuatro palabras del JSON y el navegador mantiene una
sesión local por fecha. Al terminar se puede generar otra con “Volver a jugar”.
Este comportamiento se elimina del build de producción.

## shadcn/ui

El proyecto usa el preset `b1aJEHx6e` con estilo Luma, base zinc, tema lime,
fuente Figtree, radio grande e iconos Remix. `components.json` es la fuente de
configuración y no debe reconfigurarse manualmente.

Antes de añadir un componente propio, reutiliza los disponibles en
`src/components/ui/`. La composición puede usar utilidades Tailwind basadas en
los tokens del preset, pero no debe introducir colores, variables globales ni
hojas de estilo propias.
