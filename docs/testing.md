# Estrategia de pruebas

`npm test` ejecuta Vitest.

## Cobertura crítica

- Duplicados y prioridad de posiciones exactas.
- Inmutabilidad y transición de estados.
- Tableros resueltos que quedan inactivos.
- Victoria, derrota e intentos inválidos.
- Teclado independiente por tablero.
- Normalización y agotamiento del diccionario.
- Restauración de Local Storage.
- Texto compartido sin palabras.
- Corte de las 05:00 en invierno, verano y ambos cambios de hora.
- Partida existente, creación, carrera y corrupción de filas.
- Selección local sin historial, identidad nueva por replay y sesión estable
  durante recargas.
- Botón de replay visible solo al ganar o perder en modo local.

## Antes de integrar

1. `npm run validate:dictionary`
2. `npm test`
3. `npm run check`
4. `npm run build`

Cuando exista la UI se añadirán pruebas de interacción y una comprobación
manual responsive, de teclado y `prefers-reduced-motion`.
