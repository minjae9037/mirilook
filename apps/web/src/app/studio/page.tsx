import { redirect } from "next/navigation";
import { STUDIO_FIRST_STEP, stepHref } from "@/lib/studio-flow";

// /studio 진입 → 첫 단계(성별 선택)로. 실제 화면은 layout이 스튜디오를 지속 렌더.
export default function StudioIndex() {
  redirect(stepHref(STUDIO_FIRST_STEP));
}
