/**
 * 새 Supabase 프로젝트 스키마 + Vercel env 교체 + 프로덕션 재배포
 *
 * 준비: .env.migrate ( .env.migrate.example 복사 후 값 입력 )
 *
 *   node scripts/setup-new-supabase.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const migrateEnvPath = join(root, ".env.migrate");
const sqlPath = join(root, "supabase", "setup-new-project.sql");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function loadMigrateEnv() {
  if (!existsSync(migrateEnvPath)) {
    console.error("`.env.migrate` 파일이 없습니다.");
    console.error("  copy .env.migrate.example .env.migrate 후 Supabase 키를 채우세요.");
    process.exit(1);
  }
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

function requireEnv(env, key) {
  const v = env[key]?.trim();
  if (!v) {
    console.error(`\`.env.migrate\`에 ${key} 가 비어 있습니다.`);
    process.exit(1);
  }
  return v;
}

function projectRefFromUrl(url) {
  const m = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  return m?.[1] ?? "";
}

async function ensurePg() {
  try {
    return await import("pg");
  } catch {
    console.log("pg 패키지 설치 중…");
    execSync("npm install pg --no-save --legacy-peer-deps", { cwd: root, stdio: "inherit" });
    return await import("pg");
  }
}

async function runSql(env) {
  const url = requireEnv(env, "NEW_SUPABASE_URL");
  const serviceRole = requireEnv(env, "NEW_SUPABASE_SERVICE_ROLE");
  const dbPassword = requireEnv(env, "NEW_SUPABASE_DB_PASSWORD");
  const ref = projectRefFromUrl(url);
  if (!ref) die("NEW_SUPABASE_URL 형식이 올바르지 않습니다.");

  const sql = readFileSync(sqlPath, "utf8");
  const pg = await ensurePg();

  const candidates = [];
  const encPw = encodeURIComponent(dbPassword);
  if (dbPassword) {
    candidates.push(
      `postgresql://postgres.${ref}:${encPw}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres`,
      `postgresql://postgres.${ref}:${encPw}@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres`,
      `postgresql://postgres:${encPw}@db.${ref}.supabase.co:5432/postgres`
    );
  }

  let lastErr;
  for (const connectionString of candidates) {
    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
      console.log("DB 연결 시도…");
      await client.connect();
      console.log("DB에 스키마 적용 중…");
      await client.query(sql);
      await client.end();
      console.log("스키마 적용 완료.");
      return;
    } catch (e) {
      lastErr = e;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
  throw lastErr ?? new Error("DB 연결 실패 — .env.migrate 에 NEW_SUPABASE_DB_PASSWORD 를 넣어 주세요.");
}

async function verifyAnon(url, anonKey) {
  const sb = createClient(url, anonKey, { auth: { persistSession: false } });
  const { error } = await sb.from("portfolios").select("id", { count: "exact", head: true });
  if (error) throw new Error(`연결 확인 실패: ${error.message}`);
  console.log("anon 키로 portfolios 테이블 접근 OK");
}

function vercelEnvSet(name, value, environments = ["production", "preview", "development"]) {
  for (const envName of environments) {
    try {
      execSync(`npx vercel@latest env rm ${name} ${envName} --yes`, { cwd: root, stdio: "pipe" });
    } catch {
      /* 없으면 무시 */
    }
    execSync(`npx vercel@latest env add ${name} ${envName}`, {
      cwd: root,
      stdio: ["pipe", "inherit", "inherit"],
      input: value,
    });
    console.log(`Vercel env ${name} (${envName}) 갱신`);
  }
}

async function main() {
  const env = loadMigrateEnv();
  const url = requireEnv(env, "NEW_SUPABASE_URL");
  const anonKey = requireEnv(env, "NEW_SUPABASE_ANON_KEY");
  requireEnv(env, "NEW_SUPABASE_SERVICE_ROLE");

  await runSql(env);
  await verifyAnon(url, anonKey);

  console.log("Vercel 환경 변수 교체 중…");
  vercelEnvSet("VITE_SUPABASE_URL", url);
  vercelEnvSet("VITE_SUPABASE_ANON_KEY", anonKey);

  console.log("프로덕션 재배포 중…");
  execSync("npx vercel@latest deploy --prod --yes", { cwd: root, stdio: "inherit" });

  console.log("\n완료. https://www.soulinwoodfactory.com 새로고침 후 확인하세요.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
