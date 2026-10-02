import type { Project } from "../types";

export const glople: Project = {
  slug: "glople",
  no: "05",
  name: "Glople",
  tagline: "MBTI 기반 여행지 추천 커뮤니티",
  summary:
    "MBTI·연령·성별로 여행지와 루트를 추천하고, 지역 전문가와 실시간으로 연결하는 여행 커뮤니티 서비스입니다.",
  period: "2024.03 ~ 2024.11",
  team: "7인 (개발자 5인 + 디자인 2인)",
  role: "추천 로직 구현 · 프론트 일부 개발",
  focus: "사용자 성향과 선택 키워드로 여행지·경로를 추천하는 로직을 구현했습니다.",
  teamShort: "7인 팀 · 추천/FE",

  stack: [
    { group: "Backend", items: ["Spring Boot", "Spring Security", "Java 17"] },
    { group: "Frontend", items: ["React", "Styled-components", "Ant Design"] },
    { group: "Realtime", items: ["WebSocket (SimpleBroker)"] },
    { group: "Data", items: ["MySQL 8.0", "JPA / Hibernate"] },
    { group: "Infra", items: ["Nginx", "Docker", "Docker Compose"] },
    {
      group: "External APIs",
      items: ["OpenAI API", "Google Maps", "Google Places", "Google STT", "Wikipedia", "RestCountries"],
    },
  ],
  stackFlat: ["Spring Boot", "React", "MySQL", "WebSocket", "OpenAI", "Google Maps", "Docker"],

  links: [
    { label: "GitHub", href: "https://github.com/yss9/Glople", kind: "github" },
    { label: "시연 영상", href: "https://www.youtube.com/watch?v=5vuvjGWdCII", kind: "video" },
  ],

  preview: {
    src: "/projects/glople/main.png",
    alt:
      "Glople 메인 화면에서 세계 지도를 중심으로 여행지 추천과 예약 메뉴를 탐색하는 모습",
  },

  screenshots: [
    {
      src: "/projects/glople/main.png",
      alt: "Glople 세계 지도 홈 화면과 여행지 예약·추천·루트 탐색·커뮤니티 메뉴",
      caption: "지도 홈 — 세계 지도에서 국가를 선택해 여행 정보 탐색을 시작",
    },
    {
      src: "/projects/glople/mbti.png",
      alt: "Glople MBTI 추천 화면에서 ESTJ 성향과 잘 맞는 시드니, 싱가포르, 워싱턴 여행지를 확인하는 모습",
      caption: "MBTI 여행지 추천 — 사용자의 성향과 잘 맞는 여행지를 결과 카드로 제공",
    },
    {
      src: "/projects/glople/keyword-result.png",
      alt: "Glople 키워드 기반 맞춤 여행지 결과에 타우포 호수, 그레이트 배리어 리프, 본다이 비치가 표시된 화면",
      caption: "키워드 추천 결과 — 선택한 여행 취향을 기준으로 맞춤 여행지를 제안",
    },
    {
      src: "/projects/glople/cosine-route.png",
      alt: "Glople 코사인 유사도 기반 여행 루트 화면에서 유사한 사용자가 다녀온 파리 여행 경로를 확인하는 모습",
      caption: "유사 사용자 여행 루트 — 코사인 유사도로 찾은 사용자의 실제 여행 경로를 추천",
    },
  ],

  architectureImage: {
    src: "/projects/glople/architecture.png",
    alt: "Glople React 프론트엔드, Spring Boot 백엔드, MySQL, 외부 API와 Docker Compose 배포 구조를 보여주는 시스템 아키텍처",
    width: 1323,
    height: 719,
  },

  highlights: ["Bitmask 기반 후보 필터링", "PriorityQueue Top-K", "WebSocket 실시간 채팅"],

  features: [
    {
      title: "개인 맞춤형 추천",
      desc: "나이·성별·MBTI 유형을 수치 벡터로 변환하고 코사인 유사도를 계산해 유사 사용자의 여행 루트를 추천",
    },
    {
      title: "키워드 필터링",
      desc: "100개 이상의 키워드를 두 개의 63-bit mask로 변환하고 MySQL BIT_COUNT로 공통 키워드가 많은 여행지를 정렬",
    },
    {
      title: "AI 대화형 챗봇",
      desc: "OpenAI API 연동을 통한 자연어 기반 여행지 질문 및 추천 답변 생성",
    },
    {
      title: "실시간 매칭 / 채팅",
      desc: "WebSocket을 활용하여 사용자 간 매칭 및 채팅 흐름 구현",
    },
    {
      title: "추천 로직의 조회·정렬 개선",
      desc: "전체 조회·정렬로 불필요한 연산이 늘어나는 문제를 확인하고, DB 후보 필터링과 PriorityQueue Top-K 방식으로 개선했습니다.",
    },
  ],

  architecture: [
    {
      id: "react",
      label: "React",
      role: "여행지 추천 입력 인터페이스, 결과 시각화, 커뮤니티 UI 전반 담당",
      band: "client",
    },
    {
      id: "spring",
      label: "Spring Boot",
      role: "추천 알고리즘 처리, 외부 API 연동 제어, REST API 및 실시간 통신 중계",
      band: "server",
    },
    {
      id: "ws",
      label: "WebSocket",
      role: "사용자 간의 실시간 매칭 상태 공유 및 채팅 메시지 송수신 흐름 처리",
      band: "realtime",
    },
    {
      id: "mysql",
      label: "MySQL",
      role: "사용자 성향(MBTI 등), 여행지 메타데이터, 사용자 루트 및 후기 데이터 관리",
      band: "data",
    },
    {
      id: "external",
      label: "External APIs",
      role: "OpenAI(자연어 추천), Google Places/Wikipedia(여행 정보 보강) 데이터 수집",
      band: "external",
    },
  ],
  architectureIntent:
    "추천 연산은 서버에 두고, 여행 정보 보강은 외부 API 매시업으로 처리해 자체 데이터 부족을 메웠습니다.",

  troubleshooting: [
    {
      id: "recommend-analysis",
      title: "추천 로직 병목 분석",
      problem:
        "추천 결과는 상위 몇 건만 필요한데 전체 데이터를 읽고 문자열 탐색과 정렬을 반복했습니다.",
      solution:
        "키워드는 DB의 비트마스크 필터와 BIT_COUNT로 계산하고, MBTI 추천은 성별·연령 후보군에서 PriorityQueue로 상위 12건만 유지했습니다.",
      steps: [
        {
          label: "1",
          title: "기존 추천 흐름 확인",
          body: "나이·성별·MBTI 값을 수치 벡터로 변환해 코사인 유사도를 계산했지만, 모든 사용자를 조회하고 전체 결과를 정렬한 뒤 상위 12건만 사용했습니다.",
        },
        {
          label: "2",
          title: "Keyword 추천 병목 (String Search)",
          body: "전체 데이터를 조회(findAll)한 뒤 Java에서 문자열 탐색(contains)을 반복했습니다. → keyword_mask 후보 필터링과 MySQL BIT_COUNT 점수 계산으로 변경했습니다.",
        },
        {
          label: "3",
          title: "MBTI 추천 병목 (Sorting Cost)",
          body: "상위 12건만 필요하지만 전체 사용자에 대해 벡터 변환과 유사도 계산을 수행한 뒤 전체 정렬 후 limit을 적용했습니다. → 성별/연령 후보군 축소 + PriorityQueue Top-K 추출",
        },
      ],
      takeaway:
        "조회 대상과 정렬 범위를 줄여 두 추천 경로의 평균 응답 시간을 단축했습니다. 아래는 로컬 테스트 결과입니다.",
    },
  ],

  performance: [
    {
      id: "keyword-bitmask",
      title: "Keyword 추천 — 문자열 탐색을 비트 연산으로",
      summary:
        "전체 여행지를 읽고 문자열을 비교하던 문제를 DB 비트마스크 필터와 BIT_COUNT 점수 계산으로 해결했습니다.",
      before: {
        label: "Before: 전체 조회 후 Java 문자열 탐색",
        code: {
          language: "java",
          code: `repository.findAll().stream()
    .filter(e -> containsAnyKeyword(e.getInfo(), keywords))
    .sorted((a, b) -> Integer.compare(
        countMatchingKeywords(b.getInfo(), keywords),
        countMatchingKeywords(a.getInfo(), keywords)))
    .limit(21)
    .collect(Collectors.toList());`,
        },
        notes: ["전체 행을 메모리로 로드", "정렬 비교마다 매칭 수를 다시 계산"],
      },
      after: {
        label: "After: Bitmask 필터링 + bitCount 점수",
        code: {
          language: "sql",
          code: `-- 두 개의 63-bit mask로 후보와 공통 키워드 수 계산
WHERE (keyword_mask_low & :maskLow) <> 0
   OR (keyword_mask_high & :maskHigh) <> 0
ORDER BY BIT_COUNT(keyword_mask_low & :maskLow)
       + BIT_COUNT(keyword_mask_high & :maskHigh) DESC
LIMIT :limit`,
        },
        notes: ["후보군과 점수를 DB에서 계산", "애플리케이션에는 상위 결과만 반환"],
      },
      metrics: [
        { label: "Avg Response Time", before: "15.7ms", after: "8.92ms", delta: "-43.3%", better: "lower" },
        { label: "p95 Latency", before: "20ms", after: "10ms", delta: "-50.0%", better: "lower" },
      ],
      condition: "로컬 테스트 환경에서 JMeter로 동일 데이터셋과 동일 요청 시나리오의 Before/After 평균 및 p95를 비교했습니다.",
    },
    {
      id: "mbti-topk",
      title: "MBTI 추천 — 전체 정렬을 Top-K 추출로",
      summary:
        "상위 12건을 위해 전체 사용자를 정렬하던 문제를 후보군 축소와 PriorityQueue Top-K로 해결했습니다.",
      before: {
        label: "Before: 전체 계산 및 정렬",
        code: {
          language: "java",
          code: `findAllUsers()
    .map(this::cosineSimilarity)
    .sorted(Comparator.reverseOrder())
    .limit(12);`,
        },
        notes: ["전체 사용자 벡터 변환", "O(n log n) 전체 정렬 후 12건만 사용"],
      },
      after: {
        label: "After: 후보군 축소 + PriorityQueue",
        code: {
          language: "java",
          code: `var candidates = findByGenderAndBirthYear(gender, birthYear);
var topScores = new PriorityQueue<Score>(12);
// 크기 12를 넘으면 최솟값을 버리며 Top-K만 유지`,
        },
        notes: ["성별·연령으로 후보군 선축소", "힙 크기를 12로 고정해 정렬 비용 제거"],
      },
      metrics: [
        { label: "Avg Response Time", before: "27.9ms", after: "7.21ms", delta: "-74.2%", better: "lower" },
        { label: "p95 Latency", before: "33ms", after: "9ms", delta: "-72.7%", better: "lower" },
      ],
      condition: "로컬 테스트 환경에서 JMeter로 동일 데이터셋과 동일 요청 시나리오의 Before/After 평균 및 p95를 비교했습니다.",
    },
  ],

  demo: [
    {
      id: "mbti-test",
      label: "MBTI 진단",
      caption:
        "나이·성별·각 MBTI 문자를 수치 벡터로 변환합니다. MBTI 문자는 연속형 점수가 아니라 유형별 이진값으로 사용합니다.",
    },
    {
      id: "recommend",
      label: "성향 추천",
      caption:
        "성별·연령으로 후보군을 좁힌 뒤 코사인 유사도 Top-K를 뽑습니다. 후보군 축소를 껐다 켜면 계산 건수가 어떻게 달라지는지 볼 수 있습니다.",
    },
    {
      id: "keyword",
      label: "키워드 필터",
      caption:
        "선택한 키워드가 비트마스크로 바뀌고, 여행지 마스크와의 AND 연산으로 점수가 매겨집니다.",
    },
    {
      id: "chatbot",
      label: "AI 챗봇",
      caption:
        "OpenAI API로 자연어 여행 질문에 답하던 챗봇입니다. 데모에서는 미리 준비된 응답을 스트리밍하듯 보여줍니다.",
    },
    {
      id: "matching",
      label: "글로플러 매칭",
      caption:
        "지역 전문가와 매칭되어 WebSocket 채팅으로 일정을 조율하는 흐름입니다.",
    },
  ],
};
