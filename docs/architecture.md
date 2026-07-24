# Arquitectura

## Capas

1. `src/game/`: dominio puro. Normaliza, evalúa y transforma estados.
2. `src/lib/`: utilidades compartidas sin infraestructura.
3. `src/services/`: casos de uso diarios y adaptadores de Supabase.
4. `src/pages/api/`: transporte HTTP, autenticación del cron y códigos de error.
5. `src/pages/` y `src/components/`: composición Astro/React.

Las dependencias apuntan hacia el dominio. El dominio no conoce Astro,
Supabase, React ni GSAP.

## Flujo de carga

1. La página solicita `GET /api/game/today`.
2. El servidor calcula la fecha de juego de Madrid.
3. En producción, el servicio recupera cuatro filas ordenadas o crea la
   partida si falta.
4. En desarrollo, selecciona cuatro palabras del JSON sin cargar el adaptador
   de Supabase.
5. El cliente recibe identificador, fecha, soluciones, modo y permiso de replay.
6. La isla React crea el estado o lo reconstruye desde Local Storage.
7. Cada intento se procesa con `submitGuess`.
8. La UI persiste el nuevo estado y anima la evaluación resultante.

## Estado

El servidor solo conserva el historial de soluciones. El progreso del jugador
permanece en Local Storage y se reconstruye reproduciendo intentos sobre el
motor; no se confía en evaluaciones persistidas.

En local se guarda además la sesión activa —identificador y cuatro soluciones—
para que recargar no conceda una partida nueva. Cada replay recibe otro
identificador y elimina el progreso anterior.

## Integración de UI

La página monta una isla React `Game`. Button, Card, Badge, Alert, Dialog,
Textarea, Separator, Skeleton y Sonner proceden del preset shadcn. Los
componentes de composición `Board` y `Keyboard` usan exclusivamente utilidades
de Tailwind asociadas a los tokens del preset; no añaden hojas de estilo,
colores ni variables propios.

La isla representa el estado inmutable del motor, carga y restaura la sesión,
despacha intentos y delega las reglas en `src/game/`. GSAP coordina la entrada
del título, las respuestas visuales de las casillas evaluadas y la aparición
del resultado según victoria o derrota. Todas estas animaciones se omiten con
`prefers-reduced-motion`.
