/**
 * 포트폴리오 상세 등에서 LCP·썸네일용으로 이미지 바이트를 줄이기 위한 URL 보정.
 * Supabase Storage 이미지 변환 API 사용(미지원/오류 시 onError로 원본으로 폴백).
 */
export function optimizePortfolioImageUrl(url: string, maxWidth: number, quality = 82): string {
  if (!url.startsWith("http")) return url;
  if (url.includes("/object/sign/")) return url;

  if (url.includes("supabase.co") && url.includes("/storage/v1/object/public/")) {
    const base = url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
    const joiner = base.includes("?") ? "&" : "?";
    return `${base}${joiner}width=${maxWidth}&quality=${quality}`;
  }

  if (url.includes("images.unsplash.com")) {
    const joiner = url.includes("?") ? "&" : "?";
    return `${url}${joiner}w=${maxWidth}&q=${quality}&auto=format&fit=max`;
  }

  return url;
}
