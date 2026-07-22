import { mirilookGeneratedTranslations } from "./mirilook-translations.generated";
import type { MirilookRegionId } from "./mirilook-regions";

export type MirilookLocale = "ko" | "zh" | "ja" | "en";

export type MirilookLocaleOption = {
  flag: string;
  id: MirilookLocale;
  label: string;
  lang: string;
  nativeLabel: string;
};

export const mirilookLocaleOptions: MirilookLocaleOption[] = [
  { flag: "🇰🇷", id: "ko", label: "Korea", lang: "ko-KR", nativeLabel: "한국어" },
  { flag: "🇨🇳", id: "zh", label: "China", lang: "zh-CN", nativeLabel: "中文" },
  { flag: "🇯🇵", id: "ja", label: "Japan", lang: "ja-JP", nativeLabel: "日本語" },
  { flag: "🇺🇸", id: "en", label: "America", lang: "en-US", nativeLabel: "English" },
];

export const mirilookLocaleStorageKey = "mirilook_locale";
export const mirilookTranslationCacheVersion = "2026-07-22-generated-dict-13";

type TranslationValue = Record<Exclude<MirilookLocale, "ko">, string>;

const exactEntries: Array<[string, TranslationValue]> = [
  // 스튜디오 위저드 단계 라벨(성별 → 동의 → 사진 …)과 잔액 부족 팝업.
  [
    "성별",
    {
      zh: "性别",
      ja: "性別",
      en: "Gender",
    },
  ],
  [
    "추천 서비스 선택",
    {
      zh: "选择推荐服务",
      ja: "おすすめサービスの選択",
      en: "Choose a service",
    },
  ],
  [
    "사진 사용 동의",
    {
      zh: "同意使用照片",
      ja: "写真利用への同意",
      en: "Photo use consent",
    },
  ],
  [
    "Hair Money 충전 후 계속하기",
    {
      zh: "充值 Hair Money 后继续",
      ja: "Hair Money をチャージして続ける",
      en: "Top up Hair Money to continue",
    },
  ],
  [
    "스타일 추천 1회에는 Hair Money",
    {
      zh: "每次发型推荐需要 Hair Money",
      ja: "スタイル提案1回には Hair Money",
      en: "One style recommendation requires Hair Money",
    },
  ],
  [
    "아래에서 충전하면 지금 올린 사진을 그대로 둔 채 이어서 진행됩니다.",
    {
      zh: "在下方充值后，已上传的照片会保留，可直接继续。",
      ja: "下でチャージすると、アップロード済みの写真はそのままで続けられます。",
      en: "Top up below and continue right where you left off — your uploaded photos are kept.",
    },
  ],
  [
    "충전 완료 — 계속하기",
    {
      zh: "充值完成 — 继续",
      ja: "チャージ完了 — 続ける",
      en: "Topped up — continue",
    },
  ],
  [
    "잔액을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "无法确认余额。请稍后再试。",
      ja: "残高を確認できませんでした。しばらくしてからもう一度お試しください。",
      en: "We couldn't check your balance. Please try again in a moment.",
    },
  ],
  [
    "표시된 외화 금액은 유럽중앙은행 참고환율 기준의 참고값이며, 실제 결제는 원화로 청구됩니다. (환율 기준일",
    {
      zh: "所显示的外币金额为按欧洲央行参考汇率换算的参考值，实际支付以韩元结算。(汇率基准日",
      ja: "表示されている外貨金額は欧州中央銀行の参考レートによる参考値であり、実際の決済はウォンで請求されます。(レート基準日",
      en: "Foreign currency amounts are approximate, based on European Central Bank reference rates. You will be charged in KRW. (rate as of",
    },
  ],
  [
    "본 문서의 번역본은 이해를 돕기 위한 참고용이며, 법적 효력은 한국어 원문을 기준으로 합니다.",
    {
      zh: "本文件的译文仅供参考，法律效力以韩文原文为准。",
      ja: "本書面の翻訳版は理解を助けるための参考であり、法的効力は韓国語の原文を基準とします。",
      en: "This translation is provided for convenience only; the Korean original governs and is legally binding.",
    },
  ],
  // 숫자와 붙어 나오는 단위. `{price}원` 같은 JSX는 숫자와 단위가 각각 별도의
  // 텍스트 노드라 단위만 따로 조회된다. 영어는 앞 숫자와 붙지 않도록 공백을 넣는다.
  [
    "원",
    {
      zh: "韩元",
      ja: "ウォン",
      en: " KRW",
    },
  ],
  [
    "원 VAT 포함 기준",
    {
      zh: "韩元（含增值税）",
      ja: "ウォン（税込基準）",
      en: " KRW, VAT included",
    },
  ],
  [
    "년",
    {
      zh: "年",
      ja: "年",
      en: " year",
    },
  ],
  [
    "년입니다.",
    {
      zh: "年。",
      ja: "年です。",
      en: " year.",
    },
  ],
  [
    "· 개발자:",
    {
      zh: "· 开发者：",
      ja: "・開発者：",
      en: "· Developer:",
    },
  ],
  [
    "계정·데이터 삭제 관련 문의는 jipsa.admin@gmail.com으로 접수해 주세요. 자세한 처리 기준은",
    {
      zh: "账号・数据删除相关咨询请发送至 jipsa.admin@gmail.com。详细处理标准请见",
      ja: "アカウント・データ削除に関するお問い合わせは jipsa.admin@gmail.com までご連絡ください。詳しい処理基準は",
      en: "For account/data deletion inquiries, please contact jipsa.admin@gmail.com. For detailed handling criteria, see",
    },
  ],
  [
    "미리룩 앱 또는",
    {
      zh: "Miri Look 应用或",
      ja: "Miri Lookアプリ、または",
      en: "the Miri Look app or",
    },
  ],
  [
    "항목에서",
    {
      zh: "项目中",
      ja: "の項目で",
      en: " section",
    },
  ],
  [
    "확인을 위해 계정 이메일을 입력한 뒤",
    {
      zh: "为进行验证，请输入账号邮箱后",
      ja: "確認のため、アカウントのメールアドレスを入力した後",
      en: "After entering your account email for verification,",
    },
  ],
  [
    "서비스 이용, 결제, 환불, 개인정보, 신고 관련 문의는",
    {
      zh: "服务使用、支付、退款、个人信息、举报相关咨询请",
      ja: "サービス利用、決済、返金、個人情報、通報に関するお問い合わせは",
      en: "For inquiries about service use, payment, refunds, personal information, or reports,",
    },
  ],
  [
    "는 로그인 후",
    {
      zh: "，登录后",
      ja: "はログイン後",
      en: " must be signed in to",
    },
  ],
  [
    "충전한 유상 H머니의 사용기간(유효기간)은 충전일로부터 1년입니다. 구매 후 7일 이내 사용하지 않은 유상 H머니는 청약철회(취소)하여 환불받을 수 있으며, 환불은 최초 결제하신 결제수단으로만 이루어집니다. 취소·환불· 교환의 구체적 기준은",
    {
      zh: "充值的付费Hair Money使用期限（有效期）自充值之日起为1年。购买后7天内未使用的付费Hair Money可通过撤回申请（取消）获得退款，退款仅退回至您最初使用的支付方式。取消・退款・换购的具体标准请见",
      ja: "チャージした有償Hair Moneyの使用期間（有効期限）はチャージ日から1年間です。購入後7日以内に使用していない有償Hair Moneyは申込みの撤回（取消）により返金を受けることができ、返金は最初にご利用いただいた決済手段にのみ行われます。取消・返金・交換の具体的な基準は",
      en: "The usage period (validity) of purchased paid Hair Money is 1 year from the date of top-up. Paid Hair Money not used within 7 days of purchase can be refunded by withdrawing the purchase (cancellation), and refunds are issued only to the original payment method used. For the detailed criteria on cancellations, refunds, and exchanges, see",
    },
  ],
  [
    "오류 코드:",
    {
      zh: "错误代码：",
      ja: "エラーコード：",
      en: "Error code:",
    },
  ],
  [
    "관심 있으신 미용실에서는",
    {
      zh: "您感兴趣的美发店",
      ja: "気になる美容室では",
      en: "At the salon you're interested in,",
    },
  ],
  [
    "또는",
    {
      zh: "或",
      ja: "または",
      en: "or",
    },
  ],
  [
    "· 사진",
    {
      zh: "· 照片",
      ja: "・写真",
      en: "· Photo",
    },
  ],
  [
    "까지 열람 가능",
    {
      zh: "前可查看",
      ja: "まで閲覧可能",
      en: " can be viewed until",
    },
  ],
  [
    "장 기준",
    {
      zh: "张为准",
      ja: "枚基準",
      en: " photos as the basis",
    },
  ],
  [
    "· 삭제되는 항목: 계정 정보, 프로필, 업로드한 얼굴 사진, 상담 결과·생성 이미지(",
    {
      zh: "· 删除的项目：账号信息、个人资料、上传的面部照片、咨询结果・生成图片（",
      ja: "・削除される項目：アカウント情報、プロフィール、アップロードした顔写真、相談結果・生成画像（",
      en: "· Items deleted: account information, profile, uploaded face photos, consultation results and generated images (",
    },
  ],
  [
    "건)",
    {
      zh: "件）",
      ja: "件）",
      en: " items)",
    },
  ],
  [
    "영구 삭제",
    {
      zh: "永久删除",
      ja: "完全削除",
      en: "Permanently delete",
    },
  ],
  [
    "으로 요청하셔도 됩니다.",
    {
      zh: "方式提出申请即可。",
      ja: "でご依頼いただいても構いません。",
      en: " you may also submit your request.",
    },
  ],
  [
    "직접 삭제가 어려우면",
    {
      zh: "如果难以自行删除，",
      ja: "ご自身での削除が難しい場合は",
      en: "If you have difficulty deleting it yourself,",
    },
  ],
  [
    "Hair Money가 함께 소멸",
    {
      zh: "Hair Money也将一并消失",
      ja: "Hair Moneyも一緒に消滅",
      en: "Hair Money will also be forfeited",
    },
  ],
  [
    "로그인하면",
    {
      zh: "登录后，",
      ja: "ログインすると",
      en: "When you sign in,",
    },
  ],
  [
    "만 14세 이상이며,",
    {
      zh: "年满14周岁，并且",
      ja: "満14歳以上であり、",
      en: "is at least 14 years old, and",
    },
  ],
  [
    "및 커뮤니티 무관용 정책에 동의하게 됩니다.",
    {
      zh: "以及社区零容忍政策。",
      ja: "およびコミュニティのゼロトレランスポリシーに同意したことになります。",
      en: "and agree to the community zero-tolerance policy.",
    },
  ],
  [
    "에 동의합니다. 미리룩 커뮤니티는",
    {
      zh: "。Miri Look社区",
      ja: "に同意します。Miri Lookコミュニティは",
      en: " agree to. The Miri Look community is",
    },
  ],
  [
    "댓글 접수",
    {
      zh: "评论已提交",
      ja: "コメント受付",
      en: "Comment received",
    },
  ],
  [
    "접수",
    {
      zh: "已提交",
      ja: "受付",
      en: "Submitted",
    },
  ],
  [
    "투표 대상",
    {
      zh: "投票对象",
      ja: "投票対象",
      en: "Poll target",
    },
  ],
  [
    "투표 저장",
    {
      zh: "保存投票",
      ja: "投票を保存",
      en: "Save vote",
    },
  ],
  [
    "신고 접수",
    {
      zh: "举报已提交",
      ja: "通報受付",
      en: "Report received",
    },
  ],
  [
    "리뷰 접수하기",
    {
      zh: "提交评价",
      ja: "レビューを送信する",
      en: "Submit review",
    },
  ],
  [
    "예약 문의 보내기",
    {
      zh: "发送预约咨询",
      ja: "予約問い合わせを送る",
      en: "Send reservation inquiry",
    },
  ],
  [
    "입점 신청 보내기",
    {
      zh: "发送入驻申请",
      ja: "出店申請を送る",
      en: "Send partnership application",
    },
  ],
  [
    "투표 요청 보내기",
    {
      zh: "发送投票请求",
      ja: "投票リクエストを送る",
      en: "Send poll request",
    },
  ],
  [
    "· 잔액",
    {
      zh: "· 余额",
      ja: "・残高",
      en: "· Balance",
    },
  ],
  [
    "· 충전한 유상 Hair Money의 사용기간(유효기간)은 충전일로부터",
    {
      zh: "· 充值的付费Hair Money使用期限（有效期）自充值之日起为",
      ja: "・チャージした有償Hair Moneyの使用期間（有効期限）はチャージ日から",
      en: "· The usage period (validity) of purchased paid Hair Money is, from the date of top-up,",
    },
  ],
  [
    "· 충전한 Hair Money의 사용기간(유효기간)은 충전일로부터",
    {
      zh: "· 充值的Hair Money使用期限（有效期）自充值之日起为",
      ja: "・チャージしたHair Moneyの使用期間（有効期限）はチャージ日から",
      en: "· The usage period (validity) of purchased Hair Money is, from the date of top-up,",
    },
  ],
  [
    "· Hair Money는 유상 충전 사이버머니이며 현재 충전 기준은 1 Hair Money당",
    {
      zh: "· Hair Money是付费充值的虚拟货币，目前充值标准为每1 Hair Money",
      ja: "・Hair Moneyは有償チャージ型のサイバーマネーであり、現在のチャージ基準は1 Hair Moneyあたり",
      en: "· Hair Money is a paid top-up virtual currency, and the current top-up rate is, per 1 Hair Money,",
    },
  ],
  [
    "% 할인",
    {
      zh: "% 折扣",
      ja: "%割引",
      en: "% off",
    },
  ],
  [
    "1 Hair Money는",
    {
      zh: "1 Hair Money为",
      ja: "1 Hair Moneyは",
      en: "1 Hair Money is",
    },
  ],
  [
    "같은 원화로 더 많은 Hair Money를 드립니다 — 충전 금액이 클수록 최대 약 26.5%까지 추가 적립됩니다. (1 Hair Money 정가 환산",
    {
      zh: "以相同的韩元金额提供更多的Hair Money — 充值金额越大，最多可额外获得约26.5%的赠送。(1 Hair Money 原价折算",
      ja: "同じウォン金額でより多くのHair Moneyを差し上げます — チャージ金額が大きいほど、最大約26.5%まで追加付与されます。(1 Hair Money 正価換算",
      en: "Get more Hair Money for the same amount in KRW — the larger the top-up amount, the more bonus you receive, up to about 26.5% extra. (1 Hair Money at list-price conversion",
    },
  ],
  [
    "결제 정책",
    {
      zh: "支付政策",
      ja: "決済ポリシー",
      en: "Payment Policy",
    },
  ],
  [
    "결제 정책을 따르며, 환불은",
    {
      zh: "支付政策，退款",
      ja: "決済ポリシーに従い、返金は",
      en: "follows the Payment Policy, and refunds",
    },
  ],
  [
    "결제가 확인되면 로그인한 계정 지갑에 즉시 적립됩니다. 헤어스타일 추천을 요청할 때마다",
    {
      zh: "支付确认后将立即充值到您登录账号的钱包中。每次请求发型推荐时，",
      ja: "決済が確認されると、ログイン中のアカウントのウォレットに即座に付与されます。ヘアスタイル提案をリクエストするたびに",
      en: "Once payment is confirmed, it is instantly credited to your signed-in account wallet. Each time you request a hairstyle recommendation,",
    },
  ],
  [
    "년입니다.",
    {
      zh: "年。",
      ja: "年間です。",
      en: " year(s).",
    },
  ],
  [
    "원 ·",
    {
      zh: "韩元 ·",
      ja: "ウォン・",
      en: " KRW ·",
    },
  ],
  [
    "원 (VAT 포함)",
    {
      zh: "韩元（含增值税）",
      ja: "ウォン（税込）",
      en: " KRW (VAT included)",
    },
  ],
  [
    "원, VAT 포함 기준)이 차감되고, 생성 결과와 사용 내역으로 기록됩니다.",
    {
      zh: "韩元，含增值税）将被扣除，并记录为生成结果和使用记录。",
      ja: "ウォン、税込基準）が差し引かれ、生成結果と利用履歴として記録されます。",
      en: " KRW, VAT included) will be deducted and recorded as a generation result and usage history.",
    },
  ],
  [
    "원, VAT 포함) 충전한 Hair Money는 회원 계정에 적립되고 추천 사용 시 차감됩니다.",
    {
      zh: "韩元，含增值税）充值的Hair Money将存入会员账号，并在使用推荐服务时扣除。",
      ja: "ウォン、税込）チャージしたHair Moneyは会員アカウントに付与され、提案利用時に差し引かれます。",
      en: " KRW, VAT included). Purchased Hair Money is credited to your member account and deducted when you use a recommendation.",
    },
  ],
  [
    "원(VAT 포함) 기준입니다.",
    {
      zh: "韩元（含增值税）为准。",
      ja: "ウォン（税込）が基準です。",
      en: " KRW (VAT included).",
    },
  ],
  [
    "원(VAT 포함)이며, 추천 1회는",
    {
      zh: "韩元（含增值税），单次推荐为",
      ja: "ウォン（税込）であり、提案1回は",
      en: " KRW (VAT included), and one recommendation is",
    },
  ],
  [
    "원(VAT 포함)입니다.",
    {
      zh: "韩元（含增值税）。",
      ja: "ウォン（税込）です。",
      en: " KRW (VAT included).",
    },
  ],
  [
    "을 따르며, 환불은",
    {
      zh: "，退款",
      ja: "に従い、返金は",
      en: ", and refunds",
    },
  ],
  [
    "자세한 내용은",
    {
      zh: "详细内容请见",
      ja: "詳細は",
      en: "For details, see",
    },
  ],
  [
    "잔액 새로고침",
    {
      zh: "刷新余额",
      ja: "残高を更新",
      en: "Refresh balance",
    },
  ],
  [
    "주문내역에서 신청할 수 있습니다.",
    {
      zh: "可在订单记录中申请。",
      ja: "注文履歴から申請できます。",
      en: "You can request this from your order history.",
    },
  ],
  [
    "충전한 Hair Money의 사용기간(유효기간)은 충전일로부터",
    {
      zh: "充值的Hair Money使用期限（有效期）自充值之日起为",
      ja: "チャージしたHair Moneyの使用期間（有効期限）はチャージ日から",
      en: "The usage period (validity) of purchased Hair Money is, from the date of top-up,",
    },
  ],
  [
    "헤어 추천 1회",
    {
      zh: "1次发型推荐",
      ja: "ヘア提案1回",
      en: "1 hairstyle recommendation",
    },
  ],
  [
    "Hair Money 충전하기",
    {
      zh: "充值Hair Money",
      ja: "Hair Moneyをチャージする",
      en: "Top up Hair Money",
    },
  ],
  [
    "Hair Money, 추가 상담 세트(9방향) 생성 1회",
    {
      zh: "Hair Money，额外生成1次咨询套装（9个方向）",
      ja: "Hair Money、追加の相談セット（9方向）生成1回",
      en: "Hair Money, 1 additional consultation set (9 angles) generation",
    },
  ],
  [
    "Hair Money가 차감됩니다.",
    {
      zh: "将被扣除Hair Money。",
      ja: "Hair Moneyが差し引かれます。",
      en: " Hair Money will be deducted.",
    },
  ],
  [
    "· 기본은 전체 업로드입니다. 제외할 사진을 누르면 체크가 해제됩니다.",
    {
      zh: "· 默认为全部上传。点击要排除的照片即可取消勾选。",
      ja: "・デフォルトは全件アップロードです。除外したい写真をタップするとチェックが外れます。",
      en: "· By default, all photos are uploaded. Tap a photo to exclude it and its checkmark will be cleared.",
    },
  ],
  [
    "· 원본",
    {
      zh: "· 原图",
      ja: "・オリジナル",
      en: "· Original",
    },
  ],
  [
    "선택된 사진",
    {
      zh: "已选照片",
      ja: "選択した写真",
      en: "Selected photos",
    },
  ],
  [
    "장 · 결과",
    {
      zh: "张 · 结果",
      ja: "枚・結果",
      en: " photos · Result",
    },
  ],
  [
    "장 · 추천",
    {
      zh: "张 · 推荐",
      ja: "枚・提案",
      en: " photos · Recommendation",
    },
  ],
  [
    "피드",
    {
      zh: "动态",
      ja: "フィード",
      en: "Feed",
    },
  ],
  [
    "피드에 올리기",
    {
      zh: "发布到动态",
      ja: "フィードに投稿",
      en: "Post to feed",
    },
  ],
  [
    "회수",
    {
      zh: "撤回",
      ja: "取り消し",
      en: "Retract",
    },
  ],
  [
    "발송하기",
    {
      zh: "发送",
      ja: "送信する",
      en: "Send",
    },
  ],
  [
    "미리룩의 AI 추천 이미지는 상담 참고용이며 실제 시술 결과와 다를 수 있어요. ·",
    {
      zh: "Miri Look的AI推荐图片仅供咨询参考，可能与实际施术结果有所不同。·",
      ja: "Miri LookのAI提案画像は相談の参考用であり、実際の施術結果とは異なる場合があります。・",
      en: "Miri Look's AI recommendation images are for consultation reference only and may differ from actual results. ·",
    },
  ],
  [
    "또는 공유 아이콘 →",
    {
      zh: "或分享图标 →",
      ja: "または共有アイコン →",
      en: "or the share icon →",
    },
  ],
  [
    "로 열려 있어요. 이 상태에서는",
    {
      zh: "已打开。在此状态下，",
      ja: "で開かれています。この状態では",
      en: " is open. In this state,",
    },
  ],
  [
    "로 열면 정상 작동해요.",
    {
      zh: "打开即可正常使用。",
      ja: "で開くと正常に動作します。",
      en: " opens it correctly.",
    },
  ],
  [
    "메뉴 →",
    {
      zh: "菜单 →",
      ja: "メニュー →",
      en: "Menu →",
    },
  ],
  [
    "크롬",
    {
      zh: "Chrome",
      ja: "Chrome",
      en: "Chrome",
    },
  ],
  [
    "화면",
    {
      zh: "画面",
      ja: "画面",
      en: "screen",
    },
  ],
  [
    "알림 받기",
    {
      zh: "接收通知",
      ja: "通知を受け取る",
      en: "Receive notifications",
    },
  ],
  [
    "해제",
    {
      zh: "解除",
      ja: "解除",
      en: "Turn off",
    },
  ],
  [
    "카드 결제 (KG이니시스)",
    {
      zh: "银行卡支付（KG Inicis）",
      ja: "カード決済（KG イニシス）",
      en: "Card payment (KG Inicis)",
    },
  ],
  [
    ", 충전은",
    {
      zh: "，充值",
      ja: "、チャージは",
      en: ", and top-up",
    },
  ],
  [
    "선택한 사진 저장",
    {
      zh: "保存所选照片",
      ja: "選択した写真を保存",
      en: "Save selected photos",
    },
  ],
  [
    "프로필 저장",
    {
      zh: "保存资料",
      ja: "プロフィールを保存",
      en: "Save profile",
    },
  ],
  [
    "· 리뷰",
    {
      zh: "· 评价",
      ja: "・レビュー",
      en: "· Review",
    },
  ],
  [
    "님에게 DM 보내기",
    {
      zh: "发私信",
      ja: "さんにDMを送る",
      en: " Send a DM to",
    },
  ],
  [
    "등록",
    {
      zh: "注册",
      ja: "登録",
      en: "Register",
    },
  ],
  [
    "에게 DM",
    {
      zh: "私信",
      ja: "へDM",
      en: " DM to",
    },
  ],
  [
    "이 이용자를 차단할까요?\\n차단하면 이 이용자의 게시물이 내 피드에서 즉시 사라지고, 운영자에게 통지됩니다.",
    {
      zh: "要屏蔽此用户吗？\\n屏蔽后，该用户的帖子将立即从我的动态中消失，并会通知给运营方。",
      ja: "このユーザーをブロックしますか？\\nブロックすると、このユーザーの投稿が自分のフィードから即座に非表示になり、運営者に通知されます。",
      en: "Block this user?\\nBlocking will immediately remove this user's posts from your feed and notify the admins.",
    },
  ],
  [
    "jpg, png, webp · 최대",
    {
      zh: "jpg、png、webp · 最大",
      ja: "jpg、png、webp・最大",
      en: "jpg, png, webp · Max",
    },
  ],
  [
    "/2장 완료",
    {
      zh: "/2张完成",
      ja: "/2枚完了",
      en: "/2 photos done",
    },
  ],
  [
    "2 Hair Money로 투표 올리기",
    {
      zh: "以2 Hair Money发起投票",
      ja: "2 Hair Moneyで投票を投稿",
      en: "Post a poll for 2 Hair Money",
    },
  ],
  [
    "9장 중",
    {
      zh: "9张中",
      ja: "9枚中",
      en: "of 9 photos",
    },
  ],
  [
    "가이드",
    {
      zh: "指南",
      ja: "ガイド",
      en: "Guide",
    },
  ],
  [
    "개가 필요합니다.",
    {
      zh: "个为必需。",
      ja: "個必要です。",
      en: " are required.",
    },
  ],
  [
    "검색 결과를 추가하면 현재 선택된",
    {
      zh: "添加搜索结果后，当前已选择的",
      ja: "検索結果を追加すると、現在選択されている",
      en: "If you add a search result, the currently selected",
    },
  ],
  [
    "공유 링크 만들기",
    {
      zh: "创建分享链接",
      ja: "共有リンクを作成",
      en: "Create share link",
    },
  ],
  [
    "그룹에 들어갑니다.",
    {
      zh: "将加入该分组。",
      ja: "グループに入ります。",
      en: " will join the group.",
    },
  ],
  [
    "레퍼런스 추가",
    {
      zh: "添加参考",
      ja: "参考を追加",
      en: "Add reference",
    },
  ],
  [
    "명 선택 · 추가 가능",
    {
      zh: "人已选 · 可继续添加",
      ja: "人選択・追加可能",
      en: " selected · more can be added",
    },
  ],
  [
    "사진 적합도 ·",
    {
      zh: "照片匹配度 ·",
      ja: "写真適合度・",
      en: "Photo suitability ·",
    },
  ],
  [
    "상담용 9장 생성에는 Hair Money",
    {
      zh: "生成咨询用9张图片需要Hair Money",
      ja: "相談用9枚の生成にはHair Money",
      en: "Generating the 9 consultation images requires Hair Money",
    },
  ],
  [
    "상담용 이미지",
    {
      zh: "咨询用图片",
      ja: "相談用画像",
      en: "Consultation images",
    },
  ],
  [
    "아래에서 충전하면 추천 화면을 그대로 둔 채 이어서 생성됩니다.",
    {
      zh: "在下方充值后，将保留当前推荐画面并继续生成。",
      ja: "以下でチャージすると、提案画面をそのままにして生成が続行されます。",
      en: "If you top up below, generation will continue without leaving the recommendation screen.",
    },
  ],
  [
    "에 이미지 링크 추가",
    {
      zh: "添加图片链接至",
      ja: "に画像リンクを追加",
      en: " add an image link to",
    },
  ],
  [
    "원, VAT 포함 기준)가 차감됩니다.",
    {
      zh: "韩元，含增值税）将被扣除。",
      ja: "ウォン、税込基準）が差し引かれます。",
      en: " KRW, VAT included) will be deducted.",
    },
  ],
  [
    "원하는 컷을 여러 개 선택할 수 있습니다. 선택하지 않으면",
    {
      zh: "可以选择多个想要的发型。若不选择，",
      ja: "希望するカットを複数選択できます。選択しない場合は",
      en: "You can select multiple cuts you want. If none are selected,",
    },
  ],
  [
    "을 사용하려면 얼굴 사진을 AI 헤어스타일 추천과 상담 이미지 생성에 사용하는 것에 먼저 동의해 주세요.",
    {
      zh: "若要使用，请先同意将面部照片用于AI发型推荐及咨询图片生成。",
      ja: "を利用するには、顔写真をAIヘアスタイル提案および相談画像生成に使用することに、まず同意してください。",
      en: " requires you to first agree to using your face photo for AI hairstyle recommendations and consultation image generation.",
    },
  ],
  [
    "장 · 추천 결과 1칸 사용",
    {
      zh: "张 · 使用1个推荐结果位",
      ja: "枚・提案結果1枠使用",
      en: " photos · uses 1 recommendation result slot",
    },
  ],
  [
    "장 기준 · 결과",
    {
      zh: "张为准 · 结果",
      ja: "枚基準・結果",
      en: " photos basis · Result",
    },
  ],
  [
    "장이 생성되지 않았습니다. 다시 생성해도 추가 비용은 없습니다.",
    {
      zh: "张未生成。重新生成不会产生额外费用。",
      ja: "枚が生成されませんでした。再生成しても追加費用はかかりません。",
      en: " photos were not generated. Regenerating incurs no additional cost.",
    },
  ],
  [
    "전용 후보 안에서 자동 추천합니다.",
    {
      zh: "将在专属候选中自动推荐。",
      ja: "専用候補の中から自動で提案します。",
      en: "Automatically recommends from within the dedicated candidates.",
    },
  ],
  [
    "추가",
    {
      zh: "添加",
      ja: "追加",
      en: "Add",
    },
  ],
  [
    "추천 목적과 헤어 컬러, 필요한 메모를 먼저 확인하면 더 정확한 9개 이미지를 만들 수 있습니다. 실제 추천 1회당",
    {
      zh: "先确认推荐目的、发色和所需备注，可以生成更精准的9张图片。实际每次推荐",
      ja: "提案の目的とヘアカラー、必要なメモを先にご確認いただくと、より精度の高い9枚の画像を作成できます。実際の提案1回あたり",
      en: "Checking your recommendation purpose, hair color, and any notes in advance helps create more accurate images from the 9. Per actual recommendation,",
    },
  ],
  [
    "현재",
    {
      zh: "当前",
      ja: "現在",
      en: "Currently",
    },
  ],
  [
    "휠을 마우스나 손으로 움직여 원하는 색을 고른 뒤, 아래",
    {
      zh: "用鼠标或手指移动色轮选择想要的颜色后，在下方",
      ja: "ホイールをマウスや指で動かして好きな色を選んだ後、下の",
      en: "Move the wheel with your mouse or finger to pick the color you want, then below,",
    },
  ],
  [
    "(선택 · 최대",
    {
      zh: "（选填 · 最多",
      ja: "（任意・最大",
      en: "(Optional · Max",
    },
  ],
  [
    "문의 접수",
    {
      zh: "咨询已提交",
      ja: "お問い合わせ受付",
      en: "Inquiry received",
    },
  ],
  [
    "스크린샷 첨부",
    {
      zh: "附加截图",
      ja: "スクリーンショットを添付",
      en: "Attach screenshot",
    },
  ],
  [
    "장)",
    {
      zh: "张）",
      ja: "枚）",
      en: " photos)",
    },
  ],
  [
    "— 신고·제재 이력은 재가입을 통한 회피를 막기 위해 필요한 범위에서 최소한으로 보관될 수 있습니다.",
    {
      zh: "— 举报·处罚记录可能在为防止通过重新注册规避处罚所需的最小范围内予以保留。",
      ja: "— 通報・制裁の履歴は、再登録による回避を防止するために必要な範囲で最小限保管される場合があります。",
      en: "— Report and sanction history may be retained to the minimum extent necessary to prevent evasion through re-registration.",
    },
  ],
  [
    "— 작성자 식별정보가 제거된 익명 상태로 남습니다. 다른 이용자의 대화 맥락이 훼손되지 않도록 하기 위함이며, 해당 게시물의 삭제를 원하시면 계정 삭제 전에 직접 삭제하시거나 jipsa.admin@gmail.com으로 요청해 주세요.",
    {
      zh: "— 将以移除作者识别信息的匿名状态保留。这是为了不损害其他用户的对话脉络，如需删除该帖子，请在删除账户前自行删除，或通过 jipsa.admin@gmail.com 提出申请。",
      ja: "— 作成者の識別情報が削除された匿名の状態で残ります。他の利用者の会話の文脈が損なわれないようにするためであり、当該投稿の削除をご希望の場合は、アカウント削除前にご自身で削除するか、jipsa.admin@gmail.com までご依頼ください。",
      en: "— It remains in an anonymous state with the author's identifying information removed. This is to avoid disrupting the conversation context for other users; if you want that post deleted, please delete it yourself before deleting your account, or request deletion at jipsa.admin@gmail.com.",
    },
  ],
  [
    "— 전자상거래 등에서의 소비자보호에 관한 법률에 따라",
    {
      zh: "— 根据《电子商务等消费者保护法》",
      ja: "— 電子商取引等における消費者保護に関する法律に基づき",
      en: "— Pursuant to the Act on Consumer Protection in Electronic Commerce, Etc.",
    },
  ],
  [
    "“계정 삭제”",
    {
      zh: "“删除账户”",
      ja: "「アカウント削除」",
      en: "\"Delete Account\"",
    },
  ],
  [
    "“계정 삭제하기”",
    {
      zh: "“删除账户”",
      ja: "「アカウントを削除する」",
      en: "\"Delete Account\"",
    },
  ],
  [
    "“영구 삭제”",
    {
      zh: "“永久删除”",
      ja: "「完全に削除」",
      en: "\"Permanently Delete\"",
    },
  ],
  [
    "5년간",
    {
      zh: "5年间",
      ja: "5年間",
      en: "for 5 years",
    },
  ],
  [
    "결제·환불 기록",
    {
      zh: "支付·退款记录",
      ja: "決済・返金記録",
      en: "Payment and refund records",
    },
  ],
  [
    "계정 및 데이터 삭제",
    {
      zh: "账户及数据删除",
      ja: "アカウントおよびデータの削除",
      en: "Account and Data Deletion",
    },
  ],
  [
    "계정 정보(이메일, 소셜 로그인 식별값, 닉네임, 자기소개, 프로필 사진)",
    {
      zh: "账户信息（邮箱、社交登录识别值、昵称、个人简介、头像照片）",
      ja: "アカウント情報（メールアドレス、ソーシャルログイン識別値、ニックネーム、自己紹介、プロフィール写真）",
      en: "Account information (email, social login identifier, nickname, bio, profile photo)",
    },
  ],
  [
    "계정을 삭제하는 방법",
    {
      zh: "删除账户的方法",
      ja: "アカウントを削除する方法",
      en: "How to delete your account",
    },
  ],
  [
    "계정을 삭제하지 않고 데이터만 지우려면",
    {
      zh: "如果想在不删除账户的情况下仅删除数据",
      ja: "アカウントを削除せずにデータのみ削除したい場合",
      en: "To delete only your data without deleting your account",
    },
  ],
  [
    "계정을 유지한 채 일부 데이터만 삭제할 수 있습니다.",
    {
      zh: "您可以在保留账户的同时仅删除部分数据。",
      ja: "アカウントを維持したまま一部のデータのみを削除できます。",
      en: "You can delete some data while keeping your account.",
    },
  ],
  [
    "되며 되돌릴 수 없습니다. 직접 삭제가 어려운 경우 jipsa.admin@gmail.com으로 요청하시면 접수 후 30일 이내에 처리합니다.",
    {
      zh: "，且无法恢复。如自行删除有困难，可通过 jipsa.admin@gmail.com 提出申请，我们将在受理后30日内处理。",
      ja: "され、元に戻すことはできません。ご自身での削除が難しい場合は、jipsa.admin@gmail.com までご依頼いただければ、受付後30日以内に処理いたします。",
      en: ", which cannot be undone. If you have difficulty deleting it yourself, you may request deletion at jipsa.admin@gmail.com, and it will be processed within 30 days of receipt.",
    },
  ],
  [
    "로 이동합니다. (앱에서는 하단 내비게이션의 “마이”)",
    {
      zh: "移动至该页面。（在应用中为底部导航栏的“我的”）",
      ja: "そのページに移動します。（アプリでは下部ナビゲーションの「マイ」）",
      en: "Go to that page. (In the app, this is \"My\" in the bottom navigation)",
    },
  ],
  [
    "를 누릅니다.",
    {
      zh: "点击该按钮。",
      ja: "を押します。",
      en: "Tap it.",
    },
  ],
  [
    "마이페이지 → 기준 사진에서 업로드한 얼굴 사진을 개별 삭제",
    {
      zh: "我的页面 → 在基准照片中单独删除已上传的面部照片",
      ja: "マイページ → 基準写真でアップロードした顔写真を個別削除",
      en: "My Page → Individually delete uploaded face photos in Reference Photos",
    },
  ],
  [
    "마이페이지 → 상담 기록에서 상담 결과와 생성 이미지를 개별 삭제",
    {
      zh: "我的页面 → 在咨询记录中单独删除咨询结果和生成的图片",
      ja: "マイページ → 相談履歴で相談結果と生成画像を個別削除",
      en: "My Page → Individually delete consultation results and generated images in Consultation History",
    },
  ],
  [
    "미리룩 (Miri Look)",
    {
      zh: "Miri Look",
      ja: "Miri Look",
      en: "Miri Look",
    },
  ],
  [
    "미리룩 계정과 데이터를 삭제하는 방법을 안내합니다.",
    {
      zh: "介绍删除 Miri Look 账户和数据的方法。",
      ja: "Miri Look アカウントとデータを削除する方法をご案内します。",
      en: "This explains how to delete your Miri Look account and data.",
    },
  ],
  [
    "보관됩니다.",
    {
      zh: "予以保留。",
      ja: "保管されます。",
      en: "will be retained.",
    },
  ],
  [
    "보유한 Hair Money 잔액(환불되지 않고 소멸)",
    {
      zh: "持有的 Hair Money 余额（不予退还，直接失效）",
      ja: "保有している Hair Money 残高（返金されず消滅）",
      en: "Hair Money balance held (forfeited without refund)",
    },
  ],
  [
    "부정 이용 방지 기록",
    {
      zh: "防止不当使用记录",
      ja: "不正利用防止記録",
      en: "Fraud prevention records",
    },
  ],
  [
    "삭제는",
    {
      zh: "删除将",
      ja: "削除は",
      en: "Deletion is",
    },
  ],
  [
    "삭제되는 데이터",
    {
      zh: "被删除的数据",
      ja: "削除されるデータ",
      en: "Data that will be deleted",
    },
  ],
  [
    "삭제되지 않고 남는 데이터",
    {
      zh: "不被删除而保留的数据",
      ja: "削除されずに残るデータ",
      en: "Data that will not be deleted and will remain",
    },
  ],
  [
    "상담 공유 링크 및 그 접근 권한",
    {
      zh: "咨询分享链接及其访问权限",
      ja: "相談共有リンクおよびそのアクセス権限",
      en: "Consultation share links and their access permissions",
    },
  ],
  [
    "앱 이름:",
    {
      zh: "应用名称：",
      ja: "アプリ名：",
      en: "App name:",
    },
  ],
  [
    "업로드한 얼굴 사진 원본",
    {
      zh: "上传的面部照片原图",
      ja: "アップロードした顔写真の原本",
      en: "Original uploaded face photos",
    },
  ],
  [
    "에 로그인합니다.",
    {
      zh: "登录。",
      ja: "にログインします。",
      en: "Log in to it.",
    },
  ],
  [
    "즉시 처리",
    {
      zh: "立即处理",
      ja: "即時処理",
      en: "Immediate processing",
    },
  ],
  [
    "커뮤니티 게시글·댓글",
    {
      zh: "社区帖子·评论",
      ja: "コミュニティ投稿・コメント",
      en: "Community posts and comments",
    },
  ],
  [
    "커뮤니티에서 본인이 작성한 게시글·댓글 삭제",
    {
      zh: "删除本人在社区发布的帖子·评论",
      ja: "コミュニティでご自身が作成した投稿・コメントの削除",
      en: "Delete posts and comments you have written in the community",
    },
  ],
  [
    "페이지 맨 아래",
    {
      zh: "页面最下方",
      ja: "ページの一番下",
      en: "Bottom of the page",
    },
  ],
  [
    "AI가 생성한 헤어스타일 추천 결과와 9방향 상담 이미지",
    {
      zh: "AI 生成的发型推荐结果及9个方向的咨询用图片",
      ja: "AIが生成したヘアスタイル推薦結果と9方向相談画像",
      en: "AI-generated hairstyle recommendation results and 9-angle consultation images",
    },
  ],
  [
    "계정·데이터 삭제",
    {
      zh: "账户·数据删除",
      ja: "アカウント・データ削除",
      en: "Account and Data Deletion",
    },
  ],
  [
    "취소·환불·교환",
    {
      zh: "取消·退款·换货",
      ja: "キャンセル・返金・交換",
      en: "Cancellation, Refunds, and Exchanges",
    },
  ],
  [
    "10. 만 14세 미만 아동의 개인정보",
    {
      zh: "10. 未满14周岁儿童的个人信息",
      ja: "10. 満14歳未満の児童の個人情報",
      en: "10. Personal Information of Children Under Age 14",
    },
  ],
  [
    "11. 개인정보 보호책임자 및 사업자 정보",
    {
      zh: "11. 个人信息保护负责人及经营者信息",
      ja: "11. 個人情報保護責任者および事業者情報",
      en: "11. Personal Information Protection Officer and Business Information",
    },
  ],
  [
    "개인정보 관련 문의, 권리 행사, 침해 신고는 위 연락처로 접수할 수 있습니다. 개인정보 침해에 관한 상담이 필요한 경우 개인정보분쟁조정위원회 (1833-6972), 개인정보침해신고센터(118), 대검찰청 사이버수사과(1301), 경찰청 사이버수사국(182)에 문의하실 수 있습니다.",
    {
      zh: "个人信息相关咨询、权利行使、侵害举报可通过上述联系方式受理。如需就个人信息侵害进行咨询，可联系个人信息纠纷调解委员会（1833-6972）、个人信息侵害举报中心（118）、大检察厅网络调查科（1301）、警察厅网络调查局（182）。",
      ja: "個人情報に関するお問い合わせ、権利行使、侵害の申告は上記連絡先で受け付けます。個人情報侵害に関する相談が必要な場合は、個人情報紛争調停委員会（1833-6972）、個人情報侵害申告センター（118）、大検察庁サイバー捜査課（1301）、警察庁サイバー捜査局（182）にお問い合わせいただけます。",
      en: "Inquiries regarding personal information, exercise of rights, and reports of infringement may be submitted to the contact information above. For consultation regarding personal information infringement, you may contact the Personal Information Dispute Mediation Committee (1833-6972), the Personal Information Infringement Report Center (118), the Supreme Prosecutors' Office Cyber Investigation Division (1301), or the National Police Agency Cyber Investigation Bureau (182).",
    },
  ],
  [
    "개인정보 보호책임자: 이민재 (대표)",
    {
      zh: "个人信息保护负责人：李玟宰（代表）",
      ja: "個人情報保護責任者：イ・ミンジェ（代表）",
      en: "Personal Information Protection Officer: Lee Min-jae (CEO)",
    },
  ],
  [
    "미리룩은 만 14세 미만 아동을 대상으로 하지 않으며, 만 14세 미만 아동의 회원가입과 개인정보 수집을 허용하지 않습니다. 만 14세 미만인 경우 서비스를 이용할 수 없으며, 회사가 법정대리인의 동의 없이 만 14세 미만 아동의 개인정보가 수집된 사실을 알게 된 경우 지체 없이 해당 정보를 파기합니다.",
    {
      zh: "Miri Look 不面向未满14周岁的儿童，不允许未满14周岁儿童注册会员及收集其个人信息。未满14周岁者不得使用本服务，若公司在未经法定代理人同意的情况下获知已收集未满14周岁儿童个人信息的事实，将立即销毁该信息。",
      ja: "Miri Look は満14歳未満の児童を対象としておらず、満14歳未満の児童の会員登録および個人情報の収集を許可しません。満14歳未満の場合はサービスを利用できず、会社が法定代理人の同意なく満14歳未満の児童の個人情報が収集された事実を知った場合、遅滞なく当該情報を破棄します。",
      en: "Miri Look is not directed at children under the age of 14 and does not permit membership registration or collection of personal information from children under 14. Those under 14 may not use the Service, and if the Company becomes aware that personal information of a child under 14 has been collected without the consent of a legal guardian, it will destroy that information without delay.",
    },
  ],
  [
    "미리룩은 엠제이인사이트 주식회사가 운영합니다. 상호: 엠제이인사이트 주식회사 · 대표: 이민재 · 사업자등록번호: 226-81-56027 · 통신판매업신고: 제2026-부천소사-0462호 · 소재지: 경기도 부천시 소사구 소삼로 62.",
    {
      zh: "Miri Look 由 MJ Insight 株式会社运营。商号：MJ Insight 株式会社 · 代表：李玟宰 · 事业者登记号：226-81-56027 · 通信销售业申报：第2026-富川素砂-0462号 · 地址：京畿道富川市素砂区素三路62。",
      ja: "Miri Look はMJインサイト株式会社が運営しています。商号：MJインサイト株式会社・代表：イ・ミンジェ・事業者登録番号：226-81-56027・通信販売業申告：第2026-富川素砂-0462号・所在地：京畿道富川市素砂区素三路62。",
      en: "Miri Look is operated by MJ Insight Co., Ltd. Company name: MJ Insight Co., Ltd. · CEO: Lee Min-jae · Business Registration Number: 226-81-56027 · Mail-Order Sales Registration No.: 2026-Bucheon Sosa-0462 · Address: 62 Sosam-ro, Sosa-gu, Bucheon-si, Gyeonggi-do.",
    },
  ],
  [
    "생성 결과 정보: AI 추천 이미지, 상담용 이미지, 코디 결과, 저장·공유·다운로드 이력",
    {
      zh: "生成结果信息：AI 推荐图片、咨询用图片、穿搭结果、保存·分享·下载记录",
      ja: "生成結果情報：AI推薦画像、相談用画像、コーディネート結果、保存・共有・ダウンロード履歴",
      en: "Generated result information: AI recommendation images, consultation images, outfit results, save/share/download history",
    },
  ],
  [
    "서비스 운영을 위해 회사는 클라우드, 인증, 데이터베이스, 이메일, 결제, 자동화, AI 이미지 생성 사업자에게 업무를 위탁할 수 있습니다. 현재 또는 예정된 주요 처리 수탁자는 Supabase(데이터베이스·인증·저장소), Vercel(호스팅·분석), OpenAI 및 Google(Gemini)(AI 이미지 생성), Resend(이메일 발송), Sentry(오류 진단), Trigger.dev(자동화), RevenueCat 및 Google Play(앱 내 결제), 그리고 결제대행사인 KG이니시스(주식회사 케이지이니시스)입니다. 일부 사업자는 국외에 서버를 둘 수 있으며, 회사는 실제 도입 시 서비스 내 고지 또는 본 방침 개정을 통해 세부 항목을 안내합니다.",
    {
      zh: "为运营服务，公司可能将云端、认证、数据库、邮件、支付、自动化、AI图片生成相关业务委托给相关经营者。目前或计划中的主要处理受托者为 Supabase（数据库·认证·存储）、Vercel（托管·分析）、OpenAI 及 Google（Gemini）（AI图片生成）、Resend（邮件发送）、Sentry（错误诊断）、Trigger.dev（自动化）、RevenueCat 及 Google Play（应用内支付），以及支付代理商 KG Inicis（株式会社 KG Inicis）。部分经营者可能在境外设有服务器，公司在实际引入时将通过服务内公告或修订本方针的方式说明具体事项。",
      ja: "サービス運営のため、会社はクラウド、認証、データベース、メール、決済、自動化、AI画像生成事業者に業務を委託することがあります。現在または予定されている主な処理受託者は、Supabase（データベース・認証・ストレージ）、Vercel（ホスティング・分析）、OpenAI および Google（Gemini）（AI画像生成）、Resend（メール送信）、Sentry（エラー診断）、Trigger.dev（自動化）、RevenueCat および Google Play（アプリ内決済）、そして決済代行会社であるKGイニシス（株式会社KGイニシス）です。一部の事業者は海外にサーバーを置く場合があり、会社は実際に導入する際にサービス内の告知または本方針の改定を通じて詳細事項をご案内します。",
      en: "To operate the Service, the Company may outsource work to cloud, authentication, database, email, payment, automation, and AI image generation providers. Current or planned key processing subcontractors include Supabase (database, authentication, storage), Vercel (hosting, analytics), OpenAI and Google (Gemini) (AI image generation), Resend (email delivery), Sentry (error diagnostics), Trigger.dev (automation), RevenueCat and Google Play (in-app payments), and the payment gateway KG Inicis (KG Inicis Co., Ltd.). Some providers may operate servers outside Korea, and the Company will provide details through an in-service notice or an amendment to this policy when such providers are actually adopted.",
    },
  ],
  [
    "시행일 2026.07.20.",
    {
      zh: "施行日 2026.07.20。",
      ja: "施行日 2026.07.20。",
      en: "Effective date: July 20, 2026.",
    },
  ],
  [
    "연락처: jipsa.admin@gmail.com / 010-2704-5672",
    {
      zh: "联系方式：jipsa.admin@gmail.com / 010-2704-5672",
      ja: "連絡先：jipsa.admin@gmail.com / 010-2704-5672",
      en: "Contact: jipsa.admin@gmail.com / 010-2704-5672",
    },
  ],
  [
    "의 “계정 삭제” 메뉴에서 직접 하실 수 있습니다. 삭제 시 계정 정보, 프로필, 업로드한 얼굴 사진, 상담 결과와 생성 이미지가 삭제됩니다. 커뮤니티 게시글과 댓글은 작성자 식별정보가 제거된 익명 상태로 남을 수 있고, 결제·환불 기록은 법령상 보관 의무가 있는 범위에서 보존됩니다. 보유한 Hair Money는 함께 소멸되며 환불되지 않습니다. 직접 삭제가 어려운 경우 jipsa.admin@gmail.com으로 요청하실 수 있습니다.",
    {
      zh: "的“删除账户”菜单中自行进行。删除后，账户信息、个人资料、上传的面部照片、咨询结果及生成的图片将被删除。社区帖子和评论可能以移除作者识别信息的匿名状态保留，支付·退款记录将在法令规定的保存义务范围内予以保存。持有的 Hair Money 将一并失效且不予退还。如自行删除有困难，可通过 jipsa.admin@gmail.com 提出申请。",
      ja: "の「アカウント削除」メニューからご自身で行うことができます。削除するとアカウント情報、プロフィール、アップロードした顔写真、相談結果と生成画像が削除されます。コミュニティの投稿とコメントは作成者の識別情報が削除された匿名の状態で残る場合があり、決済・返金記録は法令上の保管義務がある範囲で保存されます。保有しているHair Moneyは同時に消滅し、返金されません。ご自身での削除が難しい場合は、jipsa.admin@gmail.com までご依頼いただけます。",
      en: "You can do this yourself from the \"Delete Account\" menu there. Upon deletion, your account information, profile, uploaded face photos, and consultation results and generated images will be deleted. Community posts and comments may remain in an anonymous state with your identifying information removed, and payment and refund records will be retained to the extent required by law. Any Hair Money you hold will be forfeited along with your account and will not be refunded. If you have difficulty deleting it yourself, you may request deletion at jipsa.admin@gmail.com.",
    },
  ],
  [
    "회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 정보주체의 문의·불만·피해 구제를 처리하기 위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.",
    {
      zh: "公司为全面负责个人信息处理相关业务，并处理信息主体的咨询·投诉·权益救济，特指定如下个人信息保护负责人。",
      ja: "会社は個人情報の処理に関する業務を総括して責任を負い、情報主体の問い合わせ・苦情・被害救済を処理するため、以下のとおり個人情報保護責任者を指定しています。",
      en: "The Company designates a Personal Information Protection Officer as follows to take overall responsibility for personal information processing and to handle inquiries, complaints, and remedies for data subjects.",
    },
  ],
  [
    "AI 헤어스타일, 코디 추천과 이미지 생성",
    {
      zh: "AI 发型、穿搭推荐及图片生成",
      ja: "AIヘアスタイル、コーディネート推薦と画像生成",
      en: "AI hairstyle and outfit recommendations and image generation",
    },
  ],
  [
    "10. 처리 방식",
    {
      zh: "10. 处理方式",
      ja: "10. 処理方法",
      en: "10. Processing Method",
    },
  ],
  [
    "11. 정책 변경",
    {
      zh: "11. 政策变更",
      ja: "11. 方針の変更",
      en: "11. Changes to This Policy",
    },
  ],
  [
    "2. 서비스 제공시기 (배송 안내)",
    {
      zh: "2. 服务提供时间（发货说明）",
      ja: "2. サービス提供時期（配送案内）",
      en: "2. Timing of Service Provision (Delivery Information)",
    },
  ],
  [
    "3. 청약철회 및 취소 규정",
    {
      zh: "3. 撤回要约及取消规定",
      ja: "3. 申込みの撤回および取消し規定",
      en: "3. Withdrawal of Offer and Cancellation Policy",
    },
  ],
  [
    "4. 교환 안내",
    {
      zh: "4. 换货说明",
      ja: "4. 交換案内",
      en: "4. Exchange Information",
    },
  ],
  [
    "5. 환불 가능 기준",
    {
      zh: "5. 可退款标准",
      ja: "5. 返金可能基準",
      en: "5. Refund Eligibility Criteria",
    },
  ],
  [
    "6. 환불이 제한될 수 있는 경우",
    {
      zh: "6. 退款可能受限的情形",
      ja: "6. 返金が制限される場合",
      en: "6. Cases Where Refunds May Be Restricted",
    },
  ],
  [
    "7. 환불 금액 산정",
    {
      zh: "7. 退款金额计算",
      ja: "7. 返金額の算定",
      en: "7. Calculation of Refund Amount",
    },
  ],
  [
    "8. 유효기간",
    {
      zh: "8. 有效期",
      ja: "8. 有効期間",
      en: "8. Validity Period",
    },
  ],
  [
    "9. 신청 절차",
    {
      zh: "9. 申请程序",
      ja: "9. 申請手続き",
      en: "9. Application Procedure",
    },
  ],
  [
    "결제 직후 취소: 유료 기능을 아직 실행하지 않았다면 전액 취소·환불 됩니다.",
    {
      zh: "结算后立即取消：如尚未使用付费功能，将全额取消·退款。",
      ja: "決済直後のキャンセル：有料機能をまだ実行していない場合、全額キャンセル・返金されます。",
      en: "Cancellation immediately after payment: If the paid feature has not yet been used, it will be fully canceled and refunded.",
    },
  ],
  [
    "다만 회사의 귀책, 결제 오류, 콘텐츠가 표시·광고 내용과 다르거나 계약과 다르게 이행된 경우에는 관련 법령에 따라 청약철회·취소·환불이 가능합니다.",
    {
      zh: "但如因公司过错、支付错误、内容与标示·广告内容不符或未按约定履行的情况，依据相关法令可进行撤回要约·取消·退款。",
      ja: "ただし、会社の帰責事由、決済エラー、コンテンツが表示・広告内容と異なる場合、または契約と異なる方法で履行された場合には、関連法令に従い申込みの撤回・取消・返金が可能です。",
      en: "However, if the issue is attributable to the Company, due to a payment error, or the content differs from what was displayed or advertised, or was provided in a manner different from the agreement, withdrawal of offer, cancellation, or refund is possible in accordance with applicable law.",
    },
  ],
  [
    "미리룩 H머니 및 유료 서비스의 서비스 제공시기(배송), 청약철회·취소, 교환, 환불 정책",
    {
      zh: "Miri Look Hair Money 及付费服务的服务提供时间（配送）、撤回要约·取消、换货、退款政策",
      ja: "Miri Look Hair Money および有料サービスのサービス提供時期（配送）、申込みの撤回・取消し、交換、返金ポリシー",
      en: "Miri Look Hair Money and Paid Service Delivery Timing, Withdrawal/Cancellation, Exchange, and Refund Policy",
    },
  ],
  [
    "미리룩은 별도의 실물 배송이 없는 온라인 디지털 서비스로, 재화의 공급방법은 서비스 내 즉시 이용(온라인 제공)입니다.",
    {
      zh: "Miri Look 是无需实物配送的在线数字服务，商品的提供方式为服务内即时使用（在线提供）。",
      ja: "Miri Look は実物の配送がないオンラインデジタルサービスであり、商品の供給方法はサービス内での即時利用（オンライン提供）です。",
      en: "Miri Look is an online digital service with no physical delivery; the method of providing the goods is immediate use within the Service (online provision).",
    },
  ],
  [
    "미리룩이 제공하는 결과물은 디지털 콘텐츠로, 실물 재화의 교환·반품과 같은 방식의 교환은 적용되지 않습니다. AI 생성 과정에서 회사 귀책의 오류가 발생한 경우에는 교환에 갈음하여 무료 재생성 또는 사용된 H머니의 복구·환불로 처리합니다. 재생성·복구 기준은 본 정책 및 아래 생성 오류 안내를 따릅니다.",
    {
      zh: "Miri Look 提供的结果为数字内容，不适用于如实物商品的换货·退货方式的换货。若在 AI 生成过程中发生可归责于公司的错误，将以免费重新生成或恢复·退还所使用的 Hair Money 代替换货处理。重新生成·恢复的标准依照本政策及以下生成错误说明执行。",
      ja: "Miri Look が提供する成果物はデジタルコンテンツであり、実物商品の交換・返品のような方式による交換は適用されません。AI生成過程で会社の帰責事由による誤りが発生した場合は、交換に代えて無料再生成、または使用したHair Moneyの復元・返金で対応します。再生成・復元の基準は本ポリシーおよび以下の生成エラー案内に従います。",
      en: "The results provided by Miri Look are digital content, and exchanges in the manner of exchanging or returning physical goods do not apply. If an error attributable to the Company occurs during the AI generation process, it will be handled by providing a free regeneration or restoring/refunding the Hair Money used, in lieu of an exchange. The criteria for regeneration and restoration follow this policy and the generation error guidance below.",
    },
  ],
  [
    "본 정책은 미리룩 유료 서비스(H머니 및 AI 생성 기능)의 서비스 제공시기, 청약철회·취소, 교환, 환불 기준을 안내합니다.",
    {
      zh: "本政策说明 Miri Look 付费服务（Hair Money 及 AI 生成功能）的服务提供时间、撤回要约·取消、换货、退款标准。",
      ja: "本ポリシーは、Miri Look の有料サービス（Hair MoneyおよびAI生成機能）のサービス提供時期、申込みの撤回・取消し、交換、返金基準をご案内します。",
      en: "This policy explains the delivery timing, withdrawal/cancellation, exchange, and refund criteria for Miri Look's paid services (Hair Money and AI generation features).",
    },
  ],
  [
    "시스템 점검, 장애, 외부 API 제공자 사정 등으로 제공이 지연·중단되는 경우 서비스 내 공지 또는 이메일로 안내합니다.",
    {
      zh: "如因系统维护、故障、外部 API 提供商情况等导致提供延迟·中断，将通过服务内公告或电子邮件告知。",
      ja: "システム点検、障害、外部API提供者の事情などによりサービス提供が遅延・中断される場合は、サービス内の告知またはメールでご案内します。",
      en: "If provision is delayed or interrupted due to system maintenance, failures, or circumstances of external API providers, notice will be given via in-service announcement or email.",
    },
  ],
  [
    "이용(제공) 기간: 충전된 유상 H머니는 아래 제8조(유효기간)에 따른 기간 동안 이용할 수 있습니다.",
    {
      zh: "使用（提供）期限：充值的付费 Hair Money 可在以下第8条（有效期）规定的期限内使用。",
      ja: "利用（提供）期間：チャージされた有償Hair Moneyは、下記第8条（有効期間）に定める期間ご利用いただけます。",
      en: "Usage (provision) period: Paid Hair Money that has been charged can be used for the period specified in Article 8 (Validity Period) below.",
    },
  ],
  [
    "청약철회가 제한되는 경우: 같은 법 제17조 제2항에 따라, 회원이 유료 기능(추천·AI 이미지 생성 등)을 실행하여 디지털 콘텐츠의 제공이 시작된 부분에 대해서는 단순 변심에 의한 청약철회가 제한됩니다.",
    {
      zh: "撤回要约受限的情形：根据同法第17条第2款，会员执行付费功能（推荐·AI 图片生成等）后，就已开始提供数字内容的部分，因单纯变心而撤回要约将受到限制。",
      ja: "申込みの撤回が制限される場合：同法第17条第2項により、会員が有料機能（推薦・AI画像生成など）を実行してデジタルコンテンツの提供が開始された部分については、単なる気変わりによる申込みの撤回が制限されます。",
      en: "Cases where withdrawal is restricted: Pursuant to Article 17(2) of the same Act, once a member has executed a paid feature (such as recommendations or AI image generation) and the provision of digital content has begun, withdrawal of the offer due to a simple change of mind is restricted for that portion.",
    },
  ],
  [
    "취소·청약철회 신청 방법은 아래 제9조(신청 절차)와 같습니다.",
    {
      zh: "取消·撤回要约的申请方法如下第9条（申请程序）所述。",
      ja: "キャンセル・申込みの撤回の申請方法は、下記第9条（申請手続き）のとおりです。",
      en: "The method for applying for cancellation or withdrawal of offer is as set out in Article 9 (Application Procedure) below.",
    },
  ],
  [
    "회원은 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라, 유상으로 구매한 H머니를 결제일(또는 이용 가능일)로부터 7일 이내에 청약철회(취소)할 수 있습니다. 단, 아직 사용하지 않은 유상 H머니에 한합니다.",
    {
      zh: "会员依据《电子商务等消费者保护法》，可在付费购买的 Hair Money 结算日（或可使用日）起7日内撤回要约（取消）。但仅限尚未使用的付费 Hair Money。",
      ja: "会員は「電子商取引等における消費者保護に関する法律」に基づき、有償で購入したHair Moneyを決済日（または利用可能日）から7日以内に申込みの撤回（キャンセル）をすることができます。ただし、まだ使用していない有償Hair Moneyに限ります。",
      en: "Under the Act on Consumer Protection in Electronic Commerce, Etc., members may withdraw their offer (cancel) for paid Hair Money within 7 days from the payment date (or the date it became available for use). This applies only to paid Hair Money that has not yet been used.",
    },
  ],
  [
    "AI 추천·이미지 생성 등 유료 기능: 회원이 기능을 실행하면 즉시 처리가 시작되며, 통상 수십 초에서 수 분 이내에 결과가 제공됩니다. (접속량, 외부 AI 제공자 상황에 따라 지연될 수 있습니다.)",
    {
      zh: "AI 推荐·图片生成等付费功能：会员执行该功能后将立即开始处理，通常在数十秒至数分钟内提供结果。（可能因访问量、外部 AI 提供商情况而延迟。）",
      ja: "AI推薦・画像生成などの有料機能：会員が機能を実行すると即座に処理が開始され、通常は数十秒から数分以内に結果が提供されます。（アクセス量や外部AI提供者の状況により遅延する場合があります。）",
      en: "Paid features such as AI recommendations and image generation: Processing begins immediately when a member executes the feature, and results are typically provided within tens of seconds to a few minutes. (This may be delayed depending on traffic volume or the status of external AI providers.)",
    },
  ],
  [
    "H머니 충전: 결제 승인이 완료되는 즉시 회원 계정에 충전되어 바로 이용할 수 있습니다.",
    {
      zh: "Hair Money 充值：支付审批完成后将立即充值到会员账户，可马上使用。",
      ja: "Hair Moneyチャージ：決済承認が完了すると同時に会員アカウントにチャージされ、すぐにご利用いただけます。",
      en: "Hair Money charging: As soon as payment approval is completed, it is credited to the member's account and is immediately available for use.",
    },
  ],
  [
    "Hair money 또는 H머니는 미리룩의 헤어, 코디 추천과 AI 이미지 생성 등 유료 기능 이용을 위해 회원이 원화로 구매하는 서비스 내 결제 단위입니다. H머니는 현금, 예금, 전자화폐가 아니며 서비스 밖에서 사용할 수 없습니다.",
    {
      zh: "Hair Money是会员为使用 Miri Look 的发型、穿搭推荐及 AI 图片生成等付费功能，以韩元购买的服务内结算单位。Hair Money 不是现金、存款或电子货币，不能在服务之外使用。",
      ja: "Hair Moneyは、Miri Lookのヘア、コーディネート推薦とAI画像生成などの有料機能を利用するために会員がウォンで購入するサービス内の決済単位です。Hair Moneyは現金、預金、電子貨幣ではなく、サービス外で使用することはできません。",
      en: "Hair Money is an in-service payment unit purchased by members in KRW to use paid features of Miri Look such as hairstyle and outfit recommendations and AI image generation. Hair Money is not cash, a deposit, or electronic money, and cannot be used outside the Service.",
    },
  ],
  [
    "기능이 제공되며, 회원은 부적절한 콘텐츠를 즉시 신고할 수 있습니다. 신고가 누적된 콘텐츠는 자동으로 노출이 중단됩니다.",
    {
      zh: "该功能，会员可立即举报不当内容。举报累积的内容将自动停止展示。",
      ja: "機能が提供され、会員は不適切なコンテンツを直ちに通報できます。通報が累積したコンテンツは自動的に表示が停止されます。",
      en: "This feature is provided, and members can immediately report inappropriate content. Content that accumulates reports will automatically stop being displayed.",
    },
  ],
  [
    "모든 게시물에는",
    {
      zh: "所有帖子均",
      ja: "すべての投稿には",
      en: "Every post has",
    },
  ],
  [
    "미리룩은 만 14세 미만 아동을 대상으로 하지 않습니다. 만 14세 미만인 자는 회원으로 가입할 수 없으며 서비스를 이용할 수 없습니다. 회사가 만 14세 미만 아동의 가입 사실을 확인한 경우 해당 계정과 개인정보를 지체 없이 삭제할 수 있습니다.",
    {
      zh: "Miri Look 不面向未满14周岁的儿童。未满14周岁者不得注册为会员，也不得使用本服务。如公司确认存在未满14周岁儿童注册的事实，可立即删除该账户及个人信息。",
      ja: "Miri Look は満14歳未満の児童を対象としていません。満14歳未満の方は会員として登録することができず、サービスを利用できません。会社が満14歳未満の児童の登録の事実を確認した場合、当該アカウントおよび個人情報を遅滞なく削除することができます。",
      en: "Miri Look is not directed at children under the age of 14. Persons under 14 may not register as members and may not use the Service. If the Company confirms that a child under 14 has registered, it may delete the account and personal information without delay.",
    },
  ],
  [
    "미리룩은 커뮤니티 내",
    {
      zh: "Miri Look 在社区内",
      ja: "Miri Look はコミュニティ内",
      en: "Within the Miri Look community,",
    },
  ],
  [
    "본 약관은 미리룩(Miri Look, 이하 “회사”)이 제공하는 AI 기반 헤어스타일, 코디 추천 서비스 및 관련 커뮤니티, 투표, 입점, 예약, 결제 기능의 이용 조건과 회사와 회원의 권리·의무를 정하는 것을 목적으로 합니다.",
    {
      zh: "本条款旨在规定使用 Miri Look（以下称“公司”）提供的基于 AI 的发型、穿搭推荐服务及相关社区、投票、入驻、预约、支付功能的条件，以及公司与会员之间的权利与义务。",
      ja: "本規約は、Miri Look（以下「会社」といいます）が提供するAIベースのヘアスタイル、コーディネート推薦サービスおよび関連するコミュニティ、投票、出店、予約、決済機能の利用条件と、会社および会員の権利・義務を定めることを目的とします。",
      en: "The purpose of these Terms is to set forth the conditions of use for the AI-based hairstyle and outfit recommendation service, and related community, voting, salon listing, booking, and payment features provided by Miri Look (hereinafter the \"Company\"), as well as the rights and obligations of the Company and its members.",
    },
  ],
  [
    "부적절 콘텐츠·악성 이용자 무관용 정책",
    {
      zh: "不当内容·恶意用户零容忍政策",
      ja: "不適切コンテンツ・悪質利用者ゼロトレランスポリシー",
      en: "Zero-Tolerance Policy for Inappropriate Content and Malicious Users",
    },
  ],
  [
    "부적절한 콘텐츠(불법·음란·혐오·차별·폭력· 괴롭힘·명예훼손·사칭 등)와 다른 이용자를 괴롭히는 악성 이용자에 대해 어떠한 관용도 두지 않습니다(무관용).",
    {
      zh: "对不当内容（违法、淫秽、仇恨、歧视、暴力、骚扰、诽谤、冒充他人等）以及骚扰其他用户的恶意用户不予任何容忍（零容忍）。",
      ja: "不適切なコンテンツ（違法・わいせつ・ヘイト・差別・暴力・嫌がらせ・名誉毀損・なりすましなど）や、他の利用者を嫌がらせする悪質な利用者に対して、いかなる寛容も認めません（ゼロトレランス）。",
      en: "No tolerance whatsoever is given for inappropriate content (illegal, obscene, hateful, discriminatory, violent, harassing, defamatory, impersonating, etc.) or for malicious users who harass other users (zero tolerance).",
    },
  ],
  [
    "부적절한 표현은 게시·댓글 작성 시 자동 필터로 1차 차단되며, 걸러지지 않은 콘텐츠는 신고를 통해 조치됩니다.",
    {
      zh: "不当言论在发布帖子·评论时将通过自动过滤器进行初步拦截，未被过滤的内容将通过举报进行处理。",
      ja: "不適切な表現は投稿・コメント作成時に自動フィルターで一次的にブロックされ、フィルタリングされなかったコンテンツは通報により措置されます。",
      en: "Inappropriate expressions are initially blocked by an automatic filter when posting or commenting, and any content that is not filtered will be addressed through reports.",
    },
  ],
  [
    "상호: 엠제이인사이트 주식회사 · 대표: 이민재 · 사업자등록번호: 226-81-56027 · 통신판매업신고: 제2026-부천소사-0462호 · 소재지: 경기도 부천시 소사구 소삼로 62.",
    {
      zh: "商号：MJ Insight 株式会社 · 代表：李玟宰 · 事业者登记号：226-81-56027 · 通信销售业申报：第2026-富川素砂-0462号 · 地址：京畿道富川市素砂区素三路62。",
      ja: "商号：MJインサイト株式会社・代表：イ・ミンジェ・事業者登録番号：226-81-56027・通信販売業申告：第2026-富川素砂-0462号・所在地：京畿道富川市素砂区素三路62。",
      en: "Company name: MJ Insight Co., Ltd. · CEO: Lee Min-jae · Business Registration Number: 226-81-56027 · Mail-Order Sales Registration No.: 2026-Bucheon Sosa-0462 · Address: 62 Sosam-ro, Sosa-gu, Bucheon-si, Gyeonggi-do.",
    },
  ],
  [
    "서비스 이용, 결제, 환불, 개인정보, 신고 관련 문의는 jipsa.admin@gmail.com 또는 010-2704-5672로 접수할 수 있습니다.",
    {
      zh: "有关服务使用、支付、退款、个人信息、举报的咨询可通过 jipsa.admin@gmail.com 或 010-2704-5672 提出。",
      ja: "サービス利用、決済、返金、個人情報、通報に関するお問い合わせは、jipsa.admin@gmail.com または 010-2704-5672 で受け付けます。",
      en: "Inquiries regarding service use, payments, refunds, personal information, and reports may be submitted to jipsa.admin@gmail.com or 010-2704-5672.",
    },
  ],
  [
    "유료 기능을 실행하면 사전에 고지된 H머니가 차감됩니다. 추천 또는 이미지 생성이 시작된 이후에는 디지털 콘텐츠 제공의 특성상 단순 변심에 따른 취소가 제한될 수 있습니다.",
    {
      zh: "执行付费功能后，将扣除事先告知的 Hair Money。推荐或图片生成开始后，由于数字内容提供的特性，因单纯变心而取消可能受到限制。",
      ja: "有料機能を実行すると、事前に告知されたHair Moneyが差し引かれます。推薦または画像生成が開始された後は、デジタルコンテンツ提供の特性上、単なる気変わりによるキャンセルが制限される場合があります。",
      en: "Executing a paid feature deducts the Hair Money amount notified in advance. Once a recommendation or image generation has started, cancellation due to a simple change of mind may be restricted due to the nature of digital content provision.",
    },
  ],
  [
    "차단",
    {
      zh: "屏蔽",
      ja: "ブロック",
      en: "Block",
    },
  ],
  [
    "할 수 있습니다. 차단하면 해당 이용자의 게시물이 내 피드에서 즉시 사라지고, 차단 사실은 운영자에게 통지됩니다.",
    {
      zh: "。屏蔽后，该用户的帖子将立即从我的动态中消失，屏蔽情况会通知给运营方。",
      ja: "できます。ブロックすると、当該利用者の投稿が自分のフィードから即座に消え、ブロックした事実は運営者に通知されます。",
      en: ". Once blocked, that user's posts immediately disappear from your feed, and the fact of blocking is notified to the operator.",
    },
  ],
  [
    "회사는 신고된 부적절 콘텐츠를 확인하는 즉시(늦어도 24시간 이내) 해당 콘텐츠를 삭제하고 위반 이용자의 이용을 제한·차단합니다.",
    {
      zh: "公司在确认被举报的不当内容后将立即（最迟不超过24小时）删除该内容，并限制·屏蔽违规用户的使用。",
      ja: "会社は通報された不適切なコンテンツを確認次第（遅くとも24時間以内に）当該コンテンツを削除し、違反した利用者の利用を制限・ブロックします。",
      en: "Upon confirming reported inappropriate content, the Company will delete that content immediately (within 24 hours at the latest) and restrict or block the offending user's access.",
    },
  ],
  [
    "회원은 특정 이용자를",
    {
      zh: "会员可以将特定用户",
      ja: "会員は特定の利用者を",
      en: "Members may",
    },
  ],
  [
    "회원이 커뮤니티를 이용하려면 본 정책에 동의해야 하며, 위반 시 사전 통지 없이 콘텐츠가 삭제되고 이용이 제한·종료될 수 있습니다.",
    {
      zh: "会员如需使用社区，必须同意本政策，若违反规定，可能在未事先通知的情况下删除内容并限制·终止使用。",
      ja: "会員がコミュニティを利用するには本ポリシーに同意する必要があり、違反した場合は事前通知なくコンテンツが削除され、利用が制限・終了される場合があります。",
      en: "To use the community, members must agree to this policy; violations may result in content being deleted and use being restricted or terminated without prior notice.",
    },
  ],
  [
    "Hair money 또는 H머니는 회원이 원화로 구매해 미리룩의 헤어, 코디 추천 및 AI 이미지 생성 등 유료 기능에 사용할 수 있는 서비스 내 결제 단위입니다. H머니는 현금, 예금, 전자화폐가 아니며, 서비스 외부에서 양도, 판매, 교환하거나 현금처럼 사용할 수 없습니다.",
    {
      zh: "Hair Money是会员以韩元购买、可用于 Miri Look 的发型、穿搭推荐及 AI 图片生成等付费功能的服务内结算单位。Hair Money 不是现金、存款或电子货币，不能在服务外部转让、出售、兑换或像现金一样使用。",
      ja: "Hair Moneyは、会員がウォンで購入し、Miri Lookのヘア、コーディネート推薦およびAI画像生成などの有料機能に使用できるサービス内の決済単位です。Hair Moneyは現金、預金、電子貨幣ではなく、サービス外部で譲渡、販売、交換したり、現金のように使用することはできません。",
      en: "Hair Money is an in-service payment unit that members purchase in KRW and can use for paid features of Miri Look such as hairstyle and outfit recommendations and AI image generation. Hair Money is not cash, a deposit, or electronic money, and cannot be transferred, sold, exchanged, or used as cash outside the Service.",
    },
  ],
  [
    "2 Hair Money · 다른 회원이 좋아요/싫어요로 투표해요",
    {
      zh: "2 Hair Money · 其他会员会为你投赞成/反对票",
      ja: "2 Hair Money・他のメンバーがいいね/よくないねで投票します",
      en: "2 Hair Money · Other members vote like/dislike",
    },
  ],
  [
    "2개 차감하고 생성",
    {
      zh: "扣除2个后生成",
      ja: "2個差し引いて生成",
      en: "Deduct 2 and generate",
    },
  ],
  [
    "3x3 한 장 저장",
    {
      zh: "保存3x3合成图",
      ja: "3x3を1枚保存",
      en: "Save as one 3x3 image",
    },
  ],
  [
    "3x3 한 장 저장에 실패했습니다. 개별 저장을 이용해 주세요.",
    {
      zh: "3x3合成图保存失败,请使用单张保存。",
      ja: "3x3の1枚保存に失敗しました。個別保存をご利用ください。",
      en: "Failed to save the 3x3 image. Please use individual save instead.",
    },
  ],
  [
    "가 들어요.",
    {
      zh: "会加入进来。",
      ja: "が入ります。",
      en: " is added.",
    },
  ],
  [
    "가방",
    {
      zh: "包",
      ja: "バッグ",
      en: "bag",
    },
  ],
  [
    "갤러리에 저장했어요",
    {
      zh: "已保存到相册",
      ja: "ギャラリーに保存しました",
      en: "Saved to gallery",
    },
  ],
  [
    "결과지",
    {
      zh: "结果单",
      ja: "結果シート",
      en: "result sheet",
    },
  ],
  [
    "결과지 이미지를 저장했습니다. 공유 시트에서 갤러리에 저장하거나 미용사에게 바로 보낼 수 있어요.",
    {
      zh: "已保存结果单图片。可以在分享面板中保存到相册,或直接发送给发型师。",
      ja: "結果シートの画像を保存しました。共有シートからギャラリーに保存したり、美容師に直接送ったりできます。",
      en: "Saved the result sheet image. You can save it to your gallery or send it directly to your stylist from the share sheet.",
    },
  ],
  [
    "결과지 저장",
    {
      zh: "保存结果单",
      ja: "結果シートを保存",
      en: "Save result sheet",
    },
  ],
  [
    "결과지 저장에 실패했습니다. 잠시 후 다시 시도하거나 개별 이미지 저장을 이용해 주세요.",
    {
      zh: "结果单保存失败,请稍后重试,或使用单张图片保存。",
      ja: "結果シートの保存に失敗しました。しばらくしてから再試行するか、個別画像保存をご利用ください。",
      en: "Failed to save the result sheet. Please try again later or use individual image save.",
    },
  ],
  [
    "결과지를 저장하는 중입니다...",
    {
      zh: "正在保存结果单...",
      ja: "結果シートを保存しています...",
      en: "Saving result sheet...",
    },
  ],
  [
    "과한 장식보다 얇은 체인이나 가죽 팔찌로 작은 포인트만 더합니다.",
    {
      zh: "比起过多装饰,用细链条或皮革手链增添小小的点缀即可。",
      ja: "過度な装飾よりも、細いチェーンや革ブレスレットで小さなポイントだけを加えます。",
      en: "Instead of heavy accessories, add just a small accent with a thin chain or leather bracelet.",
    },
  ],
  [
    "관리자 테스트 계정으로 프리미엄 확장 상담이 활성화되었습니다. 결제 없이 코디 조언을 테스트할 수 있습니다.",
    {
      zh: "已通过管理员测试账号启用高级扩展咨询。无需付费即可测试穿搭建议。",
      ja: "管理者テストアカウントでプレミアム拡張相談が有効になりました。決済なしでコーディネートアドバイスをテストできます。",
      en: "Premium extended consultation has been activated with the admin test account. You can test outfit advice without payment.",
    },
  ],
  [
    "광대와 눈매 라인을 부드럽게 보완하는 얇은 프레임을 우선합니다.",
    {
      zh: "优先选择能柔和修饰颧骨和眼型线条的细框。",
      ja: "頬骨と目元のラインを柔らかく補ってくれる細いフレームを優先します。",
      en: "Prioritize thin frames that softly complement your cheekbones and eye line.",
    },
  ],
  [
    "귀걸이",
    {
      zh: "耳环",
      ja: "ピアス",
      en: "earrings",
    },
  ],
  [
    "균형",
    {
      zh: "均衡",
      ja: "バランス",
      en: "Balance",
    },
  ],
  [
    "깔끔한 헤어 인상에 맞춰 로퍼, 더비슈즈, 미니멀 스니커즈를 비교합니다.",
    {
      zh: "根据清爽的发型印象,比较乐福鞋、德比鞋和简约运动鞋。",
      ja: "清潔感のあるヘア印象に合わせて、ローファー、ダービーシューズ、ミニマルスニーカーを比較します。",
      en: "Compare loafers, derby shoes, and minimalist sneakers to match a clean hair look.",
    },
  ],
  [
    "남성 로퍼 더비슈즈 스니커즈",
    {
      zh: "男士乐福鞋 德比鞋 运动鞋",
      ja: "メンズ ローファー ダービーシューズ スニーカー",
      en: "Men's loafers derby shoes sneakers",
    },
  ],
  [
    "남성 메탈 가죽 시계",
    {
      zh: "男士金属皮革手表",
      ja: "メンズ メタル レザー 時計",
      en: "Men's metal leather watch",
    },
  ],
  [
    "남성 미니멀 크로스백 토트백",
    {
      zh: "男士简约斜挎包 托特包",
      ja: "メンズ ミニマル ショルダーバッグ トートバッグ",
      en: "Men's minimalist crossbody tote bag",
    },
  ],
  [
    "남성 볼캡 비니",
    {
      zh: "男士棒球帽 毛线帽",
      ja: "メンズ キャップ ビーニー",
      en: "Men's ball cap beanie",
    },
  ],
  [
    "남성 슬랙스 데님 팬츠",
    {
      zh: "男士休闲裤 牛仔裤",
      ja: "メンズ スラックス デニムパンツ",
      en: "Men's slacks denim pants",
    },
  ],
  [
    "남성 얇은 팔찌 가죽",
    {
      zh: "男士细手链 皮革",
      ja: "メンズ 細いブレスレット レザー",
      en: "Men's thin bracelet leather",
    },
  ],
  [
    "남성 얇은 프레임 선글라스",
    {
      zh: "男士细框墨镜",
      ja: "メンズ 細いフレームのサングラス",
      en: "Men's thin frame sunglasses",
    },
  ],
  [
    "남성 얇은 프레임 안경",
    {
      zh: "男士细框眼镜",
      ja: "メンズ 細いフレームの眼鏡",
      en: "Men's thin frame glasses",
    },
  ],
  [
    "눈썹과 이마 노출을 살리는 얇은 프레임 선글라스를 우선합니다.",
    {
      zh: "优先选择能凸显眉毛与额头线条的细框墨镜。",
      ja: "眉と額の見せ方を活かす細いフレームのサングラスを優先します。",
      en: "Prioritize thin frame sunglasses that highlight exposed brows and forehead.",
    },
  ],
  [
    "느낌 메모",
    {
      zh: "感觉备注",
      ja: "印象メモ",
      en: "Vibe notes",
    },
  ],
  [
    "다시 시도 필요",
    {
      zh: "需要重试",
      ja: "再試行が必要です",
      en: "Retry needed",
    },
  ],
  [
    "단정",
    {
      zh: "端庄",
      ja: "端正",
      en: "Neat",
    },
  ],
  [
    "레퍼런스 닫기",
    {
      zh: "关闭参考图",
      ja: "リファレンスを閉じる",
      en: "Close reference",
    },
  ],
  [
    "레퍼런스 보기",
    {
      zh: "查看参考图",
      ja: "リファレンスを見る",
      en: "View reference",
    },
  ],
  [
    "로그인 후 프리미엄 스타일 리포트를 결제하면 코디 확장 상담 권한이 계정에 연결됩니다.",
    {
      zh: "登录后购买高级风格报告,穿搭扩展咨询权限将关联到您的账号。",
      ja: "ログイン後にプレミアムスタイルレポートを決済すると、コーディネート拡張相談の権限がアカウントに紐づきます。",
      en: "After logging in and purchasing the Premium Style Report, outfit extended consultation access will be linked to your account.",
    },
  ],
  [
    "를 누르면 그 색이 헤어 컬러로 반영됩니다.",
    {
      zh: " 后,该颜色会应用为发色。",
      ja: "を押すと、その色がヘアカラーに反映されます。",
      en: " — tap it and that color is applied as your hair color.",
    },
  ],
  [
    "모두 저장하기",
    {
      zh: "全部保存",
      ja: "すべて保存",
      en: "Save all",
    },
  ],
  [
    "모자",
    {
      zh: "帽子",
      ja: "帽子",
      en: "hat",
    },
  ],
  [
    "목걸이",
    {
      zh: "项链",
      ja: "ネックレス",
      en: "necklace",
    },
  ],
  [
    "목선과 얼굴 주변을 정돈하도록 짧은 체인이나 작은 펜던트를 추천합니다.",
    {
      zh: "推荐使用短链或小吊坠来修饰颈部线条与脸部周围。",
      ja: "首元と顔まわりをすっきり見せる短いチェーンや小さなペンダントをおすすめします。",
      en: "We recommend a short chain or small pendant to neaten your neckline and frame your face.",
    },
  ],
  [
    "무선 이어폰 이어버드",
    {
      zh: "无线耳机 耳塞",
      ja: "ワイヤレスイヤホン イヤーバッド",
      en: "Wireless earphones earbuds",
    },
  ],
  [
    "미니멀",
    {
      zh: "极简",
      ja: "ミニマル",
      en: "Minimal",
    },
  ],
  [
    "미니멀 크로스백이나 토트백처럼 상체 라인을 복잡하게 만들지 않는 가방이 좋습니다.",
    {
      zh: "像简约斜挎包或托特包这样不会让上半身线条显得复杂的包最合适。",
      ja: "ミニマルなショルダーバッグやトートバッグのように、上半身のラインを複雑にしないバッグがおすすめです。",
      en: "A bag like a minimalist crossbody or tote that doesn't clutter your upper body line works best.",
    },
  ],
  [
    "미리룩 스타일 추천 9장",
    {
      zh: "Miri Look 风格推荐 9张",
      ja: "Miri Look スタイル提案 9枚",
      en: "Miri Look style recommendations, 9 images",
    },
  ],
  [
    "보조",
    {
      zh: "辅助",
      ja: "補助",
      en: "Accent",
    },
  ],
  [
    "상담용 이미지를 히스토리에 자동 저장하지 못했습니다.",
    {
      zh: "未能自动将咨询用图片保存到历史记录。",
      ja: "相談用画像を履歴に自動保存できませんでした。",
      en: "Couldn't automatically save the consultation image to history.",
    },
  ],
  [
    "서버 생성에 실패했습니다. '다시 생성'을 누르거나 잠시 후 다시 시도해 주세요.",
    {
      zh: "服务器生成失败。请点击“重新生成”或稍后再试。",
      ja: "サーバーでの生成に失敗しました。「再生成」を押すか、しばらくしてから再試行してください。",
      en: "Server generation failed. Tap 'Regenerate' or try again later.",
    },
  ],
  [
    "서버에서 계속 생성 중입니다. 완료되면 히스토리에 저장되니, 잠시 후 히스토리에서 확인해 주세요.",
    {
      zh: "服务器仍在继续生成中。完成后会保存到历史记录,请稍后在历史记录中查看。",
      ja: "サーバーで生成を続けています。完了すると履歴に保存されるので、しばらくしてから履歴でご確認ください。",
      en: "Still generating on the server. It will be saved to history when complete — check back there shortly.",
    },
  ],
  [
    "서클렌즈",
    {
      zh: "美瞳",
      ja: "サークルレンズ",
      en: "circle lenses",
    },
  ],
  [
    "선글라스",
    {
      zh: "墨镜",
      ja: "サングラス",
      en: "sunglasses",
    },
  ],
  [
    "선택됨 · 상담으로",
    {
      zh: "已选择 · 用于咨询",
      ja: "選択済み・相談へ",
      en: "Selected · to consultation",
    },
  ],
  [
    "선택한",
    {
      zh: "已选择",
      ja: "選択した",
      en: "Selected",
    },
  ],
  [
    "선택한 색",
    {
      zh: "已选颜色",
      ja: "選択した色",
      en: "Selected color",
    },
  ],
  [
    "선택한 스타일을 올리고 다른 회원의 좋아요/싫어요를 받아요. 게시에",
    {
      zh: "上传所选风格,获得其他会员的赞成/反对票。发布需",
      ja: "選んだスタイルを投稿して、他のメンバーからいいね/よくないねをもらいましょう。投稿には",
      en: "Post your selected style and get likes/dislikes from other members. Posting costs",
    },
  ],
  [
    "선호 스타일",
    {
      zh: "偏好风格",
      ja: "好みのスタイル",
      en: "Preferred style",
    },
  ],
  [
    "손목",
    {
      zh: "手腕",
      ja: "手首",
      en: "Wrist",
    },
  ],
  [
    "손목 포인트는 얇고 깔끔하게 잡아 헤어와 메이크업을 먼저 보이게 합니다.",
    {
      zh: "手腕的点缀要细而干净,让发型和妆容更突出。",
      ja: "手首のポイントは細くすっきりまとめ、ヘアとメイクを先に見せます。",
      en: "Keep the wrist accent thin and clean so your hair and makeup stand out first.",
    },
  ],
  [
    "손목은 메탈·가죽 시계 하나로 정리하면 헤어의 단정함과 잘 맞습니다.",
    {
      zh: "手腕上只戴一块金属或皮革手表,能与发型的整洁感很搭。",
      ja: "手首はメタルやレザーの時計ひとつでまとめると、ヘアの端正さとよく合います。",
      en: "Keeping your wrist to a single metal or leather watch pairs well with a neat hairstyle.",
    },
  ],
  [
    "숏 퀴프나 리프처럼 이마가 보이는 스타일에는 선이 얇은 프레임이 잘 맞습니다.",
    {
      zh: "对于像短刘海或Quiff这类露出额头的发型,线条纤细的镜框更合适。",
      ja: "ショートクイフやリーゼントのように額が見えるスタイルには、線が細いフレームがよく合います。",
      en: "For hairstyles that show the forehead, like a short quiff or riff, thin-lined frames work well.",
    },
  ],
  [
    "시계",
    {
      zh: "手表",
      ja: "時計",
      en: "watch",
    },
  ],
  [
    "신발",
    {
      zh: "鞋子",
      ja: "靴",
      en: "shoes",
    },
  ],
  [
    "실용",
    {
      zh: "实用",
      ja: "実用",
      en: "Practical",
    },
  ],
  [
    "안경",
    {
      zh: "眼镜",
      ja: "眼鏡",
      en: "glasses",
    },
  ],
  [
    "앞머리와 눈매를 가리지 않는 얇은 프레임으로 얼굴 중심을 또렷하게 잡습니다.",
    {
      zh: "用不遮挡刘海和眼型的细框,让脸部中心更清晰。",
      ja: "前髪と目元を隠さない細いフレームで、顔の中心をはっきりと見せます。",
      en: "A thin frame that doesn't cover your bangs or eyes keeps the center of your face sharp.",
    },
  ],
  [
    "얼굴 중심",
    {
      zh: "脸部中心",
      ja: "顔の中心",
      en: "Face center",
    },
  ],
  [
    "업로드 사진과 선택 기준을 바탕으로 생성한 추천 스타일 후보입니다.",
    {
      zh: "这是根据上传的照片和所选标准生成的推荐风格候选。",
      ja: "アップロードした写真と選択基準をもとに生成したおすすめスタイル候補です。",
      en: "These are recommended style candidates generated from your uploaded photo and selected criteria.",
    },
  ],
  [
    "없음",
    {
      zh: "无",
      ja: "なし",
      en: "None",
    },
  ],
  [
    "여성 데일리 목걸이 펜던트",
    {
      zh: "女士日常项链 吊坠",
      ja: "レディース デイリーネックレス ペンダント",
      en: "Women's daily necklace pendant",
    },
  ],
  [
    "여성 로퍼 플랫 스니커즈",
    {
      zh: "女士乐福鞋 平底鞋 运动鞋",
      ja: "レディース ローファー フラットシューズ スニーカー",
      en: "Women's loafers flats sneakers",
    },
  ],
  [
    "여성 메이크업 톤과 맞출 때만 자연 직경, 브라운·그레이 계열로 가볍게 봅니다.",
    {
      zh: "只有在与女士妆容色调搭配时,才轻微考虑自然直径、棕色或灰色系。",
      ja: "レディースメイクのトーンに合わせる場合のみ、自然な直径のブラウンやグレー系を軽く検討します。",
      en: "Only consider a natural diameter in brown or gray tones lightly, when matching women's makeup tone.",
    },
  ],
  [
    "여성 메탈 가죽 시계",
    {
      zh: "女士金属皮革手表",
      ja: "レディース メタル レザー 時計",
      en: "Women's metal leather watch",
    },
  ],
  [
    "여성 미니 이어링 귀걸이",
    {
      zh: "女士迷你耳环",
      ja: "レディース ミニピアス",
      en: "Women's mini earrings",
    },
  ],
  [
    "여성 미니멀 숄더백 토트백",
    {
      zh: "女士简约单肩包 托特包",
      ja: "レディース ミニマル ショルダーバッグ トートバッグ",
      en: "Women's minimalist shoulder bag tote",
    },
  ],
  [
    "여성 볼캡 버킷햇",
    {
      zh: "女士棒球帽 渔夫帽",
      ja: "レディース キャップ バケットハット",
      en: "Women's ball cap bucket hat",
    },
  ],
  [
    "여성 슬랙스 롱스커트 데님",
    {
      zh: "女士休闲裤 长裙 牛仔",
      ja: "レディース スラックス ロングスカート デニム",
      en: "Women's slacks long skirt denim",
    },
  ],
  [
    "여성 얇은 팔찌 뱅글",
    {
      zh: "女士细手链 手镯",
      ja: "レディース 細いブレスレット バングル",
      en: "Women's thin bracelet bangle",
    },
  ],
  [
    "여성 얇은 프레임 선글라스",
    {
      zh: "女士细框墨镜",
      ja: "レディース 細いフレームのサングラス",
      en: "Women's thin frame sunglasses",
    },
  ],
  [
    "여성 얇은 프레임 안경",
    {
      zh: "女士细框眼镜",
      ja: "レディース 細いフレームの眼鏡",
      en: "Women's thin frame glasses",
    },
  ],
  [
    "연예인 레퍼런스",
    {
      zh: "明星参考图",
      ja: "芸能人リファレンス",
      en: "Celebrity reference",
    },
  ],
  [
    "옆머리 라인을 가리지 않는 작은 무선 이어버드가 깔끔합니다.",
    {
      zh: "不遮挡侧发线条的小巧无线耳塞更显干净利落。",
      ja: "サイドの髪のラインを隠さない小さなワイヤレスイヤーバッドがすっきりします。",
      en: "Small wireless earbuds that don't cover your side hair line look clean.",
    },
  ],
  [
    "옆머리 사이로 작게 보이는 이어링이 얼굴 주변 포인트를 만듭니다.",
    {
      zh: "在侧发之间若隐若现的小耳环,能为脸部周围增添亮点。",
      ja: "サイドの髪の間から小さく見えるピアスが、顔まわりのポイントになります。",
      en: "Small earrings peeking through your side hair create an accent around your face.",
    },
  ],
  [
    "옆머리와 귀 라인을 크게 가리지 않는 작은 이어버드가 깔끔합니다.",
    {
      zh: "不会大幅遮挡侧发和耳部线条的小耳塞更显干净。",
      ja: "サイドの髪と耳のラインを大きく隠さない小さなイヤーバッドがすっきりします。",
      en: "Small earbuds that don't heavily cover your side hair and ear line look clean.",
    },
  ],
  [
    "예시 닫기",
    {
      zh: "关闭示例",
      ja: "例を閉じる",
      en: "Close example",
    },
  ],
  [
    "예시 보기",
    {
      zh: "查看示例",
      ja: "例を見る",
      en: "View example",
    },
  ],
  [
    "원본 방향 보기",
    {
      zh: "查看原始方向",
      ja: "元の向きを見る",
      en: "View original orientation",
    },
  ],
  [
    "은은한 체인이나 뱅글로 손목에 작은 반짝임만 더합니다.",
    {
      zh: "用低调的链条或手镯,为手腕增添一点点闪耀。",
      ja: "控えめなチェーンやバングルで、手首にほんの少しの輝きだけを加えます。",
      en: "Add just a subtle sparkle to your wrist with a delicate chain or bangle.",
    },
  ],
  [
    "은은함",
    {
      zh: "低调",
      ja: "控えめ",
      en: "Subtle",
    },
  ],
  [
    "이 색상으로 적용하기",
    {
      zh: "应用此颜色",
      ja: "この色を適用",
      en: "Apply this color",
    },
  ],
  [
    "이 스타일 선택",
    {
      zh: "选择此风格",
      ja: "このスタイルを選択",
      en: "Select this style",
    },
  ],
  [
    "이 스타일 투표 올리기",
    {
      zh: "为此风格投票发布",
      ja: "このスタイルを投票に投稿",
      en: "Post this style for voting",
    },
  ],
  [
    "이성만",
    {
      zh: "仅异性",
      ja: "異性のみ",
      en: "Opposite sex only",
    },
  ],
  [
    "이어폰",
    {
      zh: "耳机",
      ja: "イヤホン",
      en: "earphones",
    },
  ],
  [
    "인상",
    {
      zh: "印象",
      ja: "印象",
      en: "Impression",
    },
  ],
  [
    "자동 추천",
    {
      zh: "自动推荐",
      ja: "自動おすすめ",
      en: "Auto recommend",
    },
  ],
  [
    "자연스러운 브라운 그레이 서클렌즈",
    {
      zh: "自然棕灰色美瞳",
      ja: "自然なブラウングレーのサークルレンズ",
      en: "Natural brown-gray circle lenses",
    },
  ],
  [
    "작성함",
    {
      zh: "已撰写",
      ja: "作成済み",
      en: "Written",
    },
  ],
  [
    "저장 중",
    {
      zh: "保存中",
      ja: "保存中",
      en: "Saving",
    },
  ],
  [
    "저장할 상담용 이미지가 아직 없습니다.",
    {
      zh: "还没有可保存的咨询用图片。",
      ja: "保存できる相談用画像がまだありません。",
      en: "There's no consultation image to save yet.",
    },
  ],
  [
    "저장할 추천 이미지가 아직 없습니다.",
    {
      zh: "还没有可保存的推荐图片。",
      ja: "保存できるおすすめ画像がまだありません。",
      en: "There's no recommended image to save yet.",
    },
  ],
  [
    "저장할 코디 이미지가 아직 없습니다.",
    {
      zh: "还没有可保存的穿搭图片。",
      ja: "保存できるコーディネート画像がまだありません。",
      en: "There's no outfit image to save yet.",
    },
  ],
  [
    "적용하기",
    {
      zh: "应用",
      ja: "適用する",
      en: "Apply",
    },
  ],
  [
    "전신 코디",
    {
      zh: "全身穿搭",
      ja: "全身コーディネート",
      en: "Full-body outfit",
    },
  ],
  [
    "전신 코디 추천",
    {
      zh: "全身穿搭推荐",
      ja: "全身コーディネート提案",
      en: "Full-body outfit recommendation",
    },
  ],
  [
    "전체 공개",
    {
      zh: "公开",
      ja: "全体公開",
      en: "Public",
    },
  ],
  [
    "전체 코디가 가벼워 보이도록 로퍼, 플랫, 미니멀 스니커즈를 우선 비교합니다.",
    {
      zh: "为了让整体穿搭显得轻盈,优先比较乐福鞋、平底鞋和简约运动鞋。",
      ja: "全体のコーディネートが軽やかに見えるよう、ローファー、フラットシューズ、ミニマルスニーカーを優先的に比較します。",
      en: "Compare loafers, flats, and minimalist sneakers first to keep the overall outfit looking light.",
    },
  ],
  [
    "절제",
    {
      zh: "克制",
      ja: "抑制",
      en: "Restraint",
    },
  ],
  [
    "좌우 반전하기",
    {
      zh: "左右翻转",
      ja: "左右反転する",
      en: "Flip horizontally",
    },
  ],
  [
    "지정 안 함",
    {
      zh: "不指定",
      ja: "指定しない",
      en: "Not specified",
    },
  ],
  [
    "직접 고르기",
    {
      zh: "自行选择",
      ja: "自分で選ぶ",
      en: "Choose manually",
    },
  ],
  [
    "짧은 시간에 요청이 많아 일부 이미지가 생성되지 못했습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "短时间内请求过多,部分图片未能生成。请稍后重试。",
      ja: "短時間にリクエストが集中し、一部の画像が生成できませんでした。しばらくしてから再試行してください。",
      en: "Too many requests in a short time, so some images weren't generated. Please try again later.",
    },
  ],
  [
    "차감 중",
    {
      zh: "扣除中",
      ja: "差引中",
      en: "Deducting",
    },
  ],
  [
    "추가 상담용 9장 (Hair Money 2)",
    {
      zh: "追加咨询用9张 (Hair Money 2)",
      ja: "追加相談用9枚(Hair Money 2)",
      en: "9 additional consultation images (Hair Money 2)",
    },
  ],
  [
    "추천 대상",
    {
      zh: "推荐对象",
      ja: "おすすめ対象",
      en: "Recommendation target",
    },
  ],
  [
    "추천 스타일 9장이 브라우저 히스토리에 자동 저장되었습니다. 서버 저장은 지연되어 다음 저장 때 다시 시도합니다.",
    {
      zh: "推荐风格9张已自动保存到浏览器历史记录。服务器保存有延迟,将在下次保存时重试。",
      ja: "おすすめスタイル9枚がブラウザ履歴に自動保存されました。サーバー保存が遅延しているため、次回保存時に再試行します。",
      en: "The 9 recommended styles were automatically saved to your browser history. Server save was delayed and will retry on the next save.",
    },
  ],
  [
    "추천 스타일 9장이 브라우저 히스토리에 자동 저장되었습니다. Supabase 전용 프로젝트 연결 후 서버 저장이 활성화됩니다.",
    {
      zh: "推荐风格9张已自动保存到浏览器历史记录。连接专用Supabase项目后将启用服务器保存。",
      ja: "おすすめスタイル9枚がブラウザ履歴に自動保存されました。Supabase専用プロジェクトを接続するとサーバー保存が有効になります。",
      en: "The 9 recommended styles were automatically saved to your browser history. Server save will be enabled once a dedicated Supabase project is connected.",
    },
  ],
  [
    "추천 스타일 9장이 브라우저와 서버 히스토리에 자동 저장되었습니다.",
    {
      zh: "推荐风格9张已自动保存到浏览器和服务器历史记录。",
      ja: "おすすめスタイル9枚がブラウザとサーバーの履歴に自動保存されました。",
      en: "The 9 recommended styles were automatically saved to both your browser and server history.",
    },
  ],
  [
    "추천 스타일 9장이 이 브라우저에 자동 저장되었습니다. 로그인하면 계정 히스토리와 서버 공유 링크를 사용할 수 있습니다.",
    {
      zh: "推荐风格9张已自动保存到此浏览器。登录后可使用账号历史记录和服务器分享链接。",
      ja: "おすすめスタイル9枚がこのブラウザに自動保存されました。ログインするとアカウント履歴とサーバー共有リンクを利用できます。",
      en: "The 9 recommended styles were automatically saved to this browser. Log in to use account history and server share links.",
    },
  ],
  [
    "추천 스타일을 히스토리에 자동 저장하지 못했습니다.",
    {
      zh: "未能自动将推荐风格保存到历史记录。",
      ja: "おすすめスタイルを履歴に自動保存できませんでした。",
      en: "Couldn't automatically save the recommended style to history.",
    },
  ],
  [
    "코디 생성 중",
    {
      zh: "正在生成穿搭",
      ja: "コーディネート生成中",
      en: "Generating outfit",
    },
  ],
  [
    "코디 이미지 3x3 한 장으로 저장하기",
    {
      zh: "将穿搭图片保存为3x3合成图",
      ja: "コーディネート画像を3x3の1枚として保存",
      en: "Save outfit images as one 3x3 image",
    },
  ],
  [
    "코디 이미지를 3x3 바둑판 한 장으로 저장",
    {
      zh: "将穿搭图片保存为3x3拼图一张",
      ja: "コーディネート画像を3x3の格子状1枚に保存",
      en: "Save outfit images as one 3x3 grid image",
    },
  ],
  [
    "코디 추천을 헤어 추천 결과에 함께 붙이는 30일 프리미엄 권한입니다.",
    {
      zh: "这是将穿搭推荐附加在发型推荐结果中的30天高级权限。",
      ja: "コーディネート提案をヘアおすすめ結果に一緒に付ける30日間のプレミアム権限です。",
      en: "A 30-day premium access that adds outfit recommendations alongside your hairstyle results.",
    },
  ],
  [
    "투표 게시 중 오류가 발생했어요.",
    {
      zh: "发布投票时发生错误。",
      ja: "投票の投稿中にエラーが発生しました。",
      en: "An error occurred while posting the vote.",
    },
  ],
  [
    "투표 게시에 실패했어요. 잠시 후 다시 시도해 주세요.",
    {
      zh: "投票发布失败,请稍后重试。",
      ja: "投票の投稿に失敗しました。しばらくしてから再試行してください。",
      en: "Failed to post the vote. Please try again later.",
    },
  ],
  [
    "투표 범위",
    {
      zh: "投票范围",
      ja: "投票範囲",
      en: "Vote scope",
    },
  ],
  [
    "투표 올리기",
    {
      zh: "发布投票",
      ja: "投票を投稿",
      en: "Post vote",
    },
  ],
  [
    "투표가 올라갔어요! 스타일 투표와 커뮤니티에서 확인할 수 있어요.",
    {
      zh: "投票已发布!可以在风格投票和社区中查看。",
      ja: "投票が投稿されました!スタイル投票とコミュニティで確認できます。",
      en: "Your vote post is up! Check it out in Style Vote and the community.",
    },
  ],
  [
    "투표를 올리려면 로그인해 주세요.",
    {
      zh: "请登录后再发布投票。",
      ja: "投票を投稿するにはログインしてください。",
      en: "Please log in to post a vote.",
    },
  ],
  [
    "팔레트 고르기",
    {
      zh: "选择调色板",
      ja: "パレットを選ぶ",
      en: "Choose palette",
    },
  ],
  [
    "팔레트에서 색을 먼저 선택하세요",
    {
      zh: "请先在调色板中选择颜色",
      ja: "パレットから色を先に選択してください",
      en: "Select a color from the palette first",
    },
  ],
  [
    "팔레트에서 원하는 색상을 먼저 선택해 주세요.",
    {
      zh: "请先在调色板中选择您想要的颜色。",
      ja: "パレットから希望の色を先に選択してください。",
      en: "Please select the color you want from the palette first.",
    },
  ],
  [
    "팔찌",
    {
      zh: "手链",
      ja: "ブレスレット",
      en: "bracelet",
    },
  ],
  [
    "펜던트",
    {
      zh: "吊坠",
      ja: "ペンダント",
      en: "pendant",
    },
  ],
  [
    "프레임",
    {
      zh: "镜框",
      ja: "フレーム",
      en: "frame",
    },
  ],
  [
    "프리미엄 스타일 리포트 결제 후 코디 확장 상담이 계정에 연결됩니다.",
    {
      zh: "购买高级风格报告后,穿搭扩展咨询将关联到您的账号。",
      ja: "プレミアムスタイルレポートを決済すると、コーディネート拡張相談がアカウントに紐づきます。",
      en: "After purchasing the Premium Style Report, outfit extended consultation will be linked to your account.",
    },
  ],
  [
    "프리미엄 스타일 리포트 권한이 활성화되었습니다. 코디 확장 상담을 선택할 수 있습니다.",
    {
      zh: "高级风格报告权限已启用。您可以选择穿搭扩展咨询。",
      ja: "プレミアムスタイルレポートの権限が有効になりました。コーディネート拡張相談を選択できます。",
      en: "Premium Style Report access is now active. You can select outfit extended consultation.",
    },
  ],
  [
    "프리미엄 확장 상담이 활성화되었습니다. 코디 조언을 정식 권한으로 사용할 수 있습니다.",
    {
      zh: "高级扩展咨询已启用。您可以正式使用穿搭建议权限。",
      ja: "プレミアム拡張相談が有効になりました。コーディネートアドバイスを正式な権限で利用できます。",
      en: "Premium extended consultation is now active. You can use outfit advice with full access.",
    },
  ],
  [
    "헤어 볼륨을 누르지 않는 볼캡이나 버킷햇을 보조 아이템으로 봅니다.",
    {
      zh: "选择不压扁发型蓬松感的棒球帽或渔夫帽作为辅助单品。",
      ja: "ヘアのボリュームを潰さないキャップやバケットハットを補助アイテムとして検討します。",
      en: "Consider a ball cap or bucket hat that doesn't flatten your hair volume as an accent item.",
    },
  ],
  [
    "헤어 연출을 살릴 날에는 보조 아이템으로만 두고, 볼캡이나 비니를 가볍게 봅니다.",
    {
      zh: "在想展现发型的日子里,只作为辅助单品轻松搭配棒球帽或毛线帽。",
      ja: "ヘアスタイリングを活かしたい日は補助アイテムにとどめ、キャップやビーニーを軽く取り入れます。",
      en: "On days you want to show off your hairstyling, keep it as just an accent and wear a cap or beanie lightly.",
    },
  ],
  [
    "헤어 컬러가 적용되었습니다. 추천 받기를 눌러주세요.",
    {
      zh: "发色已应用。请点击获取推荐。",
      ja: "ヘアカラーが適用されました。「おすすめを受け取る」を押してください。",
      en: "Hair color applied. Please tap Get Recommendations.",
    },
  ],
  [
    "헤어와 상체 실루엣을 방해하지 않는 미니멀 숄더백이나 토트백이 무난합니다.",
    {
      zh: "不干扰发型和上半身轮廓的简约单肩包或托特包更百搭。",
      ja: "ヘアと上半身のシルエットを邪魔しないミニマルなショルダーバッグやトートバッグが無難です。",
      en: "A minimalist shoulder bag or tote that doesn't disrupt your hair and upper body silhouette is a safe choice.",
    },
  ],
  [
    "현재 적용된 헤어 컬러",
    {
      zh: "当前应用的发色",
      ja: "現在適用中のヘアカラー",
      en: "Currently applied hair color",
    },
  ],
  [
    "휴일",
    {
      zh: "假日",
      ja: "休日",
      en: "Holiday",
    },
  ],
  [
    "Hair Money가 부족해요. 스토어에서 충전 후 다시 시도해 주세요.",
    {
      zh: "Hair Money不足。请在商店充值后重试。",
      ja: "Hair Moneyが不足しています。ストアでチャージ後、再度お試しください。",
      en: "Not enough Hair Money. Please recharge in the store and try again.",
    },
  ],
  [
    "내 정보와 활동을 관리하세요.",
    {
      zh: "管理我的信息和活动。",
      ja: "自分の情報と活動を管理しましょう。",
      en: "Manage your info and activity.",
    },
  ],
  [
    "카테고리를 선택해 프로필, 상담 기록, 알림, 보안, 계정을 각각 관리할 수 있습니다.",
    {
      zh: "选择分类，分别管理个人资料、咨询记录、通知、安全和账号。",
      ja: "カテゴリーを選択して、プロフィール・相談履歴・通知・セキュリティ・アカウントをそれぞれ管理できます。",
      en: "Select a category to manage your profile, consultation history, notifications, security, and account.",
    },
  ],
  [
    "계정 이메일",
    {
      zh: "账号邮箱",
      ja: "アカウントのメールアドレス",
      en: "Account email",
    },
  ],
  [
    "계정을 삭제하지 못했습니다. 네트워크 상태를 확인해 주세요.",
    {
      zh: "账号删除失败，请检查网络状态。",
      ja: "アカウントを削除できませんでした。ネットワーク状態をご確認ください。",
      en: "Couldn't delete your account. Please check your network connection.",
    },
  ],
  [
    "로그인이 만료되었습니다. 다시 로그인한 뒤 시도해 주세요.",
    {
      zh: "登录已过期，请重新登录后再试。",
      ja: "ログインの有効期限が切れました。再度ログインしてからお試しください。",
      en: "Your session has expired. Please sign in again and try.",
    },
  ],
  [
    "확인을 위해 계정 이메일을 정확히 입력해 주세요.",
    {
      zh: "为了确认，请准确输入账号邮箱。",
      ja: "確認のため、アカウントのメールアドレスを正確に入力してください。",
      en: "Please enter your account email exactly to confirm.",
    },
  ],
  [
    "가입하면 추천 결과와 상담 이미지를 계정에 저장할 수 있어요.",
    {
      zh: "注册后可将推荐结果和咨询图片保存到账号中。",
      ja: "会員登録すると、推薦結果と相談画像をアカウントに保存できます。",
      en: "Sign up to save your recommendation results and consultation images to your account.",
    },
  ],
  [
    "내 계정",
    {
      zh: "我的账号",
      ja: "マイアカウント",
      en: "My account",
    },
  ],
  [
    "로그인하면 추천 히스토리와 상담 기록을 이어서 볼 수 있어요.",
    {
      zh: "登录后可继续查看推荐历史和咨询记录。",
      ja: "ログインすると、推薦履歴と相談履歴を続けて確認できます。",
      en: "Sign in to continue viewing your recommendation history and consultation records.",
    },
  ],
  [
    "미리룩 계정으로 추천 히스토리와 상담 기록을 관리하세요.",
    {
      zh: "使用 Miri Look 账号管理推荐历史和咨询记录。",
      ja: "Miri Look アカウントで推薦履歴と相談履歴を管理しましょう。",
      en: "Manage your recommendation history and consultation records with your Miri Look account.",
    },
  ],
  [
    "부적절한 콘텐츠와 괴롭힘·악성 이용자에 대해 무관용",
    {
      zh: "对不当内容及骚扰、恶意用户零容忍",
      ja: "不適切なコンテンツや嫌がらせ・悪質な利用者には一切妥協しません",
      en: "Zero tolerance for inappropriate content and harassment or abusive users",
    },
  ],
  [
    "비밀번호를 잊으셨나요?",
    {
      zh: "忘记密码了吗？",
      ja: "パスワードをお忘れですか？",
      en: "Forgot your password?",
    },
  ],
  [
    "이메일로 가입",
    {
      zh: "使用邮箱注册",
      ja: "メールで登録",
      en: "Sign up with email",
    },
  ],
  [
    "이며, 위반 시 콘텐츠 삭제와 이용 제한이 적용됩니다.",
    {
      zh: "，违反时将删除内容并限制使用。",
      ja: "であり、違反した場合はコンテンツの削除および利用制限が適用されます。",
      en: "and violations will result in content removal and usage restrictions.",
    },
  ],
  [
    "재설정 메일 발송 중…",
    {
      zh: "正在发送重置邮件…",
      ja: "再設定メールを送信中…",
      en: "Sending reset email…",
    },
  ],
  [
    "회원가입을 진행하려면 이용약관 동의에 체크해 주세요.",
    {
      zh: "请勾选同意服务条款以继续注册。",
      ja: "会員登録を進めるには利用規約への同意にチェックしてください。",
      en: "Please agree to the Terms of Service to continue signing up.",
    },
  ],
  [
    "Apple 로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "Apple 登录时出现问题，请稍后重试。",
      ja: "Appleログイン中に問題が発生しました。しばらくしてからもう一度お試しください。",
      en: "There was a problem signing in with Apple. Please try again later.",
    },
  ],
  [
    "Apple 로그인 창을 여는 중입니다...",
    {
      zh: "正在打开 Apple 登录窗口...",
      ja: "Appleログイン画面を開いています...",
      en: "Opening Apple sign-in window...",
    },
  ],
  [
    "로그인 후 차단 목록을 확인할 수 있습니다.",
    {
      zh: "登录后可查看屏蔽列表。",
      ja: "ログイン後にブロックリストを確認できます。",
      en: "Sign in to view your block list.",
    },
  ],
  [
    "불러오는 중…",
    {
      zh: "加载中…",
      ja: "読み込み中…",
      en: "Loading…",
    },
  ],
  [
    "차단 목록을 불러오지 못했습니다.",
    {
      zh: "屏蔽列表加载失败。",
      ja: "ブロックリストを読み込めませんでした。",
      en: "Couldn't load your block list.",
    },
  ],
  [
    "차단 해제",
    {
      zh: "取消屏蔽",
      ja: "ブロック解除",
      en: "Unblock",
    },
  ],
  [
    "차단 해제 중 오류가 발생했습니다.",
    {
      zh: "取消屏蔽时发生错误。",
      ja: "ブロック解除中にエラーが発生しました。",
      en: "An error occurred while unblocking.",
    },
  ],
  [
    "차단 해제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "取消屏蔽失败，请稍后重试。",
      ja: "ブロック解除に失敗しました。しばらくしてからもう一度お試しください。",
      en: "Failed to unblock. Please try again later.",
    },
  ],
  [
    "차단한 회원",
    {
      zh: "已屏蔽的会员",
      ja: "ブロックした会員",
      en: "Blocked members",
    },
  ],
  [
    "차단한 회원의 게시물은 내 피드에서 보이지 않습니다. 차단을 해제하면 다시 표시됩니다.",
    {
      zh: "已屏蔽会员的帖子不会显示在我的动态中。取消屏蔽后将重新显示。",
      ja: "ブロックした会員の投稿はフィードに表示されません。ブロックを解除すると再度表示されます。",
      en: "Posts from blocked members won't appear in your feed. Unblocking will show them again.",
    },
  ],
  [
    "차단한 회원이 없습니다.",
    {
      zh: "没有已屏蔽的会员。",
      ja: "ブロックした会員はいません。",
      en: "No blocked members.",
    },
  ],
  [
    "괴롭힘/비방",
    {
      zh: "骚扰/诽谤",
      ja: "嫌がらせ・誹謗中傷",
      en: "Harassment/Defamation",
    },
  ],
  [
    "나:",
    {
      zh: "我：",
      ja: "自分：",
      en: "Me:",
    },
  ],
  [
    "대화 목록으로",
    {
      zh: "返回对话列表",
      ja: "会話一覧へ",
      en: "Back to conversations",
    },
  ],
  [
    "대화를 시작해 보세요",
    {
      zh: "开始对话吧",
      ja: "会話を始めてみましょう",
      en: "Start a conversation",
    },
  ],
  [
    "로그인 후 DM 대화함을 확인할 수 있습니다.",
    {
      zh: "登录后可查看私信对话。",
      ja: "ログイン後にDM会話を確認できます。",
      en: "Sign in to view your DM conversations.",
    },
  ],
  [
    "메시지 전송 중 오류가 발생했습니다.",
    {
      zh: "发送消息时发生错误。",
      ja: "メッセージ送信中にエラーが発生しました。",
      en: "An error occurred while sending the message.",
    },
  ],
  [
    "메시지 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "消息发送失败，请稍后重试。",
      ja: "メッセージの送信に失敗しました。しばらくしてからもう一度お試しください。",
      en: "Failed to send message. Please try again later.",
    },
  ],
  [
    "메시지를 입력하세요",
    {
      zh: "请输入消息",
      ja: "メッセージを入力してください",
      en: "Type a message",
    },
  ],
  [
    "보내기",
    {
      zh: "发送",
      ja: "送信",
      en: "Send",
    },
  ],
  [
    "사칭/사기 의심",
    {
      zh: "疑似冒充/诈骗",
      ja: "なりすまし・詐欺の疑い",
      en: "Suspected impersonation/fraud",
    },
  ],
  [
    "상대 신고",
    {
      zh: "举报对方",
      ja: "相手を通報",
      en: "Report user",
    },
  ],
  [
    "상대 차단",
    {
      zh: "屏蔽对方",
      ja: "相手をブロック",
      en: "Block user",
    },
  ],
  [
    "성적/음란 메시지",
    {
      zh: "性暗示/淫秽消息",
      ja: "性的・わいせつなメッセージ",
      en: "Sexual/explicit message",
    },
  ],
  [
    "신고 접수에 실패했습니다.",
    {
      zh: "举报提交失败。",
      ja: "通報の受付に失敗しました。",
      en: "Failed to submit report.",
    },
  ],
  [
    "신고가 접수되었습니다. 운영자가 24시간 이내에 확인합니다.",
    {
      zh: "举报已提交，运营人员将在24小时内进行确认。",
      ja: "通報を受け付けました。運営者が24時間以内に確認します。",
      en: "Your report has been submitted. Our team will review it within 24 hours.",
    },
  ],
  [
    "아직 주고받은 DM이 없습니다. 커뮤니티에서 다른 회원에게 DM을 보내면 여기 모입니다.",
    {
      zh: "还没有私信往来。在社区中给其他会员发送私信后会显示在这里。",
      ja: "まだやり取りしたDMがありません。コミュニティで他の会員にDMを送るとここに表示されます。",
      en: "No DMs yet. Messages you send to other members in the community will appear here.",
    },
  ],
  [
    "이 회원 신고하기",
    {
      zh: "举报该会员",
      ja: "この会員を通報する",
      en: "Report this member",
    },
  ],
  [
    "차단 중 오류가 발생했습니다.",
    {
      zh: "屏蔽时发生错误。",
      ja: "ブロック中にエラーが発生しました。",
      en: "An error occurred while blocking.",
    },
  ],
  [
    "첨부 이미지",
    {
      zh: "附件图片",
      ja: "添付画像",
      en: "Attached image",
    },
  ],
  [
    "커뮤니티에서 주고받은 DM 대화입니다. 대화를 눌러 메시지를 확인하고 답장할 수 있으며, 대화 안에서 상대를 신고하거나 차단할 수 있습니다.",
    {
      zh: "这是您在社区中进行的私信对话。点击对话即可查看消息并回复，也可以在对话中举报或屏蔽对方。",
      ja: "コミュニティでやり取りしたDM会話です。会話をタップしてメッセージを確認・返信でき、会話内で相手を通報・ブロックすることもできます。",
      en: "These are your DM conversations from the community. Tap a conversation to view and reply to messages, and report or block the other user from within it.",
    },
  ],
  [
    "해당 회원을 차단했습니다.",
    {
      zh: "已屏蔽该会员。",
      ja: "この会員をブロックしました。",
      en: "You've blocked this member.",
    },
  ],
  [
    "계정",
    {
      zh: "账号",
      ja: "アカウント",
      en: "Account",
    },
  ],
  [
    "계정 관리",
    {
      zh: "账号管理",
      ja: "アカウント管理",
      en: "Account management",
    },
  ],
  [
    "계정과 데이터를 영구 삭제",
    {
      zh: "永久删除账号和数据",
      ja: "アカウントとデータを完全に削除",
      en: "Permanently delete account and data",
    },
  ],
  [
    "내 상담 기록 · 매칭",
    {
      zh: "我的咨询记录 · 匹配",
      ja: "相談履歴・マッチング",
      en: "My consultation history · Matches",
    },
  ],
  [
    "내 프로필",
    {
      zh: "我的资料",
      ja: "マイプロフィール",
      en: "My profile",
    },
  ],
  [
    "내 활동",
    {
      zh: "我的活动",
      ja: "マイアクティビティ",
      en: "My activity",
    },
  ],
  [
    "내가 접수한 신고와 처리 상태",
    {
      zh: "我提交的举报及处理状态",
      ja: "自分が行った通報と処理状況",
      en: "Reports I've submitted and their status",
    },
  ],
  [
    "닉네임, 자기소개, 추천용 얼굴 사진",
    {
      zh: "昵称、自我介绍、推荐用面部照片",
      ja: "ニックネーム、自己紹介、推薦用の顔写真",
      en: "Nickname, bio, and photo for recommendations",
    },
  ],
  [
    "뒤로",
    {
      zh: "返回",
      ja: "戻る",
      en: "Back",
    },
  ],
  [
    "비밀번호 변경",
    {
      zh: "修改密码",
      ja: "パスワード変更",
      en: "Change password",
    },
  ],
  [
    "상담 기록 · 나의 매칭",
    {
      zh: "咨询记录 · 我的匹配",
      ja: "相談履歴・マイマッチング",
      en: "Consultation history · My matches",
    },
  ],
  [
    "설정",
    {
      zh: "设置",
      ja: "設定",
      en: "Settings",
    },
  ],
  [
    "신고 이력",
    {
      zh: "举报记录",
      ja: "通報履歴",
      en: "Report history",
    },
  ],
  [
    "약관 · 정책",
    {
      zh: "条款 · 政策",
      ja: "規約・ポリシー",
      en: "Terms & policies",
    },
  ],
  [
    "주고받은 DM 확인 · 답장 · 상대 신고/차단",
    {
      zh: "查看私信 · 回复 · 举报/屏蔽对方",
      ja: "DMの確認・返信・相手の通報/ブロック",
      en: "View DMs · Reply · Report/block users",
    },
  ],
  [
    "차단 목록 확인 · 차단 해제",
    {
      zh: "查看屏蔽列表 · 取消屏蔽",
      ja: "ブロックリストの確認・解除",
      en: "View block list · Unblock",
    },
  ],
  [
    "차단한 회원 관리",
    {
      zh: "管理已屏蔽的会员",
      ja: "ブロックした会員の管理",
      en: "Manage blocked members",
    },
  ],
  [
    "추천 히스토리, H머니 내역, 매칭",
    {
      zh: "推荐历史、Hair Money 记录、匹配",
      ja: "推薦履歴、Hair Money履歴、マッチング",
      en: "Recommendation history, Hair Money history, matches",
    },
  ],
  [
    "프로필 · 기준 사진",
    {
      zh: "资料 · 基准照片",
      ja: "プロフィール・基準写真",
      en: "Profile · Reference photo",
    },
  ],
  [
    "프로필 관리",
    {
      zh: "资料管理",
      ja: "プロフィール管理",
      en: "Manage profile",
    },
  ],
  [
    "결제·H머니",
    {
      zh: "支付·Hair Money",
      ja: "決済・Hair Money",
      en: "Payments & Hair Money",
    },
  ],
  [
    "기기 알림 서버 준비가 완료되면 켤 수 있습니다.",
    {
      zh: "设备通知服务器准备完成后即可开启。",
      ja: "端末通知サーバーの準備が完了すると有効にできます。",
      en: "You can turn this on once the device notification server is ready.",
    },
  ],
  [
    "기기 알림을 켜면 위에서 선택한 종류의 소식을 받을 수 있어요.",
    {
      zh: "开启设备通知后，可接收上方所选类型的消息。",
      ja: "端末通知をオンにすると、上で選択した種類のお知らせを受け取れます。",
      en: "Turn on device notifications to receive updates for the categories selected above.",
    },
  ],
  [
    "기기 알림이 켜졌어요. 앱을 닫아둬도 소식을 받을 수 있어요.",
    {
      zh: "设备通知已开启。即使关闭应用也能接收消息。",
      ja: "端末通知がオンになりました。アプリを閉じていてもお知らせを受け取れます。",
      en: "Device notifications are on. You'll get updates even when the app is closed.",
    },
  ],
  [
    "댓글, 투표, DM 소식",
    {
      zh: "评论、投票、私信消息",
      ja: "コメント・投票・DMのお知らせ",
      en: "Comments, polls, and DM updates",
    },
  ],
  [
    "마케팅·혜택 수신",
    {
      zh: "接收营销和优惠信息",
      ja: "マーケティング・特典情報の受信",
      en: "Marketing & promotions",
    },
  ],
  [
    "미용실·예약",
    {
      zh: "美发店·预约",
      ja: "美容室・予約",
      en: "Salon & bookings",
    },
  ],
  [
    "브라우저 알림 권한이 차단되어 있습니다. 브라우저 설정에서 허용해주세요.",
    {
      zh: "浏览器通知权限已被屏蔽，请在浏览器设置中允许。",
      ja: "ブラウザの通知権限がブロックされています。ブラウザの設定で許可してください。",
      en: "Browser notification permission is blocked. Please allow it in your browser settings.",
    },
  ],
  [
    "서버에 Web Push 키가 아직 설정되지 않았습니다. 잠시 후 다시 시도해주세요.",
    {
      zh: "服务器尚未设置 Web Push 密钥，请稍后重试。",
      ja: "サーバーにWebプッシュキーがまだ設定されていません。しばらくしてからもう一度お試しください。",
      en: "The Web Push key hasn't been set up on the server yet. Please try again later.",
    },
  ],
  [
    "서비스 안내와 운영 공지",
    {
      zh: "服务指南和运营公告",
      ja: "サービス案内と運営からのお知らせ",
      en: "Service info and announcements",
    },
  ],
  [
    "예약 상태와 안내",
    {
      zh: "预约状态和指南",
      ja: "予約状況とご案内",
      en: "Booking status and info",
    },
  ],
  [
    "운영 안내",
    {
      zh: "运营公告",
      ja: "運営案内",
      en: "Operational notices",
    },
  ],
  [
    "이 기기는 미리룩 알림을 받고 있어요.",
    {
      zh: "此设备正在接收 Miri Look 通知。",
      ja: "この端末はMiri Look通知を受け取っています。",
      en: "This device is receiving Miri Look notifications.",
    },
  ],
  [
    "이 기기의 알림을 껐어요.",
    {
      zh: "已关闭此设备的通知。",
      ja: "この端末の通知をオフにしました。",
      en: "Notifications for this device are turned off.",
    },
  ],
  [
    "이벤트·혜택·프로모션 등 광고성 정보 수신(선택)",
    {
      zh: "接收活动、优惠、促销等广告信息（可选）",
      ja: "イベント・特典・プロモーションなどの広告情報受信（任意）",
      en: "Receive event, offer, and promotional info (optional)",
    },
  ],
  [
    "추천과 이미지 생성이 끝나면 알려드려요",
    {
      zh: "推荐和图片生成完成后会通知您",
      ja: "推薦と画像生成が完了したらお知らせします",
      en: "We'll notify you when your recommendations and images are ready",
    },
  ],
  [
    "충전과 사용 내역",
    {
      zh: "充值和使用记录",
      ja: "チャージ・利用履歴",
      en: "Top-up & usage history",
    },
  ],
  [
    "현재 브라우저에서는 기기 알림이 지원되지 않습니다.",
    {
      zh: "当前浏览器不支持设备通知。",
      ja: "現在のブラウザでは端末通知がサポートされていません。",
      en: "Device notifications aren't supported in this browser.",
    },
  ],
  [
    "후기",
    {
      zh: "评价",
      ja: "レビュー",
      en: "Reviews",
    },
  ],
  [
    "후기와 평가 관련 안내",
    {
      zh: "评价相关指南",
      ja: "レビュー・評価に関するご案内",
      en: "Review & rating info",
    },
  ],
  [
    "AI 추천·생성",
    {
      zh: "AI 推荐·生成",
      ja: "AI推薦・生成",
      en: "AI recommendations & generation",
    },
  ],
  [
    "비밀번호 설정",
    {
      zh: "设置密码",
      ja: "パスワード設定",
      en: "Set password",
    },
  ],
  [
    "비밀번호 확인이 일치하지 않습니다.",
    {
      zh: "密码确认不一致。",
      ja: "パスワード（確認）が一致しません。",
      en: "Passwords don't match.",
    },
  ],
  [
    "비밀번호를 변경했습니다.",
    {
      zh: "密码已修改。",
      ja: "パスワードを変更しました。",
      en: "Your password has been changed.",
    },
  ],
  [
    "비밀번호를 설정했습니다. 이제 이메일과 비밀번호로도 로그인할 수 있습니다.",
    {
      zh: "密码已设置。现在也可以使用邮箱和密码登录。",
      ja: "パスワードを設定しました。これでメールアドレスとパスワードでもログインできます。",
      en: "Your password has been set. You can now sign in with your email and password too.",
    },
  ],
  [
    "비밀번호를 저장하는 중입니다.",
    {
      zh: "正在保存密码。",
      ja: "パスワードを保存しています。",
      en: "Saving your password…",
    },
  ],
  [
    "비밀번호를 저장하지 못했습니다.",
    {
      zh: "密码保存失败。",
      ja: "パスワードを保存できませんでした。",
      en: "Couldn't save your password.",
    },
  ],
  [
    "이메일 로그인에 사용할 비밀번호를 변경합니다.",
    {
      zh: "修改用于邮箱登录的密码。",
      ja: "メールログインに使用するパスワードを変更します。",
      en: "Change the password used for email sign-in.",
    },
  ],
  [
    "카카오·구글·네이버로 가입한 계정입니다. 비밀번호를 설정하면 소셜 로그인과 이메일 로그인을 모두 쓸 수 있습니다.",
    {
      zh: "这是通过 Kakao・Google・Naver 注册的账号。设置密码后可同时使用社交登录和邮箱登录。",
      ja: "Kakao・Google・Naverで登録したアカウントです。パスワードを設定すると、ソーシャルログインとメールログインの両方を使えます。",
      en: "This account was created with Kakao, Google, or Naver. Set a password to also sign in with email.",
    },
  ],
  [
    "· 환불은 결제 시 사용한 결제수단 또는 앱마켓 정책에 따라 처리됩니다.",
    {
      zh: "· 退款将按支付时使用的支付方式或应用商店政策处理。",
      ja: "・返金は決済時に使用した決済手段またはアプリマーケットのポリシーに従って処理されます。",
      en: "· Refunds are processed according to the payment method used or the app store's policy.",
    },
  ],
  [
    "계정 H머니 이력을 불러왔습니다.",
    {
      zh: "已加载账号 Hair Money 记录。",
      ja: "アカウントのHair Money履歴を読み込みました。",
      en: "Loaded your account's Hair Money history.",
    },
  ],
  [
    "로그인 후 H머니 잔액과 사용 이력을 확인할 수 있습니다.",
    {
      zh: "登录后可查看 Hair Money 余额和使用记录。",
      ja: "ログイン後にHair Moneyの残高と利用履歴を確認できます。",
      en: "Sign in to view your Hair Money balance and usage history.",
    },
  ],
  [
    "로그인이 필요합니다.",
    {
      zh: "需要登录。",
      ja: "ログインが必要です。",
      en: "Sign-in required.",
    },
  ],
  [
    "사용",
    {
      zh: "使用",
      ja: "使用",
      en: "Used",
    },
  ],
  [
    "추천·추가 상담 생성으로 차감된 누적 금액입니다.",
    {
      zh: "因推荐及追加咨询生成而扣除的累计金额。",
      ja: "推薦・追加相談の生成で差し引かれた累計金額です。",
      en: "Total amount deducted for recommendations and additional consultations.",
    },
  ],
  [
    "추천과 추가 상담 생성에 사용할 수 있습니다.",
    {
      zh: "可用于推荐和追加咨询生成。",
      ja: "推薦や追加相談の生成に利用できます。",
      en: "Can be used for recommendations and additional consultations.",
    },
  ],
  [
    "충전, 보상, 조정으로 계정에 들어온 누적 H머니입니다.",
    {
      zh: "通过充值、奖励、调整累计进入账号的 Hair Money。",
      ja: "チャージ・報酬・調整でアカウントに入った累計Hair Moneyです。",
      en: "Total Hair Money added to your account through top-ups, rewards, and adjustments.",
    },
  ],
  [
    "H머니 이력 확인이 지연되고 있습니다.",
    {
      zh: "Hair Money 记录确认延迟。",
      ja: "Hair Money履歴の確認が遅れています。",
      en: "Checking your Hair Money history is taking longer than expected.",
    },
  ],
  [
    "H머니 잔액과 사용 이력을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "Hair Money 余额及使用记录加载失败，请稍后重试。",
      ja: "Hair Moneyの残高と利用履歴を読み込めませんでした。しばらくしてからもう一度お試しください。",
      en: "Couldn't load your Hair Money balance and usage history. Please try again later.",
    },
  ],
  [
    "H머니 잔액과 사용 이력을 확인하는 중입니다.",
    {
      zh: "正在查询 Hair Money 余额和使用记录。",
      ja: "Hair Moneyの残高と利用履歴を確認しています。",
      en: "Checking your Hair Money balance and usage history…",
    },
  ],
  [
    "H머니 저장소 연결이 필요합니다.",
    {
      zh: "需要连接 Hair Money 存储。",
      ja: "Hair Moneyストレージの接続が必要です。",
      en: "Hair Money storage connection required.",
    },
  ],
  [
    "내가 접수한 신고와 처리 상태입니다. 운영자는 신고를 24시간 이내에 확인해 조치합니다. 아직 처리 전인 신고는 취소할 수 있습니다.",
    {
      zh: "这是我提交的举报及处理状态。运营人员将在24小时内确认并处理举报。尚未处理的举报可以取消。",
      ja: "自分が行った通報とその処理状況です。運営者は24時間以内に通報を確認し対応します。まだ処理されていない通報は取り消せます。",
      en: "Reports you've submitted and their status. Our team reviews and acts on reports within 24 hours. Reports not yet processed can be canceled.",
    },
  ],
  [
    "로그인 후 신고 이력을 확인할 수 있습니다.",
    {
      zh: "登录后可查看举报记录。",
      ja: "ログイン後に通報履歴を確認できます。",
      en: "Sign in to view your report history.",
    },
  ],
  [
    "신고 이력을 불러오지 못했습니다.",
    {
      zh: "举报记录加载失败。",
      ja: "通報履歴を読み込めませんでした。",
      en: "Couldn't load your report history.",
    },
  ],
  [
    "신고 취소",
    {
      zh: "取消举报",
      ja: "通報を取り消す",
      en: "Cancel report",
    },
  ],
  [
    "신고 취소 중 오류가 발생했습니다.",
    {
      zh: "取消举报时发生错误。",
      ja: "通報の取り消し中にエラーが発生しました。",
      en: "An error occurred while canceling the report.",
    },
  ],
  [
    "신고 취소에 실패했습니다.",
    {
      zh: "取消举报失败。",
      ja: "通報の取り消しに失敗しました。",
      en: "Failed to cancel the report.",
    },
  ],
  [
    "신고를 취소했습니다.",
    {
      zh: "举报已取消。",
      ja: "通報を取り消しました。",
      en: "Report canceled.",
    },
  ],
  [
    "이미 운영자가 확인 중이라 취소할 수 없습니다.",
    {
      zh: "运营人员正在确认中，无法取消。",
      ja: "すでに運営者が確認中のため取り消せません。",
      en: "Can't cancel — our team is already reviewing this report.",
    },
  ],
  [
    "접수한 신고가 없습니다.",
    {
      zh: "没有已提交的举报。",
      ja: "通報した内容がありません。",
      en: "No reports submitted.",
    },
  ],
  [
    "상담 결과",
    {
      zh: "咨询结果",
      ja: "相談結果",
      en: "Consultation result",
    },
  ],
  [
    "Hair Money 스토어",
    {
      zh: "Hair Money 商店",
      ja: "Hair Money ストア",
      en: "Hair Money Store",
    },
  ],
  [
    "다른 회원이 좋아요/싫어요로 투표하고, 게시자는 결과를 바로 확인할 수 있어요.",
    {
      zh: "其他会员通过赞/踩投票，发布者可以立即查看结果。",
      ja: "他のユーザーがいいね・よくないねで投票し、投稿者はすぐに結果を確認できます。",
      en: "Other members vote like or dislike, and posters can see results instantly.",
    },
  ],
  [
    "스타일 골라 올리기",
    {
      zh: "选择风格发布",
      ja: "スタイルを選んで投稿",
      en: "Pick a style to post",
    },
  ],
  [
    "전체 공개 또는 ‘이성만’ 투표로 올릴 수 있고, DM 허용 여부도 직접 정할 수 있어요.",
    {
      zh: "可以设为公开或“仅限异性”投票，也能自行决定是否允许私信。",
      ja: "全体公開または「異性のみ」投票として投稿でき、DM許可の有無も自分で設定できます。",
      en: "Post publicly or as “opposite sex only” voting, and choose whether to allow DMs.",
    },
  ],
  [
    "좋아요·싫어요 투표",
    {
      zh: "赞·踩投票",
      ja: "いいね・よくないね投票",
      en: "Like / dislike vote",
    },
  ],
  [
    "추천받은 스타일, 다른 회원의 투표로 검증하세요.",
    {
      zh: "用其他会员的投票，验证你收到的推荐风格吧。",
      ja: "おすすめされたスタイルを、他のユーザーの投票で検証しましょう。",
      en: "Verify your recommended style with votes from other members.",
    },
  ],
  [
    "추천받은 헤어스타일을 다른 회원의 투표로 검증받아 보세요.",
    {
      zh: "让其他会员用投票，验证你收到推荐的发型吧。",
      ja: "おすすめされたヘアスタイルを、他のユーザーの投票で検証してもらいましょう。",
      en: "Get your recommended hairstyle verified by votes from other members.",
    },
  ],
  [
    "투표 범위 선택",
    {
      zh: "选择投票范围",
      ja: "投票範囲を選択",
      en: "Choose vote scope",
    },
  ],
  [
    "AI 추천 9개 중 마음에 드는 스타일 하나를 골라 ‘투표 올리기’로 게시해요. 게시에는 2 Hair Money가 들어요.",
    {
      zh: "从9个AI推荐风格中选一个喜欢的，用“发布投票”发布。发布需花费2 Hair Money。",
      ja: "9つのAIおすすめの中から気に入ったスタイルを1つ選び、「投票を投稿」で公開します。投稿には2 Hair Moneyがかかります。",
      en: "Pick your favorite from 9 AI recommendations and post it as a vote. Posting costs 2 Hair Money.",
    },
  ],
  [
    "AI 추천 9개 중 하나를 골라 올리면, 다른 회원이 좋아요/싫어요로 투표해요. 게시한 스타일은 커뮤니티에도 함께 공개됩니다.",
    {
      zh: "从9个AI推荐中选一个发布后，其他会员会通过赞/踩投票。发布的风格也会同时公开到社区。",
      ja: "9つのAIおすすめの中から1つ選んで投稿すると、他のユーザーがいいね・よくないねで投票します。投稿したスタイルはコミュニティにも同時に公開されます。",
      en: "Pick one of 9 AI recommendations to post, and other members vote like or dislike. Posted styles are also shared to the community.",
    },
  ],
  [
    "AI 추천 받으러 가기",
    {
      zh: "前往获取AI推荐",
      ja: "AIおすすめを見に行く",
      en: "Get AI recommendations",
    },
  ],
  [
    "AI 추천 헤어스타일 중 하나를 골라 올리고, 다른 회원의 좋아요/싫어요 투표로 검증받으세요.",
    {
      zh: "选择一款AI推荐发型发布，接受其他会员的赞/踩投票验证吧。",
      ja: "AIおすすめヘアスタイルの中から1つ選んで投稿し、他のユーザーのいいね・よくないね投票で検証してもらいましょう。",
      en: "Pick one of your AI-recommended hairstyles to post and get it verified by other members' votes.",
    },
  ],
  [
    "마이",
    {
      zh: "我的",
      ja: "マイ",
      en: "My",
    },
  ],
  [
    "AI추천",
    {
      zh: "AI推荐",
      ja: "AIおすすめ",
      en: "AI Recommend",
    },
  ],
  [
    "밝기",
    {
      zh: "亮度",
      ja: "明るさ",
      en: "Brightness",
    },
  ],
  [
    "결제가 완료되었습니다. 적립 반영을 확인하는 중입니다.",
    {
      zh: "支付已完成。正在确认积分是否到账。",
      ja: "決済が完了しました。付与の反映を確認しています。",
      en: "Payment complete. Confirming your Hair Money credit.",
    },
  ],
  [
    "결제가 완료되었습니다. Hair Money가 적립되었습니다.",
    {
      zh: "支付已完成。Hair Money已到账。",
      ja: "決済が完了しました。Hair Moneyが付与されました。",
      en: "Payment complete. Hair Money has been credited.",
    },
  ],
  [
    "결제를 취소했습니다. 다시 시도할 수 있습니다.",
    {
      zh: "已取消支付。可以重新尝试。",
      ja: "決済をキャンセルしました。もう一度お試しいただけます。",
      en: "Payment canceled. You can try again.",
    },
  ],
  [
    "결제창을 여는 중입니다...",
    {
      zh: "正在打开支付窗口...",
      ja: "決済画面を開いています...",
      en: "Opening payment window...",
    },
  ],
  [
    "상품 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "未能加载商品信息。请稍后再试。",
      ja: "商品情報を読み込めませんでした。しばらくしてからもう一度お試しください。",
      en: "Couldn't load product info. Please try again shortly.",
    },
  ],
  [
    "실패",
    {
      zh: "失败",
      ja: "失敗",
      en: "Failed",
    },
  ],
  [
    "앱 결제 모듈을 불러오지 못했습니다. 앱을 최신 버전으로 업데이트한 뒤 다시 시도해 주세요.",
    {
      zh: "未能加载应用内支付模块。请将应用更新到最新版本后重试。",
      ja: "アプリの決済モジュールを読み込めませんでした。アプリを最新バージョンに更新してから、もう一度お試しください。",
      en: "Couldn't load the in-app payment module. Please update the app and try again.",
    },
  ],
  [
    "웹 결제는 준비 중입니다. 앱에서 결제하거나 잠시 후 다시 시도해 주세요.",
    {
      zh: "网页支付功能正在准备中。请在应用内支付，或稍后再试。",
      ja: "ウェブ決済は準備中です。アプリで決済するか、しばらくしてからもう一度お試しください。",
      en: "Web payment is coming soon. Please pay in the app or try again shortly.",
    },
  ],
  [
    "추가 상담 이미지 생성 사용",
    {
      zh: "用于生成额外咨询图片",
      ja: "追加相談画像生成に使用",
      en: "Used for extra consultation image generation",
    },
  ],
  [
    "추천 실패/검토 환불",
    {
      zh: "推荐失败·审核退款",
      ja: "おすすめ失敗・審査返金",
      en: "Refund for recommendation failure/review",
    },
  ],
  [
    "커뮤니티 피드 공유 보상",
    {
      zh: "社区分享奖励",
      ja: "コミュニティフィード共有報酬",
      en: "Community feed share reward",
    },
  ],
  [
    "KG이니시스 PG",
    {
      zh: "KG Inicis PG",
      ja: "KGイニシス PG",
      en: "KG Inicis PG",
    },
  ],
  [
    "업로드 제외",
    {
      zh: "不含上传",
      ja: "アップロード除外",
      en: "Exclude upload",
    },
  ],
  [
    "업로드 포함",
    {
      zh: "含上传",
      ja: "アップロード込み",
      en: "Include upload",
    },
  ],
  [
    "미리룩 앱 시연 영상 — AI 헤어스타일 추천 흐름",
    {
      zh: "Miri Look 应用演示视频 — AI发型推荐流程",
      ja: "Miri Look アプリデモ動画 — AIヘアスタイルおすすめの流れ",
      en: "Miri Look app demo video — AI hairstyle recommendation flow",
    },
  ],
  [
    "앱 시연 예시 · AI 생성 이미지",
    {
      zh: "应用演示示例 · AI生成图片",
      ja: "アプリデモ例 · AI生成画像",
      en: "App demo example · AI-generated image",
    },
  ],
  [
    "첫 상담 세트는 무료 · 로그인 없이 바로 체험",
    {
      zh: "首次咨询套装免费 · 无需登录即可体验",
      ja: "初回相談セットは無料 · ログイン不要ですぐ体験",
      en: "First consultation set is free · Try it now, no login needed",
    },
  ],
  [
    "·사파리",
    {
      zh: "·Safari",
      ja: "·Safari",
      en: "·Safari",
    },
  ],
  [
    "※ 본 화면의 다방향 헤어스타일 이미지 제공 기술과 화면 디자인은 특허·디자인 출원으로 보호받고 있으며, 무단 복제·모방 시 법적 책임이 따를 수 있습니다.",
    {
      zh: "※ 本画面的多方向发型图片提供技术及画面设计已提交专利·外观设计申请予以保护，未经授权复制·仿冒可能需承担法律责任。",
      ja: "※ 本画面の多方向ヘアスタイル画像提供技術および画面デザインは、特許・意匠出願により保護されており、無断複製・模倣には法的責任が伴う場合があります。",
      en: "* The multi-angle hairstyle image technology and screen design shown here are protected under patent and design applications; unauthorized copying or imitation may result in legal liability.",
    },
  ],
  [
    "특허출원 10-2026-0131146 (2026.07.16) · 디자인출원 30-2026-0025955 (2026.07.14) · 엠제이인사이트㈜",
    {
      zh: "专利申请 10-2026-0131146（2026.07.16）· 外观设计申请 30-2026-0025955（2026.07.14）· MJ Insight株式会社",
      ja: "特許出願 10-2026-0131146（2026.07.16）· 意匠出願 30-2026-0025955（2026.07.14）· MJインサイト株式会社",
      en: "Patent pending 10-2026-0131146 (2026.07.16) · Design registration pending 30-2026-0025955 (2026.07.14) · MJ Insight Co., Ltd.",
    },
  ],
  [
    "결제 서버 저장소가 아직 연결되지 않았습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "支付服务器存储尚未连接。请稍后再试。",
      ja: "決済サーバーのストレージがまだ接続されていません。しばらくしてからもう一度お試しください。",
      en: "Payment server storage isn't connected yet. Please try again shortly.",
    },
  ],
  [
    "결제 후 스타일 투표 노출, DM 정책, 상담 공유를 연결하기 위한 KG이니시스 결제 영역입니다.",
    {
      zh: "这是KG Inicis支付区域，用于连接支付后的风格投票展示、私信政策及咨询分享。",
      ja: "決済後のスタイル投票表示、DMポリシー、相談共有を連携するためのKGイニシス決済エリアです。",
      en: "This is the KG Inicis payment area that connects post-payment style vote display, DM policy, and consultation sharing.",
    },
  ],
  [
    "결제가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "支付未完成。请稍后再试。",
      ja: "決済が完了していません。しばらくしてからもう一度お試しください。",
      en: "Payment wasn't completed. Please try again shortly.",
    },
  ],
  [
    "결제가 확인되었습니다. 구매한 권한이 계정에 적용되었습니다.",
    {
      zh: "支付已确认。购买的权限已应用到账户。",
      ja: "決済が確認されました。購入した権限がアカウントに適用されました。",
      en: "Payment confirmed. Your purchased benefits have been applied to your account.",
    },
  ],
  [
    "결제를 취소했습니다.",
    {
      zh: "已取消支付。",
      ja: "決済をキャンセルしました。",
      en: "Payment canceled.",
    },
  ],
  [
    "결제창으로 이동합니다. 완료 후 이 페이지로 돌아옵니다.",
    {
      zh: "即将跳转至支付页面。完成后将返回本页面。",
      ja: "決済画面へ移動します。完了後、このページに戻ります。",
      en: "Redirecting to the payment window. You'll return here when done.",
    },
  ],
  [
    "부적절한 게시물을 운영자에게 신고합니다. 신고가 접수되면 운영자가 24시간 이내에 확인해 조치합니다.",
    {
      zh: "向管理员举报不当内容。举报提交后，管理员将在24小时内确认并处理。",
      ja: "不適切な投稿を運営者に通報します。通報を受け付けると、運営者が24時間以内に確認し対応します。",
      en: "Report inappropriate posts to the admin. Once reported, the admin will review and act within 24 hours.",
    },
  ],
  [
    "이 이용자 차단",
    {
      zh: "屏蔽此用户",
      ja: "このユーザーをブロック",
      en: "Block this user",
    },
  ],
  [
    "이 이용자를 차단할까요?\\n차단하면 이 이용자의 게시물이 내 피드에서 즉시 사라지고, 운영자에게 통지됩니다.",
    {
      zh: "要屏蔽此用户吗？\\n屏蔽后，该用户的帖子会立即从我的动态中消失，并会通知管理员。",
      ja: "このユーザーをブロックしますか？\\nブロックすると、このユーザーの投稿がすぐに自分のフィードから消え、運営者に通知されます。",
      en: "Block this user?\\nBlocking will immediately remove their posts from your feed and notify the admin.",
    },
  ],
  [
    "뭔가 있다",
    {
      zh: "有点意思",
      ja: "何かある",
      en: "There's something there",
    },
  ],
  [
    "내 투표",
    {
      zh: "我的投票",
      ja: "マイ投票",
      en: "My votes",
    },
  ],
  [
    "내가 올린 투표에는 투표할 수 없어요.",
    {
      zh: "无法为自己发布的投票投票。",
      ja: "自分が投稿した投票には投票できません。",
      en: "You can't vote on your own post.",
    },
  ],
  [
    "다른 회원이 올린 스타일에 좋아요/싫어요로 투표해 주세요. “이성만” 투표는 내 성별이 맞아야 참여할 수 있어요.",
    {
      zh: "请为其他会员发布的风格投赞或踩。“仅限异性”投票需性别相符才能参与。",
      ja: "他のユーザーが投稿したスタイルにいいね・よくないねで投票してください。「異性のみ」投票は、自分の性別が条件に合っている場合のみ参加できます。",
      en: "Vote like or dislike on styles posted by other members. “Opposite sex only” votes require your gender to match.",
    },
  ],
  [
    "아직 올라온 스타일 투표가 없어요. AI 추천 결과에서 마음에 드는 스타일을 골라 “투표 올리기”로 첫 투표를 시작해 보세요.",
    {
      zh: "目前还没有风格投票。从AI推荐结果中选一个喜欢的风格，用“发布投票”开始第一个投票吧。",
      ja: "まだ投稿されたスタイル投票がありません。AIおすすめ結果から気に入ったスタイルを選び、「投票を投稿」で最初の投票を始めてみましょう。",
      en: "No style votes yet. Pick a style you like from your AI recommendations and start your first vote by posting it.",
    },
  ],
  [
    "이 투표는 이성만 참여할 수 있어요. 상단에서 내 성별을 선택했는지 확인해 주세요.",
    {
      zh: "此投票仅限异性参与。请确认已在顶部选择自己的性别。",
      ja: "この投票は異性のみ参加できます。上部で自分の性別を選択しているか確認してください。",
      en: "Only the opposite sex can join this vote. Make sure you've selected your gender at the top.",
    },
  ],
  [
    "이미 종료되었거나 찾을 수 없는 투표예요.",
    {
      zh: "该投票已结束或无法找到。",
      ja: "すでに終了しているか、見つからない投票です。",
      en: "This vote has ended or can't be found.",
    },
  ],
  [
    "투표 목록을 불러오지 못했습니다.",
    {
      zh: "未能加载投票列表。",
      ja: "投票リストを読み込めませんでした。",
      en: "Couldn't load the vote list.",
    },
  ],
  [
    "투표 처리 중 오류가 발생했습니다.",
    {
      zh: "处理投票时发生错误。",
      ja: "投票処理中にエラーが発生しました。",
      en: "An error occurred while processing the vote.",
    },
  ],
  [
    "투표를 불러오는 중입니다.",
    {
      zh: "正在加载投票。",
      ja: "投票を読み込んでいます。",
      en: "Loading the vote.",
    },
  ],
  [
    "투표를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    {
      zh: "未能保存投票。请稍后再试。",
      ja: "投票を保存できませんでした。しばらくしてからもう一度お試しください。",
      en: "Couldn't save your vote. Please try again shortly.",
    },
  ],
  [
    "투표하려면 로그인해 주세요.",
    {
      zh: "投票需要登录。",
      ja: "投票するにはログインしてください。",
      en: "Please log in to vote.",
    },
  ],
  [
    "보통",
    {
      zh: "一般",
      ja: "普通",
      en: "Fair",
    },
  ],
  [
    "분석은 가능하지만, 조금 더 가까운 사진이면 더 정확해요.",
    {
      zh: "可以进行分析，但拍得更近一些会更准确。",
      ja: "分析は可能ですが、もう少し近い写真の方がより正確です。",
      en: "Analysis is possible, but a closer photo would be more accurate.",
    },
  ],
  [
    "얼굴이 감지되지 않았어요",
    {
      zh: "未检测到面部",
      ja: "顔が検出されませんでした",
      en: "No face detected",
    },
  ],
  [
    "얼굴이 너무 작아요. 더 가까이서 찍은 사진을 추천합니다.",
    {
      zh: "面部太小了。建议拍摄更近距离的照片。",
      ja: "顔が小さすぎます。もっと近くで撮った写真をおすすめします。",
      en: "Your face is too small. We recommend a closer photo.",
    },
  ],
  [
    "얼굴이 또렷하게 잘 나왔어요.",
    {
      zh: "面部拍得很清晰。",
      ja: "顔がはっきりと写っています。",
      en: "Your face is clear and well captured.",
    },
  ],
  [
    "얼굴이 작게 나왔어요",
    {
      zh: "面部拍得较小",
      ja: "顔が小さく写っています",
      en: "Your face appears small",
    },
  ],
  [
    "적합",
    {
      zh: "合适",
      ja: "適合",
      en: "Suitable",
    },
  ],
  [
    "정면이 잘 보이는 사진으로 교체를 추천합니다.",
    {
      zh: "建议换一张能清楚看到正脸的照片。",
      ja: "正面がよく見える写真への変更をおすすめします。",
      en: "We recommend a photo with a clearer front-facing view.",
    },
  ],
  [
    "반복 상담, 코디 확장 기능 테스트까지 고려한 패키지입니다.",
    {
      zh: "该套餐还考虑了重复咨询和穿搭扩展功能测试。",
      ja: "繰り返しの相談や、コーディネート拡張機能のテストまで考慮したパッケージです。",
      en: "A package designed for repeat consultations and testing the styling add-on feature.",
    },
  ],
  [
    "스타일 추천 13회",
    {
      zh: "13次风格推荐",
      ja: "スタイルおすすめ13回",
      en: "13 style recommendations",
    },
  ],
  [
    "스타일 추천 1회",
    {
      zh: "1次风格推荐",
      ja: "スタイルおすすめ1回",
      en: "1 style recommendation",
    },
  ],
  [
    "스타일 추천 20회",
    {
      zh: "20次风格推荐",
      ja: "スタイルおすすめ20回",
      en: "20 style recommendations",
    },
  ],
  [
    "스타일 추천 27회",
    {
      zh: "27次风格推荐",
      ja: "スタイルおすすめ27回",
      en: "27 style recommendations",
    },
  ],
  [
    "스타일 추천 34회",
    {
      zh: "34次风格推荐",
      ja: "スタイルおすすめ34回",
      en: "34 style recommendations",
    },
  ],
  [
    "스타일 추천 6회",
    {
      zh: "6次风格推荐",
      ja: "スタイルおすすめ6回",
      en: "6 style recommendations",
    },
  ],
  [
    "헤어 추천에 코디 조언을 붙여 더 구체적인 상담 자료를 만듭니다.",
    {
      zh: "在发型推荐基础上加入穿搭建议，打造更具体的咨询资料。",
      ja: "ヘアスタイルのおすすめにコーディネートアドバイスを加え、より具体的な相談資料を作成します。",
      en: "Adds styling advice to your hair recommendation for more detailed consultation material.",
    },
  ],
  [
    "70대",
    {
      zh: "70多岁",
      ja: "70代",
      en: "70s",
    },
  ],
  [
    "서울",
    {
      zh: "首尔",
      ja: "ソウル",
      en: "Seoul",
    },
  ],
  [
    "세대별",
    {
      zh: "按世代",
      ja: "世代別",
      en: "By generation",
    },
  ],
  [
    "느낌 메모 · 레퍼런스",
    {
      zh: "感觉备注 · 参考",
      ja: "イメージメモ · リファレンス",
      en: "Mood notes · References",
    },
  ],
  [
    "스타일 추천 결과",
    {
      zh: "风格推荐结果",
      ja: "スタイルおすすめ結果",
      en: "Style recommendation results",
    },
  ],
  [
    "요약",
    {
      zh: "摘要",
      ja: "要約",
      en: "Summary",
    },
  ],
  [
    "요약 · 추천 받기",
    {
      zh: "摘要 · 获取推荐",
      ja: "要約 · おすすめを受ける",
      en: "Summary · Get recommendation",
    },
  ],
  [
    "추천 목적 · 스타일",
    {
      zh: "推荐目的 · 风格",
      ja: "おすすめ目的 · スタイル",
      en: "Purpose · Style",
    },
  ],
  [
    "컬러",
    {
      zh: "颜色",
      ja: "カラー",
      en: "Color",
    },
  ],
  [
    "문제가 발생했어요",
    {
      zh: "出错了",
      ja: "問題が発生しました",
      en: "Something went wrong",
    },
  ],
  [
    "잠시 후 다시 시도해 주세요.",
    {
      zh: "请稍后再试。",
      ja: "しばらくしてからもう一度お試しください。",
      en: "Please try again in a moment.",
    },
  ],
  [
    "다시 시도",
    {
      zh: "重试",
      ja: "再試行",
      en: "Try again",
    },
  ],
  [
    "일시적인 오류가 발생했어요",
    {
      zh: "发生了临时错误",
      ja: "一時的なエラーが発生しました",
      en: "A temporary error occurred",
    },
  ],
  [
    "미리룩에서 예상치 못한 문제가 생겼습니다.",
    {
      zh: "Miri Look 发生了意外问题。",
      ja: "Miri Look で予期しない問題が発生しました。",
      en: "An unexpected problem occurred in Miri Look.",
    },
  ],
  [
    "홈으로 가기",
    {
      zh: "返回首页",
      ja: "ホームへ",
      en: "Go to home",
    },
  ],
  [
    "페이지를 찾을 수 없어요",
    {
      zh: "找不到页面",
      ja: "ページが見つかりません",
      en: "Page not found",
    },
  ],
  [
    "주소가 바뀌었거나 삭제된 페이지일 수 있어요.",
    {
      zh: "网址可能已更改，或页面已被删除。",
      ja: "アドレスが変わったか、削除されたページの可能性があります。",
      en: "The address may have changed, or the page may have been deleted.",
    },
  ],
  [
    "홈으로",
    {
      zh: "回首页",
      ja: "ホームへ",
      en: "Home",
    },
  ],
  [
    "Hair Money는 미리룩의 헤어 추천과 이미지 생성 기능을 사용하는 유상 포인트입니다. 결제 검증이 완료되면 회원 계정에 적립되고, 추천 요청 시 사용량이 자동 차감되어 내역으로 기록됩니다.",
    {
      zh: "Hair Money 是用于 Miri Look 发型推荐和图像生成功能的付费积分。支付验证完成后会积存到会员账户，发起推荐请求时使用量会自动扣除并记录在明细中。",
      ja: "Hair Money は Miri Look のヘア推薦と画像生成機能を利用する有料ポイントです。決済の検証が完了すると会員アカウントに積み立てられ、推薦リクエスト時に使用量が自動的に差し引かれ、履歴として記録されます。",
      en: "Hair Money is a paid point used for Miri Look's hair recommendation and image generation features. Once payment is verified, it is credited to your member account, and usage is automatically deducted and recorded in your history when you request a recommendation.",
    },
  ],
  [
    "계정 삭제",
    {
      zh: "删除账户",
      ja: "アカウント削除",
      en: "Delete account",
    },
  ],
  [
    "계정과 업로드한 얼굴 사진, 상담 결과가 삭제됩니다. 되돌릴 수 없습니다.",
    {
      zh: "账户及上传的面部照片、咨询结果将被删除。此操作无法撤销。",
      ja: "アカウントとアップロードした顔写真、相談結果が削除されます。元に戻せません。",
      en: "Your account, uploaded face photos, and consultation results will be deleted. This cannot be undone.",
    },
  ],
  [
    "· 남는 항목: 커뮤니티 글·댓글은",
    {
      zh: "· 保留项目：社区帖子和评论将保留为",
      ja: "· 残る項目：コミュニティの投稿・コメントは",
      en: "· Remaining items: community posts and comments remain as ",
    },
  ],
  [
    "작성자 정보가 지워진 익명 상태",
    {
      zh: "已抹去作者信息的匿名状态",
      ja: "投稿者情報が消された匿名状態",
      en: "an anonymous state with the author's information removed",
    },
  ],
  [
    "로 남습니다.",
    {
      zh: "。",
      ja: "として残ります。",
      en: ".",
    },
  ],
  [
    "· 결제·환불 기록은 법령상 보관 의무가 있는 범위에서 보존될 수 있습니다.",
    {
      zh: "· 支付和退款记录可能会在法律规定的保存义务范围内予以保留。",
      ja: "· 決済・返金の記録は、法令上の保管義務がある範囲で保存される場合があります。",
      en: "· Payment and refund records may be retained to the extent required by law.",
    },
  ],
  [
    "· ⚠️ 보유한",
    {
      zh: "· ⚠️ 您持有的 ",
      ja: "· ⚠️ 保有している ",
      en: "· ⚠️ The ",
    },
  ],
  [
    "되며 환불되지 않습니다.",
    {
      zh: " 将被清除且不予退款。",
      ja: " は消滅し、返金されません。",
      en: " you hold will be forfeited and will not be refunded.",
    },
  ],
  [
    "정말 삭제하려면 계정 이메일",
    {
      zh: "若确实要删除，请输入账户邮箱 ",
      ja: "本当に削除するにはアカウントのメールアドレス ",
      en: "To really delete, type your account email ",
    },
  ],
  [
    "을 입력하세요.",
    {
      zh: "。",
      ja: "を入力してください。",
      en: ".",
    },
  ],
  [
    "계정 삭제하기",
    {
      zh: "删除账户",
      ja: "アカウントを削除する",
      en: "Delete account",
    },
  ],
  [
    "둘러보기",
    {
      zh: "随便看看",
      ja: "見て回る",
      en: "Browse",
    },
  ],
  [
    "회원가입하고 시작하기",
    {
      zh: "注册并开始",
      ja: "会員登録して始める",
      en: "Sign up and get started",
    },
  ],
  [
    "주요 메뉴",
    {
      zh: "主要菜单",
      ja: "主なメニュー",
      en: "Main menu",
    },
  ],
  [
    "생성 실패·결제·환불·계정 문의를 접수합니다. 스크린샷을 함께 첨부하면 확인이 빨라집니다.",
    {
      zh: "受理生成失败、支付、退款、账户相关咨询。一并附上截图可加快确认。",
      ja: "生成失敗・決済・返金・アカウントに関するお問い合わせを受け付けます。スクリーンショットを添付いただくと確認が早くなります。",
      en: "We handle inquiries about generation failures, payments, refunds, and accounts. Attaching a screenshot helps us respond faster.",
    },
  ],
  [
    "고객 문의",
    {
      zh: "客户咨询",
      ja: "お問い合わせ",
      en: "Contact support",
    },
  ],
  [
    "충전 전 필수 확인",
    {
      zh: "充值前必读",
      ja: "チャージ前の必須確認事項",
      en: "Must-read before charging",
    },
  ],
  [
    "입니다. 기간이 지나면 소멸될 수 있습니다.",
    {
      zh: "。超过期限后可能会失效。",
      ja: "です。期間が過ぎると失効する場合があります。",
      en: ". It may expire once the period passes.",
    },
  ],
  [
    "· 구매·환불은",
    {
      zh: "· 购买和退款遵循 ",
      ja: "· 購入・返金は ",
      en: "· Purchases and refunds follow the ",
    },
  ],
  [
    "Google Play 결제 정책",
    {
      zh: "Google Play 支付政策",
      ja: "Google Play の決済ポリシー",
      en: "Google Play payment policy",
    },
  ],
  [
    "을 따르며, 환불은 Google Play 주문내역에서 신청할 수 있습니다.",
    {
      zh: "，退款可在 Google Play 订单记录中申请。",
      ja: "に従い、返金は Google Play の注文履歴から申請できます。",
      en: ", and refunds can be requested from your Google Play order history.",
    },
  ],
  [
    "· 환불은",
    {
      zh: "· 退款仅可退回至",
      ja: "· 返金は",
      en: "· Refunds are only possible to the ",
    },
  ],
  [
    "최초 결제하신 결제수단",
    {
      zh: "最初支付时使用的支付方式",
      ja: "最初に決済された決済手段",
      en: "payment method you originally paid with",
    },
  ],
  [
    "(카드 등)으로만 가능합니다.",
    {
      zh: "（银行卡等）。",
      ja: "（カードなど）でのみ可能です。",
      en: " (card, etc.).",
    },
  ],
  [
    "· 구매 후",
    {
      zh: "· 购买后",
      ja: "· 購入後",
      en: "· After purchase, ",
    },
  ],
  [
    "7일 이내",
    {
      zh: "7日内",
      ja: "7日以内",
      en: "within 7 days,",
    },
  ],
  [
    "사용하지 않은 Hair Money는 청약철회(취소·환불)할 수 있습니다.",
    {
      zh: "未使用的 Hair Money 可撤销购买（取消·退款）。",
      ja: "使用していない Hair Money はクーリングオフ（キャンセル・返金）できます。",
      en: " any unused Hair Money can be withdrawn (canceled and refunded).",
    },
  ],
  [
    "사용처 및 사용 규칙",
    {
      zh: "使用范围及使用规则",
      ja: "利用先および利用ルール",
      en: "Where and how it's used",
    },
  ],
  [
    "Hair Money는 미리룩의 유료 기능에 사용합니다 — 헤어스타일 추천, AI 상담용 이미지(9방향) 생성, 코디 추천 등.",
    {
      zh: "Hair Money 用于 Miri Look 的付费功能——发型推荐、AI 咨询用图像（9个方向）生成、穿搭推荐等。",
      ja: "Hair Money は Miri Look の有料機能に使用します — ヘアスタイル推薦、AI 相談用画像（9方向）生成、コーデ推薦など。",
      en: "Hair Money is used for Miri Look's paid features — hairstyle recommendations, AI consultation image (9-direction) generation, outfit recommendations, and more.",
    },
  ],
  [
    "결제 승인·금액·통화가 모두 맞을 때만 계정 지갑에 적립되며, 사용·적립 내역은 마이페이지에서 확인할 수 있습니다.",
    {
      zh: "仅当支付授权、金额、货币全部一致时才会积存到账户钱包，使用和积存记录可在我的页面中查看。",
      ja: "決済承認・金額・通貨がすべて一致した場合のみアカウントウォレットに積み立てられ、使用・積立履歴はマイページで確認できます。",
      en: "It is credited to your account wallet only when the payment approval, amount, and currency all match, and your usage and credit history can be viewed on My Page.",
    },
  ],
  [
    "· 구매·환불은 Google Play 결제 정책을 따르며, 환불은 Google Play 주문내역에서 신청할 수 있습니다.",
    {
      zh: "· 购买和退款遵循 Google Play 支付政策，退款可在 Google Play 订单记录中申请。",
      ja: "· 購入・返金は Google Play の決済ポリシーに従い、返金は Google Play の注文履歴から申請できます。",
      en: "· Purchases and refunds follow the Google Play payment policy, and refunds can be requested from your Google Play order history.",
    },
  ],
  [
    "· 구매 후 7일 이내 사용하지 않은 유상 Hair Money는 청약철회(취소)하여 환불받을 수 있습니다.",
    {
      zh: "· 购买后 7 日内未使用的付费 Hair Money 可撤销购买（取消）并获得退款。",
      ja: "· 購入後 7 日以内に使用していない有料 Hair Money はクーリングオフ（キャンセル）して返金を受けられます。",
      en: "· Paid Hair Money not used within 7 days of purchase can be canceled (withdrawn) for a refund.",
    },
  ],
  [
    "· 환불은 최초 결제하신 결제수단(카드 등)으로만 이루어집니다.",
    {
      zh: "· 退款仅退回至最初支付时使用的支付方式（银行卡等）。",
      ja: "· 返金は最初に決済された決済手段（カードなど）でのみ行われます。",
      en: "· Refunds are made only to the original payment method (card, etc.).",
    },
  ],
  [
    "· 부정 결제, 중복 결제, 미성년자 결제 등은 결제 내역과 운영 정책에 따라 별도로 확인합니다.",
    {
      zh: "· 对于欺诈支付、重复支付、未成年人支付等，将根据支付记录和运营政策另行核实。",
      ja: "· 不正決済、重複決済、未成年者の決済などは、決済履歴と運営ポリシーに従って別途確認します。",
      en: "· Fraudulent payments, duplicate payments, payments by minors, and similar cases are reviewed separately according to payment records and operating policy.",
    },
  ],
  [
    "· 부정 결제, 중복 결제, 미성년자 결제 등은 카드 결제 내역과 운영 정책에 따라 별도로 확인합니다.",
    {
      zh: "· 对于欺诈支付、重复支付、未成年人支付等，将根据卡片支付记录和运营政策另行核实。",
      ja: "· 不正決済、重複決済、未成年者の決済などは、カード決済履歴と運営ポリシーに従って別途確認します。",
      en: "· Fraudulent payments, duplicate payments, payments by minors, and similar cases are reviewed separately according to card payment records and operating policy.",
    },
  ],
  [
    "취소·환불·교환 정책",
    {
      zh: "取消·退款·换货政策",
      ja: "キャンセル・返金・交換ポリシー",
      en: "Cancellation, refund, and exchange policy",
    },
  ],
  [
    "에서 확인하실 수 있습니다.",
    {
      zh: "中即可查看。",
      ja: "でご確認いただけます。",
      en: " — see it for details.",
    },
  ],
  [
    "안내",
    {
      zh: "提示",
      ja: "お知らせ",
      en: "Notice",
    },
  ],
  [
    "브라우저로 열어주세요",
    {
      zh: "请用浏览器打开",
      ja: "ブラウザで開いてください",
      en: "Please open in a browser",
    },
  ],
  [
    "지금",
    {
      zh: "目前，在 ",
      ja: "現在、",
      en: "Right now, in ",
    },
  ],
  [
    "카카오톡 등 앱 안의 브라우저",
    {
      zh: "KakaoTalk 等应用内浏览器",
      ja: "カカオトークなどアプリ内ブラウザ",
      en: "an in-app browser (such as KakaoTalk)",
    },
  ],
  [
    "구글 로그인·회원가입이 정상 저장되지 않아요.",
    {
      zh: "中，Google 登录和注册无法正常保存。",
      ja: "では、Google ログイン・会員登録が正しく保存されません。",
      en: ", Google login and sign-up may not be saved correctly.",
    },
  ],
  [
    "외부 브라우저로 열기",
    {
      zh: "用外部浏览器打开",
      ja: "外部ブラウザで開く",
      en: "Open in external browser",
    },
  ],
  [
    "오른쪽 위",
    {
      zh: "点击右上角的 ",
      ja: "右上の",
      en: "At the top right, tap ",
    },
  ],
  [
    "“Safari로 열기”",
    {
      zh: "“用 Safari 打开”",
      ja: "“Safari で開く”",
      en: "“Open in Safari”",
    },
  ],
  [
    "를 눌러주세요.",
    {
      zh: "。",
      ja: "を押してください。",
      en: ".",
    },
  ],
  [
    "“다른 브라우저로 열기”",
    {
      zh: "“用其他浏览器打开”",
      ja: "“別のブラウザで開く”",
      en: "“Open in another browser”",
    },
  ],
  [
    "링크가 복사됐어요",
    {
      zh: "链接已复制",
      ja: "リンクをコピーしました",
      en: "Link copied",
    },
  ],
  [
    "링크 복사 (브라우저에 붙여넣기)",
    {
      zh: "复制链接（粘贴到浏览器）",
      ja: "リンクをコピー（ブラウザに貼り付け）",
      en: "Copy link (paste into browser)",
    },
  ],
  [
    "그냥 여기서 계속 둘러볼게요",
    {
      zh: "就在这里继续浏览",
      ja: "このままここで見て回ります",
      en: "Just keep browsing here",
    },
  ],
  [
    "회원가입/로그인",
    {
      zh: "注册/登录",
      ja: "会員登録/ログイン",
      en: "Sign up / Log in",
    },
  ],
  [
    "기기 알림을 켜면 앱을 닫아둬도 추천 완료·결제·커뮤니티 소식을 알려드려요.",
    {
      zh: "开启设备通知后，即使关闭应用，也会通知您推荐完成、支付和社区动态。",
      ja: "デバイス通知をオンにすると、アプリを閉じていても推薦完了・決済・コミュニティのお知らせをお届けします。",
      en: "Turn on device notifications and we'll let you know about completed recommendations, payments, and community updates even when the app is closed.",
    },
  ],
  [
    "기기 알림",
    {
      zh: "设备通知",
      ja: "デバイス通知",
      en: "Device notifications",
    },
  ],
  [
    "계정 정보를 불러오는 중입니다.",
    {
      zh: "正在加载账户信息。",
      ja: "アカウント情報を読み込んでいます。",
      en: "Loading account information.",
    },
  ],
  [
    "새 비밀번호",
    {
      zh: "新密码",
      ja: "新しいパスワード",
      en: "New password",
    },
  ],
  [
    "새 비밀번호 확인",
    {
      zh: "确认新密码",
      ja: "新しいパスワードの確認",
      en: "Confirm new password",
    },
  ],
  [
    "한 번 더 입력",
    {
      zh: "再输入一次",
      ja: "もう一度入力",
      en: "Enter again",
    },
  ],
  [
    "H머니",
    {
      zh: "Hair Money",
      ja: "Hair Money",
      en: "Hair Money",
    },
  ],
  [
    "현재 보유 H머니와 추천·상담 생성에 사용한 이력을 관리합니다.",
    {
      zh: "管理当前持有的 Hair Money 以及用于推荐和咨询生成的使用记录。",
      ja: "現在保有している Hair Money と、推薦・相談生成に使用した履歴を管理します。",
      en: "Manage your current Hair Money balance and your history of usage for recommendations and consultations.",
    },
  ],
  [
    "H머니 충전",
    {
      zh: "充值 Hair Money",
      ja: "Hair Money をチャージ",
      en: "Charge Hair Money",
    },
  ],
  [
    "H머니 사용내역",
    {
      zh: "Hair Money 使用记录",
      ja: "Hair Money 利用履歴",
      en: "Hair Money usage history",
    },
  ],
  [
    "아직 H머니 적립/사용 이력이 없습니다. H머니를 충전하거나 추천을 요청하면 이곳에 기록됩니다.",
    {
      zh: "目前还没有 Hair Money 的积存/使用记录。充值 Hair Money 或发起推荐后，将记录在此处。",
      ja: "まだ Hair Money の積立/利用履歴がありません。Hair Money をチャージするか推薦をリクエストすると、ここに記録されます。",
      en: "You don't have any Hair Money credit/usage history yet. Once you charge Hair Money or request a recommendation, it will be recorded here.",
    },
  ],
  [
    "H머니 이용·환불 안내",
    {
      zh: "Hair Money 使用·退款说明",
      ja: "Hair Money 利用・返金のご案内",
      en: "Hair Money usage and refund guide",
    },
  ],
  [
    "· 사용처: 헤어스타일 추천, AI 상담용 이미지(9방향) 생성, 코디 추천 등 미리룩 유료 기능.",
    {
      zh: "· 使用范围：发型推荐、AI 咨询用图像（9个方向）生成、穿搭推荐等 Miri Look 付费功能。",
      ja: "· 利用先：ヘアスタイル推薦、AI 相談用画像（9方向）生成、コーデ推薦など Miri Look の有料機能。",
      en: "· Where it's used: Miri Look paid features such as hairstyle recommendations, AI consultation image (9-direction) generation, and outfit recommendations.",
    },
  ],
  [
    "· 사용기간(유효기간): 충전한 유상 H머니는 충전일로부터 1년.",
    {
      zh: "· 使用期限（有效期）：充值的付费 Hair Money 自充值之日起 1 年。",
      ja: "· 利用期間（有効期限）：チャージした有料 Hair Money はチャージ日から 1 年。",
      en: "· Usage period (validity): charged paid Hair Money is valid for 1 year from the charge date.",
    },
  ],
  [
    "· 구매 후 7일 이내 사용하지 않은 유상 H머니는 청약철회(취소·환불)할 수 있습니다.",
    {
      zh: "· 购买后 7 日内未使用的付费 Hair Money 可撤销购买（取消·退款）。",
      ja: "· 購入後 7 日以内に使用していない有料 Hair Money はクーリングオフ（キャンセル・返金）できます。",
      en: "· Paid Hair Money not used within 7 days of purchase can be withdrawn (canceled and refunded).",
    },
  ],
  [
    "· 환불은 최초 결제하신 결제수단(카드 등)으로만 가능합니다.",
    {
      zh: "· 退款仅可退回至最初支付时使用的支付方式（银行卡等）。",
      ja: "· 返金は最初に決済された決済手段（カードなど）でのみ可能です。",
      en: "· Refunds are only possible to the original payment method (card, etc.).",
    },
  ],
  [
    "H머니 스토어",
    {
      zh: "Hair Money 商店",
      ja: "Hair Money ストア",
      en: "Hair Money store",
    },
  ],
  [
    "에서 확인할 수 있습니다.",
    {
      zh: "中即可查看。",
      ja: "で確認できます。",
      en: " — check there for details.",
    },
  ],
  [
    "현재 보유",
    {
      zh: "当前持有",
      ja: "現在の保有",
      en: "Current balance",
    },
  ],
  [
    "누적 사용",
    {
      zh: "累计使用",
      ja: "累計使用",
      en: "Total used",
    },
  ],
  [
    "총 적립",
    {
      zh: "总积存",
      ja: "累計積立",
      en: "Total earned",
    },
  ],
  [
    "가입하면 내 얼굴에 어울리는",
    {
      zh: "注册即可获得适合我脸型的",
      ja: "登録すると自分の顔に似合う",
      en: "Sign up and you'll get styles that suit your face, ",
    },
  ],
  [
    "스타일 9개를 바로 받아볼 수 있어요",
    {
      zh: "9 款发型，即刻呈现。",
      ja: "スタイルを 9 個すぐに受け取れます。",
      en: "9 of them right away.",
    },
  ],
  [
    "이미 회원이에요 · 로그인",
    {
      zh: "已经是会员了 · 登录",
      ja: "すでに会員です · ログイン",
      en: "Already a member · Log in",
    },
  ],
  [
    "마음에 드는 스타일을 고르면 상담용 9장을 만들 수 있어요. 각 이미지의 저장 버튼으로 개별 저장도 가능해요.",
    {
      zh: "选择喜欢的发型后，即可生成 9 张咨询用图像。也可以通过每张图像的保存按钮单独保存。",
      ja: "気に入ったスタイルを選ぶと、相談用の 9 枚を作成できます。各画像の保存ボタンで個別保存も可能です。",
      en: "Pick a style you like and you can create 9 consultation images. You can also save each one individually with its save button.",
    },
  ],
  [
    "추천 이미지 9장 3x3 한 장으로 저장하기",
    {
      zh: "将 9 张推荐图像保存为一张 3x3 网格图",
      ja: "推薦画像 9 枚を 3x3 の 1 枚として保存",
      en: "Save 9 recommended images as one 3x3 grid",
    },
  ],
  [
    "추천 9장을 3x3 바둑판 한 장으로 저장",
    {
      zh: "将 9 张推荐图像保存为一张 3x3 网格图",
      ja: "推薦 9 枚を 3x3 グリッド 1 枚として保存",
      en: "Save 9 recommendations as one 3x3 grid",
    },
  ],
  [
    "사진 9장을 각각 한 장씩 저장",
    {
      zh: "将 9 张照片逐张分别保存",
      ja: "写真 9 枚をそれぞれ 1 枚ずつ保存",
      en: "Save each of the 9 photos individually",
    },
  ],
  [
    "사진 9장을 3x3 바둑판 한 장으로 저장",
    {
      zh: "将 9 张照片保存为一张 3x3 网格图",
      ja: "写真 9 枚を 3x3 グリッド 1 枚として保存",
      en: "Save 9 photos as one 3x3 grid",
    },
  ],
  [
    "크게 보기",
    {
      zh: "放大查看",
      ja: "拡大表示",
      en: "View larger",
    },
  ],
  [
    "구글 렌즈로 검색",
    {
      zh: "用 Google Lens 搜索",
      ja: "Google レンズで検索",
      en: "Search with Google Lens",
    },
  ],
  [
    "생성 실패·결제 오류 화면을 캡처해 올리면 확인이 훨씬 빨라집니다.",
    {
      zh: "截取生成失败或支付错误的画面并上传，可大幅加快确认速度。",
      ja: "生成失敗・決済エラーの画面をキャプチャしてアップロードいただくと、確認がずっと早くなります。",
      en: "Capturing and uploading the generation failure or payment error screen makes it much faster for us to look into it.",
    },
  ],
  [
    "이미지",
    {
      zh: "图像",
      ja: "画像",
      en: "Image",
    },
  ],
  [
    "첨부 이미지 삭제",
    {
      zh: "删除附件图像",
      ja: "添付画像を削除",
      en: "Remove attached image",
    },
  ],
  [
    "내 얼굴에 어울리는 헤어스타일을 추천받아보세요.",
    {
      zh: "获取适合你脸型的发型推荐。",
      ja: "あなたの顔に似合うヘアスタイルをおすすめします。",
      en: "Get hairstyle recommendations that suit your face.",
    },
  ],
  [
    "Get personalized hairstyle recommendations for your face.",
    {
      zh: "获取适合你脸型的个性化发型推荐。",
      ja: "あなたの顔に合わせたパーソナルなヘアスタイル提案を受けられます。",
      en: "Get personalized hairstyle recommendations for your face.",
    },
  ],
  [
    "내 사진을 올리고, 헤어스타일을 추천받고, 미용사에게 더 고품질의 서비스를 받아보세요.",
    {
      zh: "上传你的照片，获取发型推荐，并让发型师提供更高质量的服务。",
      ja: "写真をアップロードしてヘアスタイル提案を受け、美容師からより高品質なサービスを受けましょう。",
      en: "Upload your photos, get hairstyle recommendations, and give your stylist a clearer reference.",
    },
  ],
  [
    "Upload your photos, preview your style, and give your stylist a clearer reference.",
    {
      zh: "上传照片、预览造型，并为发型师提供更清晰的参考。",
      ja: "写真をアップロードし、スタイルを確認して、美容師により明確な参考資料を渡せます。",
      en: "Upload your photos, preview your style, and give your stylist a clearer reference.",
    },
  ],
  [
    "사진",
    { zh: "照片", ja: "写真", en: "Photos" },
  ],
  [
    "선호",
    { zh: "偏好", ja: "好み", en: "Preferences" },
  ],
  [
    "추천",
    { zh: "推荐", ja: "おすすめ", en: "Recommendations" },
  ],
  [
    "선택",
    { zh: "选择", ja: "選択", en: "Select" },
  ],
  [
    "상담 보드",
    { zh: "咨询板", ja: "相談ボード", en: "Consultation Board" },
  ],
  [
    "히스토리",
    { zh: "历史", ja: "履歴", en: "History" },
  ],
  [
    "미용실",
    { zh: "美发店", ja: "美容室", en: "Salons" },
  ],
  [
    "커뮤니티",
    { zh: "社区", ja: "コミュニティ", en: "Community" },
  ],
  [
    "투표",
    { zh: "投票", ja: "投票", en: "Votes" },
  ],
  [
    "스토어",
    { zh: "商店", ja: "ストア", en: "Store" },
  ],
  [
    "1 Hair Money = 550원 (VAT 포함)",
    {
      zh: "1 Hair Money = 550韩元（含VAT）",
      ja: "1 Hair Money = 550ウォン（税込）",
      en: "1 Hair Money = KRW 550 (VAT included)",
    },
  ],
  [
    "로그인",
    { zh: "登录", ja: "ログイン", en: "Log In" },
  ],
  [
    "로그아웃",
    { zh: "退出登录", ja: "ログアウト", en: "Log Out" },
  ],
  [
    "마이페이지",
    { zh: "我的页面", ja: "マイページ", en: "My Page" },
  ],
  [
    "좌측면 사진",
    { zh: "左侧照片", ja: "左側写真", en: "Left-side Photo" },
  ],
  [
    "정면 사진",
    { zh: "正面照片", ja: "正面写真", en: "Front Photo" },
  ],
  [
    "우측면 사진",
    { zh: "右侧照片", ja: "右側写真", en: "Right-side Photo" },
  ],
  [
    "파일 선택",
    { zh: "选择文件", ja: "ファイルを選択", en: "Choose File" },
  ],
  [
    "다시 업로드",
    { zh: "重新上传", ja: "再アップロード", en: "Upload Again" },
  ],
  [
    "최소 2장 필요: 좌측면, 정면, 우측면 중 2장을 업로드해 주세요.",
    {
      zh: "至少需要2张：请上传左侧、正面、右侧中的2张。",
      ja: "最低2枚必要：左側・正面・右側のうち2枚をアップロードしてください。",
      en: "At least 2 photos required: upload any 2 of left, front, and right-side photos.",
    },
  ],
  [
    "3장을 모두 올리면 얼굴 방향과 두상 정보를 더 정확하게 반영합니다.",
    {
      zh: "上传3张照片可以更准确地反映面部方向和头型信息。",
      ja: "3枚すべてをアップロードすると、顔の向きと頭の形をより正確に反映できます。",
      en: "Uploading all 3 photos improves face direction and head-shape accuracy.",
    },
  ],
  [
    "원하는 헤어컷",
    { zh: "想要的发型", ja: "希望するヘアカット", en: "Preferred Haircuts" },
  ],
  [
    "원하는 헤어 컬러",
    { zh: "想要的发色", ja: "希望するヘアカラー", en: "Preferred Hair Color" },
  ],
  [
    "원하는 느낌 메모",
    { zh: "想要的氛围备注", ja: "希望イメージのメモ", en: "Style Memo" },
  ],
  [
    "스타일 추천 받기",
    { zh: "获取风格推荐", ja: "スタイル提案を受ける", en: "Get Style Recommendations" },
  ],
  [
    "추천 결과",
    { zh: "推荐结果", ja: "おすすめ結果", en: "Recommendation Results" },
  ],
  [
    "상담용 9장 생성하기",
    { zh: "生成9张咨询用图片", ja: "相談用9枚を生成", en: "Generate 9 Consultation Images" },
  ],
  [
    "코디 추천",
    { zh: "穿搭推荐", ja: "コーデ提案", en: "Outfit Recommendation" },
  ],
  [
    "메이크업 스타일",
    { zh: "妆容风格", ja: "メイクスタイル", en: "Makeup Style" },
  ],
  [
    "내 최근 히스토리",
    { zh: "我的最近历史", ja: "最近の履歴", en: "My Recent History" },
  ],
  [
    "남성",
    { zh: "男性", ja: "男性", en: "Male" },
  ],
  [
    "여성",
    { zh: "女性", ja: "女性", en: "Female" },
  ],
  [
    "남성 모드",
    { zh: "男性模式", ja: "男性モード", en: "Male Mode" },
  ],
  [
    "여성 모드",
    { zh: "女性模式", ja: "女性モード", en: "Female Mode" },
  ],
  [
    "선택한 컷",
    { zh: "已选发型", ja: "選択したカット", en: "Selected Haircuts" },
  ],
  [
    "선택한 것",
    { zh: "已选择", ja: "選択済み", en: "Selected" },
  ],
  [
    "추천 기준",
    { zh: "推荐标准", ja: "おすすめ基準", en: "Recommendation Criteria" },
  ],
  [
    "헤어컷",
    { zh: "发型", ja: "ヘアカット", en: "Haircut" },
  ],
  [
    "헤어 컬러",
    { zh: "发色", ja: "ヘアカラー", en: "Hair Color" },
  ],
  [
    "현재 기장으로 가능한 스타일",
    { zh: "当前长度可实现的风格", ja: "現在の長さで可能なスタイル", en: "Styles Possible With Current Length" },
  ],
  [
    "얼굴에 어울리는 스타일",
    { zh: "适合脸型的风格", ja: "顔に似合うスタイル", en: "Styles That Suit Your Face" },
  ],
  [
    "회원 ID 검색",
    { zh: "会员ID搜索", ja: "会員ID検索", en: "Member ID Search" },
  ],
  [
    "닉네임, ID, 자기소개로 회원을 찾고 바로 DM을 보낼 수 있습니다.",
    {
      zh: "可通过昵称、ID、自我介绍查找会员并直接发送DM。",
      ja: "ニックネーム、ID、自己紹介から会員を探してすぐDMできます。",
      en: "Find members by nickname, ID, or bio and send a DM instantly.",
    },
  ],
  [
    "검색",
    { zh: "搜索", ja: "検索", en: "Search" },
  ],
  [
    "DM 대화함",
    { zh: "DM聊天", ja: "DM受信箱", en: "DM Inbox" },
  ],
  [
    "새로고침",
    { zh: "刷新", ja: "更新", en: "Refresh" },
  ],
  [
    "답장 보내기",
    { zh: "发送回复", ja: "返信を送る", en: "Send Reply" },
  ],
  [
    "DM 보내기",
    { zh: "发送DM", ja: "DMを送る", en: "Send DM" },
  ],
  [
    "메시지 입력",
    { zh: "输入消息", ja: "メッセージを入力", en: "Enter message" },
  ],
  [
    "답장 입력",
    { zh: "输入回复", ja: "返信を入力", en: "Enter reply" },
  ],
  [
    "로그인하면 회원 간 DM 대화함을 사용할 수 있습니다.",
    {
      zh: "登录后可使用会员之间的DM聊天。",
      ja: "ログインすると会員間DMを利用できます。",
      en: "Log in to use member-to-member DMs.",
    },
  ],
  [
    "아직 받은 DM이 없습니다.",
    { zh: "还没有收到DM。", ja: "まだ受信したDMはありません。", en: "No DMs yet." },
  ],
  [
    "스타일 사진 커뮤니티",
    { zh: "风格照片社区", ja: "スタイル写真コミュニティ", en: "Style Photo Community" },
  ],
  [
    "익명 스타일 투표",
    { zh: "匿名风格投票", ja: "匿名スタイル投票", en: "Anonymous Style Votes" },
  ],
  [
    "내 상담 히스토리",
    { zh: "我的咨询历史", ja: "相談履歴", en: "My Consultation History" },
  ],
  [
    "Hair Money 충전",
    { zh: "充值Hair Money", ja: "Hair Moneyをチャージ", en: "Top Up Hair Money" },
  ],
  [
    "로그인하고 충전하기",
    { zh: "登录并充值", ja: "ログインしてチャージ", en: "Log In and Top Up" },
  ],
  [
    "이용약관",
    { zh: "服务条款", ja: "利用規約", en: "Terms" },
  ],
  [
    "개인정보처리방침",
    { zh: "隐私政策", ja: "プライバシーポリシー", en: "Privacy Policy" },
  ],
  [
    "환불정책",
    { zh: "退款政策", ja: "返金ポリシー", en: "Refund Policy" },
  ],
  [
    "국가",
    { zh: "国家", ja: "国", en: "Country" },
  ],
  [
    "좋아요",
    { zh: "喜欢", ja: "いいね", en: "Like" },
  ],
  [
    "싫어요",
    { zh: "不喜欢", ja: "よくない", en: "Dislike" },
  ],
  [
    "공유",
    { zh: "分享", ja: "共有", en: "Share" },
  ],
  [
    "댓글",
    { zh: "评论", ja: "コメント", en: "Comments" },
  ],
  [
    "저장",
    { zh: "保存", ja: "保存", en: "Save" },
  ],
  [
    "삭제",
    { zh: "删除", ja: "削除", en: "Delete" },
  ],
  [
    "다운로드",
    { zh: "下载", ja: "ダウンロード", en: "Download" },
  ],
  [
    "이메일 전송",
    { zh: "发送邮件", ja: "メール送信", en: "Send Email" },
  ],
];

// The generated dictionary covers every Korean UI string in the app (human
// reviewed, full-sentence translations). Curated exactEntries are applied on
// top so any hand-tuned phrase wins over the generated one.
const exactTranslationMap = [...mirilookGeneratedTranslations, ...exactEntries].reduce<
  Record<string, TranslationValue>
>((acc, [source, value]) => {
  acc[normalizeText(source)] = value;
  return acc;
}, {});

// 사전에 없는 문장에만 적용되는 단어 단위 치환(폴백).
// ⚠️ 1글자 키는 절대 넣지 말 것. 단순 문자열 치환이라 단어 중간까지 걸려
// "계정" → "계front"("정"→front), "계좌" → "계left" 처럼 원문을 망가뜨린다.
// (좌/정/우, 내, 장 항목을 이 이유로 제거했다. 2글자 이상만 등록한다.)
const glossary: Record<Exclude<MirilookLocale, "ko">, Array<[string, string]>> = {
  zh: [
    ["미리룩", "Miri Look"],
    ["헤어스타일", "发型"],
    ["헤어 스타일", "发型"],
    ["헤어컷", "发型"],
    ["헤어 컬러", "发色"],
    ["미용사", "发型师"],
    ["미용실", "美发店"],
    ["상담", "咨询"],
    ["추천", "推荐"],
    ["결과", "结果"],
    ["사진", "照片"],
    ["이미지", "图片"],
    ["업로드", "上传"],
    ["선택", "选择"],
    ["생성", "生成"],
    ["저장", "保存"],
    ["공유", "分享"],
    ["히스토리", "历史"],
    ["커뮤니티", "社区"],
    ["투표", "投票"],
    ["회원", "会员"],
    ["로그인", "登录"],
    ["로그아웃", "退出登录"],
    ["추천받", "获取推荐"],
    ["얼굴", "脸部"],
    ["스타일", "风格"],
    ["컬러", "颜色"],
    ["메이크업", "妆容"],
    ["코디", "穿搭"],
    ["상의", "上衣"],
    ["하의", "下装"],
    ["액세서리", "配饰"],
    ["예약", "预约"],
    ["리뷰", "评价"],
    ["지도", "地图"],
    ["검색", "搜索"],
    ["메시지", "消息"],
    ["답장", "回复"],
    ["가이드라인", "指南"],
    ["닫기", "关闭"],
    ["영상", "视频"],
    ["준비", "准备"],
    ["재생", "播放"],
    ["얼굴에 어울리는", "适合脸型的"],
    ["올리고", "上传"],
    ["받고", "获取"],
    ["받아보세요", "试试看"],
    ["고품질", "高质量"],
    ["서비스", "服务"],
    ["여성", "女性"],
    ["남성", "男性"],
    ["회원가입", "注册"],
    ["다각도", "多角度"],
    ["입력", "输入"],
    ["등록", "注册"],
    ["관리", "管理"],
    ["확인", "确认"],
    ["완료", "完成"],
    ["실패", "失败"],
    ["필요", "需要"],
    ["가능", "可用"],
    ["사용", "使用"],
    ["열기", "打开"],
    ["보내기", "发送"],
    ["남기기", "留下"],
    ["문의", "咨询"],
    ["정책", "政策"],
    ["약관", "条款"],
    ["환불", "退款"],
  ],
  ja: [
    ["미리룩", "Miri Look"],
    ["헤어스타일", "ヘアスタイル"],
    ["헤어 스타일", "ヘアスタイル"],
    ["헤어컷", "ヘアカット"],
    ["헤어 컬러", "ヘアカラー"],
    ["미용사", "美容師"],
    ["미용실", "美容室"],
    ["상담", "相談"],
    ["추천", "おすすめ"],
    ["결과", "結果"],
    ["사진", "写真"],
    ["이미지", "画像"],
    ["업로드", "アップロード"],
    ["선택", "選択"],
    ["생성", "生成"],
    ["저장", "保存"],
    ["공유", "共有"],
    ["히스토리", "履歴"],
    ["커뮤니티", "コミュニティ"],
    ["투표", "投票"],
    ["회원", "会員"],
    ["로그인", "ログイン"],
    ["로그아웃", "ログアウト"],
    ["추천받", "提案を受け"],
    ["얼굴", "顔"],
    ["스타일", "スタイル"],
    ["컬러", "カラー"],
    ["메이크업", "メイク"],
    ["코디", "コーデ"],
    ["상의", "トップス"],
    ["하의", "ボトムス"],
    ["액세서리", "アクセサリー"],
    ["예약", "予約"],
    ["리뷰", "レビュー"],
    ["지도", "地図"],
    ["검색", "検索"],
    ["메시지", "メッセージ"],
    ["답장", "返信"],
    ["가이드라인", "ガイドライン"],
    ["닫기", "閉じる"],
    ["영상", "動画"],
    ["준비", "準備"],
    ["재생", "再生"],
    ["얼굴에 어울리는", "顔に似合う"],
    ["올리고", "アップロード"],
    ["받고", "受け取り"],
    ["받아보세요", "お試しください"],
    ["고품질", "高品質"],
    ["서비스", "サービス"],
    ["여성", "女性"],
    ["남성", "男性"],
    ["회원가입", "会員登録"],
    ["다각도", "多角度"],
    ["입력", "入力"],
    ["등록", "登録"],
    ["관리", "管理"],
    ["확인", "確認"],
    ["완료", "完了"],
    ["실패", "失敗"],
    ["필요", "必要"],
    ["가능", "可能"],
    ["사용", "使用"],
    ["열기", "開く"],
    ["보내기", "送信"],
    ["남기기", "残す"],
    ["문의", "問い合わせ"],
    ["정책", "ポリシー"],
    ["약관", "規約"],
    ["환불", "返金"],
  ],
  en: [
    ["미리룩", "Miri Look"],
    ["헤어스타일", "hairstyle"],
    ["헤어 스타일", "hairstyle"],
    ["헤어컷", "haircut"],
    ["헤어 컬러", "hair color"],
    ["미용사", "stylist"],
    ["미용실", "salon"],
    ["상담", "consultation"],
    ["추천", "recommendation"],
    ["결과", "result"],
    ["사진", "photo"],
    ["이미지", "image"],
    ["업로드", "upload"],
    ["선택", "select"],
    ["생성", "generate"],
    ["저장", "save"],
    ["공유", "share"],
    ["히스토리", "history"],
    ["커뮤니티", "community"],
    ["투표", "vote"],
    ["회원", "member"],
    ["로그인", "log in"],
    ["로그아웃", "log out"],
    ["얼굴", "face"],
    ["스타일", "style"],
    ["컬러", "color"],
    ["메이크업", "makeup"],
    ["코디", "outfit"],
    ["상의", "top"],
    ["하의", "bottom"],
    ["액세서리", "accessory"],
    ["예약", "booking"],
    ["리뷰", "review"],
    ["지도", "map"],
    ["검색", "search"],
    ["메시지", "message"],
    ["답장", "reply"],
    ["가이드라인", "guideline"],
    ["닫기", "close"],
    ["영상", "video"],
    ["준비", "ready"],
    ["재생", "play"],
    ["얼굴에 어울리는", "that suits your face"],
    ["올리고", "upload"],
    ["받고", "get"],
    ["받아보세요", "try it"],
    ["고품질", "high-quality"],
    ["서비스", "service"],
    ["여성", "female"],
    ["남성", "male"],
    ["회원가입", "sign up"],
    ["다각도", "multi-angle"],
    ["입력", "input"],
    ["등록", "register"],
    ["관리", "manage"],
    ["확인", "confirm"],
    ["완료", "complete"],
    ["실패", "failed"],
    ["필요", "required"],
    ["가능", "available"],
    ["사용", "use"],
    ["열기", "open"],
    ["보내기", "send"],
    ["남기기", "leave"],
    ["문의", "inquiry"],
    ["정책", "policy"],
    ["약관", "terms"],
    ["환불", "refund"],
  ],
};

const koreanPattern = /[\u3131-\u318e\uac00-\ud7a3]/;

export function getMirilookLocaleOption(locale: MirilookLocale) {
  return (
    mirilookLocaleOptions.find((option) => option.id === locale) ??
    mirilookLocaleOptions[0]
  );
}

export function getMirilookRegionFromLocale(
  locale: MirilookLocale,
): MirilookRegionId {
  switch (locale) {
    case "zh":
      return "china";
    case "ja":
      return "japan";
    case "en":
      return "america";
    default:
      return "korea";
  }
}

export function isMirilookLocale(value: string | null): value is MirilookLocale {
  return value === "ko" || value === "zh" || value === "ja" || value === "en";
}

export function translateMirilookText(text: string, locale: MirilookLocale) {
  if (locale === "ko" || !text.trim()) {
    return text;
  }

  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  const core = text.slice(leading.length, text.length - trailing.length);
  const normalized = normalizeText(core);
  const exact = exactTranslationMap[normalized]?.[locale];

  if (exact) {
    return `${leading}${exact}${trailing}`;
  }

  if (!hasTranslatableContent(core)) {
    return text;
  }

  // Fallback for strings not in the dictionary (e.g. user-generated/dynamic
  // content). Apply the glossary for known words and keep any remaining Korean
  // intact — readable source text is better than garbled placeholder output.
  return `${leading}${applyGlossary(core, locale)}${trailing}`;
}

function applyGlossary(text: string, locale: Exclude<MirilookLocale, "ko">) {
  return glossary[locale].reduce(
    (current, [source, target]) => current.split(source).join(target),
    text,
  );
}

function hasTranslatableContent(text: string) {
  return koreanPattern.test(text) || exactTranslationMap[normalizeText(text)];
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}
