import { kakaoChannelUrl, instagramProfileUrl } from "../../lib/socialUrls";
import { KakaoBrandIcon, InstagramBrandIcon } from "./SocialBrandIcons";

export function FloatingSocialLinks() {
  return (
    <div
      className="fixed z-40 flex flex-col gap-3"
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        right: "max(1.25rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <a
        href={kakaoChannelUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        title="카카오톡"
        aria-label="카카오톡 채널로 이동"
        onClick={(e) => {
          if (!kakaoChannelUrl) e.preventDefault();
        }}
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
    </div>
  );
}
