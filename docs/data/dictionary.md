# Diccionario

## Ubicación

El fichero total debe sustituir a `src/data/words.json`. No se configura por
variable de entorno porque debe formar parte del bundle de la función de
Vercel.

## Normalización

Se eliminan espacios exteriores, se convierten letras a mayúsculas, se
eliminan diacríticos y se protege `Ñ`. Por ejemplo:

- `árbol` → `ARBOL`
- `niñez` → `NIÑEZ`

Los duplicados se comprueban después de esta transformación.

## Requisitos

- JSON válido.
- Array de strings.
- Exactamente cinco letras normalizadas.
- Solo `A-Z` y `Ñ`.
- Sin duplicados.
- Al menos cuatro entradas.

El fichero actual es una muestra de desarrollo. Ejecuta
`npm run validate:dictionary` antes de cada despliegue que modifique palabras.
Si quedan menos de cuatro palabras sin usar, no se reciclan automáticamente.
