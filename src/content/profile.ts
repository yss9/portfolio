import type { StackGroup } from "./types";

export const profile = {
  name: "서영석",
  role: "Backend Developer",
  headline:
    "안녕하세요. 백엔드 개발자 서영석입니다. 웹 서비스부터 실시간 통신, IoT까지 다양한 프로젝트를 경험했습니다. 백엔드를 중심으로 화면과 배포까지 연결하며 서비스를 만들어 왔습니다. 개발 과정에서는 AI를 조사·설계·구현에 활용하고, 결과를 직접 확인합니다.",
  email: "yse2196@gmail.com",
  phone: "010-5054-5065",
  github: "https://github.com/yss9",
  githubLabel: "github.com/yss9",

  intro: [
    "SayBridge의 화상 연결에서는 비동기 실행 순서를, PotneR의 자동 급수에서는 중복·지연 응답을 다뤘습니다. 새로이에서는 이 경험을 거래 상태와 AI의 승인형 실행 설계로 이어갔습니다.",
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
      desc: "Glople의 추천 개선은 동일한 로컬 JMeter 조건에서 비교했습니다. PotneR의 명령 처리에서는 중복·지연·실패 응답을 테스트로 확인했습니다.",
    },
  ],

  facts: [
    { label: "학력", value: "영남대학교 컴퓨터공학과 졸업" },
    { label: "전공 평점", value: "3.88 / 4.5" },
    { label: "자격증", value: "정보처리기사" },
    { label: "교육", value: "삼성청년SW·AI아카데미 참여 (2026.01 ~ 현재)" },
    {
      label: "수상",
      value: "삼성청년 SW/AI 프로젝트 우수상 2회 (SAEROI · PotneR)",
    },
  ],
};

export const aiWorkflow = {
  intro:
    "기획·기술 조사·UI 설계·코드 구현에 맞는 AI 도구를 선택합니다. 생성된 결과는 구조와 보안, 예외 처리, 실제 실행 결과를 기준으로 검토합니다.",
  tools: [
    "Claude",
    "Claude Code",
    "Gemini",
    "Gemini Deep Research",
    "ChatGPT",
    "Codex",
    "Stitch",
  ],
  steps: [
    {
      name: "RESEARCH",
      title: "기술과 공식 문서 조사",
      body: "Gemini Deep Research로 필요한 기술과 선택지를 조사합니다. 조사 내용을 바탕으로 공식 문서에서 동작 방식과 적용 조건을 확인합니다.",
      tools: ["Gemini Deep Research"],
    },
    {
      name: "DESIGN",
      title: "요구사항과 구조 검토",
      body: "ChatGPT와 Claude로 요구사항과 아키텍처를 검토합니다. Stitch로 UI를 시각화하며 화면과 기능의 연결을 구체화합니다.",
      tools: ["ChatGPT", "Claude", "Stitch"],
    },
    {
      name: "BUILD",
      title: "코드 분석·구현·리팩터링",
      body: "Claude Code와 Codex로 기존 코드의 맥락을 분석하고 구현·리팩터링을 진행합니다. 변경 내용을 읽고 서비스 구조에 맞는지 검토합니다.",
      tools: ["Claude Code", "Codex"],
    },
    {
      name: "VERIFY",
      title: "실행 결과 직접 검증",
      body: "테스트·빌드·로그·보안 검사로 실행 결과를 확인합니다. 예외 처리와 의도한 동작을 직접 검증한 뒤 변경을 반영합니다.",
      tools: ["테스트", "빌드", "로그", "보안 검사"],
    },
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
