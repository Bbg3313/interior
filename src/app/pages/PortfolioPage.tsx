import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { MapPin, Ruler, Tag } from "lucide-react";
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && visibleProjects.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-500">등록된 프로젝트가 없습니다.</div>
          )}
          {visibleProjects.map((project) => (
            <Link
              key={project.id}
              to={`/portfolio/${project.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 block"
            >
              {/* Project Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black text-xs font-semibold rounded-full">
                    {project.industry}
                  </span>
                  <span className="px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {project.style}
                  </span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-8">
                <h3 className="text-2xl mb-3 group-hover:text-yellow-600 transition-colors">{project.name}</h3>
                
                {/* Meta Information Grid */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Ruler className="w-4 h-4 flex-shrink-0" />
                    <span>면적 {project.area} · 공사 기간 {project.duration}</span>
                  </div>
                </div>

                {/* Budget - Prominent */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">총 시공비</div>
                  <div className="text-3xl font-light text-black">{project.budget}</div>
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