import { Link } from "react-router";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-neutral-50 border-t border-gray-200 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="mb-10 pb-10 border-b border-gray-200/90">
              <Link
                to="/"
                className="inline-block rounded-md bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 transition-opacity hover:opacity-90"
              >
                <img
                  src="/soulin-woodwork-logo.png"
                  alt="Soulin woodwork · 설린 우드팩토리"
                  className="h-12 w-auto max-w-[240px] sm:h-14 sm:max-w-[272px] md:h-[3.75rem] md:max-w-[300px] object-contain object-left mix-blend-multiply"
                  decoding="async"
                />
              </Link>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">사업자 정보</p>
            <dl className="space-y-3 text-sm leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] gap-1 sm:gap-3">
                <dt className="text-gray-500">상호</dt>
                <dd className="text-gray-900 font-medium">설린 우드팩토리</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] gap-1 sm:gap-3">
                <dt className="text-gray-500">대표</dt>
                <dd className="text-gray-900">김영국</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] gap-1 sm:gap-3">
                <dt className="text-gray-500">사업자등록번호</dt>
                <dd className="text-gray-900">243-29-00326</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] gap-1 sm:gap-3">
                <dt className="text-gray-500">통신판매업신고</dt>
                <dd className="text-gray-900">2025-경기김포-1490</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] gap-1 sm:gap-3">
                <dt className="text-gray-500 shrink-0">주소</dt>
                <dd className="text-gray-900 flex gap-2 items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden />
                  <span>경기도 김포시 월하로 710-17 가동</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-10">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">연락처</p>
            <h3 className="text-lg font-semibold text-black mb-6">문의</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="mailto:21_may@naver.com"
                  className="flex items-start gap-3 text-gray-700 hover:text-black transition-colors group"
                >
                  <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 group-hover:border-gray-300">
                    <Mail className="w-4 h-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs text-gray-500 mb-0.5">E-mail</span>
                    <span className="text-gray-900 underline-offset-2 group-hover:underline">21_may@naver.com</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:0319892541"
                  className="flex items-start gap-3 text-gray-700 hover:text-black transition-colors group"
                >
                  <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 group-hover:border-gray-300">
                    <Phone className="w-4 h-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs text-gray-500 mb-0.5">Tel</span>
                    <span className="text-gray-900">031-989-2541</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:01045242541"
                  className="flex items-start gap-3 text-gray-700 hover:text-black transition-colors group"
                >
                  <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 group-hover:border-gray-300">
                    <Phone className="w-4 h-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs text-gray-500 mb-0.5">Hp</span>
                    <span className="text-gray-900">010-4524-2541</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 lg:border-l lg:border-gray-200 lg:pl-10">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">바로가기</p>
            <h3 className="text-lg font-semibold text-black mb-4">서비스</h3>
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
