import rawCalendar from "../src/data/daily-games.json";
import { dictionary } from "../src/game/dictionary";
import { validateDailyCalendar } from "../src/services/daily-calendar";

const calendar = validateDailyCalendar(rawCalendar, dictionary);
const dates = Object.keys(calendar.games).sort();

console.log(
  `Calendario válido: ${dates.length} partidas, de ${dates[0]} a ${dates.at(-1)}.`,
);
