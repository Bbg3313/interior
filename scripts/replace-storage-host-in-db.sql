-- 새 Supabase SQL Editor에서 실행.
-- ref 가 다르면 hathzkpdgszfyxggqqmw / fvnxvpgwtoriewwtdphp 만 바꿔서 쓰세요.

-- ========== 1) 먼저 진단 (여기 결과가 비어 있거나 unsplash 뿐이면, 이 DB가 사이트가 보는 DB가 아닐 수 있음) ==========
SELECT 'portfolios' AS src, id, left(image_url, 120) AS image_url_preview
FROM public.portfolios
ORDER BY id
LIMIT 30;

SELECT 'site_settings' AS src, key, left(value, 200) AS value_preview
FROM public.site_settings;

SELECT COUNT(*) FILTER (WHERE image_url LIKE '%hathzkpdgszfyxggqqmw%') AS portfolios_image_url_old_host,
       COUNT(*) FILTER (WHERE image_urls::text LIKE '%hathzkpdgszfyxggqqmw%') AS portfolios_image_urls_old_host
FROM public.portfolios;

-- ========== 2) 치환 (https/http 상관없이 호스트만 교체) ==========
UPDATE public.portfolios
SET
  image_url = replace(image_url, 'hathzkpdgszfyxggqqmw.supabase.co', 'fvnxvpgwtoriewwtdphp.supabase.co'),
  image_urls = (
    SELECT COALESCE(
      jsonb_agg(
        to_jsonb(
          replace(t.elem, 'hathzkpdgszfyxggqqmw.supabase.co', 'fvnxvpgwtoriewwtdphp.supabase.co')
        )
      ),
      '[]'::jsonb
    )
    FROM jsonb_array_elements_text(COALESCE(image_urls, '[]'::jsonb)) AS t(elem)
  )
WHERE image_url LIKE '%hathzkpdgszfyxggqqmw%'
   OR COALESCE(image_urls::text, '') LIKE '%hathzkpdgszfyxggqqmw%';

UPDATE public.site_settings
SET value = replace(value, 'hathzkpdgszfyxggqqmw.supabase.co', 'fvnxvpgwtoriewwtdphp.supabase.co')
WHERE value LIKE '%hathzkpdgszfyxggqqmw%';

UPDATE public.reviews
SET image = replace(image, 'hathzkpdgszfyxggqqmw.supabase.co', 'fvnxvpgwtoriewwtdphp.supabase.co')
WHERE image LIKE '%hathzkpdgszfyxggqqmw%';

-- ========== 3) 갱신 후 다시 확인 ==========
SELECT COUNT(*) FILTER (WHERE image_url LIKE '%hathzkpdgszfyxggqqmw%') AS still_old_in_image_url
FROM public.portfolios;
