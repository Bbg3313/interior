-- 포트폴리오 확장 컬럼 (003·006을 건너뛴 DB용, 재실행 안전)
-- 관리자 저장 시 image_urls / remark_* 없으면 PostgREST에서 컬럼 오류가 납니다.

alter table public.portfolios
  add column if not exists image_urls jsonb default '[]'::jsonb;

alter table public.portfolios
  add column if not exists remark_title text not null default '';

alter table public.portfolios
  add column if not exists remark_body text not null default '';

comment on column public.portfolios.image_urls is '갤러리용 이미지 URL 배열. 비어 있으면 image_url만 사용';
comment on column public.portfolios.remark_title is '상세 페이지 비고 블록 제목 (비우면 표시 시 기본 문구 가능)';
comment on column public.portfolios.remark_body is '상세 페이지 비고 본문';
