import { Outlet, Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState, useLayoutEffect } from "react";
import { SiteFooter } from "./SiteFooter";
import { FloatingSocialLinks } from "./FloatingSocialLinks";

export function MainLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /** 라우트 이동마다 항상 페이지 최상단으로 (스크롤 복원 이슈 방지) */
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search]);

  const isAdmin = location.pathname === '/admin';

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/portfolio', label: '포트폴리오' },
    { path: '/estimate', label: '견적 요청' },
    { path: '/admin', label: '관리자' },
  ];

  const publicNav =
    "border-b border-stone-200/70 bg-gradient-to-b from-[#fdfcfa] via-[#faf8f4]/98 to-[#f5f0e8]/95 shadow-[0_12px_40px_-16px_rgba(28,25,23,0.12),inset_0_1px_0_0_rgba(255,255,255,0.85)] backdrop-blur-2xl";

  const adminNav =
    "border-b border-white/[0.08] bg-gradient-to-b from-[#121212]/98 via-[#0c0c0c]/98 to-[#080808]/95 shadow-[0_16px_48px_-20px_rgba(0,0,0,0.65)] backdrop-blur-2xl";

  return (
    <div className="min-h-screen bg-white">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[box-shadow,background-color] duration-300 ${
          isAdmin ? adminNav : publicNav
        }`}
      >
        {!isAdmin && (
          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-amber-700/35 to-transparent"
            aria-hidden
          />
        )}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className={`group flex items-center shrink-0 rounded-2xl transition-[box-shadow,transform] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isAdmin
                  ? "p-1.5 ring-1 ring-white/10 bg-white/[0.04] hover:bg-white/[0.07] focus-visible:ring-white/35"
                  : "p-1.5 ring-1 ring-stone-200/80 bg-white/70 shadow-[0_2px_12px_-4px_rgba(28,25,23,0.08)] hover:ring-amber-900/15 hover:shadow-[0_8px_28px_-10px_rgba(120,83,50,0.18)] focus-visible:ring-amber-800/35"
              }`}
            >
              <img
                src="/soulin-nav-logo.png"
                alt="Soulin woodwork — 설린 우드팩토리"
                width={200}
                height={48}
                decoding="async"
                className="h-9 sm:h-10 w-auto max-w-[min(200px,50vw)] object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="sr-only">설린 우드팩토리 홈으로 이동</span>
            </Link>

            {/* Desktop — capsule menu */}
            <div
              className={`hidden md:inline-flex items-center rounded-full p-1 gap-0.5 ${
                isAdmin
                  ? "bg-white/[0.06] ring-1 ring-white/[0.1] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                  : "bg-gradient-to-b from-white/95 to-stone-50/90 ring-1 ring-stone-200/90 shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_10px_32px_-14px_rgba(28,25,23,0.14)]"
              }`}
            >
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                const isEstimate = item.path === "/estimate";
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative rounded-full px-5 py-2 text-[13px] font-medium tracking-[0.04em] transition-all duration-200 ${
                      active
                        ? isAdmin
                          ? "text-white bg-white/[0.14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                          : "text-stone-50 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 shadow-[0_4px_14px_-4px_rgba(28,25,23,0.45),inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                        : isAdmin
                          ? "text-stone-400 hover:text-white hover:bg-white/[0.06]"
                          : isEstimate
                            ? "text-stone-700 hover:text-stone-950 hover:bg-amber-50/90 ring-1 ring-transparent hover:ring-amber-200/60"
                            : "text-stone-600 hover:text-stone-950 hover:bg-white/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              className={`md:hidden rounded-full p-2.5 transition-all duration-200 ${
                isAdmin
                  ? "text-white ring-1 ring-white/15 bg-white/[0.06] hover:bg-white/10"
                  : "text-stone-800 ring-1 ring-stone-200/90 bg-white/80 shadow-sm hover:bg-white hover:shadow-md hover:ring-stone-300/80"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div
              className={`md:hidden mt-4 overflow-hidden rounded-2xl border shadow-2xl ${
                isAdmin
                  ? "border-white/10 bg-[#141414]/95 backdrop-blur-xl"
                  : "border-stone-200/80 bg-white/95 backdrop-blur-xl shadow-stone-900/10"
              }`}
            >
              <div className="p-2 space-y-0.5">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-4 py-3.5 text-sm font-medium tracking-wide rounded-xl transition-colors ${
                        active
                          ? isAdmin
                            ? "bg-white/12 text-white"
                            : "bg-gradient-to-r from-stone-800 to-stone-900 text-white shadow-md"
                          : isAdmin
                            ? "text-stone-400 hover:bg-white/[0.06] hover:text-white"
                            : "text-stone-700 hover:bg-stone-100/90"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className={isAdmin ? "pt-[72px]" : "pt-[78px] sm:pt-[82px]"}>
        <Outlet />
      </main>
      {!isAdmin && <SiteFooter />}
      {!isAdmin && <FloatingSocialLinks />}
    </div>
  );
}