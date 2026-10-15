import type { StackGroup } from "./types";

export const profile = {
  name: "서영석",
  role: "Backend Developer",
  headline:
    "중복·지연 응답과 오래된 상태에도 정확하게 동작하는 서버를 설계하는 백엔드 개발자 서영석입니다. 승인형 AI 어시스턴트(새로이)와 IoT 자동 급수(PotneR)로 SSAFY 우수상을 두 번 받았습니다.",
  positioning: {
    kicker: "백엔드 개발자 서영석",
    title: ["요청이 꼬여도,", "상태는 정확하게."],
    lead: "중복되거나 늦게 도착한 응답, 오래된 대화 정보가 잘못된 실행으로 이어지지 않도록 서버의 상태 전이를 설계합니다.",
  },
  email: "yse2196@gmail.com",
  phone: "010-5054-5065",
  github: "https://github.com/yss9",
  githubLabel: "github.com/yss9",

  intro: [
    "SayBridge에서는 WebRTC 협상 순서를, PotneR에서는 MQTT의 중복·지연 응답을, 새로이에서는 AI가 제안한 작업의 승인 시점 검증을 다뤘습니다. 형태는 달랐지만 모두 '지금 이 요청을 실행해도 되는가'를 서버가 판단하게 만드는 일이었습니다.",
    "문제가 생기면 로그와 데이터로 재현하고, 고친 뒤에는 테스트나 같은 조건의 측정으로 확인합니다. 측정하지 않은 효과는 주장하지 않고, 남은 한계도 함께 기록합니다.",
  ],

  principles: [
    {
      title: "모델과 네트워크보다 서버 상태를 믿습니다",
      desc: "새로이의 AI 답변과 PotneR의 장치 응답은 오래되거나 순서가 바뀔 수 있습니다. 실행 직전에 서버의 최신 상태와 식별값을 다시 확인합니다.",
    },
    {
      title: "애매한 실패는 멈추고 기록합니다",
      desc: "결과만 유실된 급수를 재시도하면 물이 두 번 공급될 수 있습니다. PotneR에서는 부분 실패 시 자동 체인을 멈추고 명령 이력과 알림으로 원인을 남겼습니다.",
    },
    {
      title: "같은 조건에서 비교합니다",
      desc: "Glople 추천 개선은 동일 데이터셋·시나리오의 로컬 JMeter로 Before/After를 측정했고, 측정 조건을 결과와 함께 적었습니다.",
    },
  ],

  education: {
    school: "영남대학교",
    major: "컴퓨터공학과 졸업",
    gpa: "3.88 / 4.5",
  },

  awards: [
    {
      project: "PotneR",
      slug: "potner",
      title: "삼성청년 SW/AI 공통프로젝트 우수상",
    },
    {
      project: "SAEROI",
      slug: "saeroi",
      title: "삼성청년 SW/AI 특화프로젝트 우수상",
    },
  ],

  facts: [
    { label: "자격증", value: "정보처리기사" },
    { label: "교육", value: "삼성청년SW·AI아카데미 참여 (2026.01 ~ 현재)" },
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
