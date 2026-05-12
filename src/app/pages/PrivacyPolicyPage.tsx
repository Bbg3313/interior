import { LegalPageShell } from "../components/LegalPageShell";
import { SITE_BUSINESS } from "../../lib/siteBusinessInfo";

const B = SITE_BUSINESS;

export function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="개인정보처리방침" effectiveDateLabel="시행일: 2026년 5월 11일">
      <section className="space-y-3">
        <p>
          {B.tradeName}(이하 &quot;회사&quot;)는 「개인정보 보호법」 등 관련 법령에 따라 이용자의 개인정보를 보호하고 이와
          관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제1조 (처리 목적)</h2>
        <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>견적·상담 문의에 대한 회신, 견적 산출·안내 및 계약 관련 연락</li>
          <li>서비스 제공에 따른 본인 확인, 민원 처리, 분쟁 조정을 위한 기록 보존</li>
          <li>통계·서비스 품질 개선을 위한 내부 분석(식별 불가 형태로 가공하는 경우 포함)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제2조 (처리 및 보유 기간)</h2>
        <p>
          회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 보유·이용 기간
          내에서 개인정보를 처리·보유합니다. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-gray-900">견적·상담 문의 관련:</strong> 문의 처리 완료 후 관계 법령에 따른 보존
            기간이 있는 경우 해당 기간까지 보관하며, 그 외에는 수집·이용 목적이 달성된 후 지체 없이 파기합니다. 다만
            이용자가 별도로 삭제·파기를 요청하는 경우, 법령상 보존 의무가 없는 한 지체 없이 조치합니다.
          </li>
          <li>
            <strong className="text-gray-900">전자상거래 등에서의 소비자 보호에 관한 법률 등:</strong> 계약 또는 청약철회
            등에 관한 기록, 대금결제 및 재화 등의 공급에 관한 기록, 소비자의 불만 또는 분쟁처리에 관한 기록 등 법령이
            정한 기간이 있는 경우 해당 기간 동안 보관할 수 있습니다.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제3조 (처리하는 개인정보의 항목)</h2>
        <p>회사는 다음의 개인정보 항목을 처리할 수 있습니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-gray-900">견적·상담 문의(온라인):</strong> 이름(또는 상호), 연락처(휴대전화번호
            등), 이메일 주소, 문의 내용, 업종·면적 등 견적 산출에 필요한 정보, 산출된 견적 구간(해당 시)
          </li>
          <li>
            <strong className="text-gray-900">자동 수집 항목(해당 시):</strong> IP 주소, 쿠키, 접속 로그, 기기 정보,
            브라우저 유형 등 서비스 이용 과정에서 생성·수집될 수 있는 정보
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제4조 (개인정보의 제3자 제공)</h2>
        <p>
          회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등
          「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다. 그 외에는 정보주체의
          동의 없이 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제5조 (개인정보처리의 위탁)</h2>
        <p>
          회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁할 수 있으며, 위탁계약 시
          「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한,
          수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 문서에 명시하고, 수탁자가 개인정보를 안전하게
          처리하는지를 감독합니다. 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체 없이 본 개인정보처리방침을 통하여
          공개합니다.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-gray-900">클라우드 인프라·데이터베이스:</strong> 웹사이트 및 견적 문의 데이터의
            저장·전송을 위한 클라우드 서비스(Supabase 등 이용 시 해당 사업자)
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제6조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</h2>
        <p>
          정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 권리
          행사는 개인정보 보호법 시행령 제41조 제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며,
          회사는 이에 대해 지체 없이 조치하겠습니다. 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을
          통하여 하실 수도 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제7조 (개인정보의 파기)</h2>
        <p>
          회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를
          파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제8조 (개인정보의 안전성 확보조치)</h2>
        <p>회사는 개인정보의 안전성 확보를 위하여 다음과 같은 조치를 취합니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>관리적 조치: 내부관리계획 수립·시행, 직원 교육 등</li>
          <li>기술적 조치: 접근권한 관리, 접근통제, 보안프로그램 설치 등</li>
          <li>물리적 조치: 전산실·자료보관실 등의 접근통제</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부)</h2>
        <p>
          회사는 이용자에게 개별적인 서비스와 편의를 제공하기 위해 이용정보를 저장하고 수시로 불러오는
          &quot;쿠키(cookie)&quot;를 사용할 수 있습니다. 쿠키는 웹사이트 운영에 이용되는 서버가 이용자의 브라우저에
          보내는 아주 작은 텍스트 파일로 이용자 컴퓨터에 저장됩니다. 이용자는 웹브라우저 옵션 설정을 통해 쿠키 저장을
          거부할 수 있으나, 일부 서비스 이용에 어려움이 있을 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제10조 (개인정보 보호책임자)</h2>
        <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정합니다.</p>
        <ul className="list-none pl-0 space-y-1.5 not-italic border border-stone-200 rounded-xl bg-white/80 p-5 mt-3">
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">상호</span>
            <span className="block font-medium text-gray-900">{B.tradeName}</span>
          </li>
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">개인정보 보호책임자</span>
            <span className="block text-gray-900">대표 {B.representative}</span>
          </li>
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">연락처</span>
            <span className="block text-gray-900">
              Tel {B.telDisplay} · Hp {B.mobileDisplay}
            </span>
          </li>
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">이메일</span>
            <a href={B.mailtoHref} className="block text-gray-900 underline underline-offset-2 break-all">
              {B.email}
            </a>
          </li>
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">주소</span>
            <span className="block text-gray-900">{B.address}</span>
          </li>
        </ul>
        <p className="text-gray-600">
          정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한
          사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제11조 (권익침해 구제방법)</h2>
        <p>
          정보주체는 아래 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다. (아래 기관은 회사와
          별개의 기관으로서, 회사의 자체적인 개인정보 불만처리·피해구제 결과에 만족하지 못하시거나 보다 구체적인 도움이
          필요하시면 문의하여 주시기 바랍니다.)
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>개인정보 침해신고센터: (국번없이) 118 · privacy.kisa.or.kr</li>
          <li>개인정보 분쟁조정위원회: (국번없이) 1833-6972 · www.kopico.go.kr</li>
          <li>대검찰청 사이버범죄수사단: 1301 · www.spo.go.kr</li>
          <li>경찰청 사이버안전국: (국번없이) 182 · cyberbureau.police.go.kr</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제12조 (개인정보처리방침의 변경)</h2>
        <p>
          이 개인정보처리방침은 2026년 5월 11일부터 적용됩니다. 내용의 추가·삭제 및 수정이 있을 경우 시행일 7일 전부터
          홈페이지 공지사항을 통하여 고지하겠습니다.
        </p>
      </section>
    </LegalPageShell>
  );
}
