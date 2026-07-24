# Documentation

This directory is the starting point for understanding and maintaining Quordle.

## Product and features

- [Product and scope](product.md)
- [Gameplay rules and flow](features/gameplay.md)
- [Result sharing](features/result-sharing.md)

## Architecture and areas

- [Architecture](architecture.md)
- [Area map](areas.md)
- [Development practices](practices.md)

## Data and backend

- [Dictionary](data/dictionary.md)
- [Daily puzzle, cron, and concurrency](backend/daily-puzzle.md)

## Operations

- [Local development](development.md)
- [Testing strategy](testing.md)
- [Deployment](deployment.md)

## Decisions

- [ADR-0001: daily rollover at 05:00 Madrid time](decisions/0001-madrid-game-day.md)
- [ADR-0002: server-only Supabase access](decisions/0002-server-only-supabase.md)
- [ADR-0003: replayable games in local development only](decisions/0003-local-replay.md)

The visual interface uses the shadcn/ui preset `b1aJEHx6e` and its tokens as
its sole styling system.
