# Producto y alcance

## Objetivo

Ofrecer una partida diaria de Quordle sencilla, rápida y cuidada para un grupo
pequeño de personas. El producto prioriza claridad y mantenimiento frente a
escalabilidad.

## MVP

- Cuatro tableros simultáneos.
- Una sola palabra introducida afecta a los cuatro.
- Nueve intentos globales.
- Misma partida para todas las personas.
- Cambio diario a las 05:00 de `Europe/Madrid`.
- Restauración de progreso en el mismo navegador.
- Bloqueo de repetición al terminar.
- Resultado final copiable como cuadrícula emoji con enlace.
- Animaciones GSAP contenidas y accesibles.
- En desarrollo local, replay explícito tras terminar para facilitar pruebas.

## Fuera de alcance

- Autenticación, cuentas y perfiles.
- Estadísticas y rachas.
- Multijugador.
- Histórico jugable.
- Modo difícil.
- Temas configurables.
- Varios idiomas.
- PWA.
- Persistencia de jugadores en servidor.

El soporte de letras, Enter y borrar desde teclado físico es entrada básica y
accesibilidad, no un sistema de atajos configurable.

La posibilidad de volver a jugar no existe en producción. Allí se mantiene el
bloqueo diario incluso después de terminar.

## Estados visibles

La UI representa carga, partida activa, palabra incompleta, palabra
desconocida, victoria, derrota, restauración y fallo temporal del servicio.
Nunca muestra una pantalla vacía ante un error.
