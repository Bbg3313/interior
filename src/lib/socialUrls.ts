function envUrl(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

export const kakaoChannelUrl = envUrl(
  import.meta.env.VITE_KAKAO_CHANNEL_URL,
  "https://pf.kakao.com/_RwMxan"
);
export const instagramProfileUrl = envUrl(
  import.meta.env.VITE_INSTAGRAM_URL,
  "https://www.instagram.com/soulinwoodwork"
);
