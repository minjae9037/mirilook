import type { Metadata } from "next";
import { MirilookGenerationRefundNotice } from "@/components/mirilook-generation-refund-notice";
import { MirilookSupportCaseForm } from "@/components/mirilook-support-case-form";

export const metadata: Metadata = {
  title: "취소·환불·교환 정책",
  description:
    "미리룩 H머니 및 유료 서비스의 서비스 제공시기(배송), 청약철회·취소, 교환, 환불 정책",
};

export default function RefundPage() {
  return (
    <div className="space-y-8 text-sm leading-7 text-[#d8cbb8]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f3d28a]">
          Cancellation · Refund · Exchange Policy
        </p>
        <h1 className="mt-3 text-[26px] font-extrabold tracking-[-0.02em] text-[#fffaf1] sm:text-[32px]">
          취소·환불·교환 정책
        </h1>
        <p className="mt-3">
          본 정책은 미리룩 유료 서비스(H머니 및 AI 생성 기능)의 서비스 제공시기,
          청약철회·취소, 교환, 환불 기준을 안내합니다.
        </p>
        <p className="mt-2 text-xs font-semibold text-[#8f826f]">
          시행일 2026.07.20.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">1. H머니의 정의</h2>
        <p>
          Hair money 또는 H머니는 미리룩의 헤어, 코디 추천과 AI
          이미지 생성 등 유료 기능 이용을 위해 회원이 원화로 구매하는 서비스 내
          결제 단위입니다. H머니는 현금, 예금, 전자화폐가 아니며 서비스 밖에서
          사용할 수 없습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">
          2. 서비스 제공시기 (배송 안내)
        </h2>
        <p>
          미리룩은 별도의 실물 배송이 없는 온라인 디지털 서비스로, 재화의
          공급방법은 서비스 내 즉시 이용(온라인 제공)입니다.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            H머니 충전: 결제 승인이 완료되는 즉시 회원 계정에 충전되어 바로
            이용할 수 있습니다.
          </li>
          <li>
            AI 추천·이미지 생성 등 유료 기능: 회원이 기능을 실행하면 즉시 처리가
            시작되며, 통상 수십 초에서 수 분 이내에 결과가 제공됩니다. (접속량,
            외부 AI 제공자 상황에 따라 지연될 수 있습니다.)
          </li>
          <li>
            이용(제공) 기간: 충전된 유상 H머니는 아래 제8조(유효기간)에 따른
            기간 동안 이용할 수 있습니다.
          </li>
          <li>
            시스템 점검, 장애, 외부 API 제공자 사정 등으로 제공이 지연·중단되는
            경우 서비스 내 공지 또는 이메일로 안내합니다.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">
          3. 청약철회 및 취소 규정
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            회원은 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라, 유상으로
            구매한 H머니를 결제일(또는 이용 가능일)로부터 7일 이내에
            청약철회(취소)할 수 있습니다. 단, 아직 사용하지 않은 유상 H머니에
            한합니다.
          </li>
          <li>
            결제 직후 취소: 유료 기능을 아직 실행하지 않았다면 전액 취소·환불
            됩니다.
          </li>
          <li>
            청약철회가 제한되는 경우: 같은 법 제17조 제2항에 따라, 회원이 유료
            기능(추천·AI 이미지 생성 등)을 실행하여 디지털 콘텐츠의 제공이 시작된
            부분에 대해서는 단순 변심에 의한 청약철회가 제한됩니다.
          </li>
          <li>
            다만 회사의 귀책, 결제 오류, 콘텐츠가 표시·광고 내용과 다르거나
            계약과 다르게 이행된 경우에는 관련 법령에 따라 청약철회·취소·환불이
            가능합니다.
          </li>
          <li>취소·청약철회 신청 방법은 아래 제9조(신청 절차)와 같습니다.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">4. 교환 안내</h2>
        <p>
          미리룩이 제공하는 결과물은 디지털 콘텐츠로, 실물 재화의 교환·반품과
          같은 방식의 교환은 적용되지 않습니다. AI 생성 과정에서 회사 귀책의
          오류가 발생한 경우에는 교환에 갈음하여 무료 재생성 또는 사용된 H머니의
          복구·환불로 처리합니다. 재생성·복구 기준은 본 정책 및 아래 생성 오류
          안내를 따릅니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">5. 환불 가능 기준</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>구매 후 7일 이내이며 사용하지 않은 유상 H머니</li>
          <li>일부 사용 후 남은 유상 H머니 중 회사가 환불 가능하다고 확인한 잔액</li>
          <li>중복 결제, 결제 승인 오류, 회사 귀책으로 서비스가 제공되지 않은 경우</li>
          <li>법령 또는 결제대행사 정책상 환불이 필요한 경우</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">6. 환불이 제한될 수 있는 경우</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>회원이 유료 추천 또는 AI 이미지 생성을 실행해 디지털 콘텐츠 제공이 시작되거나 완료된 경우</li>
          <li>뒤로 가기, 화면 전환, 브라우저 새로고침·종료, 서비스 이용 중 다른 앱이나 웹 이용 등 사용자 조작 또는 이용 환경 변경으로 생성 오류가 발생한 경우</li>
          <li>결과 이미지의 취향 불일치, 시술 결과와의 차이, 사진 품질 문제 등 주관적 사유만 있는 경우</li>
          <li>타인의 사진, 부정 결제, 자동화 호출, 약관 위반 등 부정 이용이 확인된 경우</li>
          <li>이벤트, 무료 지급, 보너스, 프로모션으로 제공된 무상 H머니</li>
          <li>결제일 또는 사용일로부터 상당 기간이 지나 거래 확인이 어려운 경우</li>
        </ul>
        <MirilookGenerationRefundNotice className="mt-4" />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">7. 환불 금액 산정</h2>
        <p>
          환불은 실제 결제한 유상 H머니를 기준으로 산정합니다. 회원이 일부
          유료 기능을 사용한 경우 사용된 H머니, 결제대행 수수료, 법령상 공제
          가능한 비용을 제외한 금액이 환불될 수 있습니다. 무상 H머니는 현금으로
          환불되지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">8. 유효기간</h2>
        <p>
          유상 H머니의 사용기간(유효기간)은 충전일로부터 1년을 원칙으로 합니다.
          유효기간이 지난 H머니는 소멸될 수 있으며, 이벤트나 프로모션으로 지급된
          무상 H머니는 별도 고지된 기간을 따를 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">9. 신청 절차</h2>
        <p>
          환불 요청은 회원 계정 이메일, 결제일, 결제금액, 주문번호 또는
          승인번호, 환불 사유를 포함해 jipsa.admin@gmail.com으로 접수할 수
          있습니다. 회사는 접수 후 결제대행사 확인과 사용 이력 검토를 거쳐
          합리적인 기간 내 결과를 안내합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">
          환불/실패/고객문의 접수
        </h2>
        <p>
          생성 실패, 결제 오류, 환불 요청은 아래 양식으로 접수할 수 있습니다.
          추천 요청 ID나 결제 ID를 함께 남기면 확인 시간이 줄어듭니다.
        </p>
        <MirilookSupportCaseForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">10. 처리 방식</h2>
        <p>
          환불은 원칙적으로 최초 결제수단 취소 또는 결제대행사가 허용하는 방식에
          따릅니다. 카드사, 간편결제사, 은행, 앱마켓 등 외부 사업자의 처리
          일정에 따라 실제 입금 또는 승인 취소까지 추가 시간이 소요될 수
          있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">11. 정책 변경</h2>
        <p>
          본 정책은 법령, 결제수단, H머니 상품 구조, 유료 기능 변경에 따라
          수정될 수 있습니다. 중요한 변경은 서비스 내 공지 또는 이메일 등
          합리적인 방법으로 고지합니다.
        </p>
      </section>
    </div>
  );
}
