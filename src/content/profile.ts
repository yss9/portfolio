import type { StackGroup } from "./types";

export const profile = {
  name: "서영석",
  role: "Backend Developer",
  headline:
    "서비스의 상태와 데이터 흐름을 추적하고, 변경이 안전하게 반영되도록 설계하는 백엔드 개발자입니다.",
  email: "yse2196@gmail.com",
  phone: "010-5054-5065",
  github: "https://github.com/yss9",
  githubLabel: "github.com/yss9",

  intro: [
    "PotneR에서는 중복·지연될 수 있는 MQTT 응답을 명령 상태와 연결했고, 새로이에서는 모델의 제안과 실제 결제·서명 실행을 분리했습니다.",
    "문제가 생기면 로그와 데이터, 실행 순서를 따라 원인을 확인합니다. 바꾼 내용은 테스트나 같은 조건의 측정으로 검증하고, 남은 한계도 함께 기록합니다.",
  ],

  principles: [
    {
      title: "사용자가 끝내야 할 일부터 파악",
      desc: "새로이의 브랜드 담당자가 소재 구매부터 판매까지 여러 화면을 오가던 흐름을 거래 기능과 대화형 어시스턴트로 연결했습니다.",
    },
    {
      title: "실제 상태를 기준으로 판단",
      desc: "PotneR의 장치 응답과 새로이의 거래·생산 상태처럼 순서가 바뀔 수 있는 데이터는 식별값과 최신 상태를 확인한 뒤 반영합니다.",
    },
    {
      title: "검증 조건과 한계까지 기록",
      desc: "SayBridge의 조회 개선은 동일한 JMeter 조건에서 비교했고, 정량 측정이 없는 개선은 코드와 예외 테스트로 검증 범위를 구분합니다.",
    },
  ],

  facts: [
    { label: "학력", value: "영남대학교 컴퓨터공학과 졸업" },
    { label: "전공 평점", value: "3.88 / 4.5" },
    { label: "자격증", value: "정보처리기사" },
    { label: "교육", value: "삼성청년SW·AI아카데미(SSAFY) 참여 (2026.01 ~ )" },
    { label: "수상", value: "PotneR · SSAFY 프로젝트 우수상" },
  ],
};

export const techStack: (StackGroup & { desc: string })[] = [
  {
    group: "Backend",
    items: ["Java", "Spring Boot", "Spring Security", "JPA", "QueryDSL"],
    desc: "SayBridge의 인증·강의 API와 새로이의 거래·승인 흐름을 구현하고, QueryDSL로 강의 검색 조건을 조합했습니다.",
  },
  {
    group: "Database",
    items: ["MySQL", "PostgreSQL"],
    desc: "프로젝트 데이터를 모델링하고 조회 흐름을 개선했습니다. PostgreSQL은 별도 AWS 배포 연습에서 RDS 연결에 사용했습니다.",
  },
  {
    group: "AI / Data",
    items: ["Spring AI", "RAG", "Spring Batch", "LLM Tool Use"],
    desc: "Neoulteo의 관광지 기반 답변·데이터 갱신과 새로이의 승인형 AI Agent에 각각 적용했습니다.",
  },
  {
    group: "Realtime / IoT",
    items: ["WebSocket", "STOMP", "WebRTC", "MQTT"],
    desc: "SayBridge의 화상 연결·채팅과 PotneR의 센서 수집·장치 명령에 사용했습니다.",
  },
  {
    group: "Infra / Cloud",
    items: ["AWS", "Docker", "GitHub Actions", "Jenkins"],
    desc: "AWS Deploy에서 정적·API 배포를 분리했고, PotneR에서 Jenkins 빌드·배포와 자동 롤백을 구성했습니다.",
  },
  {
    group: "Frontend / Mobile",
    items: ["React", "Flutter", "TypeScript"],
    desc: "새로이의 거래·대화 화면과 PotneR의 식물 상태·장치 제어 앱을 서버 API와 연결했습니다.",
  },
];
