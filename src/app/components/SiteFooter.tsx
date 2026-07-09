import { Link } from "react-router";
import { Building2, Hash, Mail, MapPin, Phone, ScrollText, User } from "lucide-react";
import { kakaoChannelUrl, instagramProfileUrl } from "../../lib/socialUrls";
import { SITE_BUSINESS } from "../../lib/siteBusinessInfo";
import { KakaoBrandIcon, InstagramBrandIcon } from "./SocialBrandIcons";

const B = SITE_BUSINESS;

const iconBox =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 sm:h-9 sm:w-9 sm:rounded-xl";

export function SiteFooter() {
  return (
    <footer className="bg-neutral-50 border-t border-gray-200 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-12 lg:items-start lg:gap-0">
          <div className="min-w-0 lg:col-span-5 lg:pr-8 xl:pr-12">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-1 sm:text-xs sm:mb-2">
              사업자 정보
            </p>
            <h3 className="text-base font-semibold text-black mb-2.5 tracking-tight sm:text-lg sm:mb-4 lg:mb-5">
              {B.tradeName}
            </h3>
            <ul className="space-y-2 text-xs sm:space-y-3 sm:text-sm lg:space-y-4">
              <li className="flex gap-2 text-gray-900 sm:gap-3">
                <span className={iconBox}>
                  <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="mb-0.5 block text-[10px] text-gray-500 sm:text-xs">상호</span>
                  <span className="font-medium text-gray-900 leading-snug">{B.tradeName}</span>
                </span>
              </li>
              <li className="flex gap-2 text-gray-900 sm:gap-3">
                <span className={iconBox}>
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                </span>
                <span className="pt-0.5">
                  <span className="mb-0.5 block text-[10px] text-gray-500 sm:text-xs">대표</span>
                  <span className="text-gray-900 leading-snug">{B.representative}</span>
                </span>
              </li>
              <li className="flex gap-2 text-gray-900 sm:gap-3">
                <span className={iconBox}>
                  <Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                </span>
                <span className="pt-0.5">
                  <span className="mb-0.5 block text-[10px] text-gray-500 sm:text-xs">사업자등록번호</span>
                  <span className="tabular-nums text-gray-900 leading-snug">{B.businessRegistrationNumber}</span>
                </span>
              </li>
              <li className="flex gap-2 text-gray-900 sm:gap-3">
                <span className={iconBox}>
                  <ScrollText className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="mb-0.5 block text-[10px] text-gray-500 sm:text-xs">통신판매업신고</span>
                  <span className="break-words text-gray-900 leading-snug">{B.mailOrderReportNumber}</span>
                </span>
              </li>
              <li className="flex gap-2 text-gray-900 sm:gap-3">
                <span className={iconBox}>
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="mb-0.5 block text-[10px] text-gray-500 sm:text-xs">주소</span>
                  <span className="text-gray-900 leading-snug">{B.address}</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-8 xl:pl-10">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-1 sm:text-xs sm:mb-2">
              연락처
            </p>
            <h3 className="text-base font-semibold text-black mb-2.5 tracking-tight sm:text-lg sm:mb-4 lg:mb-5">문의</h3>
            <ul className="space-y-2 text-xs sm:space-y-3 sm:text-sm lg:space-y-4">
              <li>
                <a
                  href={B.mailtoHref}
                  className="flex gap-2 text-gray-700 hover:text-black transition-colors group sm:gap-3"
                >
                  <span
                    className={`${iconBox} group-hover:border-gray-300`}
                  >
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-[10px] text-gray-500 mb-0.5 sm:text-xs">E-mail</span>
                    <span className="text-gray-900 underline-offset-2 group-hover:underline break-all leading-snug">
                      {B.email}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={B.telHref}
                  className="flex gap-2 text-gray-700 hover:text-black transition-colors group sm:gap-3"
                >
                  <span className={`${iconBox} group-hover:border-gray-300`}>
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  </span>
                  <span className="pt-0.5">
                    <span className="block text-[10px] text-gray-500 mb-0.5 sm:text-xs">Tel</span>
                    <span className="text-gray-900 tabular-nums leading-snug">{B.telDisplay}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={B.mobileHref}
                  className="flex gap-2 text-gray-700 hover:text-black transition-colors group sm:gap-3"
                >
                  <span className={`${iconBox} group-hover:border-gray-300`}>
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  </span>
                  <span className="pt-0.5">
                    <span className="block text-[10px] text-gray-500 mb-0.5 sm:text-xs">Hp</span>
                    <span className="text-gray-900 tabular-nums leading-snug">{B.mobileDisplay}</span>
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-3 flex items-center gap-2 sm:mt-5 sm:gap-3">
              <a
                href={kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오톡 채널"
                title="카카오톡"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-[#FEE500] text-[#3C1E1E] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C1E1E] sm:h-9 sm:w-9 sm:rounded-xl"
              >
                <KakaoBrandIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인스타그램"
                title="인스타그램"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white p-1 text-gray-600 transition-opacity hover:border-gray-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 sm:h-9 sm:w-9 sm:rounded-xl sm:p-1.5"
              >
                <InstagramBrandIcon className="h-full w-full" />
              </a>
            </div>
          </div>

          <div className="col-span-2 border-t border-gray-200/80 pt-4 sm:border-t-0 sm:pt-0 lg:col-span-3 lg:border-l lg:border-gray-200 lg:pl-8 xl:pl-10">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-1 sm:text-xs sm:mb-2">
              바로가기
            </p>
            <h3 className="text-base font-semibold text-black mb-2 tracking-tight sm:text-lg sm:mb-3 lg:mb-5">서비스</h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 sm:flex-col sm:gap-y-2 sm:text-sm">
              <li>
                <Link to="/portfolio" className="hover:text-black transition-colors">
                  포트폴리오
                </Link>
              </li>
              <li>
                <Link to="/estimate" className="hover:text-black transition-colors">
                  견적 요청
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-gray-200 pt-5 text-[11px] text-gray-500 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-7 sm:text-xs lg:mt-12 lg:pt-8">
          <p className="leading-snug">© {new Date().getFullYear()} {B.tradeName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-3 shrink-0 sm:gap-4">
            <Link to="/privacy" className="hover:text-gray-800 transition-colors">
              개인정보처리방침
            </Link>
            <Link to="/terms" className="hover:text-gray-800 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
