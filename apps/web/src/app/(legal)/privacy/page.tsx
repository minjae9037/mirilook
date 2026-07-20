import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "미리룩 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-8 text-sm leading-7 text-[#d8cbb8]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f3d28a]">
          Privacy Policy
        </p>
        <h1 className="mt-3 text-[26px] font-extrabold tracking-[-0.02em] text-[#fffaf1] sm:text-[32px]">
          개인정보처리방침
        </h1>
        <p className="mt-2 text-xs font-semibold text-[#8f826f]">
          시행일 2026.07.20.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">1. 처리하는 개인정보</h2>
        <p>
          회사는 회원가입, 로그인, 추천 생성, 결제, 히스토리 저장, 커뮤니티,
          예약, 고객지원 과정에서 아래 정보를 처리할 수 있습니다.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>계정 정보: 이메일, 닉네임, 소셜 로그인 식별값, 프로필 사진</li>
          <li>서비스 입력 정보: 좌측면·정면·우측면 얼굴 사진, 선호 헤어컷, 컬러, 메모, 성별 선택, 생성 요청 기록</li>
          <li>생성 결과 정보: AI 추천 이미지, 상담용 이미지, 코디 결과, 저장·공유·다운로드 이력</li>
          <li>커뮤니티 정보: 게시글, 댓글, 투표, 신고, 메시지 수신 설정</li>
          <li>입점·예약 정보: 미용실·디자이너 정보, 예약 요청, 리뷰, 위치 조회 이력</li>
          <li>결제 정보: H머니 구매·사용·환불 내역, 결제 승인번호, 결제수단 일부 식별정보</li>
          <li>자동 생성 정보: IP 주소, 쿠키, 기기·브라우저 정보, 접속 로그, 오류 로그, 부정 이용 탐지 정보</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">2. 개인정보의 이용 목적</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>AI 헤어스타일, 코디 추천과 이미지 생성</li>
          <li>회원별 히스토리 저장, 결과 공유, PDF·이미지 내보내기</li>
          <li>H머니 결제, 차감, 환불, 결제 오류 처리</li>
          <li>미용실·디자이너 예약, 리뷰, 위치 기반 탐색 제공</li>
          <li>커뮤니티, 투표, 댓글, 메시지, 신고 및 안전 관리</li>
          <li>고객 상담, 공지, 약관 변경 안내, 서비스 품질 개선</li>
          <li>보안, 부정 이용 방지, 법령상 의무 이행</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">3. 얼굴 사진과 AI 처리</h2>
        <p>
          얼굴 사진은 헤어스타일 추천과 상담 이미지 생성을 위해 처리됩니다.
          회사는 별도 고지와 동의 없이 얼굴을 고유하게 식별하기 위한 생체인식
          템플릿을 만들거나 본인확인 목적으로 사용하지 않습니다. 또한 회원의
          얼굴 사진과 생성 결과를 별도 동의 없이 AI 모델 학습·고도화의 학습
          데이터로 사용하지 않습니다. 다만, 업로드된 사진과 생성 결과는 회원이
          요청한 추천, 저장, 공유, 오류 대응을 위해 필요한 기간 동안 보관될 수
          있습니다.
        </p>
        <p>
          회원은 업로드한 사진과 생성 결과의 삭제를 언제든지 요청할 수 있습니다.
          서비스 내 문의하기에서 “내 사진·데이터 삭제 요청”을 선택해 접수하면
          법령상 보관 의무가 있는 정보를 제외하고 지체 없이 파기합니다. 회원
          탈퇴 시에도 동일하게 처리됩니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">4. 보유 및 이용 기간</h2>
        <p>
          회사는 원칙적으로 이용 목적 달성 또는 회원 탈퇴 시 개인정보를
          파기합니다. 단, 결제·환불·분쟁 대응·전자상거래 기록·통신비밀보호 등
          법령상 보관 의무가 있는 정보는 해당 법령에서 정한 기간 동안 보관할 수
          있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">5. 제3자 제공과 공유</h2>
        <p>
          회사는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다. 다만
          회원이 미용실, 디자이너, 투표, 커뮤니티, 카카오톡·이메일 공유 등
          기능을 직접 선택한 경우 해당 기능 제공에 필요한 범위에서 정보가
          공유될 수 있습니다. 법령상 의무가 있거나 수사기관의 적법한 요청이
          있는 경우에도 필요한 범위에서 제공될 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">6. 처리위탁 및 국외 처리</h2>
        <p>
          서비스 운영을 위해 회사는 클라우드, 인증, 데이터베이스, 이메일,
          결제, 자동화, AI 이미지 생성 사업자에게 업무를 위탁할 수 있습니다.
          현재 또는 예정된 주요 처리 수탁자는 Supabase(데이터베이스·인증·저장소),
          Vercel(호스팅·분석), OpenAI 및 Google(Gemini)(AI 이미지 생성),
          Resend(이메일 발송), Sentry(오류 진단), Trigger.dev(자동화),
          RevenueCat 및 Google Play(앱 내 결제), 그리고 결제대행사인 KG이니시스(주식회사
          케이지이니시스)입니다. 일부 사업자는 국외에 서버를 둘 수 있으며, 회사는 실제 도입 시
          서비스 내 고지 또는 본 방침 개정을 통해 세부 항목을 안내합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">7. 이용자의 권리</h2>
        <p>
          회원은 본인의 개인정보 열람, 정정, 삭제, 처리정지, 동의 철회를
          요청할 수 있습니다. 서비스 내 마이페이지에서 일부 정보를 직접 수정할
          수 있으며, 직접 처리가 어려운 요청은 jipsa.admin@gmail.com으로 접수할 수
          있습니다.
        </p>
        <p>
          <b className="text-[#fffaf1]">계정 삭제</b>는 로그인 후{" "}
          <Link className="font-semibold text-[#f3d28a] underline" href="/mypage">
            마이페이지
          </Link>
          의 “계정 삭제” 메뉴에서 직접 하실 수 있습니다. 삭제 시 계정 정보, 프로필,
          업로드한 얼굴 사진, 상담 결과와 생성 이미지가 삭제됩니다. 커뮤니티 게시글과
          댓글은 작성자 식별정보가 제거된 익명 상태로 남을 수 있고, 결제·환불 기록은
          법령상 보관 의무가 있는 범위에서 보존됩니다. 보유한 Hair Money는 함께
          소멸되며 환불되지 않습니다. 직접 삭제가 어려운 경우 jipsa.admin@gmail.com으로
          요청하실 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">8. 안전성 확보 조치</h2>
        <p>
          회사는 접근권한 관리, 암호화 전송, 로그 점검, 최소 권한 원칙,
          관리자 접근 통제, 외부 API 키 보호, 오류·침해 대응 절차 등 개인정보
          보호를 위한 기술적·관리적 조치를 적용합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">9. 쿠키와 유사 기술</h2>
        <p>
          회사는 로그인 유지, 사용성 개선, 보안, 서비스 분석을 위해 쿠키 또는
          유사 기술을 사용할 수 있습니다. 회원은 브라우저 설정을 통해 쿠키
          저장을 거부할 수 있으나, 일부 기능 이용이 제한될 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">10. 만 14세 미만 아동의 개인정보</h2>
        <p>
          미리룩은 만 14세 미만 아동을 대상으로 하지 않으며, 만 14세 미만
          아동의 회원가입과 개인정보 수집을 허용하지 않습니다. 만 14세 미만인
          경우 서비스를 이용할 수 없으며, 회사가 법정대리인의 동의 없이 만 14세
          미만 아동의 개인정보가 수집된 사실을 알게 된 경우 지체 없이 해당
          정보를 파기합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">
          11. 개인정보 보호책임자 및 사업자 정보
        </h2>
        <p>
          회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 정보주체의
          문의·불만·피해 구제를 처리하기 위해 아래와 같이 개인정보 보호책임자를
          지정하고 있습니다.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>개인정보 보호책임자: 이민재 (대표)</li>
          <li>연락처: jipsa.admin@gmail.com / 010-2704-5672</li>
        </ul>
        <p>
          미리룩은 엠제이인사이트 주식회사가 운영합니다. 상호: 엠제이인사이트
          주식회사 · 대표: 이민재 · 사업자등록번호: 226-81-56027 ·
          통신판매업신고: 제2026-부천소사-0462호 · 소재지: 경기도 부천시 소사구
          소삼로 62.
        </p>
        <p>
          개인정보 관련 문의, 권리 행사, 침해 신고는 위 연락처로 접수할 수
          있습니다. 개인정보 침해에 관한 상담이 필요한 경우 개인정보분쟁조정위원회
          (1833-6972), 개인정보침해신고센터(118), 대검찰청 사이버수사과(1301),
          경찰청 사이버수사국(182)에 문의하실 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">12. 방침 변경</h2>
        <p>
          본 방침은 법령, 서비스 구조, 수탁자, 처리 항목 변경에 따라 수정될 수
          있습니다. 중요한 변경은 서비스 내 공지, 이메일, 알림 등 합리적인
          방법으로 고지합니다.
        </p>
      </section>
    </div>
  );
}
