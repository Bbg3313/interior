import { Link } from "react-router";
import { Building2, Hash, Mail, MapPin, Phone, ScrollText, User } from "lucide-react";
import { kakaoChannelUrl, instagramProfileUrl } from "../../lib/socialUrls";
import { KakaoBrandIcon, InstagramBrandIcon } from "./SocialBrandIcons";

export function SiteFooter() {
  return (
    <footer className="bg-neutral-50 border-t border-gray-200 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-16">
        <div className="mb-10 lg:mb-12">
          <Link
            to="/"
            className="inline-block rounded-md bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition-opacity hover:opacity-90"
          >
            <img
              src="/soulin-woodwork-logo.png"
              alt="Soulin woodwork · 설린 우드팩토리"
              className="h-10 w-auto max-w-[200px] object-contain object-left mix-blend-multiply sm:h-11 sm:max-w-[220px] md:h-12 md:max-w-[240px]"
              decoding="async"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-0">
          <div className="lg:col-span-5 lg:pr-8 xl:pr-12">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">사업자 정보</p>
            <h3 className="text-lg font-semibold text-black mb-5 tracking-tight">설린 우드팩토리</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 text-gray-900">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600">
                  <Building2 className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="mb-0.5 block text-xs text-gray-500">상호</span>
                  <span className="font-medium text-gray-900">설린 우드팩토리</span>
                </span>
              </li>
              <li className="flex gap-3 text-gray-900">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600">
                  <User className="h-4 w-4" aria-hidden />
                </span>
                <span className="pt-0.5">
                  <span className="mb-0.5 block text-xs text-gray-500">대표</span>
                  <span className="text-gray-900">김영국</span>
                </span>
              </li>
              <li className="flex gap-3 text-gray-900">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600">
                  <Hash className="h-4 w-4" aria-hidden />
                </span>
                <span className="pt-0.5">
                  <span className="mb-0.5 block text-xs text-gray-500">사업자등록번호</span>
                  <span className="tabular-nums text-gray-900">243-29-00326</span>
                </span>
              </li>
              <li className="flex gap-3 text-gray-900">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600">
                  <ScrollText className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="mb-0.5 block text-xs text-gray-500">통신판매업신고</span>
                  <span className="text-gray-900">2025-경기김포-1490</span>
                </span>
              </li>
              <li className="flex gap-3 text-gray-900">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600">
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="mb-0.5 block text-xs text-gray-500">주소</span>
                  <span className="text-gray-900">경기도 김포시 월하로 710-17 가동</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-8 xl:pl-10">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">연락처</p>
            <h3 className="text-lg font-semibold text-black mb-5 tracking-tight">문의</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="mailto:21_may@naver.com"
                  className="flex gap-3 text-gray-700 hover:text-black transition-colors group"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 group-hover:border-gray-300">
                    <Mail className="w-4 h-4" aria-hidden />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-xs text-gray-500 mb-0.5">E-mail</span>
                    <span className="text-gray-900 underline-offset-2 group-hover:underline break-all">21_may@naver.com</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:0319892541"
                  className="flex gap-3 text-gray-700 hover:text-black transition-colors group"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 group-hover:border-gray-300">
                    <Phone className="w-4 h-4" aria-hidden />
                  </span>
                  <span className="pt-0.5">
                    <span className="block text-xs text-gray-500 mb-0.5">Tel</span>
                    <span className="text-gray-900 tabular-nums">031-989-2541</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:01045242541"
                  className="flex gap-3 text-gray-700 hover:text-black transition-colors group"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 group-hover:border-gray-300">
                    <Phone className="w-4 h-4" aria-hidden />
                  </span>
                  <span className="pt-0.5">
                    <span className="block text-xs text-gray-500 mb-0.5">Hp</span>
                    <span className="text-gray-900 tabular-nums">010-4524-2541</span>
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={kakaoChannelUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오톡 채널"
                title="카카오톡"
                onClick={(e) => {
                  if (!kakaoChannelUrl) e.preventDefault();
                }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-[#FEE500] text-[#3C1E1E] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C1E1E] ${
                  !kakaoChannelUrl ? "pointer-events-none opacity-40" : ""
                }`}
              >
                <KakaoBrandIcon className="h-4 w-4" />
              </a>
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인스타그램"
                title="인스타그램"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-1.5 text-gray-600 transition-opacity hover:border-gray-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
              >
                <InstagramBrandIcon className="h-full w-full" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 lg:border-l lg:border-gray-200 lg:pl-8 xl:pl-10">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">바로가기</p>
            <h3 className="text-lg font-semibold text-black mb-5 tracking-tight">서비스</h3>
            <ul className="space-y-3 text-sm text-gray-600">
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

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} 설린 우드팩토리. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 shrink-0">
            <a href="#" className="hover:text-gray-800 transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors">
              이용약관
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
