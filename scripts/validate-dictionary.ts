import rawWords from "../src/data/words.json" with { type: "json" };
import { prepareDictionary } from "../src/game/dictionary";

try {
  const dictionary = prepareDictionary(rawWords);
  console.log(`Diccionario válido: ${dictionary.length} palabras.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
