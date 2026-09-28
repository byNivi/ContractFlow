import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Minimal .env loader (no external dependency). Looks for .env at the project root.
function loadEnvFile() {
  const candidates = [resolve(process.cwd(), ".env"), resolve(process.cwd(), "server/.env")];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      if (key in process.env) continue; // real env wins
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
    break;
  }
}

loadEnvFile();

export const PORT = Number(process.env.PORT || 4000);
export const DATABASE_URL = (process.env.DATABASE_URL || "").trim();
export const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || "").trim();

// Hosted providers (Neon/Supabase/Render) require TLS; local usually does not.
export const PG_SSL =
  process.env.PGSSL != null
    ? process.env.PGSSL === "true"
    : DATABASE_URL
      ? !/localhost|127\.0\.0\.1/.test(DATABASE_URL)
      : false;

