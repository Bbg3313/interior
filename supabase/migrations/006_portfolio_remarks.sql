-- 포트폴리오 상세 하단 비고(제목·본문)
alter table public.portfolios
  add column if not exists remark_title text not null default '';

alter table public.portfolios
  add column if not exists remark_body text not null default '';

comment on column public.portfolios.remark_title is '상세 페이지 비고 블록 제목 (비우면 표시 시 기본 문구 가능)';
comment on column public.portfolios.remark_body is '상세 페이지 비고 본문';
