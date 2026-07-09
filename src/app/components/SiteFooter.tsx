import { Link } from "react-router";
import { kakaoChannelUrl, instagramProfileUrl } from "../../lib/socialUrls";
import { SITE_BUSINESS } from "../../lib/siteBusinessInfo";

const B = SITE_BUSINESS;

function Sep() {
  return <span className="mx-2 text-stone-700 select-none" aria-hidden>|</span>;
}

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-500">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Link
              to="/"
              className="text-sm font-semibold tracking-tight text-stone-300 transition-colors hover:text-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 sm:text-base"
            >
              {B.tradeName}
            </Link>
            <p className="mt-2 text-xs text-stone-600">건축 · 인테리어 · 목공 · 상업공간 설계·시공</p>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-10 lg:gap-14">
            <div>
              <p className="mb-1 text-[11px] text-stone-600">문의</p>
              <a
                href={B.telHref}
                className="text-xl font-semibold tabular-nums tracking-tight text-stone-300 transition-colors hover:text-stone-200 sm:text-2xl"
              >
                {B.telDisplay}
              </a>
              <p className="mt-1 text-xs tabular-nums text-stone-600">
                <a href={B.mobileHref} className="hover:text-stone-400 transition-colors">
                  {B.mobileDisplay}
                </a>
                <Sep />
                <a href={B.mailtoHref} className="hover:text-stone-400 transition-colors break-all">
                  {B.email}
                </a>
              </p>
            </div>

            <nav aria-label="푸터 메뉴" className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-500">
              <Link to="/portfolio" className="hover:text-stone-300 transition-colors">
                포트폴리오
              </Link>
              <Link to="/estimate" className="hover:text-stone-300 transition-colors">
                견적 요청
              </Link>
              <a
                href={kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-300 transition-colors"
              >
                카카오
              </a>
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-300 transition-colors"
              >
                인스타그램
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-6 border-t border-stone-800 pt-5 text-[11px] leading-relaxed text-stone-600 sm:text-xs">
          <p className="flex flex-wrap items-center gap-y-0.5">
            <span>
              <span className="text-stone-700">대표</span> {B.representative}
            </span>
            <Sep />
            <span>
              <span className="text-stone-700">사업자등록번호</span>{" "}
              <span className="tabular-nums">{B.businessRegistrationNumber}</span>
            </span>
            <Sep />
            <span>
              <span className="text-stone-700">통신판매업신고</span> {B.mailOrderReportNumber}
            </span>
          </p>
          <p className="mt-1.5">
            <span className="text-stone-700">주소</span> {B.address}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-[11px] text-stone-700 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <p>© {new Date().getFullYear()} {B.tradeName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-stone-500 transition-colors">
              개인정보처리방침
            </Link>
            <Link to="/terms" className="hover:text-stone-500 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
