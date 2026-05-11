/**
 * 예전 Supabase Storage → 새 Supabase Storage 전체 복사 (같은 object 경로 유지)
 *
 * 준비: 새 프로젝트에 `portfolio-images` 버킷 + 005 마이그레이션 정책이 있어야 업로드 가능.
 *
 * PowerShell 예:
 *   $env:MIGRATE_OLD_URL="https://옛ref.supabase.co"
 *   $env:MIGRATE_OLD_SERVICE_ROLE="옛_service_role_키"
 *   $env:MIGRATE_NEW_URL="https://새ref.supabase.co"
 *   $env:MIGRATE_NEW_SERVICE_ROLE="새_service_role_키"
 *   pnpm exec node scripts/migrate-supabase-storage.mjs
 *
 * 선택: $env:MIGRATE_BUCKET="portfolio-images" (기본값 동일)
 */
import { createClient } from "@supabase/supabase-js";

const BUCKET = process.env.MIGRATE_BUCKET?.trim() || "portfolio-images";
const OLD_URL = process.env.MIGRATE_OLD_URL?.trim();
const OLD_KEY = process.env.MIGRATE_OLD_SERVICE_ROLE?.trim();
const NEW_URL = process.env.MIGRATE_NEW_URL?.trim();
const NEW_KEY = process.env.MIGRATE_NEW_SERVICE_ROLE?.trim();

function die(msg) {
  console.error(msg);
  process.exit(1);
}

if (!OLD_URL || !OLD_KEY) die("MIGRATE_OLD_URL, MIGRATE_OLD_SERVICE_ROLE 가 필요합니다.");
if (!NEW_URL || !NEW_KEY) die("MIGRATE_NEW_URL, MIGRATE_NEW_SERVICE_ROLE 가 필요합니다.");

const oldClient = createClient(OLD_URL, OLD_KEY, { auth: { persistSession: false } });
const newClient = createClient(NEW_URL, NEW_KEY, { auth: { persistSession: false } });

/** 폴더는 metadata 가 비어 있음 — 파일만 leaf 로 수집 */
async function collectFilePaths(client, prefix = "") {
  const paths = [];
  const limit = 1000;
  let offset = 0;
  for (;;) {
    const { data, error } = await client.storage.from(BUCKET).list(prefix, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw error;
    if (!data?.length) break;

    for (const item of data) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      // Storage UI "폴더" 행: id·metadata 가 비어 있음. 실제 파일은 metadata에 size 등이 있음.
      const isFolder = item.id == null && item.metadata == null;
      if (isFolder) {
        const sub = await collectFilePaths(client, path);
        paths.push(...sub);
      } else {
        paths.push(path);
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }
  return paths;
}

async function main() {
  console.log(`버킷 "${BUCKET}" 파일 목록 수집 중 (옛 프로젝트)…`);
  const paths = await collectFilePaths(oldClient);
  console.log(`총 ${paths.length}개 객체 복사 시작 → 새 프로젝트`);

  let ok = 0;
  let fail = 0;
  for (const path of paths) {
    const { data: blob, error: dlErr } = await oldClient.storage.from(BUCKET).download(path);
    if (dlErr || !blob) {
      console.error(`[skip] 다운로드 실패: ${path}`, dlErr?.message ?? dlErr);
      fail++;
      continue;
    }
    const buf = await blob.arrayBuffer();
    const contentType = blob.type || guessMime(path);
    const { error: upErr } = await newClient.storage.from(BUCKET).upload(path, buf, {
      upsert: true,
      contentType,
      cacheControl: "3600",
    });
    if (upErr) {
      console.error(`[skip] 업로드 실패: ${path}`, upErr.message);
      fail++;
      continue;
    }
    ok++;
    if (ok % 20 === 0 || ok === paths.length) console.log(`  … ${ok}/${paths.length}`);
  }

  console.log(`완료: 성공 ${ok}, 실패 ${fail}`);
  if (fail > 0) process.exit(1);
}

function guessMime(path) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
