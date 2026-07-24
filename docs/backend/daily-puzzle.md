# Puzzle diario

## Fechas

La fecha visible cambia a las 05:00 de `Europe/Madrid`. El cálculo usa campos
locales producidos por `Intl.DateTimeFormat`; no resta un número fijo de horas,
por lo que funciona en CET, CEST y sus transiciones.

## Cron

Vercel ejecuta `GET /api/cron/create-daily-game` a las `03:00 UTC`. En verano
coincide con las 05:00 de Madrid; en invierno prepara la fecha civil del día a
las 04:00, pero esa partida no se sirve hasta el cambio de las 05:00.

La ruta exige `Authorization: Bearer <CRON_SECRET>` y nunca devuelve palabras.

## Generación

1. Consultar filas de la fecha objetivo.
2. Si hay cuatro válidas, devolver inmediatamente.
3. Si hay entre una y tres, fallar por corrupción.
4. Paginar y cargar todas las palabras usadas.
5. Filtrarlas del diccionario.
6. Barajar y escoger cuatro.
7. Insertar las cuatro en una sola sentencia.

La clave primaria de `word` evita reutilización histórica. La restricción
única `(game_date, position)` garantiza exactamente un ganador por posición.
Si una ejecución pierde una carrera de inserción, relee y acepta el juego
completo del ganador.

## Recuperación

`GET /api/game/today` aplica la misma operación idempotente. Si el cron falló,
la primera visita posterior puede crear la partida. La respuesta no se cachea.

## Rama de desarrollo local

Con `import.meta.env.DEV`, `GET /api/game/today` selecciona cuatro palabras
distintas del JSON y responde:

- `gameId` único con prefijo `local:`
- `gameDate`
- `words`
- `mode: "local"`
- `replayAllowed: true`

No se importa el adaptador de Supabase ni se consulta el historial. El cliente
persiste esta respuesta para reutilizarla al recargar. Tras terminar,
`POST /api/game/today` genera otra partida local. En producción el GET devuelve
`mode: "daily"` y `replayAllowed: false`, y el POST está deshabilitado.

## Fallos operativos

- Diccionario agotado: `503`, sustituir o ampliar el diccionario.
- Partida parcial: `500`, revisar las filas manualmente; no completar al azar.
- Configuración ausente: `503`, revisar variables de Vercel.
