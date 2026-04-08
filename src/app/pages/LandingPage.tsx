import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, Sparkles, TrendingUp, FileText, Ruler, HardHat, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { getPortfolios, getReviews, getSiteSetting } from "../../lib/api";
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
  const [heroImageUrl, setHeroImageUrl] = useState(defaultHeroUrl);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(1);
  const [carouselStart, setCarouselStart] = useState(0);

  useEffect(() => {
    const updatePageSize = () => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(min-width: 1024px)").matches) setPageSize(3);
      else if (window.matchMedia("(min-width: 768px)").matches) setPageSize(2);
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
        const [portfolios, reviewsData, heroUrl] = await Promise.all([
          getPortfolios(),
          getReviews(),
          getSiteSetting("hero_image_url"),
        ]);
        if (cancelled) return;
        if (heroUrl && heroUrl.trim()) setHeroImageUrl(heroUrl.trim());
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

  const maxCarouselStart = Math.max(0, portfolioProjects.length - pageSize);

  useEffect(() => {
    setCarouselStart((s) => Math.min(s, maxCarouselStart));
  }, [maxCarouselStart, portfolioProjects.length]);

  const visiblePortfolios = useMemo(
    () => portfolioProjects.slice(carouselStart, carouselStart + pageSize),
    [portfolioProjects, carouselStart, pageSize]
  );

  const canPrev = carouselStart > 0;
  const canNext = carouselStart < maxCarouselStart;
  const showCarouselNav = portfolioProjects.length > pageSize;
  const rangeEnd = Math.min(carouselStart + pageSize, portfolioProjects.length);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('${heroImageUrl.replace(/'/g, "%27")}')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto py-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/90">500+ 프로젝트 완료</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white mb-8 tracking-tight leading-none">
            Premium<br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Interior Solutions
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            1분 만에 투명한 견적을 받아보세요<br />
            당신의 비즈니스를 위한<br />
            프리미엄 공간 디자인
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/estimate"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black px-10 py-5 rounded-full transition-all text-lg font-semibold shadow-2xl shadow-yellow-400/25 hover:shadow-yellow-400/40 hover:scale-105"
            >
              무료 견적 시작하기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/portfolio"
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-10 py-5 rounded-full transition-all text-lg font-medium border border-white/20 hover:border-white/40"
            >
              포트폴리오 보기
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Best Portfolios */}
      <section className="py-32 px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 text-sm text-gray-500">
                  <span>
                    {portfolioProjects.length}개 중 {carouselStart + 1}–{rangeEnd}번째
                  </span>
                </div>
              )}
              <div className="flex items-stretch gap-2 sm:gap-3 md:gap-4">
                <button
                  type="button"
                  aria-label="이전 프로젝트"
                  disabled={!canPrev}
                  onClick={() => setCarouselStart((s) => Math.max(0, s - 1))}
                  className="hidden sm:flex shrink-0 w-11 h-11 md:w-12 md:h-12 self-center items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {visiblePortfolios.map((project) => (
                    <PortfolioProjectCard key={project.id} project={project} />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="다음 프로젝트"
                  disabled={!canNext}
                  onClick={() => setCarouselStart((s) => Math.min(maxCarouselStart, s + 1))}
                  className="hidden sm:flex shrink-0 w-11 h-11 md:w-12 md:h-12 self-center items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {showCarouselNav && (
                <div className="flex sm:hidden justify-center gap-6 mt-6">
                  <button
                    type="button"
                    aria-label="이전"
                    disabled={!canPrev}
                    onClick={() => setCarouselStart((s) => Math.max(0, s - 1))}
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="다음"
                    disabled={!canNext}
                    onClick={() => setCarouselStart((s) => Math.min(maxCarouselStart, s + 1))}
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
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