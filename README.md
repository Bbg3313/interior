# Minimalist Landing Page Design

This is a code bundle for Minimalist Landing Page Design. The original project is available at https://www.figma.com/design/44sVvkEGZDx59PQsAKep4Z/Minimalist-Landing-Page-Design.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Supabase 연동

랜딩·포트폴리오·견적·관리자 데이터는 Supabase에 저장됩니다.

1. [Supabase](https://supabase.com)에서 프로젝트를 만든 뒤, **SQL Editor**에서 `supabase/migrations/001_initial.sql` 내용을 실행해 테이블을 생성하세요.
2. 프로젝트 설정에서 **API URL**과 **anon public** 키를 복사한 뒤, 루트에 `.env` 파일을 만들고 아래처럼 넣으세요 (`.env.example` 참고).

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. `npm run dev`로 다시 실행하면 랜딩/포트폴리오/견적 제출/관리자 목록이 Supabase와 연동됩니다.

데이터가 없으면 랜딩·포트폴리오는 빈 목록으로 보이고, 리뷰는 기본 3건이 표시됩니다. 관리자에서 포트폴리오를 추가하거나, 견적 페이지에서 견적을 제출하면 DB에 저장됩니다.

### 관리자 로그인 (아이디/비밀번호)

`/admin` 접속 시 아이디·비밀번호 입력 화면이 나옵니다. `.env`에 다음을 넣고, 해당 값으로 로그인하세요.

- `VITE_ADMIN_ID`: 관리자 아이디
- `VITE_ADMIN_PASSWORD`: 관리자 비밀번호

예: `VITE_ADMIN_ID=admin`, `VITE_ADMIN_PASSWORD=원하는비밀번호`  
로그인 상태는 브라우저 탭을 닫기 전까지 유지되고, **로그아웃** 버튼으로 해제할 수 있습니다.

## 커스텀 도메인 (예스닉 등 구매 + Vercel 배포)

이 저장소는 GitHub Actions로 **Vercel 프로덕션**에 올라가는 구성입니다(`vercel.json`, `.github/workflows/vercel-production.yml`). 도메인은 **Vercel에 등록**하고, **예스닉(또는 DNS 호스트)에서 레코드만** 맞추면 됩니다. 앱 소스에 도메인 문자열을 박을 필요는 없습니다.

### 1) Vercel에서 도메인 추가

1. [Vercel 대시보드](https://vercel.com/dashboard) → 이 프로젝트 선택  
2. **Settings → Domains** → **Add**  
3. 구매한 도메인 입력 (예: `example.co.kr`, 필요하면 `www.example.co.kr`도 추가)  
4. 화면에 나오는 **DNS 안내 그대로** 적어 두세요. (프로젝트마다 CNAME 값이 다를 수 있어, 예전 문서의 고정 주소와 다를 수 있습니다.)

### 2) 예스닉에서 DNS 설정

1. 예스닉 **마이페이지 → DNS 관리**(또는 네임서버/DNS 설정)로 이동  
2. Vercel이 요구하는 대로 보통 아래 중 하나입니다.  
   - **루트(apex, `@`)**: **A 레코드** — Vercel 안내 IP  
   - **`www`**: **CNAME** — Vercel이 표시한 대상(예: `xxxx.vercel-dns-…` 형태)  
3. 저장 후 전파까지 **수 분~48시간** 걸릴 수 있습니다.

**네임서버를 Vercel로 바꾸는 방법**도 가능합니다. 이 경우 예스닉이 아니라 Vercel DNS에서 레코드를 관리하게 되며, 메일용 MX 등 기존 레코드가 있으면 Vercel 쪽에도 같이 옮겨야 합니다.

### 3) 배포 후 확인

- 브라우저에서 `https://구매한도메인` 접속 → 자동 HTTPS(Vercel) 적용 여부 확인  
- 문제가 있으면 Vercel Domains 화면의 **Invalid Configuration** 메시지와 요구 레코드를 다시 예스닉에 맞춥니다.

### 4) Supabase (선택)

이 프로젝트는 주로 **anon 키 + RLS**로 동작합니다. 나중에 Auth(이메일 로그인 등)를 쓰게 되면 Supabase 대시보드 **Authentication → URL Configuration**에 프로덕션 도메인을 넣어야 리다이렉트가 맞습니다.
