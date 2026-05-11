-- migrate-supabase-database.mjs 실행 후, 새 프로젝트 SQL에서 1회 (다음 자동 id 충돌 방지)
SELECT setval(pg_get_serial_sequence('public.portfolios', 'id'), COALESCE((SELECT MAX(id) FROM public.portfolios), 1), true);
SELECT setval(pg_get_serial_sequence('public.leads', 'id'), COALESCE((SELECT MAX(id) FROM public.leads), 1), true);
SELECT setval(pg_get_serial_sequence('public.reviews', 'id'), COALESCE((SELECT MAX(id) FROM public.reviews), 1), true);
