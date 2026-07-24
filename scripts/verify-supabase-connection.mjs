import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

const envPath = [".env.local", ".env"]
  .map((candidate) => resolve(process.cwd(), candidate))
  .find(existsSync);

if (envPath === undefined) {
  console.error("No se encontró .env.local ni .env.");
  process.exit(1);
}

const values = new Map(
  readFileSync(envPath, "utf8")
    .split(/\r?\n/u)
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/u.test(line))
    .map((line) => {
      const separator = line.indexOf("=");
      const name = line.slice(0, separator);
      const rawValue = line.slice(separator + 1).trim();
      const value = rawValue.replace(/^(['"])(.*)\1$/u, "$2");
      return [name, value];
    }),
);

const supabaseUrl = values.get("SUPABASE_URL");
const publishableKey = values.get("SUPABASE_PUBLISHABLE_KEY");

if (supabaseUrl === undefined || publishableKey === undefined) {
  console.error(
    "Faltan SUPABASE_URL o SUPABASE_PUBLISHABLE_KEY en el fichero de entorno.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, publishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
const { error } = await supabase.from("daily_words").select("word").limit(1);

if (error === null) {
  console.error(
    "La conexión funciona, pero daily_words es legible con la clave pública.",
  );
  process.exit(1);
}

const permissionDenied =
  error.code === "42501" ||
  error.message.toLocaleLowerCase("en-US").includes("permission denied");

if (!permissionDenied) {
  console.error(
    `Supabase respondió con un error inesperado (${error.code ?? "sin código"}).`,
  );
  process.exit(1);
}

console.log(
  "Conexión verificada: daily_words existe y rechaza correctamente el acceso público.",
);
