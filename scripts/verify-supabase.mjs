/**
 * Supabase 연결·테이블 확인 (anon 키만 필요)
 *
 * PowerShell:
 *   $env:SUPABASE_URL="https://aqdmuqegokwecclcqhgc.supabase.co"
 *   $env:SUPABASE_ANON_KEY="anon_키"
 *   node scripts/verify-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_ANON_KEY?.trim();

if (!url || !key) {
  console.error("SUPABASE_URL, SUPABASE_ANON_KEY 필요");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

async function count(table) {
  const { count, error } = await sb.from(table).select("*", { count: "exact", head: true });
  return { table, count: error ? `ERR: ${error.message}` : count };
}

console.log("URL:", url);
for (const t of ["portfolios", "leads", "reviews", "site_settings"]) {
  const r = await count(t);
  console.log(`  ${r.table}: ${r.count}`);
}

const { data: buckets, error: bErr } = await sb.storage.listBuckets();
if (bErr) console.log("  storage list:", bErr.message);
else console.log("  buckets:", buckets?.map((b) => b.name).join(", ") || "(none)");
