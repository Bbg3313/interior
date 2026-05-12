/**
 * index.html 메타(title·description)와 맞춰 두는 문구.
 * 헤더는 한 줄 태그라인(headerTagline)만 사용합니다.
 */
export const SITE_BRANDING = {
  /** <title> 파이프 뒤 구간을 읽기 쉬운 중점 형태로 */
  headerPrimary: "건축 · 인테리어 · 목공 · 상업공간",
  /** meta description 요약 */
  headerSecondary: "상업 공간 설계·시공 · 맞춤 견적",
  /** 로고 옆·모바일 상단바·모바일 메뉴 상단 — 동일 한 줄 */
  headerTagline: "건축 · 인테리어 · 목공 · 상업공간 · 설계·시공",
} as const;
