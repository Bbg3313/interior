import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { MapPin, Tag } from "lucide-react";
import { getPortfolios } from "../../lib/api";
import { PORTFOLIO_INDUSTRY_OPTIONS } from "../../lib/portfolioIndustries";

type ProjectItem = {
  id: number;
  image: string;
  name: string;
  location: string;
  area: string;
  budget: string;
  industry: string;
  style: string;
  duration: string;
};

export function PortfolioPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("전체");

  const [visibleCount, setVisibleCount] = useState(6);
  const [portfolioProjects, setPortfolioProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolios()
      .then((list) => {
        setPortfolioProjects(
          list.map((p) => ({
            id: p.id,
            image: p.imageUrl.startsWith("http") ? p.imageUrl : `https://images.unsplash.com/photo-1676716244847-3fae1a2afb5b?w=1080`,
            name: p.name,
            location: p.location,
            area: p.area,
            budget: p.budget,
            industry: p.industry,
            style: p.style,
            duration: p.duration,
          }))
        );
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
            <Link
              key={project.id}
              to={`/portfolio/${project.id}`}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100/80 block bg-black"
            >
              {/* 이미지 중심: 세로 비율을 키워 인테리어 사진이 돋보이게 */}
              <div className="aspect-[3/4] min-h-[280px] sm:min-h-[320px] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
                {/* 항상 읽기 쉬운 하단 그라데이션 + 호버 시 살짝 진하게 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 group-hover:from-black/90 transition-all duration-500" />

                <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 bg-white/92 backdrop-blur-sm text-black text-[11px] font-semibold rounded-full shadow-sm">
                    {project.industry}
                  </span>
                  <span className="px-2.5 py-1 bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium rounded-full">
                    {project.style}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2 line-clamp-2 group-hover:text-amber-100 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-white/85 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 opacity-90" aria-hidden />
                    <span className="truncate">{project.location}</span>
                  </div>
                  <p className="text-xs text-white/65 mb-3 line-clamp-1">
                    면적 {project.area} · {project.duration}
                  </p>
                  <div className="flex items-baseline justify-between gap-3 pt-2 border-t border-white/20">
                    <span className="text-[11px] uppercase tracking-wider text-white/55">시공비</span>
                    <span className="text-lg sm:text-xl font-medium text-white tabular-nums">{project.budget}</span>
                  </div>
                  <p className="mt-3 text-[11px] text-white/45">상세 보기 →</p>
                </div>
              </div>
            </Link>
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