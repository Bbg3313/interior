import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

type LegalPageShellProps = {
  title: string;
  effectiveDateLabel: string;
  children: ReactNode;
};

export function LegalPageShell({ title, effectiveDateLabel, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/80 to-white pt-24 pb-20 md:pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
          홈으로
        </Link>
        <header className="mb-10 pb-8 border-b border-stone-200/90">
          <h1 className="text-2xl sm:text-3xl font-semibold text-black tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-gray-500">{effectiveDateLabel}</p>
        </header>
        <article className="text-sm md:text-[15px] text-gray-800 leading-relaxed space-y-9">{children}</article>
      </div>
    </div>
  );
}
