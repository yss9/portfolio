import type { Project } from "../types";

export const bluememories: Project = {
  slug: "bluememories",
  no: "03",
  name: "BlueMemories",
  tagline: "AI 감정 기록 및 멘탈케어 커뮤니티",
  summary:
    "기존 서비스 리뉴얼을 통해 감정 분석 및 콘텐츠 추천, 공유 일기장 구조를 확장한 멘탈케어 서비스입니다. 1:1 교환일기를 여러 명이 함께 쓰는 공유 일기장으로 확장하고, 소통을 위한 커뮤니티 기능을 신설했습니다.",
  period: "2024.07 ~ 2024.09",
  team: "2인 (개발 1 · 디자인 1)",
  role: "기획 및 백엔드/프론트엔드 개발 총괄",
  teamShort: "2인 · 개발 총괄",

  stack: [
    { group: "Backend", items: ["Spring Boot", "Spring MVC", "Spring Security", "JWT", "WebClient"] },
    { group: "Frontend", items: ["React", "styled-components"] },
    { group: "Realtime", items: ["WebSocket"] },
    { group: "Data", items: ["MySQL", "AWS S3"] },
    { group: "External APIs", items: ["Naver Clova Sentiment", "OpenAI API", "YouTube Data API"] },
  ],
  stackFlat: ["Spring Boot", "React", "MySQL", "WebClient", "JWT", "S3", "OpenAI", "Clova"],

  links: [{ label: "GitHub", href: "https://github.com/yss9/BlueMemories", kind: "github" }],

  preview: {
    src: "/shots/bluememories-write.png",
    alt:
      "BlueMemories 일기 작성 데모 — 저장 후 Clova Sentiment 감정 수치가 긍정·중립·부정 막대로 표시된 상태",
  },

  highlights: ["응답 147.85ms → 3.63ms", "Payload 748KB → 4KB", "GPT 응답 JSON 계약화"],

  features: [
    {
      title: "일기 CRUD 구현",
      desc: "일기 작성, 조회, 수정, 삭제를 위한 안정적인 REST API 및 사용자 인터페이스 구현",
    },
    {
      title: "AI 감정 분석 연동",
      desc: "Naver Clova Sentiment API를 활용하여 작성된 일기 텍스트의 감정 수치를 분석하고 저장",
    },
    {
      title: "맞춤형 콘텐츠 추천",
      desc: "OpenAI와 YouTube API를 조합하여 분석된 감정에 어울리는 음악 및 영상 추천 로직 설계",
    },
    {
      title: "공유 일기장 확장",
      desc: "기존 1:1 교환일기 방식에서 N:M 그룹 공유 일기장 구조로 데이터 스키마 및 기능 확장",
    },
    {
      title: "인증 및 파일 저장",
      desc: "JWT 기반 보안 인증 체계 구축 및 AWS S3를 연동한 이미지 업로드/관리 구조 최적화",
    },
  ],

  architecture: [
    {
      id: "react",
      label: "React",
      role: "일기 작성, 감정 캘린더, 커뮤니티 화면 및 사용자 인터랙션 담당",
      band: "client",
    },
    {
      id: "spring",
      label: "Spring Boot",
      role: "일기, 공유 일기장, 댓글, 공감, 추천 로직 등 핵심 API 비즈니스 로직 처리",
      band: "server",
    },
    {
      id: "mysql",
      label: "MySQL",
      role: "사용자 프로필, 일기 데이터, 감정 분석 결과, 커뮤니티 관계망 저장",
      band: "data",
    },
    {
      id: "ai",
      label: "AI APIs",
      role: "Naver(감정 분석), OpenAI(키워드 생성), YouTube(콘텐츠 검색) 연동",
      band: "external",
    },
    {
      id: "s3",
      label: "AWS S3",
      role: "일기 내 첨부 이미지 및 정적 리소스를 서버와 분리하여 효율적으로 관리",
      band: "data",
    },
  ],
  architectureIntent:
    "감정 분석·추천처럼 외부 응답에 의존하는 구간을 WebClient로 분리하고, 실패해도 사용자 흐름이 끊기지 않도록 설계했습니다.",

  troubleshooting: [
    {
      id: "gpt-json-contract",
      title: "GPT 응답 파싱 오류 해결",
      problem:
        "정규식으로 GPT 응답을 억지로 파싱하던 구조를 JSON 계약 + DTO 검증 + fallback 구조로 바꿔 추천 실패를 줄였습니다.",
      steps: [
        {
          label: "AS-IS",
          title: "정규식 기반 파싱 구조",
          body: "프롬프트로 번호 형식을 유도하고 문자열에서 추천 키워드를 추출했습니다. \"1. 노래 / 3. 검색어\" 같은 번호 형식에 의존해 Pattern 정규식으로 타입과 내용을 분리하는 방식이었습니다.",
        },
        {
          label: "문제",
          title: "응답 형식 변형에 취약",
          body: "응답 순서나 문구가 조금만 바뀌어도 키워드 추출에 실패했습니다. GPT가 표현을 섞거나 순서를 바꾸면 누락이 발생했고, 고정 형식에서만 동작하는 한계가 있었습니다.",
        },
        {
          label: "TO-BE",
          title: "JSON 계약 + DTO 검증 구조",
          body: "songs[], searchKeywords[] 형태의 JSON 응답으로 고정하고, ObjectMapper로 RecommendationResponseDto에 파싱했습니다. songs 2개, searchKeywords 2개를 필수 조건으로 두어 필드 누락·개수 불일치를 서버에서 감지합니다.",
        },
        {
          label: "예외",
          title: "fallback 처리",
          body: "파싱 실패 시 기본 추천값을 반환해 사용자 흐름을 유지했습니다.",
        },
      ],
      code: [
        {
          filename: "RecommendationResponse.json",
          language: "json",
          code: `{
  "songs": [
    { "title": "밤편지", "artist": "아이유" },
    { "title": "Through the Night", "artist": "IU" }
  ],
  "searchKeywords": ["잔잔한 새벽 플레이리스트", "마음이 편해지는 영상"]
}`,
        },
      ],
      takeaway:
        "응답 형식이 흔들려도 추천 실패를 감지하고, 검증된 데이터만 저장하도록 AI 추천 처리 흐름의 안정성을 높였습니다.",
    },
  ],

  performance: [
    {
      id: "public-diary-projection",
      title: "공개 일기 목록 조회 최적화",
      summary:
        "공개 일기 전체를 조회한 뒤 엔티티를 순회하며 DTO로 변환하고 있었습니다. Pagination과 JOIN Projection을 적용해 조회 범위와 응답 크기를 함께 줄였습니다.",
      before: {
        label: "Before: 비효율적 전체 조회",
        code: {
          language: "java",
          code: `// 공개 일기 전체 조회 — 데이터 규모와 무관하게 전 레코드 로드
List<Diary> diaries = diaryRepository.findByIsPrivateFalse();

// Entity 순회 변환 — 연관된 User 접근마다 지연 로딩 발생
return diaries.stream()
    .map(d -> new DiaryDto(d, d.getUser().getNickname()))
    .toList();`,
        },
        notes: [
          "데이터 규모와 관계없이 모든 레코드를 메모리에 로드",
          "연관 User 정보를 개별 순회하며 지연 로딩 발생",
          "목록에 불필요한 본문·전체 이미지 경로까지 모두 전송",
        ],
      },
      after: {
        label: "After: Pagination & JOIN Projection",
        code: {
          language: "java",
          code: `@Query("""
    SELECT new com.bluememories.dto.DiaryListDto(
        d.id, d.title, d.date, d.sentiment, d.likeNum, u.nickname)
    FROM Diary d JOIN d.user u
    WHERE d.isPrivate = false
    ORDER BY d.createdAt DESC
""")
Page<DiaryListDto> findPublicDiaries(Pageable pageable);`,
        },
        notes: [
          "필요한 만큼만 끊어서 가져오도록 Pagination 적용",
          "DTO 전용 쿼리로 목록에 필수적인 필드만 선별 조회",
          "대용량 텍스트 필드를 제외해 응답 범위와 크기를 축소",
        ],
      },
      metrics: [
        { label: "DB Query / Request", before: "1001", after: "1", delta: "-99.9%", better: "lower" },
        { label: "Response Payload Size", before: "748KB", after: "4KB", delta: "-99.4%", better: "lower" },
        { label: "Avg Response Time", before: "147.85ms", after: "3.63ms", delta: "-97.5%", better: "lower" },
        { label: "p95 Response Time", before: "161.95ms", after: "5ms", delta: "-96.9%", better: "lower" },
      ],
      condition:
        "측정 조건: 사용자 1,000명 / 일기 2,000건 · JMeter 20 threads × 15 loops (300 requests)",
    },
  ],

  demo: [
    {
      id: "write",
      label: "일기 작성 · 감정 분석",
      caption:
        "일기를 저장하면 Clova Sentiment가 긍정·중립·부정 confidence를 돌려주고, 그 값이 그대로 Diary 레코드에 저장됩니다.",
    },
    {
      id: "calendar",
      label: "감정 캘린더",
      caption:
        "저장된 감정 값을 달력에 색으로 얹어 한 달의 감정 흐름을 한눈에 봅니다.",
    },
    {
      id: "recommend",
      label: "콘텐츠 추천",
      caption:
        "감정 분석 결과를 프롬프트에 넣어 OpenAI가 노래·검색어를 JSON으로 돌려주고, 그 검색어로 YouTube를 조회합니다. 응답이 깨졌을 때의 fallback도 확인할 수 있습니다.",
    },
    {
      id: "shared",
      label: "공유 일기장",
      caption:
        "1:1 교환일기를 N:M 구조로 확장한 화면입니다. 한 일기장에 여러 명이 참여하고 각자 글을 이어 씁니다.",
    },
    {
      id: "community",
      label: "커뮤니티 목록",
      caption:
        "JOIN Projection으로 최적화한 바로 그 화면입니다. 조회 방식을 전환하면 쿼리 수와 응답 크기가 어떻게 달라지는지 볼 수 있습니다.",
    },
  ],
};
