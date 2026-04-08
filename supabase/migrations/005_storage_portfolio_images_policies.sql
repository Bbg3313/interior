-- Portfolio 이미지용 Storage 버킷 + RLS 정책
-- 앱 코드: bucket id = 'portfolio-images' (src/lib/api.ts)
--
-- 주의: 아래 정책은 모두 `to public`(anon 포함)입니다.
-- 현재 관리자 로그인은 Supabase Auth가 아니라서, 브라우저에서 anon 키로 업로드/수정/삭제가 가능합니다.
-- 운영 환경에서는 Supabase Auth(또는 Edge Function + service role)로 바꾸는 것을 권장합니다.

-- 버킷이 없으면 생성 (대시보드에서 이미 만들었다면 이 줄만 스킵됨)
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- 기존 정책 이름이 같으면 교체 (마이그레이션 재실행 대비)
drop policy if exists "public read portfolio images" on storage.objects;
drop policy if exists "public upload portfolio images" on storage.objects;
drop policy if exists "public update portfolio images" on storage.objects;
drop policy if exists "public delete portfolio images" on storage.objects;

-- 공개 읽기 (이미지 URL로 표시)
create policy "public read portfolio images"
on storage.objects
for select
to public
using (bucket_id = 'portfolio-images');

-- 업로드
create policy "public upload portfolio images"
on storage.objects
for insert
to public
with check (bucket_id = 'portfolio-images');

-- 수정 (메타데이터 교체 등; 클라이언트에서 upsert=false라면 드물게 사용)
create policy "public update portfolio images"
on storage.objects
for update
to public
using (bucket_id = 'portfolio-images')
with check (bucket_id = 'portfolio-images');

-- 삭제
create policy "public delete portfolio images"
on storage.objects
for delete
to public
using (bucket_id = 'portfolio-images');

/*
--- 나중에 Supabase Auth를 붙일 때 예시 (public 정책 대체용) ---
drop policy if exists "public upload portfolio images" on storage.objects;
drop policy if exists "public update portfolio images" on storage.objects;
drop policy if exists "public delete portfolio images" on storage.objects;

create policy "auth insert portfolio images"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-images');

create policy "auth update portfolio images"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-images')
with check (bucket_id = 'portfolio-images');

create policy "auth delete portfolio images"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-images');
*/
