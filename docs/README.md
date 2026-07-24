# Documentación

Este directorio es el punto de entrada para comprender y mantener Quordle.

## Producto y funcionalidades

- [Producto y alcance](product.md)
- [Reglas y flujo de juego](features/gameplay.md)
- [Compartir resultados](features/result-sharing.md)

## Arquitectura y áreas

- [Arquitectura](architecture.md)
- [Mapa de áreas](areas.md)
- [Prácticas de desarrollo](practices.md)

## Datos y backend

- [Diccionario](data/dictionary.md)
- [Puzzle diario, cron y concurrencia](backend/daily-puzzle.md)

## Operación

- [Desarrollo local](development.md)
- [Estrategia de pruebas](testing.md)
- [Despliegue](deployment.md)

## Decisiones

- [ADR-0001: cambio diario a las 05:00 de Madrid](decisions/0001-madrid-game-day.md)
- [ADR-0002: acceso a Supabase solo desde servidor](decisions/0002-server-only-supabase.md)
- [ADR-0003: partidas repetibles solo en local](decisions/0003-local-replay.md)

La interfaz visual usa el preset de shadcn/ui `b1aJEHx6e` y sus tokens como
único sistema de estilos.
