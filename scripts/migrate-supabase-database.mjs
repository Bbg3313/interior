/**
 * 예전 Supabase Postgres 행 → 새 프로젝트로 복사 (Storage 별도, 이 스크립트는 테이블만)
 *
 * 1) 새 프로젝트에서 supabase/migrations 001~005 이미 적용되어 있어야 함.
 * 2) 새 DB를 비우려면 scripts/clear-new-db-for-migrate.sql 을 먼저 실행 (시드/충돌 제거).
 * 3) Storage 는 migrate-supabase-storage.mjs 로 먼저 옮긴 뒤 실행하는 것을 권장.
 *
 * PowerShell (예전과 동일한 MIGRATE_* 변수):
 *   $env:MIGRATE_OLD_URL="https://옛ref.supabase.co"
 *   $env:MIGRATE_OLD_SERVICE_ROLE="옛_service_role"
 *   $env:MIGRATE_NEW_URL="https://새ref.supabase.co"
 *   $env:MIGRATE_NEW_SERVICE_ROLE="새_service_role"
 *   pnpm exec node scripts/migrate-supabase-database.mjs
 */
import { createClient } from "@supabase/supabase-js";

const OLD_URL = process.env.MIGRATE_OLD_URL?.trim().replace(/\/$/, "");
const OLD_KEY = process.env.MIGRATE_OLD_SERVICE_ROLE?.trim();
const NEW_URL = process.env.MIGRATE_NEW_URL?.trim().replace(/\/$/, "");
const NEW_KEY = process.env.MIGRATE_NEW_SERVICE_ROLE?.trim();

function die(msg) {
  console.error(msg);
  process.exit(1);
}

if (!OLD_URL || !OLD_KEY) die("MIGRATE_OLD_URL, MIGRATE_OLD_SERVICE_ROLE 필요");
if (!NEW_URL || !NEW_KEY) die("MIGRATE_NEW_URL, MIGRATE_NEW_SERVICE_ROLE 필요");

const oldClient = createClient(OLD_URL, OLD_KEY, { auth: { persistSession: false } });
const newClient = createClient(NEW_URL, NEW_KEY, { auth: { persistSession: false } });

const PAGE = 800;

async function fetchAllRows(table) {
  const rows = [];
  let from = 0;
  for (;;) {
    const { data, error } = await oldClient.from(table).select("*").range(from, from + PAGE - 1);
    if (error) throw new Error(`${table} 읽기: ${error.message}`);
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return rows;
}

function rewriteUrls(row, oldUrl, newUrl) {
  const s = JSON.stringify(row);
  if (!s.includes("supabase.co")) return row;
  let next = s.split(oldUrl).join(newUrl);
  // 과거에 쓰던 ref 호스트도 새 ref로 (DB URL만 치환, Storage 경로는 동일)
  const oldHosts = ["hathzkpdgszfyxggqqmw.supabase.co", "fvnxvpgwtoriewwtdphp.supabase.co"];
  const newHost = newUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  for (const h of oldHosts) {
    if (next.includes(h)) next = next.split(h).join(newHost);
  }
  return JSON.parse(next);
}

async function upsertInChunks(table, rows, conflict) {
  const chunk = 80;
  for (let i = 0; i < rows.length; i += chunk) {
    const part = rows.slice(i, i + chunk).map((row) => rewriteUrls(row, OLD_URL, NEW_URL));
    const { error } = await newClient.from(table).upsert(part, { onConflict: conflict });
    if (error) throw new Error(`${table} upsert ${i}-${i + part.length}: ${error.message}`);
    console.log(`  ${table} ${Math.min(i + chunk, rows.length)}/${rows.length}`);
  }
}

async function main() {
  console.log("예전 DB에서 읽는 중…");
  const [settings, reviews, leads, portfolios] = await Promise.all([
    fetchAllRows("site_settings"),
    fetchAllRows("reviews"),
    fetchAllRows("leads"),
    fetchAllRows("portfolios"),
  ]);

  console.log(
    `행 개수 — site_settings:${settings.length} reviews:${reviews.length} leads:${leads.length} portfolios:${portfolios.length}`
  );

  if (settings.length + reviews.length + leads.length + portfolios.length === 0) {
    die("예전 DB에서 가져온 행이 0입니다. MIGRATE_OLD_* 가 예전 프로젝트를 가리키는지 확인하세요.");
  }

  console.log(`URL 치환: ${OLD_URL} → ${NEW_URL}`);

  console.log("새 DB에 쓰는 중…");
  if (settings.length) await upsertInChunks("site_settings", settings, "key");
  if (reviews.length) await upsertInChunks("reviews", reviews, "id");
  if (leads.length) await upsertInChunks("leads", leads, "id");
  if (portfolios.length) await upsertInChunks("portfolios", portfolios, "id");

  console.log("완료. Vercel 에 VITE_SUPABASE_URL / ANON_KEY 가 새 프로젝트인지 확인 후 Redeploy 하세요.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
