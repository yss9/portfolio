/** Summaries based on documented project contributions, not team-wide claims. */
export const showcase = {
  saeroi: {
    category: "블록체인 · AI Agent",
    program: "삼성청년 SW·AI 아카데미(SSAFY) 프로젝트에서 우수상을 받은 프로젝트입니다.",
    background:
      "폐의류·원단 같은 폐소재는 공급업체에서 가공업체와 브랜드를 거쳐야 새 제품이 됩니다. 업체마다 거래 기록과 진행 상태가 흩어져 있어, 소재가 어디서 와서 어떻게 가공됐는지 확인하고 다음 할 일을 파악하기 어려웠습니다.",
    overview:
      "폐소재 공급업체·가공업체·브랜드를 연결하는 블록체인 기반 업사이클링 플랫폼입니다. 소재 거래부터 가공·생산·판매까지의 기록을 블록체인에 남기고 지갑 서명으로 각 단계를 승인하며, 브랜드 담당자는 AI 어시스턴트의 안내를 받아 소재 구매부터 제품 판매까지 진행합니다.",
    visualLabel: "AI 어시스턴트 · 생산 확정 승인",
  },
  potner: {
    category: "IoT · 이벤트 기반 시스템",
    program: "삼성청년 SW·AI 아카데미(SSAFY) 프로젝트에서 우수상을 받은 프로젝트입니다.",
    background:
      "식물을 키우다 보면 물 주기·환기·햇빛 관리를 제때 챙기기 어렵습니다. 화분이 스스로 환경을 살펴 필요한 돌봄을 하고, 사용자는 앱에서 식물의 상태와 성장을 확인할 수 있는 서비스를 목표로 했습니다.",
    overview:
      "센서로 토양 수분·조도·온습도를 수집하고, 로봇이 급수 스테이션 이동·급수·송풍·햇빛 이동을 스스로 수행하는 이동형 스마트 화분입니다. Flutter 앱에서 식물 상태와 환경 이력, 돌봄 일기, 성장 타임랩스를 볼 수 있습니다.",
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
