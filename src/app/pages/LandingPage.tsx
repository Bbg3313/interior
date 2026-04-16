import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, Sparkles, TrendingUp, FileText, Ruler, HardHat, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { getPortfolios, getReviews, getHeroImageSlides } from "../../lib/api";
import type { Review } from "../../types";
import { PortfolioProjectCard, mapPortfolioToCardProject, type PortfolioCardProject } from "../components/PortfolioProjectCard";

const defaultReviews: Review[] = [
  { name: "김민준", business: "카페 운영", rating: 5, comment: "3주 만에 완공되었고, 디자인이 정말 만족스럽습니다. 손님들 반응이 정말 좋아요!", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { name: "박서연", business: "오피스 대표", rating: 5, comment: "예산 내에서 최고의 결과물을 만들어주셨습니다. 직원들이 너무 좋아해요.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { name: "이준호", business: "레스토랑 사장", rating: 5, comment: "A/S까지 완벽하게 챙겨주시는 모습에 감동했습니다. 추천합니다!", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
];

export function LandingPage() {
  const defaultHeroUrl =
    "https://images.unsplash.com/photo-1585503081214-2d3384d1f7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb21tZXJjaWFsJTIwb2ZmaWNlJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcwNzg5MjMzfDA&ixlib=rb-4.1.0&q=80&w=1080";

  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioCardProject[]>([]);
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [heroSlides, setHeroSlides] = useState<string[]>([defaultHeroUrl]);
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);
  /** 수동으로 슬라이드를 바꾸면 자동 재생 타이머를 다시 맞추기 위한 키 */
  const [heroAutoplayKey, setHeroAutoplayKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(1);
  const [carouselStart, setCarouselStart] = useState(0);

  useEffect(() => {
    const updatePageSize = () => {
      if (typeof window === "undefined") return;
      /* lg+: 3열×2행, md: 2열×2행, 모바일: 1열 */
      if (window.matchMedia("(min-width: 1024px)").matches) setPageSize(6);
      else if (window.matchMedia("(min-width: 768px)").matches) setPageSize(4);
      else setPageSize(1);
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [portfolios, reviewsData, heroUrls] = await Promise.all([
          getPortfolios(),
          getReviews(),
          getHeroImageSlides(),
        ]);
        if (cancelled) return;
        if (heroUrls.length > 0) setHeroSlides(heroUrls);
        setPortfolioProjects(portfolios.map(mapPortfolioToCardProject));
        if (reviewsData.length > 0) setReviews(reviewsData);
      } catch {
        if (!cancelled) setPortfolioProjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const maxCarouselStart = useMemo(() => {
    const len = portfolioProjects.length;
    if (len <= pageSize) return 0;
    return (Math.ceil(len / pageSize) - 1) * pageSize;
  }, [portfolioProjects.length, pageSize]);

  useEffect(() => {
    setCarouselStart((s) => {
      const snapped = Math.floor(s / pageSize) * pageSize;
      return Math.min(Math.max(0, snapped), maxCarouselStart);
    });
  }, [maxCarouselStart, pageSize, portfolioProjects.length]);

  const visiblePortfolios = useMemo(
    () => portfolioProjects.slice(carouselStart, carouselStart + pageSize),
    [portfolioProjects, carouselStart, pageSize]
  );

  const canPrev = carouselStart > 0;
  const canNext = carouselStart < maxCarouselStart;
  const showCarouselNav = portfolioProjects.length > pageSize;
  const rangeEnd = Math.min(carouselStart + pageSize, portfolioProjects.length);

  const stepCarousel = (dir: -1 | 1) => {
    setCarouselStart((s) => {
      if (dir < 0) return Math.max(0, s - pageSize);
      return Math.min(maxCarouselStart, s + pageSize);
    });
  };

  useEffect(() => {
    setHeroActiveIndex(0);
  }, [heroSlides]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const t = window.setInterval(() => {
      setHeroActiveIndex((i) => (i + 1) % heroSlides.length);
    }, 8000);
    return () => window.clearInterval(t);
  }, [heroSlides.length, heroAutoplayKey]);

  const goHero = (dir: -1 | 1) => {
    if (heroSlides.length <= 1) return;
    setHeroActiveIndex((i) =>
      dir < 0 ? (i - 1 + heroSlides.length) % heroSlides.length : (i + 1) % heroSlides.length
    );
    setHeroAutoplayKey((k) => k + 1);
  };

  const goHeroTo = (index: number) => {
    if (heroSlides.length <= 1 || index === heroActiveIndex) return;
    setHeroActiveIndex(index);
    setHeroAutoplayKey((k) => k + 1);
  };

  const escapeBgUrl = (url: string) => url.replace(/'/g, "%27");

  return (
    <div className="bg-white">
      {/* Hero: 이미지 전환만 (문구·어두운 오버레이 없음). 높이는 뷰포트 기준으로 확실히 보이게 */}
      <section className="relative min-h-screen w-full overflow-hidden bg-neutral-100">
        <div className="absolute inset-0" aria-hidden>
          {heroSlides.map((url, i) => (
            <div
              key={`${i}-${url.slice(0, 48)}`}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms] ease-in-out"
              style={{
                backgroundImage: `url('${escapeBgUrl(url)}')`,
                opacity: i === heroActiveIndex ? 1 : 0,
                zIndex: i === heroActiveIndex ? 1 : 0,
              }}
            />
          ))}
        </div>

        {heroSlides.length > 1 && (
          <>
            <div
              className="absolute inset-0 z-[2] flex items-center justify-between px-3 sm:px-6 md:px-10 pointer-events-none"
              aria-label="히어로 이미지 슬라이드"
            >
              <button
                type="button"
                onClick={() => goHero(-1)}
                aria-label="이전 히어로 이미지"
                className="pointer-events-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white shadow-lg backdrop-blur-md transition hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => goHero(1)}
                aria-label="다음 히어로 이미지"
                className="pointer-events-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white shadow-lg backdrop-blur-md transition hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
              </button>
            </div>

            <div
              className="absolute bottom-8 left-1/2 z-[2] flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 sm:bottom-10"
              role="tablist"
              aria-label="히어로 슬라이드 위치"
            >
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === heroActiveIndex}
                  aria-label={`${i + 1}번째 이미지로 이동`}
                  onClick={() => goHeroTo(i)}
                  className={
                    i === heroActiveIndex
                      ? "h-2 w-8 rounded-full bg-white shadow transition"
                      : "h-2 w-2 rounded-full bg-white/45 shadow transition hover:bg-white/75"
                  }
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Best Portfolios */}
      <section className="py-32 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex flex-col items-center text-center mb-12 md:mb-20 gap-6 md:gap-8">
            <div className="max-w-3xl mx-auto flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200 mb-6">
                <TrendingUp className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-900 font-medium">베스트 프로젝트</span>
              </div>
              <h2 className="text-5xl md:text-6xl mb-6 tracking-tight">최근 완료된<br />프리미엄 공간</h2>
              <p className="text-xl text-gray-600">실제 고객의 성공 스토리를 확인하세요</p>
            </div>
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 text-black hover:gap-4 transition-all font-medium"
            >
              전체 보기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">로딩 중...</div>
          ) : portfolioProjects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">등록된 프로젝트가 없습니다.</div>
          ) : (
            <div className="relative">
              {showCarouselNav && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 md:mb-8 text-sm text-gray-500">
                  <span>
                    {portfolioProjects.length}개 중 {carouselStart + 1}–{rangeEnd}번째
                  </span>
                </div>
              )}
              <div className="flex items-stretch gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                <button
                  type="button"
                  aria-label="이전 프로젝트"
                  disabled={!canPrev}
                  onClick={() => stepCarousel(-1)}
                  className="hidden sm:flex shrink-0 w-12 h-12 md:w-14 md:h-14 self-center items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
                </button>

                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-x-10 md:gap-y-12 lg:gap-x-12 lg:gap-y-14">
                  {visiblePortfolios.map((project) => (
                    <PortfolioProjectCard key={project.id} project={project} />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="다음 프로젝트"
                  disabled={!canNext}
                  onClick={() => stepCarousel(1)}
                  className="hidden sm:flex shrink-0 w-12 h-12 md:w-14 md:h-14 self-center items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
                </button>
              </div>

              {showCarouselNav && (
                <div className="flex sm:hidden justify-center gap-8 mt-10">
                  <button
                    type="button"
                    aria-label="이전"
                    disabled={!canPrev}
                    onClick={() => stepCarousel(-1)}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-30"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    aria-label="다음"
                    disabled={!canNext}
                    onClick={() => stepCarousel(1)}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-30"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-900 font-medium">간편한 프로세스</span>
            </div>
            <p className="text-xl text-gray-600">체계적인 프로세스로 신뢰할 수 있는 시공을 약속합니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            {/* Connecting Lines - Hidden on mobile */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 mx-[10%]" />
            
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="relative inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 mb-8 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-2 bg-white rounded-3xl shadow-sm" />
                <FileText className="relative w-12 h-12 md:w-16 md:h-16 text-blue-600 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-2xl mb-3 font-semibold">문의</h3>
              <p className="text-gray-600 leading-relaxed">
                온라인 폼 또는 전화로<br />
                간편하게 문의하세요
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="relative inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 mb-8 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-2 bg-white rounded-3xl shadow-sm" />
                <Ruler className="relative w-12 h-12 md:w-16 md:h-16 text-blue-600 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-2xl mb-3 font-semibold">현장 방문</h3>
              <p className="text-gray-600 leading-relaxed">
                전문가가 방문하여<br />
                정확한 측정과 상담 진행
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="relative inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 mb-8 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-2 bg-white rounded-3xl shadow-sm" />
                <HardHat className="relative w-12 h-12 md:w-16 md:h-16 text-blue-600 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-2xl mb-3 font-semibold">시공</h3>
              <p className="text-gray-600 leading-relaxed">
                숙련된 전문팀이<br />
                체계적으로 시공 진행
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative text-center group">
              <div className="relative inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 mb-8 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-2 bg-white rounded-3xl shadow-sm" />
                <ShieldCheck className="relative w-12 h-12 md:w-16 md:h-16 text-blue-600 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  4
                </div>
              </div>
              <h3 className="text-2xl mb-3 font-semibold">완공 및 케어</h3>
              <p className="text-gray-600 leading-relaxed">
                최종 점검 후<br />
                지속적인 A/S 제공
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-900 font-medium">1분이면 충분합니다</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl mb-8 text-black tracking-tight leading-tight">
            지금 바로<br />
            <span className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">무료 견적</span>을<br />
            받아보세요
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            투명하고 합리적인 견적을 제공합니다
          </p>
          
          <Link 
            to="/estimate"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black px-12 py-6 rounded-full transition-all text-xl font-semibold shadow-2xl shadow-yellow-400/25 hover:shadow-yellow-400/40 hover:scale-105"
          >
            견적 요청하기
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}