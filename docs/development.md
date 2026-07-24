# Desarrollo local

## Requisitos

- Node.js 22.12 o posterior.
- Un proyecto Supabase.
- Variables basadas en `.env.example`.

## Preparación

1. `npm install`
2. Crear `.env`.
3. Aplicar la migración SQL en Supabase.
4. Sustituir y validar el diccionario.
5. `npm run dev`

## Variables

| Variable | Exposición | Uso |
| --- | --- | --- |
| `SUPABASE_URL` | Servidor | Data API de Supabase |
| `SUPABASE_SECRET_KEY` | Secreto | Lectura/escritura administrativa |
| `CRON_SECRET` | Secreto | Autenticación de Vercel Cron |
| `PUBLIC_SITE_URL` | Pública | Enlace del resultado compartido |

El proyecto puede compilar sin valores reales para facilitar la preparación,
pero las API de juego responderán como no disponibles.

Durante `npm run dev`, las credenciales de Supabase no son necesarias para
jugar. La API selecciona cuatro palabras del JSON y el navegador mantiene una
sesión local por fecha. Al terminar se puede generar otra con “Volver a jugar”.
Este comportamiento se elimina del build de producción.

## shadcn/ui

No inicializar hasta recibir el preset del propietario. Cuando llegue, aplicar
el preset al proyecto existente y revisar el diff antes de construir la isla
React.
