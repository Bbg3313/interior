/**
 * 예전 Supabase → 새 Supabase 전체 이전 (Storage 파일 + DB 행 + URL 호스트 치환)
 *
 * .env.migrate 예시:
 *   OLD_SUPABASE_URL=https://fvnxvpgwtoriewwtdphp.supabase.co
 *   OLD_SUPABASE_SERVICE_ROLE=예전_service_role
 *   NEW_SUPABASE_URL=https://aqdmuqegokwecclcqhgc.supabase.co
 *   NEW_SUPABASE_SERVICE_ROLE=새_service_role
 *   NEW_SUPABASE_DB_PASSWORD=DB비번 (선택, 시퀀스 보정용)
 *
 *   node scripts/migrate-all-from-env.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const migrateEnvPath = join(root, ".env.migrate");

function loadEnv() {
  if (!existsSync(migrateEnvPath)) {
    console.error(".env.migrate 없음 — .env.migrate.example 참고");
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

function die(msg) {
  console.error(msg);
  process.exit(1);
}

async function probe(url) {
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/`, { signal: AbortSignal.timeout(10000) });
    return res.status < 500;
  } catch (e) {
    return false;
  }
}

const env = loadEnv();
const OLD_URL = (
  env.OLD_SUPABASE_URL ||
  env.MIGRATE_OLD_URL ||
  "https://fvnxvpgwtoriewwtdphp.supabase.co"
).replace(/\/$/, "");
const OLD_KEY = env.OLD_SUPABASE_SERVICE_ROLE || env.MIGRATE_OLD_SERVICE_ROLE || "";
const NEW_URL = (env.NEW_SUPABASE_URL || env.MIGRATE_NEW_URL || "").replace(/\/$/, "");
const NEW_KEY = env.NEW_SUPABASE_SERVICE_ROLE || env.MIGRATE_NEW_SERVICE_ROLE || "";

if (!OLD_KEY) {
  die(
    [
      "예전 interior 프로젝트 service_role 키가 필요합니다.",
      "",
      "1) supabase.com → 프로젝트 interior → Settings → API",
      "2) service_role secret 복사",
      "3) .env.migrate 에 추가 (채팅에 붙이지 마세요):",
      "   OLD_SUPABASE_URL=https://fvnxvpgwtoriewwtdphp.supabase.co",
      "   OLD_SUPABASE_SERVICE_ROLE=복사한_키",
      "4) npm run migrate:all",
    ].join("\n")
  );
}
if (!NEW_URL || !NEW_KEY) die("NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_ROLE 필요");

console.log("예전 프로젝트 연결 확인:", OLD_URL);
const ok = await probe(OLD_URL);
if (!ok) {
  die(
    [
      "예전 Supabase에 접속할 수 없습니다 (일시정지/삭제 상태).",
      "Supabase 대시보드에서 예전 Interior 프로젝트를 Pro로 Resume 한 뒤 다시 실행하세요.",
      "Resume 불가 시: 대시보드에서 데이터 다운로드 후 수동 복구, 또는 관리자에서 이미지 재업로드만 가능합니다.",
    ].join("\n")
  );
}

process.env.MIGRATE_OLD_URL = OLD_URL;
process.env.MIGRATE_OLD_SERVICE_ROLE = OLD_KEY;
process.env.MIGRATE_NEW_URL = NEW_URL;
process.env.MIGRATE_NEW_SERVICE_ROLE = NEW_KEY;

const dbPw = env.NEW_SUPABASE_DB_PASSWORD?.trim();
if (dbPw) {
  console.log("\n[0/4] 새 DB 임시 데이터 비우기…");
  try {
    const pg = await import("pg");
    const ref = NEW_URL.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1];
    const enc = encodeURIComponent(dbPw);
    const cs = `postgresql://postgres.${ref}:${enc}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres`;
    const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const clearSql = readFileSync(join(root, "scripts", "clear-new-db-for-migrate.sql"), "utf8");
    await client.query(clearSql);
    await client.end();
    console.log("  새 DB 비움 (예전 데이터로 덮어쓰기 준비)");
  } catch (e) {
    console.warn("  새 DB 비우기 스킵:", e.message);
  }
}

console.log("\n[1/4] Storage 파일 복사 (이미지 전부)…");
execSync("node scripts/migrate-supabase-storage.mjs", { cwd: root, stdio: "inherit" });

console.log("\n[2/4] DB 행 복사 (포트폴리오·히어로·문의·리뷰)…");
execSync("node scripts/migrate-supabase-database.mjs", { cwd: root, stdio: "inherit" });

if (dbPw) {
  console.log("\n[3/4] id 시퀀스 보정…");
  try {
    const pg = await import("pg");
    const ref = NEW_URL.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1];
    const enc = encodeURIComponent(dbPw);
    const cs = `postgresql://postgres.${ref}:${enc}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres`;
    const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const sql = readFileSync(join(root, "scripts", "fix-sequences-after-migrate.sql"), "utf8");
    await client.query(sql);
    await client.end();
    console.log("시퀀스 보정 완료");
  } catch (e) {
    console.warn("시퀀스 보정 스킵:", e.message);
  }
} else {
  console.log("\n[3/4] 시퀀스 보정 스킵 (NEW_SUPABASE_DB_PASSWORD 없음)");
}

console.log("\n[4/4] 완료 — 예전 사이트 데이터가 새 Supabase로 옮겨졌습니다.");
console.log("사이트(www.soulinwoodfactory.com) 강력 새로고침 후 확인하세요.");
