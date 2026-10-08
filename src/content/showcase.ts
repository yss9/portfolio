/** Summaries based on documented project contributions, not team-wide claims. */
export const showcase = {
  saeroi: {
    category: "BLOCKCHAIN · AI AGENT",
    title: "폐소재의 다음 쓰임을,\n확인 가능한 거래로.",
    description:
      "폐소재의 거래·가공·생산을 연결하는 블록체인 기반 업사이클링 플랫폼입니다. 지갑 서명으로 승인한 온체인 결과를 서버의 거래 상태와 연결하고, 브랜드 담당자의 업무를 AI 어시스턴트로 안내했습니다.",
    evidence: "삼성청년 SW/AI 프로젝트 우수상 · 31개 업무 도구 연결",
    visualLabel: "SAEROI / BRAND WORKSPACE",
  },
  potner: {
    category: "IoT · EVENT-DRIVEN SYSTEM",
    title: "메시지 하나가\n실제 움직임이 되기까지.",
    description:
      "센서의 수분 부족 감지부터 로봇의 이동·급수·복귀까지 연결했습니다. 중복되거나 늦게 도착한 응답은 명령 이력과 식별 정보를 확인한 뒤 반영합니다.",
    evidence: "삼성청년 SW/AI 프로젝트 우수상",
    visualLabel: "PotneR / PLANT CARE",
  },
  saybridge: {
    category: "REALTIME · SOLO PROJECT",
    title: "첫 연결부터\n수업이 시작되도록.",
    description:
      "수업 탐색부터 화상 통화·채팅·과제 제출까지 직접 개발했습니다. 영상이 표시되지 않던 문제를 미디어 준비와 협상 순서를 추적해 개선했습니다.",
    evidence: "1인 개발 · WebRTC 초기 협상 순서 안정화",
    visualLabel: "SayBridge / LIVE CLASSROOM",
  },
} as const;

export type FeaturedSlug = keyof typeof showcase;
export const featuredSlugs: FeaturedSlug[] = ["saeroi", "potner", "saybridge"];

export function getShowcase(slug: string) {
  return Object.prototype.hasOwnProperty.call(showcase, slug)
    ? showcase[slug as FeaturedSlug]
    : undefined;
}
