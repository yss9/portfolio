import type { StackGroup } from "./types";

export const profile = {
  name: "서영석",
  role: "Backend Developer",
  headline:
    "중복·지연 응답과 오래된 상태에도 정확하게 동작하는 서버를 설계하는 백엔드 개발자 서영석입니다. 승인형 AI 어시스턴트(새로이)와 IoT 자동 급수(PotneR)로 SSAFY 우수상을 두 번 받았습니다.",
  positioning: {
    kicker: "Backend Developer",
    title: ["결제·AI·IoT 서버를", "만드는 백엔드 개발자", "서영석입니다."],
    lead: "Spring Boot로 거래와 결제, 승인형 AI 에이전트, IoT 장치 명령을 처리하는 서버를 만들어 왔습니다. 중복되거나 늦게 온 응답, 오래된 상태가 잘못된 실행으로 이어지지 않도록 실행 직전에 서버가 상태를 다시 확인하게 설계합니다.",
  },
  /** What kind of backend work the user does, each backed by a project page. */
  devAreas: [
    {
      label: "AI Agent",
      title: "승인형 AI 에이전트 서버",
      desc: "LLM이 기존 업무 기능을 도구로 호출하게 연결하고, 결제·생산 확정처럼 상태를 바꾸는 작업은 사람이 확인 카드를 승인한 뒤에만 실행되도록 서버에서 통제했습니다.",
      metric: "업무 도구 31개 · 쓰기 17개는 승인 후 실행",
      tags: ["Spring Boot", "LLM Tool Use", "React"],
      projects: [{ name: "새로이", slug: "saeroi" }],
    },
    {
      label: "IoT · Messaging",
      title: "IoT 장치 명령과 센서 수집",
      desc: "MQTT로 센서 값을 받고 로봇에 명령을 보냅니다. 명령은 DB 커밋 후에만 발행하고 회신을 requestId·장치·명령 종류로 대조해, 재전송이나 늦은 회신에도 급수가 중복되지 않게 했습니다.",
      metric: "중복·지연·실패 응답 단위 테스트",
      tags: ["Spring Boot", "MQTT", "Flutter"],
      projects: [{ name: "PotneR", slug: "potner" }],
    },
    {
      label: "Commerce · Blockchain",
      title: "거래·결제와 지갑 서명 연동",
      desc: "공급업체 소재의 판매·구매 API와 카카오페이 결제, 결제 이탈 거래 정리를 팀원과 함께 구현하고, 사용자 지갑의 서명 결과를 서버의 거래 상태에 연결했습니다.",
      metric: "Material–Brand 소재 거래 공동 구현",
      tags: ["JPA", "QueryDSL", "ethers.js"],
      projects: [{ name: "새로이", slug: "saeroi" }],
    },
    {
      label: "Data · Performance",
      title: "데이터 동기화와 성능 개선",
      desc: "Spring Batch로 공공 관광 데이터를 미리 동기화해 검색과 AI 답변의 근거로 쓰고, 추천 API의 전체 정렬을 Top-K 추출로 바꿔 응답 시간을 줄였습니다.",
      metric: "추천 API 평균 응답 -74% (로컬 JMeter)",
      tags: ["Spring Batch", "MySQL", "JMeter"],
      projects: [
        { name: "너울터", slug: "neoulteo" },
        { name: "Glople", slug: "glople" },
      ],
    },
  ],
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
