import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const envFiles = [".env.local", ".env"];
const envFile = envFiles.find((candidate) =>
  existsSync(new URL(candidate, new URL(`file://${projectRoot}/`))),
);

if (envFile === undefined) {
  console.error("No se encontró .env.local ni .env.");
  process.exit(1);
}

const contents = readFileSync(new URL(envFile, new URL(`file://${projectRoot}/`)), "utf8");
const urlLine = contents
  .split(/\r?\n/u)
  .find((line) => line.startsWith("SUPABASE_URL="));

if (urlLine === undefined) {
  console.error(`${envFile} no contiene SUPABASE_URL.`);
  process.exit(1);
}

const rawUrl = urlLine.slice("SUPABASE_URL=".length).trim();
const supabaseUrl = rawUrl.replace(/^(['"])(.*)\1$/u, "$2");
const projectRef = new URL(supabaseUrl).hostname.split(".")[0];

if (projectRef === undefined || projectRef.length === 0) {
  console.error("No se pudo obtener el project ref desde SUPABASE_URL.");
  process.exit(1);
}

const executable =
  process.platform === "win32"
    ? "node_modules/.bin/supabase.cmd"
    : "node_modules/.bin/supabase";
const result = spawnSync(
  executable,
  ["link", "--project-ref", projectRef],
  {
    cwd: projectRoot,
    stdio: "inherit",
  },
);

if (result.error !== undefined) {
  throw result.error;
}

process.exit(result.status ?? 1);
