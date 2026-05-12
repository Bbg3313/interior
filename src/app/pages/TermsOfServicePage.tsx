import { LegalPageShell } from "../components/LegalPageShell";
import { SITE_BUSINESS } from "../../lib/siteBusinessInfo";

const B = SITE_BUSINESS;

export function TermsOfServicePage() {
  return (
    <LegalPageShell title="이용약관" effectiveDateLabel="시행일: 2026년 5월 11일">
      <section className="space-y-3">
        <p>
          본 약관은 {B.tradeName}(이하 &quot;회사&quot;)가 운영하는 인터넷 웹사이트 및 관련 온라인 서비스(이하
          &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을
          목적으로 합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제1조 (목적)</h2>
        <p>이 약관은 회사가 제공하는 서비스의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 정함을 목적으로 합니다.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제2조 (정의)</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-gray-900">&quot;서비스&quot;</strong>란 회사가 제공하는 웹사이트, 포트폴리오
            열람, 견적·상담 요청 기능 등 회사가 정하는 온라인 기반의 일체의 서비스를 말합니다.
          </li>
          <li>
            <strong className="text-gray-900">&quot;이용자&quot;</strong>란 본 약관에 따라 회사가 제공하는 서비스를
            이용하는 자를 말합니다.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제3조 (약관의 효력 및 변경)</h2>
        <p>
          본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다. 회사는 관련
          법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정사유를 명시하여 현행 약관과
          함께 서비스 초기화면에 그 적용일 7일 이전부터 적용일자 전일까지 공지합니다. 이용자에게 불리한 약관의 개정인
          경우에는 그 적용일 30일 이전부터 공지하며, 필요한 경우 전자우편 등의 방법으로 개별 통지할 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제4조 (서비스의 제공 및 변경)</h2>
        <p>
          회사는 다음과 같은 업무를 수행할 수 있습니다. 포트폴리오·시공 사례 정보의 제공, 견적·상담 문의 접수 및 회신,
          기타 회사가 정하는 서비스. 회사는 운영상·기술상의 필요에 따라 제공하는 서비스의 내용을 변경할 수 있으며, 변경
          시에는 사전에 공지합니다. 회사는 천재지변, 설비 장애, 이용 폭주, 기술적 장애 등 불가항력적 사유가 있는 경우
          서비스 제공을 일시적으로 중단할 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제5조 (견적·상담 문의)</h2>
        <p>
          이용자가 서비스를 통해 제출한 견적·상담 문의에 대하여 회사는 성실히 검토·회신하기 위해 노력합니다. 다만, 온라인
          상에서 제공되는 견적·가이드는 참고용이며, 현장 실측·자재·공법·계약 조건 등에 따라 실제 계약금액·시공 범위와
          달라질 수 있습니다. 최종 견적·계약 조건은 별도의 상담 및 계약서에 따릅니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제6조 (이용자의 의무)</h2>
        <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>허위 정보의 등록, 타인의 정보 도용</li>
          <li>회사가 게시한 정보의 무단 변경, 삭제, 훼손</li>
          <li>회사 및 제3자의 저작권 등 지적재산권 침해</li>
          <li>회사 및 제3자의 명예 훼손 또는 업무 방해</li>
          <li>외설·폭력적 표현 등 공서양속에 반하는 정보의 유포</li>
          <li>컴퓨터 소프트웨어·하드웨어·통신장비의 정상적인 가동을 방해·파괴할 목적으로 고안된 바이러스 등의 유포</li>
          <li>기타 관계 법령 및 본 약관에 위배되는 행위</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제7조 (저작권 등)</h2>
        <p>
          서비스 내 게시된 포트폴리오, 이미지, 문구, 디자인 등에 대한 저작권 및 지적재산권은 회사 또는 정당한 권리자에게
          귀속됩니다. 이용자는 회사의 사전 서면 동의 없이 이를 복제·전송·배포·판매·대여·2차적 저작물 작성 등의
          방법으로 이용하거나 제3자에게 이용하게 할 수 없습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제8조 (면책)</h2>
        <p>
          회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한
          책임이 면제됩니다. 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다. 회사는
          이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않으며, 서비스를
          통하여 얻은 자료로 인한 손해 등에 대하여도 책임을 지지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제9조 (분쟁의 해결)</h2>
        <p>
          서비스 이용과 관련하여 회사와 이용자 간에 분쟁이 발생한 경우, 회사와 이용자는 분쟁의 해결을 위해 성실히
          협의합니다. 협의가 이루어지지 않을 경우 관할 법원은 민사소송법 등 관련 법령에 따릅니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제10조 (회사 정보)</h2>
        <p>서비스를 제공하는 사업자의 정보는 다음과 같습니다.</p>
        <ul className="list-none pl-0 space-y-1.5 border border-stone-200 rounded-xl bg-white/80 p-5 mt-3">
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">상호</span>
            <span className="block font-medium text-gray-900">{B.tradeName}</span>
          </li>
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">대표</span>
            <span className="block text-gray-900">{B.representative}</span>
          </li>
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">사업자등록번호</span>
            <span className="block text-gray-900 tabular-nums">{B.businessRegistrationNumber}</span>
          </li>
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">통신판매업신고</span>
            <span className="block text-gray-900">{B.mailOrderReportNumber}</span>
          </li>
          <li>
            <span className="text-gray-500 text-xs uppercase tracking-wide">주소</span>
            <span className="block text-gray-900">{B.address}</span>
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
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">제11조 (준거법)</h2>
        <p>본 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국 법을 적용합니다.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-black">부칙</h2>
        <p>이 약관은 2026년 5월 11일부터 시행합니다.</p>
      </section>
    </LegalPageShell>
  );
}
