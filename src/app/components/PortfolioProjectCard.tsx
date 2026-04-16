import { Link } from "react-router";
import { MapPin } from "lucide-react";
import type { Portfolio } from "../../types";
import { formatPortfolioBudgetDisplay } from "../../lib/formatPortfolioBudget";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1676716244847-3fae1a2afb5b?w=1080";

export type PortfolioCardProject = {
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

export function mapPortfolioToCardProject(p: Portfolio): PortfolioCardProject {
  return {
    id: p.id,
    image: p.imageUrl.startsWith("http") ? p.imageUrl : FALLBACK_IMAGE,
    name: p.name,
    location: p.location,
    area: p.area,
    budget: formatPortfolioBudgetDisplay(p.budget),
    industry: p.industry,
    style: p.style,
    duration: p.duration,
  };
}

export function PortfolioProjectCard({ project }: { project: PortfolioCardProject }) {
  return (
    <Link
      to={`/portfolio/${project.id}`}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100/80 block bg-black h-full"
    >
      <div className="aspect-[3/4] min-h-[280px] sm:min-h-[320px] overflow-hidden relative">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />
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
  );
}
