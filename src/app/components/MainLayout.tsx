import { Outlet, Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState, useLayoutEffect } from "react";
import { SiteFooter } from "./SiteFooter";
import { FloatingSocialLinks } from "./FloatingSocialLinks";
import { SITE_BRANDING } from "../../lib/siteBranding";

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
          <div className="flex h-[4.75rem] sm:h-[5.25rem] items-center justify-between gap-3 sm:gap-5">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4">
            <Link
              to="/"
              className={`group flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm ${
                isAdmin ? "focus-visible:ring-white/30" : "focus-visible:ring-amber-900/25"
              }`}
            >
              <img
                src="/soulin-nav-logo.png?v=3"
                alt="Soulin woodwork — 설린 우드팩토리"
                width={292}
                height={123}
                decoding="async"
                className={`h-9 w-auto max-w-[min(200px,46vw)] object-contain object-left transition-opacity duration-200 sm:h-11 sm:max-w-[min(260px,58vw)] md:h-12 md:max-w-[min(300px,72vw)] ${
                  isAdmin ? "opacity-95 brightness-110 contrast-[1.03]" : "opacity-[0.98] group-hover:opacity-100"
                }`}
              />
              <span className="sr-only">설린 우드팩토리 홈으로 이동</span>
            </Link>

            {!isAdmin && (
              <>
                <span
                  className="hidden h-7 w-px shrink-0 bg-gradient-to-b from-transparent via-stone-300/90 to-transparent sm:block"
                  aria-hidden
                />
                <p className="min-w-0 flex-1 truncate text-[10px] font-medium tracking-[0.07em] text-stone-600 sm:text-[11px] md:text-xs md:tracking-[0.06em]">
                  {SITE_BRANDING.headerTagline}
                </p>
              </>
            )}
            </div>

            <div className="hidden md:flex items-center gap-1 shrink-0 lg:gap-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 lg:px-5 py-2.5 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.18em] transition-colors duration-200 after:pointer-events-none after:absolute after:left-4 after:right-4 lg:after:left-5 lg:after:right-5 after:bottom-0.5 after:h-px after:transition-all after:duration-300 ${
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
              className={`md:hidden rounded-sm p-2.5 transition-colors ${
                isAdmin ? "text-zinc-300 hover:text-white" : "text-stone-700 hover:text-stone-950"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {mobileMenuOpen ? <X className="w-7 h-7 stroke-[1.5]" /> : <Menu className="w-7 h-7 stroke-[1.5]" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div
              className={`md:hidden border-t ${
                isAdmin ? "border-white/[0.06] bg-zinc-950" : "border-stone-200/80 bg-[#fcfcfb]"
              }`}
            >
              {!isAdmin && (
                <div className="px-4 pt-3 pb-3.5 border-b border-stone-200/70 bg-stone-50/40">
                  <p className="text-[11px] font-medium tracking-[0.07em] text-stone-600 leading-relaxed">
                    {SITE_BRANDING.headerTagline}
                  </p>
                </div>
              )}
              <div
                className={`flex flex-col divide-y pb-3 ${isAdmin ? "divide-white/[0.08]" : "divide-stone-200/80"}`}
              >
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-1 py-4 text-sm font-semibold uppercase tracking-[0.18em] transition-colors ${
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

      <main className={isAdmin ? "pt-[4.75rem] sm:pt-[5.25rem]" : "pt-[calc(2px+4.75rem)] sm:pt-[calc(2px+5.25rem)]"}>
        <Outlet />
      </main>
      {!isAdmin && <SiteFooter />}
      {!isAdmin && <FloatingSocialLinks />}
    </div>
  );
}
