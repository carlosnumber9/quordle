# Despliegue

## Supabase

1. Crear el proyecto.
2. Ejecutar `supabase/migrations/0001_create_daily_words.sql`.
3. Crear una secret key dedicada para el backend.
4. Confirmar que `anon` y `authenticated` no tienen acceso a `daily_words`.

## Vercel

1. Conectar el repositorio.
2. Configurar las cuatro variables de `.env.example`.
3. Desplegar con el adaptador oficial de Astro.
4. Verificar `/api/health`.
5. Confirmar que Vercel ha registrado el cron de `vercel.json`.
6. Invocar el cron manualmente con el Bearer token y comprobar que una segunda
   llamada devuelve `created: false`.

## Antes de producción

- Reemplazar el diccionario de muestra.
- Establecer `PUBLIC_SITE_URL` al dominio definitivo.
- Incorporar el preset de shadcn y completar la interfaz.
- Ejecutar la batería de validación descrita en `testing.md`.

No se realiza despliegue automático desde este repositorio durante la fase
previa a la interfaz.
