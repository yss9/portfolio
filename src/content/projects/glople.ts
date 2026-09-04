import type { Project } from "../types";

export const glople: Project = {
  slug: "glople",
  no: "02",
  name: "Glople",
  tagline: "MBTI 기반 여행지 추천 커뮤니티",
  summary:
    "사용자 성향(MBTI, 연령, 성별)을 기반으로 맞춤형 여행지와 루트를 제안하는 커뮤니티 서비스입니다. 여행자는 자신의 성향에 맞는 여행지를 추천받고, 해당 지역의 전문가인 '글로플러'와 매칭되어 개인화된 여행 경험을 제공받습니다.",
  period: "2024.03 ~ 2024.11",
  team: "5인 (개발 5 · 디자인 2)",
  role: "팀장 · 추천 로직 구현 및 프론트 일부 개발",
  teamShort: "5인 팀 · 팀장",

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
    src: "/shots/glople-keyword.png",
    alt:
      "Glople 키워드 필터 데모 — 선택한 키워드가 비트마스크로 변환되고 여행지별 AND 연산 점수가 계산된 목록",
  },

  highlights: ["MBTI 추천 27.9ms → 7.21ms", "Bitmask + Top-K 도입", "5인 팀 리딩"],

  features: [
    {
      title: "개인 맞춤형 추천",
      desc: "MBTI 4축과 인구통계 정보를 벡터화하여 코사인 유사도 기반 맞춤형 루트 추천",
    },
    {
      title: "키워드 필터링",
      desc: "사용자가 선택한 관심 키워드를 여행지 설명과 매칭해 관련 여행지를 정렬",
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
      title: "팀 리딩 및 관리",
      desc: "5인 규모 팀의 일정 관리, 기능 조율, 발표 준비 등 프로젝트 진행 총괄",
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
        "추천 결과의 정확도와 응답 속도가 함께 문제였습니다. 정확도·문자열 탐색·정렬 비용 세 축으로 나눠 원인을 분리했습니다.",
      steps: [
        {
          label: "1",
          title: "추천 정확도 문제 (Accuracy)",
          body: "초기 설계는 사용자를 16가지 MBTI 유형 중 하나로 분류했습니다. 동일 MBTI 안의 취향 차이와 세부 성향 유사도를 충분히 반영하기 어려웠습니다. → MBTI 4축 + 인구통계 벡터화 및 코사인 유사도 도입",
        },
        {
          label: "2",
          title: "Keyword 추천 병목 (String Search)",
          body: "전체 데이터를 조회(findAll)한 뒤 Java에서 문자열 탐색(contains)을 반복했습니다. 정렬 과정에서도 매칭 키워드 수 계산이 중복되었습니다. → keyword_mask 후보 필터링 + Java bitCount 점수 계산",
        },
        {
          label: "3",
          title: "MBTI 추천 병목 (Sorting Cost)",
          body: "상위 12건만 필요하지만 전체 사용자에 대해 벡터 변환과 유사도 계산을 수행한 뒤 전체 정렬 후 limit을 적용했습니다. → 성별/연령 후보군 축소 + PriorityQueue Top-K 추출",
        },
      ],
      takeaway:
        "필요한 결과가 상위 N건뿐이라면 전체를 계산하고 정렬하는 구조 자체가 비용입니다. 후보군을 먼저 줄이고 Top-K만 뽑는 방향으로 재설계했습니다.",
    },
  ],

  performance: [
    {
      id: "keyword-bitmask",
      title: "Keyword 추천 — 문자열 탐색을 비트 연산으로",
      summary:
        "전체 여행지를 조회한 뒤 Java에서 문자열 포함 검사를 반복하던 구조를, DB 단계에서 비트마스크로 후보를 거르고 bitCount로 점수를 계산하는 방식으로 바꿨습니다.",
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
          code: `-- DB에서 후보군만 추림
WHERE (keyword_mask & :mask) <> 0

-- 점수는 비트 개수로 즉시 계산
score = bitCount(keyword_mask & mask)`,
        },
        notes: ["후보군을 DB에서 선별", "점수 계산이 비교 1회당 상수 시간"],
      },
      metrics: [
        { label: "Keyword 추천 Avg", before: "15.7ms", after: "8.92ms", delta: "-43.3%", better: "lower" },
        { label: "Keyword 추천 p95", before: "20ms", after: "10ms", delta: "-50.0%", better: "lower" },
      ],
      condition: "측정 도구: JMeter",
    },
    {
      id: "mbti-topk",
      title: "MBTI 추천 — 전체 정렬을 Top-K 추출로",
      summary:
        "상위 12건만 필요한데도 전체 사용자에 대해 벡터 변환과 유사도 계산을 수행하고 전체 정렬 후 limit을 적용하고 있었습니다. 후보군을 먼저 좁히고 PriorityQueue로 Top-K만 유지하도록 바꿨습니다.",
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
        { label: "MBTI 추천 Avg", before: "27.9ms", after: "7.21ms", delta: "-74.2%", better: "lower" },
        { label: "MBTI 추천 p95", before: "33ms", after: "9ms", delta: "-72.7%", better: "lower" },
      ],
      condition: "측정 도구: JMeter",
    },
  ],

  demo: [
    {
      id: "mbti-test",
      label: "MBTI 진단",
      caption:
        "16가지 유형으로 분류하는 대신 4축을 각각 연속값으로 저장합니다. 응답을 바꾸면 아래 벡터가 바로 갱신됩니다.",
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
