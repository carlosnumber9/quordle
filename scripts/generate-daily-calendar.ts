import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { dictionary } from "../src/game/dictionary";
import {
  createDailyCalendar,
  extendDailyCalendar,
  parseHistoryCsv,
} from "./daily-calendar/utils";

const outputPath = fileURLToPath(
  new URL("../src/data/daily-games.json", import.meta.url),
);
const historyPath = readArgument("--history");
const seedArgument = readArgument("--seed");

let calendar;
if (existsSync(outputPath)) {
  if (historyPath !== undefined || seedArgument !== undefined) {
    throw new Error(
      "El calendario ya existe; no se pueden sobrescribir su histórico o su semilla.",
    );
  }
  calendar = extendDailyCalendar(
    JSON.parse(readFileSync(outputPath, "utf8")) as unknown,
    dictionary,
  );
} else {
  if (historyPath === undefined) {
    throw new Error("La primera generación requiere --history <ruta-csv>.");
  }
  const seed = seedArgument ?? randomBytes(32).toString("hex");
  calendar = createDailyCalendar(
    parseHistoryCsv(readFileSync(historyPath, "utf8")),
    dictionary,
    seed,
  );
}

writeFileSync(outputPath, `${JSON.stringify(calendar, null, 2)}\n`);
const dates = Object.keys(calendar.games).sort();
console.log(
  `Calendario válido: ${dates.length} partidas, de ${dates[0]} a ${dates.at(-1)}.`,
);

function readArgument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}
