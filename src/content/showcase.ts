/** Summaries based on documented project contributions, not team-wide claims. */
export const showcase = {
  saeroi: {
    category: "블록체인 · AI Agent",
    headline: "AI가 제안하고, 서버가 승인 시점에 다시 확인합니다",
    problem:
      "대화 이력만 믿으면 AI가 이미 끝난 결제나 오래된 정보로 구매·생산 작업을 제안할 수 있었습니다.",
    solution:
      "상태를 바꾸는 쓰기 도구 17개는 확인 카드로만 실행하고, 승인 순간 대화 소유자·유효기간과 이미 처리된 일인지를 서버가 다시 확인합니다.",
    result:
      "AI 업무 도구 31개를 연결하면서도, 모델이 결제·지갑 서명·생산 확정을 직접 실행할 수 없는 구조를 만들었습니다.",
    visualLabel: "AI 어시스턴트 · 생산 확정 승인",
  },
  potner: {
    category: "IoT · 이벤트 기반 시스템",
    headline: "중복·지연 응답에도 급수는 한 번만",
    problem:
      "MQTT QoS 1의 재전송, 늦게 도착한 회신, 몇 ms 만에 오는 장치 응답이 센서 중복 저장이나 급수 중복 실행으로 이어질 수 있었습니다.",
    solution:
      "명령은 DB 커밋 후에만 발행하고, 회신은 requestId·장치·명령 종류로 대조합니다. 재전송은 messageId로 거르고, 타임아웃 뒤 늦게 온 회신은 실제 결과로 반영합니다.",
    result:
      "중복 재전송·늦은 회신·장치 불일치·명령 실패를 단위 테스트로 확인했고, 실패하면 재시도 대신 체인을 멈춰 물이 두 번 나가지 않게 했습니다.",
    visualLabel: "Flutter 앱 · 홈과 환경 분석",
  },
} as const;

export type FeaturedSlug = keyof typeof showcase;
export const featuredSlugs: FeaturedSlug[] = ["saeroi", "potner"];

export function getShowcase(slug: string) {
  return Object.prototype.hasOwnProperty.call(showcase, slug)
    ? showcase[slug as FeaturedSlug]
    : undefined;
}

/** State flows drawn in the home hero. Each step is a documented behaviour. */
export const stateFlows = [
  {
    project: "새로이",
    slug: "saeroi",
    title: "승인형 AI 실행",
    steps: [
      { label: "쓰기 도구" },
      { label: "확인 카드" },
      { label: "사용자 승인" },
      { label: "재검증", guard: true },
      { label: "실행" },
    ],
    guard:
      "만료됐거나 이미 처리된 카드는 실행하지 않고, 같은 대상의 카드가 열려 있으면 새로 만들지 않습니다.",
  },
  {
    project: "PotneR",
    slug: "potner",
    title: "자동 급수 명령 처리",
    steps: [
      { label: "명령 저장" },
      { label: "커밋 후 발행" },
      { label: "장치 회신" },
      { label: "회신 대조", guard: true },
      { label: "다음 단계" },
    ],
    guard:
      "이동 → 급수 → 송풍 → 복귀의 각 단계가 이 순서를 따르고, 같은 messageId의 재전송은 반영하지 않습니다.",
  },
] as const;
