import { useState, useEffect, useMemo } from "react";
import { Tag } from "lucide-react";
import { getPortfolios } from "../../lib/api";
import { PORTFOLIO_INDUSTRY_OPTIONS } from "../../lib/portfolioIndustries";
import { PortfolioProjectCard, mapPortfolioToCardProject, type PortfolioCardProject } from "../components/PortfolioProjectCard";

export function PortfolioPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("전체");

  const [visibleCount, setVisibleCount] = useState(6);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioCardProject[]>([]);
  const [loading, setLoading] = useState(true);

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
      {/* Header — architectural studio tone (warm stone, subtle plan grid) */}
      <div className="relative overflow-hidden border-b border-stone-200/90 bg-gradient-to-br from-[#faf8f4] via-[#f0ebe3] to-[#e5ddd3]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(to right, rgb(120 113 108 / 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(120 113 108 / 0.07) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(146,64,14,0.09),transparent_55%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/25 to-transparent" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300/70 bg-white/55 backdrop-blur-sm text-stone-700 shadow-sm mb-6">
              <Tag className="w-4 h-4 text-amber-800/90 shrink-0" aria-hidden />
              <span className="text-sm font-medium tracking-wide">500+ 완료 프로젝트</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-5 tracking-tight text-stone-900 font-semibold">
              포트폴리오
            </h1>
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-xl">
              성공적인 프로젝트를 확인하고 영감을 얻으세요
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