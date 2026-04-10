import { supabase, assertSupabaseConfigured } from "./supabase";
import type { Lead, Portfolio, Review, CreateLeadInput, CreatePortfolioInput, UpdatePortfolioInput, LeadStatus } from "../types";

const PORTFOLIO_BUCKET = "portfolio-images";

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
  const budget = `${input.estimateMin.toLocaleString()}만원 ~ ${input.estimateMax.toLocaleString()}만원`;
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

export async function createPortfolio(input: CreatePortfolioInput): Promise<Portfolio> {
  assertSupabaseConfigured();
  const allUrls = [input.imageUrl, ...(input.imageUrls ?? [])].filter(Boolean);
  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      name: input.name,
      location: input.location,
      area: input.area,
      budget: input.budget,
      industry: input.industry,
      style: input.style,
      duration: input.duration,
      image_url: input.imageUrl,
      image_urls: allUrls,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToPortfolio(data as Record<string, unknown>);
}

export async function updatePortfolio(input: UpdatePortfolioInput): Promise<Portfolio> {
  assertSupabaseConfigured();
  const allUrls = [input.imageUrl, ...(input.imageUrls ?? [])].filter(Boolean);
  const { data, error } = await supabase
    .from("portfolios")
    .update({
      name: input.name,
      location: input.location,
      area: input.area,
      budget: input.budget,
      industry: input.industry,
      style: input.style,
      duration: input.duration,
      image_url: input.imageUrl,
      image_urls: allUrls,
    })
    .eq("id", input.id)
    .select()
    .single();
  if (error) throw error;
  return rowToPortfolio(data as Record<string, unknown>);
}

export async function uploadPortfolioImages(files: File[], storageSubfolder = "portfolio"): Promise<string[]> {
  assertSupabaseConfigured();
  const uploadedUrls: string[] = [];
  const folder = storageSubfolder.replace(/[^a-zA-Z0-9/_-]/g, "") || "portfolio";

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;

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
