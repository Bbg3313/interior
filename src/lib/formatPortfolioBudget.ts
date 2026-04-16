/**
 * 포트폴리오 시공비 문자열 표시용.
 * - `1000만원` → `1,000만원`
 * - `$12345` → `12,345원` (달러 기호만 원화 표기로 정리)
 */
export function formatPortfolioBudgetDisplay(raw: string): string {
  const t = raw.trim();
  if (!t) return t;

  if (/^\$\s*/.test(t)) {
    const rest = t.replace(/^\$\s*/, "").replace(/,/g, "").trim();
    if (/^\d+$/.test(rest)) {
      const n = parseInt(rest, 10);
      return `${n.toLocaleString("ko-KR")}원`;
    }
  }

  return t.replace(/(\d[\d,]*)(\s*만원)/g, (_, digits: string, suffix: string) => {
    const n = parseInt(digits.replace(/,/g, ""), 10);
    return Number.isNaN(n) ? `${digits}${suffix}` : `${n.toLocaleString("ko-KR")}${suffix}`;
  });
}
