import type { Project } from "../types";

export const saeroi: Project = {
  slug: "saeroi",
  no: "01",
  name: "새로이(SAEROI)",
  tagline: "소재 거래부터 제품 판매까지 잇는 순환 패션 플랫폼",
  summary:
    "폐소재 공급업체·가공업체·브랜드를 연결하고 소재 거래, 가공, 생산, 제품 판매의 진행 상태를 추적하는 팀 프로젝트입니다. 브랜드 담당자의 여러 화면에 흩어진 업무를 한 대화에서 안내하는 AI 여정 어시스턴트를 더했습니다.",
  period: "2026.08 ~ 2026.09",
  team: "팀 프로젝트",
  role: "Material–Brand 거래 및 AI Agent 백엔드·프론트엔드 개발",
  focus:
    "거래 상태를 연결하고, 결제·서명 같은 변경 작업은 승인과 최신 상태 확인 뒤 실행하도록 설계했습니다.",
  teamShort: "팀 · 거래/AI Agent · BE/FE",
  stack: [
    { group: "Backend", items: ["Java 21", "Spring Boot", "JPA"] },
    { group: "Frontend", items: ["React", "TypeScript", "TanStack Query", "ethers.js"] },
    { group: "Data / Chain", items: ["MySQL", "Hyperledger Besu"] },
    { group: "AI", items: ["LLM Tool Use", "GMS API"] },
  ],
  stackFlat: ["Spring Boot", "React", "MySQL", "LLM Tool Use", "Hyperledger Besu"],
  links: [],
  preview: {
    src: "/projects/saeroi/home.png",
    alt: "새로이 서비스의 SAEROI 로고와 폐소재 순환 메시지가 표시된 메인 화면",
    kind: "screen",
  },
  screenshots: [
    {
      src: "/projects/saeroi/home.png",
      alt: "짙은 남색 배경에 SAEROI 로고와 WASTE IS NOT THE END 문구가 표시된 서비스 메인 화면",
      caption: "서비스 첫 화면 — 버려진 소재의 다음 쓰임을 연결하는 새로이",
    },
    {
      src: "/projects/saeroi/shop.png",
      alt: "새로이 쇼핑몰에서 업사이클링 재킷, 수납함, 원피스 등의 상품이 목록으로 표시된 화면",
      caption: "제품 판매 화면 — 순환 소재로 만든 상품을 탐색하는 쇼핑몰",
    },
    {
      src: "/projects/saeroi/brand-workspace.png",
      alt: "브랜드 업무 화면에 소재 검색·구매, 가공 요청, 제품 생산 메뉴와 사업자 정보 및 업무용 지갑 상태가 표시된 모습",
      caption: "브랜드 업무 공간 — 소재 거래부터 가공·생산까지 연결되는 관리 화면",
      fit: "contain",
    },
    {
      src: "/projects/saeroi/assistant-approval.png",
      alt: "AI 어시스턴트가 소재 구매 대화와 지갑 서명 확인 카드를 함께 보여주는 화면",
      caption: "AI 어시스턴트 — 소재 구매 안내에서 사용자 결제·서명 확인으로 이어지는 시연 영상 캡처",
      fit: "contain",
    },
  ],
  highlights: ["Material–Brand 거래", "31개 업무 도구", "승인 후 상태 재검증"],
  features: [
    {
      title: "Material–Brand 소재 거래",
      desc: "브랜드가 공급업체의 소재를 조회·구매하고 결제, 발송, 수령 상태를 확인하는 거래 API와 화면 흐름을 구현했습니다. 결제 이탈 거래 정리와 취소된 온체인 예약 해제도 다뤘습니다.",
      category: "본인 기여",
    },
    {
      title: "브랜드 AI 여정 어시스턴트",
      desc: "소재 검색·거래, 가공 요청, 생산 배치, 제품 등록·판매와 연결된 기존 도메인 기능 31개를 도구로 묶었습니다. 브랜드 담당자가 한 대화에서 현재 상태와 다음 할 일을 확인하도록 했습니다.",
      category: "본인 기여",
    },
    {
      title: "승인형 업무 실행",
      desc: "조회 도구는 바로 실행하고 구매·결제·서명·생산 확정처럼 상태를 바꾸는 도구는 확인 카드를 만듭니다. 사용자 승인 시 소유권, 유효기간, 현재 업무 상태를 다시 검사합니다.",
      category: "본인 기여",
    },
    {
      title: "진행 상태와 후속 작업",
      desc: "완료된 거래·가공·생산·제품의 연결 관계를 서버에서 따라가며 남은 일과 상대 업체를 기다리는 단계를 구분했습니다. 인자가 확정된 후속 작업만 서버가 자동 제안합니다.",
      category: "본인 기여",
    },
  ],
  architecture: [
    {
      id: "brand-ui",
      label: "React 브랜드 화면",
      role: "소재 거래 화면과 대화창, 진행 패널, 결제·서명 확인 카드를 제공합니다.",
      band: "client",
    },
    {
      id: "agent",
      label: "Spring Boot Agent",
      role: "대화 이력과 실제 업무 상태를 조합하고 모델의 도구 요청을 조회 또는 승인 카드 생성으로 나눕니다.",
      band: "server",
    },
    {
      id: "domain",
      label: "기존 도메인 서비스",
      role: "소재 거래·가공·생산·제품 서비스가 업무 규칙과 상태 변경을 처리합니다.",
      band: "server",
    },
    {
      id: "database",
      label: "MySQL",
      role: "거래·프로젝트 관계, 대화 이력과 승인 대기 작업을 저장합니다.",
      band: "data",
    },
    {
      id: "chain",
      label: "Hyperledger Besu",
      role: "주문·인계·생산 등의 온체인 서명 결과를 확인한 뒤 서버 상태에 반영합니다.",
      band: "external",
    },
  ],
  architectureIntent:
    "모델은 작업을 제안하고 서버가 실제 상태와 권한을 판단합니다. 되돌리기 어려운 변경은 사용자가 카드를 승인한 뒤 기존 도메인 서비스에서 실행합니다.",
  architectureImage: {
    src: "/projects/saeroi/process.svg",
    alt: "소재 거래에서 가공·생산·판매까지 이어지는 새로이 업무와 승인형 AI Agent의 연결 구조",
    width: 1200,
    height: 750,
  },
  troubleshooting: [
    {
      id: "stale-model-state",
      title: "오래된 대화 정보가 실제 작업으로 이어지는 문제",
      problem:
        "결제 이후에도 모델이 결제 이전 상태로 답하거나, 카드 번호를 생산 배치 번호처럼 사용하는 사례가 있었습니다.",
      steps: [
        { label: "확인", title: "대화 이력과 업무 정본 분리", body: "대화의 문장만으로 거래·재고·생산 상태를 판단하면 정보가 오래될 수 있음을 확인했습니다." },
        { label: "변경", title: "매 요청에서 실제 상태 재조회", body: "서버가 거래·가공·생산 상태를 읽어 별도 시스템 메시지로 제공하고, 수량·금액·카드 제목은 서버 조회값으로 구성했습니다." },
        { label: "검증", title: "업무 상태와 화면 판정 공유", body: "대화 답변과 진행 패널이 같은 서버의 남은 일 판정을 사용하도록 연결했습니다." },
      ],
      takeaway:
        "모델의 기억 대신 서버 상태를 기준으로 다음 작업을 판단합니다. 실제 운영 환경의 오류율 감소 수치는 측정하지 않았습니다.",
    },
    {
      id: "approval-staleness",
      title: "오래되거나 중복된 확인 카드의 실행 방지",
      problem:
        "카드를 열어둔 사이 다른 화면에서 작업이 완료되거나, 같은 대상에 확인 카드가 여러 장 생성될 수 있었습니다.",
      steps: [
        { label: "제안", title: "카드 생성 전 검사", body: "실행 가능 상태와 이미 열린 카드·완료된 작업을 확인하고 같은 도구·대상의 열린 카드는 재사용했습니다." },
        { label: "승인", title: "최신 상태 재검증", body: "승인 요청에서는 사용자 소유권·카드 유효기간·도메인의 현재 상태를 다시 확인한 뒤 실행합니다." },
        { label: "테스트", title: "경계 사례 검증", body: "이미 완료된 작업과 방금 끝난 지갑 서명을 구분하는 테스트를 작성했습니다." },
      ],
      takeaway:
        "모델이 쓰기 작업을 직접 실행하지 못하게 하고, 승인 시점의 서버 상태를 다시 확인합니다.",
    },
  ],
  troubleshootingNote:
    "대화별 동시 처리 제어는 현재 단일 서버 인스턴스의 메모리 잠금을 사용합니다. 다중 인스턴스 운영으로 확대할 경우 분산 조정이 필요합니다.",
  performance: [],
  demo: [],
};
