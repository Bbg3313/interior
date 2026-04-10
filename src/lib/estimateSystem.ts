/**
 * 인테리어 견적 시스템 — 공종별 기준 단가 (만원/평)
 * 자료: 업종별 기본 공종 단가표 (필름·도장은 원문 ㎡ 단가, 화면에서는 참고용 평당 가중치로 반영)
 */

export const ESTIMATE_DEMOLITION = {
  id: "demolition",
  label: "철거",
  pricePerPyeong: 25,
  note: "내부철거 기준(폐기물량에 따라 금액 상이)",
} as const;

export const ESTIMATE_FLOORING_OPTIONS = [
  { id: "none", label: "해당 없음", pricePerPyeong: 0, note: "" },
  { id: "decotile", label: "데코타일(기본형)", pricePerPyeong: 8, note: "" },
  { id: "epoxy", label: "에폭시", pricePerPyeong: 18, note: "수평몰탈 별도" },
  { id: "tile", label: "타일", pricePerPyeong: 20, note: "" },
] as const;

/** ㎡ 단가(만원/㎡) — 견적 요약에서는 평당 환산 계수로 합산 */
export const ESTIMATE_WALL_M2_OPTIONS = [
  {
    id: "film",
    label: "필름",
    pricePerM2: 6,
    note: "㎡단가 (LG·현대 등)",
  },
  {
    id: "paint",
    label: "도장",
    pricePerM2: 2,
    note: "㎡단가 (올퍼티 기준)",
  },
] as const;

/** 바닥 1평(3.3㎡)당 대략 벽·천장 면적(㎡) 가중 — 빠른 환산용 */
const WALL_AREA_FACTOR_PER_FLOOR_M2 = 2.2;

export function wallM2ContributionPerPyeong(pricePerM2: number): number {
  const floorM2 = 3.3;
  const wallM2 = floorM2 * WALL_AREA_FACTOR_PER_FLOOR_M2;
  return Math.round(pricePerM2 * wallM2 * 10) / 10;
}

export const ESTIMATE_WALLPAPER_OPTIONS = [
  { id: "none", label: "해당 없음", pricePerPyeong: 0, note: "" },
  { id: "hanji", label: "도배(합지)", pricePerPyeong: 4, note: "기본마감" },
  { id: "silk", label: "도배(실크)", pricePerPyeong: 7, note: "일반실크 기준" },
] as const;

export const ESTIMATE_OPTIONAL_TRADES = [
  { id: "carpentry", label: "목공사", pricePerPyeong: 25, note: "내부 기본공사(석고보드 마감)" },
  { id: "furniture", label: "가구", pricePerPyeong: 25, note: "카운터·수납장(원목 별도)" },
  { id: "sign", label: "간판", pricePerPyeong: 15, note: "특수소재 별도" },
  { id: "electric", label: "전기/조명", pricePerPyeong: 25, note: "기본공사(등기구 별도)" },
  { id: "plumbing", label: "설비(급배수)", pricePerPyeong: 15, note: "주방설비 별도" },
  { id: "hvac", label: "냉난방", pricePerPyeong: 25, note: "천장형 시스템" },
  { id: "sash", label: "샷시", pricePerPyeong: 30, note: "기본 이중창(브랜드·사양에 따라 금액 상이)" },
] as const;

export type FlooringId = (typeof ESTIMATE_FLOORING_OPTIONS)[number]["id"];
export type WallpaperId = (typeof ESTIMATE_WALLPAPER_OPTIONS)[number]["id"];

export interface EstimateFormState {
  industry: string;
  area: number;
  includeDemolition: boolean;
  flooringId: FlooringId;
  wallFilm: boolean;
  wallPaint: boolean;
  wallpaperId: WallpaperId;
  optionalTradeIds: Record<string, boolean>;
}

export const defaultEstimateFormState = (): EstimateFormState => ({
  industry: "",
  area: 30,
  includeDemolition: true,
  flooringId: "none",
  wallFilm: false,
  wallPaint: false,
  wallpaperId: "none",
  optionalTradeIds: Object.fromEntries(ESTIMATE_OPTIONAL_TRADES.map((t) => [t.id, false])),
});

export interface LineItem {
  label: string;
  sub?: string;
  perPyeong: number;
}

export function buildEstimateLineItems(state: EstimateFormState): LineItem[] {
  const lines: LineItem[] = [];

  if (state.includeDemolition) {
    lines.push({
      label: ESTIMATE_DEMOLITION.label,
      sub: ESTIMATE_DEMOLITION.note,
      perPyeong: ESTIMATE_DEMOLITION.pricePerPyeong,
    });
  }

  const floor = ESTIMATE_FLOORING_OPTIONS.find((f) => f.id === state.flooringId);
  if (floor && floor.id !== "none") {
    lines.push({
      label: `바닥마감 · ${floor.label}`,
      sub: floor.note || undefined,
      perPyeong: floor.pricePerPyeong,
    });
  }

  if (state.wallFilm) {
    const o = ESTIMATE_WALL_M2_OPTIONS.find((x) => x.id === "film")!;
    const perPy = wallM2ContributionPerPyeong(o.pricePerM2);
    lines.push({
      label: `벽면 · ${o.label}`,
      sub: `${o.pricePerM2}만원/㎡ 환산(참고)`,
      perPyeong: perPy,
    });
  }
  if (state.wallPaint) {
    const o = ESTIMATE_WALL_M2_OPTIONS.find((x) => x.id === "paint")!;
    const perPy = wallM2ContributionPerPyeong(o.pricePerM2);
    lines.push({
      label: `벽면 · ${o.label}`,
      sub: `${o.pricePerM2}만원/㎡ 환산(참고)`,
      perPyeong: perPy,
    });
  }

  const paper = ESTIMATE_WALLPAPER_OPTIONS.find((w) => w.id === state.wallpaperId);
  if (paper && paper.id !== "none") {
    lines.push({
      label: paper.label,
      sub: paper.note || undefined,
      perPyeong: paper.pricePerPyeong,
    });
  }

  for (const t of ESTIMATE_OPTIONAL_TRADES) {
    if (state.optionalTradeIds[t.id]) {
      lines.push({
        label: t.label,
        sub: t.note,
        perPyeong: t.pricePerPyeong,
      });
    }
  }

  return lines;
}

export function totalPerPyeongFromLines(lines: LineItem[]): number {
  return lines.reduce((s, l) => s + l.perPyeong, 0);
}

export function computeEstimateRange(state: EstimateFormState): { min: number; max: number; lines: LineItem[] } {
  const lines = buildEstimateLineItems(state);
  const perPy = totalPerPyeongFromLines(lines);
  const raw = perPy * state.area;
  const min = Math.max(0, Math.floor((raw * 0.85) / 10) * 10);
  const max = Math.max(0, Math.floor((raw * 1.25) / 10) * 10);
  return { min, max, lines };
}

export function formatEstimateSummaryForLead(state: EstimateFormState, lines: LineItem[]): string {
  const parts = [
    `[견적 시스템 요약] 업종: ${state.industry || "미선택"}, 면적: ${state.area}평`,
    ...lines.map((l) => `· ${l.label}${l.sub ? ` (${l.sub})` : ""}: ${l.perPyeong}만원/평`),
    `합산(참고): 평당 약 ${totalPerPyeongFromLines(lines)}만원`,
  ];
  return parts.join("\n");
}
