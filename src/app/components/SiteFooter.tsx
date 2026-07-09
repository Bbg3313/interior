import type { ReactNode } from "react";
import { Link } from "react-router";
import { kakaoChannelUrl, instagramProfileUrl } from "../../lib/socialUrls";
import { SITE_BUSINESS } from "../../lib/siteBusinessInfo";
import { SITE_BRANDING } from "../../lib/siteBranding";

const B = SITE_BUSINESS;

const sectionLabel =
  "text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400 mb-3";

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 text-xs leading-relaxed sm:text-[13px]">
      <dt className="w-[5.5rem] shrink-0 text-stone-400 sm:w-24">{label}</dt>
      <dd className="min-w-0 text-stone-700">{children}</dd>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#f5f4f1] text-stone-600">
      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="inline-block opacity-90 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
            >
              <img
                src="/soulin-woodwork-logo.png"
                alt="설린 우드팩토리"
                className="h-7 w-auto max-w-[180px] object-contain object-left sm:h-8"
              />
            </Link>
            <p className="mt-3 text-sm font-semibold tracking-tight text-stone-900">{B.tradeName}</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-stone-500">
              {SITE_BRANDING.headerPrimary}
              <span className="text-stone-400"> · </span>
              {SITE_BRANDING.headerSecondary}
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className={sectionLabel}>Navigate</p>
            <ul className="space-y-2 text-sm text-stone-700">
              <li>
                <Link to="/portfolio" className="hover:text-stone-950 transition-colors">
                  포트폴리오
                </Link>
              </li>
              <li>
                <Link to="/estimate" className="hover:text-stone-950 transition-colors">
                  견적 요청
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <p className={sectionLabel}>Contact</p>
            <div className="space-y-1">
              <a
                href={B.telHref}
                className="block text-lg font-semibold tracking-tight text-stone-900 tabular-nums hover:text-stone-700 transition-colors sm:text-xl"
              >
                {B.telDisplay}
              </a>
              <a
                href={B.mobileHref}
                className="block text-sm tabular-nums text-stone-700 hover:text-stone-950 transition-colors"
              >
                {B.mobileDisplay}
              </a>
              <a
                href={B.mailtoHref}
                className="block text-sm text-stone-600 hover:text-stone-950 transition-colors break-all"
              >
                {B.email}
              </a>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
              <a
                href={kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-900 underline-offset-2 hover:underline"
              >
                카카오 채널
              </a>
              <span className="text-stone-300" aria-hidden>
                |
              </span>
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-900 underline-offset-2 hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200/90 pt-6">
          <p className={sectionLabel}>Business</p>
          <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            <InfoRow label="대표">{B.representative}</InfoRow>
            <InfoRow label="사업자번호">
              <span className="tabular-nums">{B.businessRegistrationNumber}</span>
            </InfoRow>
            <InfoRow label="통신판매업">
              <span className="break-words">{B.mailOrderReportNumber}</span>
            </InfoRow>
            <InfoRow label="주소">
              <span className="break-words">{B.address}</span>
            </InfoRow>
          </dl>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-stone-200/90 pt-5 text-[11px] text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <p>© {new Date().getFullYear()} {B.tradeName}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-stone-700 transition-colors">
              개인정보처리방침
            </Link>
            <Link to="/terms" className="hover:text-stone-700 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
