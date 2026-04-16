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
    "border-b border-stone-200/90 bg-[#faf9f6]/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] backdrop-blur-xl";

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation — warm stone / architectural studio tone (no harsh black) */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all ${
          isAdmin ? "border-b border-white/10 bg-[#0c0c0c]/95 backdrop-blur-xl" : publicNav
        }`}
      >
        {!isAdmin && (
          <div
            className="h-[3px] w-full bg-gradient-to-r from-stone-300/40 via-amber-800/25 to-stone-300/40"
            aria-hidden
          />
        )}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              {!isAdmin && (
                <span
                  className="hidden sm:block h-8 w-px shrink-0 bg-gradient-to-b from-transparent via-stone-400/50 to-transparent"
                  aria-hidden
                />
              )}
              <span
                className={`text-xl sm:text-2xl tracking-tight font-semibold ${isAdmin ? "text-white" : "text-stone-800"}`}
              >
                Interior
                <span
                  className={`ml-2 sm:ml-2.5 inline-block align-middle text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] px-2 py-1 border transition-colors ${
                    isAdmin
                      ? "border-white/25 text-stone-300 bg-white/5"
                      : "border-stone-400/50 text-stone-600 bg-white/70 group-hover:border-stone-500/60"
                  }`}
                >
                  Pro
                </span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2.5 text-sm font-medium tracking-wide transition-colors ${
                    location.pathname === item.path
                      ? isAdmin
                        ? "text-white after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px after:bg-white/70"
                        : "text-stone-900 after:absolute after:bottom-1.5 after:left-4 after:right-4 after:h-[2px] after:rounded-full after:bg-amber-800/70"
                      : isAdmin
                        ? "text-stone-400 hover:text-white"
                        : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={`md:hidden rounded-md p-2 transition-colors ${
                isAdmin ? "text-white hover:bg-white/10" : "text-stone-700 hover:bg-stone-200/50"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className={`md:hidden mt-4 pt-4 border-t space-y-1 ${
                isAdmin ? "border-white/10" : "border-stone-200/90"
              }`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-3 text-sm font-medium tracking-wide rounded-md transition-colors ${
                    location.pathname === item.path
                      ? isAdmin
                        ? "bg-white/10 text-white"
                        : "bg-stone-200/60 text-stone-900 border border-stone-300/50"
                      : isAdmin
                        ? "text-stone-400 hover:bg-white/5 hover:text-white"
                        : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Page Content — offset matches nav + optional accent strip */}
      <main className={isAdmin ? "pt-[73px]" : "pt-[77px] sm:pt-[81px]"}>
        <Outlet />
      </main>
      {!isAdmin && <SiteFooter />}
      {!isAdmin && <FloatingSocialLinks />}
    </div>
  );
}