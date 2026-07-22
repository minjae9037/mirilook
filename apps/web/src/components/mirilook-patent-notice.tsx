// 특허·디자인 출원 각주 — 헤어스타일 추천 9장 / 상담용 9장 3x3 화면 하단에 표시.
// 경쟁자의 무단 모방을 선언적으로 억지하기 위한 고지. ⚠️ 반드시 "출원(Pending)"으로만
// 표기한다(등록 아님) — 허위표시 방지(특허법 제224조·표시광고법).
export function MirilookPatentNotice({ className = "" }: { className?: string }) {
  return (
    // 각주라 결과 이미지보다 시선을 끌면 안 된다 — 11px에서 2px 낮춘 9px.
    // 줄간격도 함께 좁히지 않으면 글자만 작아지고 덩어리 높이는 그대로다.
    <aside
      className={`rounded-md border border-[#2b281f] bg-[#0f0e0c]/60 px-3 py-2 text-[9px] leading-4 text-[#8f826f] ${className}`}
    >
      <p className="text-[#b8aa95]">
        ※ 본 화면의 다방향 헤어스타일 이미지 제공 기술과 화면 디자인은 특허·디자인
        출원으로 보호받고 있으며, 무단 복제·모방 시 법적 책임이 따를 수 있습니다.
      </p>
      <p className="mt-0.5">
        특허출원 10-2026-0131146 (2026.07.16) · 디자인출원 30-2026-0025955
        (2026.07.14) · 엠제이인사이트㈜
      </p>
      <p className="mt-1.5 text-[#b8aa95]">
        This feature and screen design are protected by pending patent and design
        applications. Unauthorized reproduction or imitation is prohibited.
      </p>
      <p className="mt-0.5">
        Patent App. No. 10-2026-0131146 (filed Jul 16, 2026) · Design App. No.
        30-2026-0025955 (filed Jul 14, 2026) · MJ Insight Co., Ltd.
      </p>
    </aside>
  );
}
