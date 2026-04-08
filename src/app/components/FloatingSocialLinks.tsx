import { useId } from "react";

const kakaoUrl = import.meta.env.VITE_KAKAO_CHANNEL_URL ?? "";
const instagramUrl =
  import.meta.env.VITE_INSTAGRAM_URL ?? "https://www.instagram.com/soulinwoodwork";

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 3C6.486 3 2 6.41 2 10.652c0 2.508 1.673 4.716 4.205 5.96l-.9 3.35a.6.6 0 0 0 .928.63l3.962-2.11c.542.074 1.097.113 1.665.113 5.514 0 10-3.41 10-7.652S17.514 3 12 3z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  const raw = useId();
  const gradId = `floating-ig-${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <radialGradient id={gradId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      />
    </svg>
  );
}

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
        href={kakaoUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        title="카카오톡"
        aria-label="카카오톡 채널로 이동"
        onClick={(e) => {
          if (!kakaoUrl) e.preventDefault();
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-[#3C1E1E] shadow-lg shadow-black/15 ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C1E1E]"
      >
        <KakaoIcon className="h-7 w-7" />
      </a>
      <a
        href={instagramUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        title="인스타그램"
        aria-label="인스타그램으로 이동"
        onClick={(e) => {
          if (!instagramUrl) e.preventDefault();
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-2.5 shadow-lg shadow-black/15 ring-1 ring-black/10 transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
      >
        <InstagramIcon className="h-full w-full" />
      </a>
    </div>
  );
}
