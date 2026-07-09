import { Link } from "react-router";
import { NotebookPen } from "lucide-react";
import { kakaoChannelUrl, instagramProfileUrl } from "../../lib/socialUrls";
import { KakaoBrandIcon, InstagramBrandIcon } from "./SocialBrandIcons";

export function FloatingSocialLinks() {
  return (
    <div
      className="fixed z-40 flex flex-col items-end gap-3"
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        right: "max(1.25rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <a
        href={kakaoChannelUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="카카오톡"
        aria-label="카카오톡 채널로 이동"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-[#3C1E1E] shadow-lg shadow-black/15 ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C1E1E]"
      >
        <KakaoBrandIcon className="h-7 w-7" />
      </a>
      <a
        href={instagramProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="인스타그램"
        aria-label="인스타그램으로 이동"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-2.5 shadow-lg shadow-black/15 ring-1 ring-black/10 transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
      >
        <InstagramBrandIcon className="h-full w-full" />
      </a>
      <Link
        to="/estimate"
        title="무료 견적"
        aria-label="무료 견적 요청 페이지로 이동"
        className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-xl bg-[#f7f4ed] text-stone-700 shadow-lg shadow-black/15 ring-1 ring-stone-300/80 transition-transform hover:scale-105 hover:bg-[#f0ebe0] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        <NotebookPen className="h-6 w-6 text-amber-800" strokeWidth={1.75} aria-hidden />
        <span className="text-[9px] font-semibold leading-none tracking-tight text-stone-600">견적</span>
      </Link>
    </div>
  );
}
