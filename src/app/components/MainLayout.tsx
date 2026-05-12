import { Outlet, Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState, useLayoutEffect } from "react";
import { SiteFooter } from "./SiteFooter";
import { FloatingSocialLinks } from "./FloatingSocialLinks";

export function MainLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search]);

  const isAdmin = location.pathname === "/admin";

  const navItems = [
    { path: "/", label: "홈" },
    { path: "/portfolio", label: "포트폴리오" },
    { path: "/estimate", label: "견적 요청" },
    { path: "/admin", label: "관리자" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${
          isAdmin
            ? "border-b border-white/[0.06] bg-zinc-950/95 backdrop-blur-md"
            : "border-b border-stone-200/90 bg-[#fcfcfb]/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset]"
        }`}
      >
        {!isAdmin && (
          <div className="flex h-[2px] w-full" aria-hidden>
            <div className="flex-1 bg-gradient-to-r from-transparent via-amber-900/25 to-stone-400/30" />
            <div className="w-px shrink-0 bg-stone-300/40" />
            <div className="flex-1 bg-gradient-to-l from-transparent via-stone-500/20 to-amber-900/20" />
          </div>
        )}

        <nav className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex h-[4.25rem] sm:h-[4.5rem] items-center justify-between gap-6">
            <Link
              to="/"
              className={`group flex min-w-0 items-center gap-3 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm ${
                isAdmin ? "focus-visible:ring-white/30" : "focus-visible:ring-amber-900/25"
              }`}
            >
              <img
                src="/soulin-nav-mark.svg"
                alt="Soulin — 설린 우드팩토리"
                width={232}
                height={40}
                decoding="async"
                className={`h-8 sm:h-9 w-auto max-w-[min(200px,58vw)] shrink-0 object-left object-contain transition-opacity duration-200 ${
                  isAdmin ? "opacity-[0.92] [filter:brightness(1.15)_contrast(1.05)]" : "opacity-[0.97] group-hover:opacity-100"
                }`}
              />
              {!isAdmin && (
                <div className="hidden min-[380px]:flex flex-col justify-center border-l border-stone-200/90 pl-3 sm:pl-4">
                  <span className="text-[9px] font-semibold tracking-[0.35em] text-stone-500 leading-none">건축</span>
                  <span className="mt-1 text-[9px] font-semibold tracking-[0.28em] text-stone-400 leading-none">
                    인테리어
                  </span>
                </div>
              )}
              <span className="sr-only">설린 우드팩토리 홈으로 이동</span>
            </Link>

            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 lg:px-4 py-2 text-[11px] lg:text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 after:pointer-events-none after:absolute after:left-3 after:right-3 lg:after:left-4 lg:after:right-4 after:bottom-0 after:h-px after:transition-all after:duration-300 ${
                      active
                        ? isAdmin
                          ? "text-white after:opacity-100 after:bg-white/65"
                          : "text-stone-900 after:opacity-100 after:bg-gradient-to-r after:from-transparent after:via-amber-900/70 after:to-transparent"
                        : isAdmin
                          ? "text-zinc-500 hover:text-zinc-200 after:opacity-0 hover:after:opacity-50 after:bg-white/45"
                          : "text-stone-500 hover:text-stone-800 after:opacity-0 hover:after:opacity-70 after:bg-stone-800/30"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              className={`md:hidden rounded-sm p-2 transition-colors ${
                isAdmin ? "text-zinc-300 hover:text-white" : "text-stone-700 hover:text-stone-950"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div
              className={`md:hidden border-t ${
                isAdmin ? "border-white/[0.06] bg-zinc-950" : "border-stone-200/80 bg-[#fcfcfb]"
              }`}
            >
              <div
                className={`flex flex-col divide-y pb-3 ${isAdmin ? "divide-white/[0.08]" : "divide-stone-200/80"}`}
              >
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-1 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                        active
                          ? isAdmin
                            ? "text-white bg-white/[0.04]"
                            : "text-stone-900 bg-stone-100/60"
                          : isAdmin
                            ? "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                            : "text-stone-600 hover:text-stone-900 hover:bg-stone-50/80"
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
        </nav>
      </header>

      <main className={isAdmin ? "pt-[68px]" : "pt-[calc(2px+4.25rem)] sm:pt-[calc(2px+4.5rem)]"}>
        <Outlet />
      </main>
      {!isAdmin && <SiteFooter />}
      {!isAdmin && <FloatingSocialLinks />}
    </div>
  );
}
