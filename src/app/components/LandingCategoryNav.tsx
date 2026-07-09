import { useState } from "react";
import { Link } from "react-router";
import { Home, Store, Armchair, Presentation } from "lucide-react";
import { LANDING_CATEGORY_MENU } from "../../lib/landingCategories";

const ICONS = [Home, Store, Armchair, Presentation] as const;

export function LandingCategoryNav() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <nav aria-label="시공 분야 바로가기" className="mx-auto max-w-5xl">
      <div className="relative px-2 sm:px-6">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-[2.75rem] hidden h-px bg-stone-300/90 sm:block md:top-[3.25rem]"
          aria-hidden
        />

        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
          {LANDING_CATEGORY_MENU.map((item, index) => {
            const Icon = ICONS[index];
            const isActive = activeIndex === index;

            return (
              <li key={item.industry} className="flex justify-center">
                <Link
                  to={`/portfolio?industry=${encodeURIComponent(item.industry)}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                  className="group flex w-full max-w-[9.5rem] flex-col items-center text-center sm:max-w-[10.5rem]"
                >
                  <div className="relative mb-4 flex h-[5.5rem] w-[5.5rem] items-center justify-center md:h-[6.5rem] md:w-[6.5rem]">
                    <div
                      className={`absolute inset-0 rotate-45 rounded-sm shadow-md transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-amber-500 to-amber-700 shadow-amber-700/25 scale-105"
                          : "bg-gradient-to-br from-stone-600 to-stone-700 shadow-stone-900/15 group-hover:from-amber-500 group-hover:to-amber-700 group-hover:shadow-amber-700/20 group-hover:scale-105"
                      }`}
                    />
                    <div className="absolute inset-[3px] rotate-45 overflow-hidden rounded-sm">
                      <img
                        src={item.image}
                        alt=""
                        className={`h-full w-full scale-[1.45] object-cover transition-opacity duration-300 ${
                          isActive ? "opacity-35" : "opacity-25 group-hover:opacity-35"
                        }`}
                      />
                    </div>
                    <Icon
                      className={`relative h-7 w-7 transition-colors duration-300 md:h-8 md:w-8 ${
                        isActive ? "text-white" : "text-white/95"
                      }`}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold tracking-tight transition-colors duration-300 md:text-base ${
                      isActive ? "text-amber-700" : "text-stone-800 group-hover:text-amber-700"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
