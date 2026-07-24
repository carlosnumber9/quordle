# Prácticas de desarrollo

## TypeScript

- Modo estricto y `noUncheckedIndexedAccess`.
- Tipos `readonly` en contratos de dominio.
- Resultados discriminados para errores esperables.
- Los errores de infraestructura se capturan en el límite HTTP.

## Diseño del código

- Separación explícita entre dominio, infraestructura y presentación.
- Inyección del repositorio y del generador aleatorio para probar sin red.
- Sin abstracciones que solo tengan una implementación salvo que delimiten una
  frontera externa, como `DailyGameRepository`.
- Estados derivados, como el teclado, no se persisten.

## Seguridad

- Menor privilegio en Supabase y RLS habilitado.
- Secret keys solo en módulos `.server.ts`.
- Cron autenticado mediante Bearer token.
- Mensajes públicos genéricos y detalles únicamente en logs de servidor.

## Interfaz

- Estado semántico además de color.
- Navegación táctil y teclado físico.
- Foco visible y regiones `aria-live`.
- `prefers-reduced-motion` desactiva movimientos no esenciales.
- Las animaciones se limpian al desmontar componentes.
