import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Tag } from "lucide-react";
import { getPortfolios } from "../../lib/api";
import { PORTFOLIO_INDUSTRY_OPTIONS } from "../../lib/portfolioIndustries";
import { SITE_BRANDING } from "../../lib/siteBranding";
import { PortfolioProjectCard, mapPortfolioToCardProject, type PortfolioCardProject } from "../components/PortfolioProjectCard";

export function PortfolioPage() {
  const [searchParams] = useSearchParams();
  const industryFromUrl = searchParams.get("industry");
  const [selectedIndustry, setSelectedIndustry] = useState<string>(() => {
    if (industryFromUrl && (PORTFOLIO_INDUSTRY_OPTIONS as readonly string[]).includes(industryFromUrl)) {
      return industryFromUrl;
    }
    return "전체";
  });

  const [visibleCount, setVisibleCount] = useState(6);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioCardProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (industryFromUrl && (PORTFOLIO_INDUSTRY_OPTIONS as readonly string[]).includes(industryFromUrl)) {
      setSelectedIndustry(industryFromUrl);
    }
  }, [industryFromUrl]);

  useEffect(() => {
    getPortfolios()
      .then((list) => {
        setPortfolioProjects(list.map(mapPortfolioToCardProject));
      })
      .catch(() => setPortfolioProjects([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedIndustry]);

  const filteredProjects = useMemo(() => {
    if (selectedIndustry === "전체") return portfolioProjects;
    return portfolioProjects.filter((p) => p.industry === selectedIndustry);
  }, [portfolioProjects, selectedIndustry]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredProjects.length));
  };

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/80 to-white">
      {/* Header — wood workshop hero */}
      <div className="relative min-h-[22rem] overflow-hidden border-b border-stone-200/90 md:min-h-[26rem]">
        <img
          src="/portfolio-hero-woodwork.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[72%_center] md:object-[78%_center]"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#faf8f4] via-[#f3ede4]/94 to-[#e8dfd3]/35 md:via-[#f0ebe3]/88 md:to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_90%_at_0%_50%,rgba(250,248,244,0.97),transparent_68%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.28]"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(to right, rgb(120 113 108 / 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(120 113 108 / 0.08) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/25 to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-stone-700 shadow-sm backdrop-blur-sm">
              <Tag className="h-4 w-4 shrink-0 text-amber-800/90" aria-hidden />
              <span className="text-sm font-medium tracking-wide">500+ 완료 프로젝트</span>
            </div>
            <h1 className="mb-5 text-3xl font-semibold tracking-tight leading-snug text-stone-900 sm:text-4xl md:text-5xl md:leading-tight">
              포트폴리오
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-stone-600 md:text-xl">
              {SITE_BRANDING.portfolioSubtitleLead}
              <br />
              {SITE_BRANDING.portfolioSubtitleCta}
            </p>
          </div>
        </div>
      </div>

      {/* 업종 카테고리 */}
      <div className="bg-[#fafaf8]/95 backdrop-blur-xl border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <p className="text-sm font-medium text-stone-600 mb-3 tracking-wide">업종</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedIndustry("전체")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedIndustry === "전체"
                  ? "bg-stone-800 text-white shadow-sm ring-1 ring-stone-700/30"
                  : "bg-stone-100/90 text-stone-700 hover:bg-stone-200/90 border border-stone-200/80"
              }`}
            >
              전체
            </button>
            {PORTFOLIO_INDUSTRY_OPTIONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedIndustry(label)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedIndustry === label
                    ? "bg-stone-800 text-white shadow-sm ring-1 ring-stone-700/30"
                    : "bg-stone-100/90 text-stone-700 hover:bg-stone-200/90 border border-stone-200/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-8 text-stone-600">
          {loading ? "로딩 중..." : `총 ${filteredProjects.length}개의 프로젝트`}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {!loading && visibleProjects.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-500">등록된 프로젝트가 없습니다.</div>
          )}
          {visibleProjects.map((project) => (
            <PortfolioProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-16">
            <button
              type="button"
              className="px-8 py-4 rounded-full bg-stone-800 text-white hover:bg-stone-900 transition-all shadow-md shadow-stone-900/10 hover:shadow-lg hover:scale-[1.02] ring-1 ring-stone-700/20"
              onClick={loadMore}
            >
              더 많은 프로젝트 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}