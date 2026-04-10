import React, { useMemo, useState } from "react";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  X,
  Phone,
  Mail,
  User,
  MessageSquare,
  Hammer,
  Layers,
  Paintbrush,
  Grid3x3,
  Info,
  Table2,
} from "lucide-react";
import { EstimatePriceTableModal } from "../components/EstimatePriceTableModal";
import { createLead } from "../../lib/api";
import { PORTFOLIO_INDUSTRY_OPTIONS } from "../../lib/portfolioIndustries";
import {
  ESTIMATE_DEMOLITION,
  ESTIMATE_FLOORING_OPTIONS,
  ESTIMATE_WALLPAPER_OPTIONS,
  ESTIMATE_OPTIONAL_TRADES,
  ESTIMATE_WALL_M2_OPTIONS,
  wallM2ContributionPerPyeong,
  defaultEstimateFormState,
  computeEstimateRange,
  formatEstimateSummaryForLead,
  totalPerPyeongFromLines,
  type EstimateFormState,
  type FlooringId,
  type WallpaperId,
} from "../../lib/estimateSystem";

interface ContactData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const STEPS = 3;

export function EstimatePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<EstimateFormState>(() => defaultEstimateFormState());
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPriceTableModal, setShowPriceTableModal] = useState(false);
  const [contactData, setContactData] = useState<ContactData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { min, max, lines } = useMemo(() => computeEstimateRange(form), [form]);
  const perPyeongTotal = totalPerPyeongFromLines(lines);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.phone || !contactData.email) {
      alert("이름, 연락처, 이메일은 필수 입력 항목입니다.");
      return;
    }
    if (!form.industry) return;

    setSubmitting(true);
    try {
      const summaryBlock = formatEstimateSummaryForLead(form, lines);
      const combinedMessage = [summaryBlock, contactData.message.trim() && `---\n${contactData.message.trim()}`]
        .filter(Boolean)
        .join("\n\n");

      await createLead({
        clientName: contactData.name,
        phone: contactData.phone,
        email: contactData.email,
        message: combinedMessage,
        businessType: form.industry,
        area: form.area,
        estimateMin: min,
        estimateMax: max,
      });
      alert("견적 요청이 완료되었습니다. 곧 연락드리겠습니다.");
      setShowContactModal(false);
      setContactData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("요청 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const setFlooring = (id: FlooringId) => setForm((f) => ({ ...f, flooringId: id }));
  const setWallpaper = (id: WallpaperId) => setForm((f) => ({ ...f, wallpaperId: id }));
  const toggleOptional = (id: string) =>
    setForm((f) => ({
      ...f,
      optionalTradeIds: { ...f.optionalTradeIds, [id]: !f.optionalTradeIds[id] },
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200 mb-6">
              <Grid3x3 className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-900 font-medium">공종 단가표 기반</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight">
              인테리어 견적 시스템
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              업종·면적·공종을 선택하면 기본 공종 단가(만원/평)로 예상 범위를 산출합니다.
              <span className="block text-sm text-gray-500 mt-2">
                실제 금액은 현장 조건·브랜드·폐기물량 등에 따라 달라질 수 있습니다.
              </span>
            </p>
            <button
              type="button"
              onClick={() => setShowPriceTableModal(true)}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-900 bg-white text-gray-900 text-sm font-semibold hover:bg-gray-900 hover:text-white transition-colors shadow-sm"
            >
              <Table2 className="w-4 h-4" aria-hidden />
              단가표 보기
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
                <div className="flex items-center gap-2 mb-8">
                  {Array.from({ length: STEPS }, (_, i) => (
                    <React.Fragment key={i}>
                      <button
                        type="button"
                        onClick={() => setStep(i + 1)}
                        className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                          step === i + 1
                            ? "bg-black text-white"
                            : step > i + 1
                              ? "bg-gray-200 text-gray-800"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {i + 1}
                      </button>
                      {i < STEPS - 1 && <div className="flex-1 h-0.5 bg-gray-100 max-w-12" />}
                    </React.Fragment>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    {step === 1 && "업종"}
                    {step === 2 && "면적"}
                    {step === 3 && "공종 구성"}
                  </span>
                </div>

                {step === 1 && (
                  <div>
                    <h2 className="text-2xl md:text-3xl mb-2">어떤 업종인가요?</h2>
                    <p className="text-gray-600 mb-8">포트폴리오·현장 유형과 동일한 분류입니다.</p>
                    <select
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-all bg-white hover:border-gray-300"
                    >
                      <option value="">업종을 선택하세요</option>
                      {PORTFOLIO_INDUSTRY_OPTIONS.map((label) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-10 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!form.industry}
                        className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
                      >
                        다음 <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl md:text-3xl mb-2">공간 면적</h2>
                    <p className="text-gray-600 mb-8">시공 면적(평)을 선택하세요.</p>
                    <div className="text-center mb-8">
                      <div className="text-6xl md:text-7xl font-light mb-2">
                        {form.area}
                        <span className="text-3xl text-gray-400 ml-2">평</span>
                      </div>
                      <div className="text-gray-600">약 {Math.round(form.area * 3.3)}㎡</div>
                    </div>
                    <input
                      type="range"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      min={10}
                      max={200}
                      step={5}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-3">
                      <span>10평</span>
                      <span>200평</span>
                    </div>
                    <div className="mt-10 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 px-8 py-4 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                      >
                        <ArrowLeft className="w-5 h-5" /> 이전
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all shadow-lg"
                      >
                        다음 <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-2xl md:text-3xl mb-2">공종 구성</h2>
                      <p className="text-gray-600 text-sm md:text-base">
                        단가표(만원/평)를 기준으로 선택합니다. 필름·도장은 ㎡ 단가를 벽면적 가정으로 환산합니다.
                      </p>
                    </div>

                    {/* 철거 */}
                    <section className="rounded-2xl border-2 border-gray-100 p-6 bg-gray-50/50">
                      <div className="flex items-start gap-3 mb-4">
                        <Hammer className="w-6 h-6 text-gray-800 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-semibold">{ESTIMATE_DEMOLITION.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{ESTIMATE_DEMOLITION.note}</p>
                        </div>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.includeDemolition}
                          onChange={(e) => setForm({ ...form, includeDemolition: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <span className="font-medium">
                          포함 ({ESTIMATE_DEMOLITION.pricePerPyeong}만원/평)
                        </span>
                      </label>
                    </section>

                    {/* 바닥 */}
                    <section className="rounded-2xl border-2 border-gray-100 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-6 h-6 text-gray-800" />
                        <h3 className="text-lg font-semibold">바닥마감</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ESTIMATE_FLOORING_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFlooring(opt.id)}
                            className={`text-left p-4 rounded-xl border-2 transition-all ${
                              form.flooringId === opt.id
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="font-medium">{opt.label}</div>
                            {opt.id !== "none" && (
                              <div className="text-sm text-yellow-700 mt-1">{opt.pricePerPyeong}만원/평</div>
                            )}
                            {opt.note && <div className="text-xs text-gray-500 mt-1">{opt.note}</div>}
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* 필름 / 도장 */}
                    <section className="rounded-2xl border-2 border-gray-100 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Paintbrush className="w-6 h-6 text-gray-800" />
                        <h3 className="text-lg font-semibold">벽면 마감 (㎡ 단가)</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-4 flex items-start gap-1">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        견적 합계에는 바닥면적 대비 벽·천장 면적 비율로 평당 환산해 반영합니다.
                      </p>
                      <div className="space-y-3">
                        {ESTIMATE_WALL_M2_OPTIONS.map((opt) => {
                          const key = opt.id === "film" ? "wallFilm" : "wallPaint";
                          const checked = form[key];
                          const perPy = wallM2ContributionPerPyeong(opt.pricePerM2);
                          return (
                            <label
                              key={opt.id}
                              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer ${
                                checked ? "border-black bg-gray-50" : "border-gray-200"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                                className="w-5 h-5 mt-0.5 rounded border-gray-300"
                              />
                              <div>
                                <div className="font-medium">{opt.label}</div>
                                <div className="text-sm text-gray-600">
                                  {opt.pricePerM2}만원/㎡ · 환산 약 {perPy}만원/평
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{opt.note}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </section>

                    {/* 도배 */}
                    <section className="rounded-2xl border-2 border-gray-100 p-6">
                      <h3 className="text-lg font-semibold mb-4">도배</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {ESTIMATE_WALLPAPER_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setWallpaper(opt.id)}
                            className={`text-left p-4 rounded-xl border-2 transition-all ${
                              form.wallpaperId === opt.id
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="font-medium">{opt.label}</div>
                            {opt.id !== "none" && (
                              <div className="text-sm text-yellow-700 mt-1">{opt.pricePerPyeong}만원/평</div>
                            )}
                            {opt.note && <div className="text-xs text-gray-500 mt-1">{opt.note}</div>}
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* 기타 공종 */}
                    <section className="rounded-2xl border-2 border-gray-100 p-6">
                      <h3 className="text-lg font-semibold mb-4">기타 공종 (중복 선택)</h3>
                      <div className="space-y-3">
                        {ESTIMATE_OPTIONAL_TRADES.map((t) => (
                          <label
                            key={t.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              form.optionalTradeIds[t.id]
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                form.optionalTradeIds[t.id] ? "bg-black border-black" : "border-gray-300"
                              }`}
                            >
                              {form.optionalTradeIds[t.id] && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={form.optionalTradeIds[t.id]}
                              onChange={() => toggleOptional(t.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium flex flex-wrap items-baseline gap-2">
                                {t.label}
                                <span className="text-sm text-yellow-700">{t.pricePerPyeong}만원/평</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{t.note}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </section>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 px-8 py-4 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                      >
                        <ArrowLeft className="w-5 h-5" /> 이전
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 요약 패널 */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-6 md:p-8 lg:sticky lg:top-[120px]">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold">견적 요약</h3>
                </div>

                <div className="space-y-4 mb-6 text-sm border-b border-gray-100 pb-6">
                  <div>
                    <div className="text-gray-500">업종</div>
                    <div className="font-medium">{form.industry || "—"}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">면적</div>
                    <div className="font-medium">{form.area}평</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-2">선택 공종 (평당 합산)</div>
                    {lines.length === 0 ? (
                      <p className="text-gray-400 text-xs">철거 외 선택 없음 시에도 철거만 반영됩니다.</p>
                    ) : (
                      <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {lines.map((l, i) => (
                          <li key={i} className="flex justify-between gap-2 text-xs">
                            <span className="text-gray-700 truncate">{l.label}</span>
                            <span className="shrink-0 text-gray-900 tabular-nums">{l.perPyeong}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex justify-between mt-3 pt-3 border-t border-dashed border-gray-200 font-semibold text-sm">
                      <span>참고 평당 합계</span>
                      <span className="tabular-nums">{perPyeongTotal}만원/평</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-sm text-gray-600 mb-2">예상 범위 (참고)</div>
                  {form.industry ? (
                    <>
                      <div className="text-3xl md:text-4xl font-light bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent tabular-nums">
                        {min.toLocaleString()}만원
                      </div>
                      <div className="text-gray-600 mb-6">~ {max.toLocaleString()}만원</div>
                    </>
                  ) : (
                    <div className="text-2xl text-gray-300 mb-6">업종을 선택하세요</div>
                  )}

                  <button
                    type="button"
                    disabled={!form.industry}
                    onClick={() => setShowContactModal(true)}
                    className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black rounded-full transition-all font-semibold disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg"
                  >
                    정확한 견적 요청하기
                  </button>
                  <p className="mt-3 text-[11px] text-gray-500 text-center leading-relaxed">
                    * 본 산출은 단가표 기준 자동 합산입니다. 현장 실측 후 확정 견적이 발행됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EstimatePriceTableModal open={showPriceTableModal} onClose={() => setShowPriceTableModal(false)} />

      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-1">견적 요청</h2>
                <p className="text-sm text-gray-600">연락처를 남겨 주시면 담당자가 연락드립니다.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuote}>
              <div className="p-8 space-y-6">
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-gray-900">예상 범위</span>
                  </div>
                  <div className="text-2xl font-light text-gray-900 tabular-nums">
                    {min.toLocaleString()}만원 ~ {max.toLocaleString()}만원
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {form.industry} · {form.area}평 · 평당 합산 약 {perPyeongTotal}만원
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <User className="w-4 h-4" />
                      이름 <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      연락처 <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      이메일 <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      추가 요청사항
                    </span>
                  </label>
                  <textarea
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none resize-none"
                    placeholder="현장 위치, 희망 일정 등"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-8 py-6 flex gap-3 rounded-b-3xl border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-100 font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-black rounded-full font-semibold shadow-lg disabled:opacity-70"
                >
                  {submitting ? "전송 중..." : "견적 요청하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
