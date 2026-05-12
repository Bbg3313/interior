import type { ReactNode } from "react";
import { X, Table2 } from "lucide-react";
import {
  ESTIMATE_DEMOLITION,
  ESTIMATE_FLOORING_OPTIONS,
  ESTIMATE_WALL_M2_OPTIONS,
  ESTIMATE_WALLPAPER_OPTIONS,
  ESTIMATE_OPTIONAL_TRADES,
  wallM2ContributionPerPyeong,
} from "../../lib/estimateSystem";

type Props = {
  open: boolean;
  onClose: () => void;
};

function PricePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400/90 to-amber-400/90 px-3 py-1 text-sm font-semibold text-black tabular-nums shadow-sm">
      {children}
    </span>
  );
}

function SectionCard({
  title,
  accent,
  children,
}: {
  title: string;
  accent: "yellow" | "slate";
  children: ReactNode;
}) {
  const bar =
    accent === "yellow"
      ? "bg-gradient-to-b from-yellow-400 to-amber-500"
      : "bg-gradient-to-b from-gray-700 to-gray-900";
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className={`flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/80`}>
        <span className={`w-1 self-stretch min-h-[1.25rem] rounded-full ${bar}`} aria-hidden />
        <h3 className="text-sm font-semibold tracking-tight text-gray-900">{title}</h3>
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}

function Row({
  name,
  note,
  pill,
}: {
  name: string;
  note?: string;
  pill: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-gray-50 last:border-0 last:pb-0 first:pt-0">
      <div className="min-w-0">
        <div className="font-medium text-gray-900">{name}</div>
        {note && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{note}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2 shrink-0">{pill}</div>
    </div>
  );
}

export function EstimatePriceTableModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="price-table-title"
    >
      <div className="relative w-full max-w-2xl max-h-[min(88vh,860px)] flex flex-col rounded-3xl bg-white shadow-2xl border border-gray-200/80 overflow-hidden">
        <div className="relative shrink-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white px-6 py-7 md:px-8 md:py-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                <Table2 className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 id="price-table-title" className="text-xl md:text-2xl font-semibold tracking-tight">
                  기본 공종 단가 안내
                </h2>
                <p className="text-sm text-white/65 mt-1.5 leading-relaxed">
                  견적 계산에 사용하는 참고 단가입니다. 현장·브랜드·물량에 따라 달라질 수 있습니다.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors shrink-0"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative mt-5 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/90">
              단위: 만원/평 (명시 ㎡ 제외)
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/25 text-amber-100">
              매장·상업 공종 단가표
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-8 md:py-7 space-y-5 bg-gradient-to-b from-gray-50/80 to-white">
          <SectionCard title="견적 시스템 개요 (안내)" accent="yellow">
            <ul className="text-xs text-gray-700 space-y-2 leading-relaxed list-disc pl-4">
              <li>건축·주거공간: 평당 500만원부터 (옵션·자재에 따라 금액 상이)</li>
              <li>매장·상업공간: 아래 공종 단가표 기준 자동 합산</li>
              <li>주문제작 가구·목공사: 소재·마감에 따라 상이 (상담)</li>
              <li>전시·행사: 상담 필요</li>
              <li>CNC 가공: 합판 1장당 1시간 기준 6만원 (15T 기준, 상담 시 확정)</li>
              <li>데크·조경시설물: 상담 필요</li>
            </ul>
          </SectionCard>

          <SectionCard title="철거" accent="slate">
            <Row
              name={ESTIMATE_DEMOLITION.label}
              note={ESTIMATE_DEMOLITION.note}
              pill={<PricePill>{ESTIMATE_DEMOLITION.pricePerPyeong}만원/평</PricePill>}
            />
          </SectionCard>

          <SectionCard title="바닥마감" accent="yellow">
            <div className="space-y-0">
              {ESTIMATE_FLOORING_OPTIONS.filter((o) => o.id !== "none").map((o) => (
                <Row
                  key={o.id}
                  name={o.label}
                  note={o.note || undefined}
                  pill={<PricePill>{o.pricePerPyeong}만원/평</PricePill>}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="벽면 (㎡ 단가)" accent="yellow">
            <p className="text-xs text-gray-500 mb-3 -mt-1">
              견적 합산 시 바닥면적 대비 벽·천장 비율로 평당 환산해 반영합니다.
            </p>
            {ESTIMATE_WALL_M2_OPTIONS.map((o) => {
              const approx = wallM2ContributionPerPyeong(o.pricePerM2);
              return (
                <Row
                  key={o.id}
                  name={o.label}
                  note={`견적 환산 참고 약 ${approx}만원/평 · ${o.note}`}
                  pill={<PricePill>{o.pricePerM2}만원/㎡</PricePill>}
                />
              );
            })}
          </SectionCard>

          <SectionCard title="도배" accent="yellow">
            {ESTIMATE_WALLPAPER_OPTIONS.filter((o) => o.id !== "none").map((o) => (
              <Row key={o.id} name={o.label} note={o.note || undefined} pill={<PricePill>{o.pricePerPyeong}만원/평</PricePill>} />
            ))}
          </SectionCard>

          <SectionCard title="기타 공종" accent="slate">
            {ESTIMATE_OPTIONAL_TRADES.map((t) => (
              <Row key={t.id} name={t.label} note={t.note} pill={<PricePill>{t.pricePerPyeong}만원/평</PricePill>} />
            ))}
          </SectionCard>

          <p className="text-center text-[11px] text-gray-400 leading-relaxed px-2 pb-2">
            본 단가는 사내 기준표를 바탕으로 한 안내용 수치이며, 계약·최종 견적서와 다를 수 있습니다.
          </p>
        </div>

        <div className="shrink-0 px-5 py-4 md:px-8 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
