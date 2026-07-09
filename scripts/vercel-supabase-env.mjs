/**
 * Vercel Supabase env 교체 + 프로덕션 재배포 (SQL 없이)
 */
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const migrateEnvPath = join(root, ".env.migrate");

function loadMigrateEnv() {
  const env = {};
  for (const line of readFileSync(migrateEnvPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function vercelEnvSet(name, value) {
  for (const envName of ["production", "preview", "development"]) {
    try {
      execSync(`npx vercel@latest env rm ${name} ${envName} --yes`, { cwd: root, stdio: "pipe" });
    } catch {}
    execSync(`npx vercel@latest env add ${name} ${envName}`, {
      cwd: root,
      stdio: ["pipe", "inherit", "inherit"],
      input: value,
    });
    console.log(`Vercel env ${name} (${envName}) OK`);
  }
}

if (!existsSync(migrateEnvPath)) {
  console.error(".env.migrate 없음");
  process.exit(1);
}
const env = loadMigrateEnv();
const url = env.NEW_SUPABASE_URL;
const anon = env.NEW_SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error("URL/anon 키 필요");
  process.exit(1);
}

console.log("Vercel env 교체:", url);
vercelEnvSet("VITE_SUPABASE_URL", url);
vercelEnvSet("VITE_SUPABASE_ANON_KEY", anon);
console.log("프로덕션 재배포…");
execSync("npx vercel@latest deploy --prod --yes", { cwd: root, stdio: "inherit" });
console.log("Vercel 배포 완료");
