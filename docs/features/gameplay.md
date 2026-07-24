# Reglas y flujo de juego

## Inicio

Una partida contiene cuatro soluciones únicas de cinco letras y una fecha
`YYYY-MM-DD`. También tiene un `gameId`: estable para el puzzle diario y único
para cada repetición local. El motor expone un estado inmutable.

## Intentos

- Se normalizan a mayúsculas, eliminando tildes y conservando `Ñ`.
- Deben contener cinco caracteres de `A-Z` o `Ñ`.
- Deben existir en el mismo diccionario usado para elegir soluciones.
- Un intento inválido no consume turno.
- Un intento válido se evalúa contra todo tablero todavía activo.

## Duplicados

La evaluación usa dos pasadas:

1. Marca coincidencias en posición correcta.
2. Cuenta las letras restantes de la solución y consume una por cada
   coincidencia en otra posición.

Esto impide marcar más apariciones amarillas de las existentes.

## Resolución

Al acertar un tablero se registra el número global de intento. Los intentos
posteriores guardan `null` para ese tablero y no alteran su resultado. Se gana
al resolver los cuatro y se pierde al completar el noveno intento sin hacerlo.

## Teclado

Cada tecla puede tener cuatro estados visuales, uno por tablero. Dentro de cada
tablero la prioridad es `correct > present > absent`, por lo que una pista nunca
se degrada.

## Persistencia

Se guardan versión, fecha, lista de intentos y si la partida terminó. Al cargar,
los intentos se reproducen desde cero. Un payload corrupto, incoherente o de
otra fecha se elimina.

## Desarrollo local

- Solo hay una sesión local activa: recargar restaura sus mismas soluciones y
  progreso.
- La sesión inicial obtiene cuatro palabras aleatorias directamente del JSON.
- No se consulta el historial ni se importa el cliente Supabase.
- “Volver a jugar” aparece únicamente después de ganar o perder.
- El botón solicita `POST /api/game/today`, reemplaza la sesión local, borra el
  progreso anterior y crea un estado con el nuevo `gameId`.
- En producción el POST responde `405` y el botón no se renderiza.

La integración debe usar `getOrCreateLocalSession` durante el arranque local y
`replayLocalGame` en el callback de `LocalReplayButton`.
