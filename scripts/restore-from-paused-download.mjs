/**
 * 일시정지된 Supabase 프로젝트에서 **무료로** 받은 백업 복구 (Pro Resume 불필요)
 *
 * Supabase 대시보드 → 일시정지된 Interior 프로젝트 → Project Overview:
 *   1) Database backup (.backup 또는 .gz) 다운로드
 *   2) Storage objects 전체 다운로드
 *
 * PC에 아래 구조로 넣기:
 *   supabase-paused-download/
 *     database.backup          (또는 database.backup.gz)
 *     storage/portfolio-images/hero/...
 *     storage/portfolio-images/portfolio/...
 *
 * .env.migrate 에 NEW_* 키가 있으면:
 *   npm run restore:download
 */
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { gunzipSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const downloadRoot = join(root, "supabase-paused-download");
const BUCKET = "portfolio-images";

function loadEnv() {
  const p = join(root, ".env.migrate");
  if (!existsSync(p)) return {};
  const env = {};
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function walkFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkFiles(p));
    else out.push(p);
  }
  return out;
}

function mimeFor(file) {
  const l = file.toLowerCase();
  if (l.endsWith(".png")) return "image/png";
  if (l.endsWith(".webp")) return "image/webp";
  if (l.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

async function uploadStorage(sb) {
  const storageRoot = join(downloadRoot, "storage", BUCKET);
  if (!existsSync(storageRoot)) {
    console.log("Storage 폴더 없음 — storage/portfolio-images/ 만 건너뜀");
    return 0;
  }
  const files = walkFiles(storageRoot);
  console.log(`Storage 업로드 ${files.length}개…`);
  let ok = 0;
  for (const abs of files) {
    const rel = relative(storageRoot, abs).replace(/\\/g, "/");
    const body = readFileSync(abs);
    const { error } = await sb.storage.from(BUCKET).upload(rel, body, {
      upsert: true,
      contentType: mimeFor(abs),
    });
    if (error) {
      console.error(`  [skip] ${rel}:`, error.message);
    } else {
      ok++;
      if (ok % 10 === 0) console.log(`  ${ok}/${files.length}`);
    }
  }
  console.log(`Storage 완료: ${ok}/${files.length}`);
  return ok;
}

async function restoreDatabase(env) {
  const candidates = [
    join(downloadRoot, "database.backup"),
    join(downloadRoot, "database.backup.gz"),
    join(downloadRoot, "db.backup"),
    join(downloadRoot, "db.backup.gz"),
  ];
  const backupPath = candidates.find((p) => existsSync(p));
  if (!backupPath) {
    console.log("DB backup 파일 없음 — database.backup(.gz) 건너뜀");
    return;
  }

  const pw = env.NEW_SUPABASE_DB_PASSWORD?.trim();
  if (!pw) die("DB 복구에 NEW_SUPABASE_DB_PASSWORD 필요 (.env.migrate)");

  const url = env.NEW_SUPABASE_URL || env.MIGRATE_NEW_URL;
  const ref = url?.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1];
  if (!ref) die("NEW_SUPABASE_URL 형식 오류");

  let sqlFile = backupPath;
  let tmpGz = null;
  if (backupPath.endsWith(".gz")) {
    const raw = gunzipSync(readFileSync(backupPath));
    tmpGz = join(downloadRoot, "_database-restored.sql");
    writeFileSync(tmpGz, raw);
    sqlFile = tmpGz;
  }

  const enc = encodeURIComponent(pw);
  const cs = `postgresql://postgres.${ref}:${enc}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres`;

  console.log("DB backup 복구 중 (object already exists 경고는 무시 가능)…");
  try {
    execSync(`psql "${cs}" -f "${sqlFile.replace(/"/g, '\\"')}"`, {
      stdio: "inherit",
      env: { ...process.env, PGSSLMODE: "require" },
    });
  } catch {
    console.warn("psql 일부 오류 — 스키마 중복이면 정상일 수 있음");
  }

  const newHost = `${ref}.supabase.co`;
  const pg = await import("pg");
  const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const hosts = ["fvnxvpgwtoriewwtdphp.supabase.co", "hathzkpdgszfyxggqqmw.supabase.co"];
  for (const h of hosts) {
    await client.query(
      `update portfolios set image_url=replace(image_url,$1,$2) where image_url like '%'||$3||'%'`,
      [h, newHost, h]
    );
    await client.query(
      `update portfolios set image_urls=replace(image_urls::text,$1,$2)::jsonb where image_urls::text like '%'||$3||'%'`,
      [h, newHost, h]
    );
    await client.query(
      `update site_settings set value=replace(value,$1,$2) where value like '%'||$3||'%'`,
      [h, newHost, h]
    );
  }
  await client.end();
  console.log("DB URL 호스트 → 새 프로젝트로 치환 완료");
}

async function main() {
  if (!existsSync(downloadRoot)) {
    die(
      [
        `${downloadRoot} 폴더가 없습니다.`,
        "Supabase 일시정지 프로젝트 Overview에서 DB backup + Storage 다운로드 후 위 구조로 넣으세요.",
        "자세한 안내: npm run restore:download -- --help",
      ].join("\n")
    );
  }

  const env = loadEnv();
  const url = (env.NEW_SUPABASE_URL || env.MIGRATE_NEW_URL || "").replace(/\/$/, "");
  const key = env.NEW_SUPABASE_SERVICE_ROLE || env.MIGRATE_NEW_SERVICE_ROLE;
  if (!url || !key) die("NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_ROLE 필요 (.env.migrate)");

  const sb = createClient(url, key, { auth: { persistSession: false } });
  await uploadStorage(sb);
  await restoreDatabase(env);
  console.log("\n복구 완료. 사이트 새로고침 후 확인하세요.");
}

if (process.argv.includes("--help")) {
  console.log(`
무료 백업 복구 (Pro Resume 없이)

1) supabase.com → 일시정지된 Interior 프로젝트 열기
2) Overview 에서 Database backup + Storage objects 다운로드
3) 프로젝트 폴더에 배치:
   supabase-paused-download/database.backup
   supabase-paused-download/storage/portfolio-images/hero/...
   supabase-paused-download/storage/portfolio-images/portfolio/...
4) npm run restore:download
`);
  process.exit(0);
}

main().catch((e) => die(e.message));
