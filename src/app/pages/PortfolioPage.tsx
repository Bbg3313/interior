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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Tag className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">500+ 완료 프로젝트</span>
            </div>
            <h1 className="text-6xl md:text-7xl mb-6 tracking-tight">포트폴리오</h1>
            <p className="text-xl text-gray-400">성공적인 프로젝트를 확인하고 영감을 얻으세요</p>
          </div>
        </div>
      </div>

      {/* 업종 카테고리 */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <p className="text-sm font-medium text-gray-700 mb-3">업종</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedIndustry("전체")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedIndustry === "전체"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {PORTFOLIO_INDUSTRY_OPTIONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedIndustry(label)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedIndustry === label
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
        <div className="mb-8 text-gray-600">
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
            <button className="px-8 py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:scale-105" onClick={loadMore}>
              더 많은 프로젝트 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}