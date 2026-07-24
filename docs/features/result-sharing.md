# Compartir resultados

Solo una partida terminada puede compartirse.

## Contenido

- Nombre y fecha del juego.
- Resultado por tablero: emoji numérico del intento de resolución o `❌`.
- Cuatro cuadrículas colocadas en dos filas y dos columnas.
- `🟩`, `🟨` y `⬛` para evaluaciones.
- `⬜` para intentos posteriores a la resolución de un tablero.
- URL canónica sin slash final.

No se incluyen letras, palabras ni soluciones.

## Portapapeles

La futura UI llamará `createShareText` y luego `copyTextToClipboard`. Si la
Clipboard API no está disponible o el navegador la bloquea, el helper devuelve
`false`. El diálogo deberá entonces mostrar el texto seleccionado para que la
persona pueda copiarlo manualmente.

La URL procede de `PUBLIC_SITE_URL`; durante desarrollo puede usarse el origen
actual del navegador.
