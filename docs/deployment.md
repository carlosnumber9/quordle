# Despliegue

## Supabase

1. Crear el proyecto.
2. Autenticar la CLI y ejecutar `npm run db:link`.
3. Aplicar `supabase/migrations/0001_create_daily_words.sql` mediante
   `npm run db:migrate`.
4. Crear una secret key dedicada para el backend.
5. Confirmar que `anon` y `authenticated` no tienen acceso a `daily_words`.

La comprobación automatizada `npm run db:verify` debe terminar correctamente.
Para que el cron funcione, `SUPABASE_SECRET_KEY` debe configurarse en Vercel
con una secret key de backend; no se obtiene ni versiona desde la CLI.

## Vercel

1. Conectar el repositorio.
2. Configurar las cuatro variables de `.env.example`.
3. Mantener Node.js 24 alineado entre `.nvmrc` y `engines.node`. Vercel solo
   garantiza la major configurada (`24.x`) y actualiza minor y patch
   automáticamente.
4. Instalar con `npm ci` usando el `package-lock.json` versionado. Si una
   instalación de Vercel falla dentro de npm, repetir el primer despliegue sin
   reutilizar Build Cache.
5. Desplegar con el adaptador oficial de Astro.
6. Verificar `/api/health`.
7. Confirmar que Vercel ha registrado el cron de `vercel.json`.
8. Invocar el cron manualmente con el Bearer token y comprobar que una segunda
   llamada devuelve `created: false`.

## Antes de producción

- Reemplazar el diccionario de muestra.
- Establecer `PUBLIC_SITE_URL` al dominio definitivo.
- Incorporar el preset de shadcn y completar la interfaz.
- Ejecutar la batería de validación descrita en `testing.md`.

No se realiza despliegue automático desde este repositorio durante la fase
previa a la interfaz.
