-- 새 Supabase 프로젝트 SQL Editor에서 1회 실행 (예전 DB에서 행 복사하기 전에 새 쪽 샘플/충돌 행 비우기)
-- 주의: leads / portfolios / reviews / site_settings 전부 삭제됩니다.

TRUNCATE public.leads, public.portfolios, public.reviews RESTART IDENTITY CASCADE;
DELETE FROM public.site_settings;
