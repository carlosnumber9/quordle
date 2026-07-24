# Quordle

Un Quordle diario en español creado como regalo. Cada día, a las 05:00 en
`Europe/Madrid`, todas las personas reciben las mismas cuatro palabras y
disponen de nueve intentos.

## Estado

La base técnica, el motor, la persistencia local, la generación diaria, el
formato para compartir resultados y la interfaz de juego están preparados. La
UI usa el preset de shadcn/ui `b1aJEHx6e` como único sistema visual.

En desarrollo local no se conecta a Supabase: se mantiene una partida aleatoria
del JSON y, al terminar, se habilita “Volver a jugar”. Producción conserva una
única partida diaria compartida.

## Primeros pasos

1. Instala las dependencias con `npm install`.
2. Copia `.env.example` a `.env` y añade las credenciales.
3. Sustituye `src/data/words.json` por el diccionario completo.
4. Ejecuta `npm run validate:dictionary`.
5. Aplica `supabase/migrations/0001_create_daily_words.sql`.
6. Inicia el proyecto con `npm run dev`.

La documentación completa se encuentra en [`docs/README.md`](docs/README.md).
