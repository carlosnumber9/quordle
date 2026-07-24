# Diccionario

El diccionario de producción debe guardarse en `src/data/words.json`.

El fichero incluido en el repositorio contiene únicamente palabras de muestra
para poder desarrollar y ejecutar las pruebas. Debe reemplazarse antes de
publicar la aplicación.

## Contrato

- El contenido es un array JSON de strings.
- Cada entrada se normaliza a mayúsculas.
- Las vocales acentuadas se normalizan a su forma sin tilde.
- La `Ñ` se conserva.
- Cada palabra normalizada contiene exactamente cinco caracteres de `A-Z` o
  `Ñ`.
- No puede haber duplicados después de normalizar.
- Todas las palabras pueden ser tanto intentos como soluciones.

Ejecuta `npm run validate:dictionary` después de sustituir el fichero.
