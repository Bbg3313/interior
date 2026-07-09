/**
 * Pro 없이: 로컬 사이트 캡처(portfolio-shots-upload)에서 히어로·포트폴리오 복원
 *   1) scripts/crop-restore-images.ps1 로 이미지 자르기
 *   2) node scripts/restore-from-site-snapshot.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cropsDir = join(root, "portfolio-shots-upload", "_restore-crops");
const manifestPath = join(root, "data", "portfolio-restore-manifest.json");
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

async function uploadFile(sb, storagePath, absPath) {
  const body = readFileSync(absPath);
  const { error } = await sb.storage.from(BUCKET).upload(storagePath, body, {
    upsert: true,
    contentType: "image/jpeg",
  });
  if (error) throw new Error(`${storagePath}: ${error.message}`);
  const { data } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function main() {
  const heroPath = join(cropsDir, "hero-01.jpg");
  if (!existsSync(heroPath)) {
    console.error("먼저 실행: powershell -File scripts/crop-restore-images.ps1");
    process.exit(1);
  }

  const env = loadEnv();
  const url = (env.NEW_SUPABASE_URL || env.MIGRATE_NEW_URL || "").replace(/\/$/, "");
  const key = env.NEW_SUPABASE_SERVICE_ROLE || env.MIGRATE_NEW_SERVICE_ROLE;
  if (!url || !key) {
    console.error(".env.migrate 에 NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_ROLE 필요");
    process.exit(1);
  }

  const sb = createClient(url, key, { auth: { persistSession: false } });
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  console.log("히어로 업로드…");
  const heroUrl = await uploadFile(sb, `hero/restored-${Date.now()}-hero-01.jpg`, heroPath);
  await sb.from("site_settings").upsert(
    [
      { key: "hero_image_urls", value: JSON.stringify([heroUrl]) },
      { key: "hero_image_url", value: heroUrl },
    ],
    { onConflict: "key" }
  );
  console.log("  hero:", heroUrl);

  const { count } = await sb.from("portfolios").select("*", { count: "exact", head: true });
  if (count && count > 0) {
    console.log(`기존 포트폴리오 ${count}건 있음 — 추가만 진행`);
  }

  console.log(`포트폴리오 ${manifest.length}건 업로드…`);
  for (let i = 0; i < manifest.length; i++) {
    const p = manifest[i];
    const cropFile = join(cropsDir, `portfolio-${i + 1}.jpg`);
    if (!existsSync(cropFile)) {
      console.warn(`  skip ${p.name}: ${basename(cropFile)} 없음`);
      continue;
    }
    const imageUrl = await uploadFile(
      sb,
      `portfolio/restored-${Date.now()}-${i + 1}.jpg`,
      cropFile
    );
    const { error } = await sb.from("portfolios").insert({
      name: p.name,
      location: p.location,
      area: p.area,
      budget: p.budget,
      industry: p.industry,
      style: p.style,
      duration: p.duration,
      image_url: imageUrl,
      image_urls: [imageUrl],
      remark_title: "",
      remark_body: "",
    });
    if (error) throw new Error(p.name + ": " + error.message);
    console.log(`  [${i + 1}] ${p.name}`);
  }

  const { count: final } = await sb.from("portfolios").select("*", { count: "exact", head: true });
  console.log(`\n완료. 포트폴리오 ${final}건. 사이트 새로고침하세요.`);
  console.log("나머지 7건(총 13건 중)은 Supabase 백업 복구 또는 /admin 에서 추가하세요.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
