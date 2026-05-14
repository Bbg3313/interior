import { supabase, assertSupabaseConfigured } from "./supabase";
import type { Lead, Portfolio, Review, CreateLeadInput, CreatePortfolioInput, UpdatePortfolioInput, LeadStatus } from "../types";

const PORTFOLIO_BUCKET = "portfolio-images";

/** Supabase/PostgREST/Storage 오류를 사용자·로그용 문자열로 */
export function formatSupabaseError(err: unknown): string {
  if (err == null) return "알 수 없는 오류";
  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = typeof (err as { message: unknown }).message === "string" ? (err as { message: string }).message : "";
    const details =
      "details" in err && typeof (err as { details: unknown }).details === "string"
        ? (err as { details: string }).details.trim()
        : "";
    const hint =
      "hint" in err && typeof (err as { hint: unknown }).hint === "string" ? (err as { hint: string }).hint.trim() : "";
    const code = "code" in err && typeof (err as { code: unknown }).code === "string" ? (err as { code: string }).code : "";
    const parts = [msg, details && `(${details})`, hint && `[힌트: ${hint}]`, code && `[${code}]`].filter(Boolean);
    let out = parts.join(" ").trim() || String(err);

    const lower = out.toLowerCase();
    if (lower.includes("row-level security") || lower.includes("rls") || lower.includes("violates")) {
      out +=
        " — 이미지 업로드가 막혀 있을 수 있습니다. Supabase SQL Editor에서 supabase/migrations/005_storage_portfolio_images_policies.sql 을 실행하고, Storage에 버킷 portfolio-images 가 있는지 확인하세요.";
    }
    if (lower.includes("could not find") && (lower.includes("image_urls") || lower.includes("remark_"))) {
      out +=
        " — DB에 포트폴리오 확장 컬럼이 없습니다. supabase/migrations/007_portfolio_extras_baseline.sql (또는 003·006)을 Supabase에서 실행하세요.";
    }
    return out;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

// --- Leads ---

function rowToLead(row: Record<string, unknown>): Lead {
  const createdAt = row.created_at as string | undefined;
  const date = createdAt ? createdAt.slice(0, 10) : "";
  return {
    id: Number(row.id),
    clientName: (row.client_name as string) ?? "",
    phone: (row.phone as string) ?? "",
    email: (row.email as string) ?? "",
    message: (row.message as string) ?? "",
    businessType: (row.business_type as string) ?? "",
    area: (row.area as string) ?? "",
    budget: (row.budget as string) ?? "",
    estimateMin: row.estimate_min as number | undefined,
    estimateMax: row.estimate_max as number | undefined,
    status: (row.status as LeadStatus) ?? "신규",
    date,
    createdAt,
  };
}

export async function getLeads(): Promise<Lead[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToLead);
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  assertSupabaseConfigured();
  const budget =
    input.estimateMin === 0 && input.estimateMax === 0
      ? "상담 후 확정"
      : `${input.estimateMin.toLocaleString()}만원 ~ ${input.estimateMax.toLocaleString()}만원`;
  const { data, error } = await supabase
    .from("leads")
    .insert({
      client_name: input.clientName,
      phone: input.phone,
      email: input.email,
      message: input.message ?? "",
      business_type: input.businessType,
      area: `${input.area}평`,
      budget,
      estimate_min: input.estimateMin,
      estimate_max: input.estimateMax,
      status: "신규",
    })
    .select()
    .single();
  if (error) throw error;
  return rowToLead(data as Record<string, unknown>);
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<void> {
  assertSupabaseConfigured();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw error;
}

// --- Portfolios ---

function parseImageUrls(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") {
    try {
      const arr = JSON.parse(v);
      return Array.isArray(arr) ? arr.filter((x: unknown): x is string => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

function rowToPortfolio(row: Record<string, unknown>): Portfolio {
  return {
    id: Number(row.id),
    name: (row.name as string) ?? "",
    location: (row.location as string) ?? "",
    area: (row.area as string) ?? "",
    budget: (row.budget as string) ?? "",
    industry: (row.industry as string) ?? "",
    style: (row.style as string) ?? "",
    duration: (row.duration as string) ?? "",
    imageUrl: (row.image_url as string) ?? "",
    imageUrls: parseImageUrls(row.image_urls),
    remarkTitle: (row.remark_title as string) ?? "",
    remarkBody: (row.remark_body as string) ?? "",
    createdAt: row.created_at as string | undefined,
  };
}

export async function getPortfolios(): Promise<Portfolio[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToPortfolio);
}

export async function getPortfolio(id: number): Promise<Portfolio | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToPortfolio(data as Record<string, unknown>) : null;
}

const portfolioDetailCache = new Map<number, Portfolio | null>();
const portfolioDetailInflight = new Map<number, Promise<Portfolio | null>>();

/** 동일 id 재방문·목록에서 프리패치 시 즉시 반환 */
export async function getPortfolioCached(id: number): Promise<Portfolio | null> {
  if (portfolioDetailCache.has(id)) return portfolioDetailCache.get(id)!;
  const inflight = portfolioDetailInflight.get(id);
  if (inflight) return inflight;

  const p = getPortfolio(id).then((row) => {
    portfolioDetailCache.set(id, row);
    portfolioDetailInflight.delete(id);
    return row;
  });
  portfolioDetailInflight.set(id, p);
  return p;
}

/** 목록 카드 호버 등 — 상세 진입 전 데이터·이미지 URL 선로딩 */
export function prefetchPortfolioDetail(id: number): void {
  if (portfolioDetailCache.has(id) || portfolioDetailInflight.has(id)) return;
  void getPortfolioCached(id);
}


export async function createPortfolio(input: CreatePortfolioInput): Promise<Portfolio> {
  assertSupabaseConfigured();
  const imageUrl = String(input.imageUrl ?? "").trim();
  const allUrls = [imageUrl, ...(input.imageUrls ?? [])].filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  const row = {
    name: String(input.name ?? "").trim(),
    location: String(input.location ?? "").trim(),
    area: String(input.area ?? "").trim(),
    budget: String(input.budget ?? "").trim(),
    industry: String(input.industry ?? "").trim(),
    style: String(input.style ?? "").trim(),
    duration: String(input.duration ?? "").trim(),
    image_url: imageUrl,
    image_urls: allUrls,
    remark_title: String(input.remarkTitle ?? "").trim(),
    remark_body: String(input.remarkBody ?? "").trim(),
  };
  const { data, error } = await supabase.from("portfolios").insert(row).select().single();
  if (error) throw error;
  return rowToPortfolio(data as Record<string, unknown>);
}

export async function updatePortfolio(input: UpdatePortfolioInput): Promise<Portfolio> {
  assertSupabaseConfigured();
  const imageUrl = String(input.imageUrl ?? "").trim();
  const allUrls = [imageUrl, ...(input.imageUrls ?? [])].filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  const row = {
    name: String(input.name ?? "").trim(),
    location: String(input.location ?? "").trim(),
    area: String(input.area ?? "").trim(),
    budget: String(input.budget ?? "").trim(),
    industry: String(input.industry ?? "").trim(),
    style: String(input.style ?? "").trim(),
    duration: String(input.duration ?? "").trim(),
    image_url: imageUrl,
    image_urls: allUrls,
    remark_title: String(input.remarkTitle ?? "").trim(),
    remark_body: String(input.remarkBody ?? "").trim(),
  };
  const { data, error } = await supabase.from("portfolios").update(row).eq("id", input.id).select().single();
  if (error) throw error;
  portfolioDetailCache.delete(input.id);
  return rowToPortfolio(data as Record<string, unknown>);
}

export async function uploadPortfolioImages(files: File[], storageSubfolder = "portfolio"): Promise<string[]> {
  assertSupabaseConfigured();
  const uploadedUrls: string[] = [];
  const folder = storageSubfolder.replace(/[^a-zA-Z0-9/_-]/g, "") || "portfolio";

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const unique =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `${folder}/${unique}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path);
    if (!data?.publicUrl) {
      throw new Error("Uploaded image URL could not be generated.");
    }
    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
}

// --- Reviews ---

function rowToReview(row: Record<string, unknown>): Review {
  return {
    id: Number(row.id),
    name: (row.name as string) ?? "",
    business: (row.business as string) ?? "",
    rating: Number(row.rating) ?? 5,
    comment: (row.comment as string) ?? "",
    image: (row.image as string) ?? "",
  };
}

export async function getReviews(): Promise<Review[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToReview);
}

// --- Site settings (Hero 이미지 등) ---

const HERO_IMAGE_URLS_KEY = "hero_image_urls";
const HERO_IMAGE_URL_LEGACY_KEY = "hero_image_url";

function parseHeroUrlsJson(raw: string): string[] {
  const t = raw.trim();
  if (!t) return [];
  try {
    const v = JSON.parse(t) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((s) => s.trim());
  } catch {
    return [];
  }
}

/** 히어로 배경 URL 목록 (순서 유지). 다중 미설정 시 기존 단일 hero_image_url만 사용 */
export async function getHeroImageSlides(): Promise<string[]> {
  if (!supabase) return [];
  const multiRaw = await getSiteSetting(HERO_IMAGE_URLS_KEY);
  const fromMulti = parseHeroUrlsJson(multiRaw);
  if (fromMulti.length > 0) return fromMulti;
  const single = (await getSiteSetting(HERO_IMAGE_URL_LEGACY_KEY)).trim();
  return single ? [single] : [];
}

export async function setHeroImageSlides(urls: string[]): Promise<void> {
  assertSupabaseConfigured();
  const cleaned = urls.map((u) => u.trim()).filter(Boolean);
  await setSiteSetting(HERO_IMAGE_URLS_KEY, JSON.stringify(cleaned));
  await setSiteSetting(HERO_IMAGE_URL_LEGACY_KEY, cleaned[0] ?? "");
}

export async function getSiteSetting(key: string): Promise<string> {
  if (!supabase) return "";
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return (data?.value as string) ?? "";
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  assertSupabaseConfigured();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}
