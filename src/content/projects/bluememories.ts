import type { Project } from "../types";

export const bluememories: Project = {
  slug: "bluememories",
  no: "05",
  name: "BlueMemories",
  tagline: "AI 감정 기록 및 멘탈케어 커뮤니티",
  summary:
    "기존 서비스 리뉴얼을 통해 감정 분석 및 콘텐츠 추천, 공유 일기장 구조를 확장한 멘탈케어 서비스입니다. 1:1 교환일기를 여러 명이 함께 쓰는 공유 일기장으로 확장하고, 소통을 위한 커뮤니티 기능을 신설했습니다.",
  period: "2024.07 ~ 2024.09",
  team: "2인 (개발자 1인 + 디자인 1인)",
  role: "기획 및 백엔드/프론트엔드 개발 총괄",
  teamShort: "2인 팀 · 개발 총괄",

  stack: [
    { group: "Backend", items: ["Spring Boot", "Spring MVC", "Spring Security", "JWT", "WebClient"] },
    { group: "Frontend", items: ["React", "styled-components"] },
    { group: "Data", items: ["MySQL", "AWS S3"] },
    { group: "AI / External", items: ["OpenAI API", "Ollama", "YouTube Data API", "Naver Clova (초기 버전)"] },
  ],
  stackFlat: ["Spring Boot", "React", "MySQL", "WebClient", "JWT", "S3", "OpenAI", "Ollama"],

  links: [{ label: "GitHub", href: "https://github.com/yss9/BlueMemories", kind: "github" }],

  preview: {
    src: "/projects/bluememories/calendar.png",
    alt:
      "BlueMemories 2026년 9월 감정 캘린더에 긍정·중립·부정 일기가 표정 아이콘으로 표시된 화면",
  },

  screenshots: [
    {
      src: "/projects/bluememories/overview.png",
      alt: "BlueMemories 메인 화면의 감정 기록 서비스 로고와 라이프스타일·일기·무드트래킹 소개",
      caption: "서비스 홈 — 하루의 감정을 기록하고 공유하는 핵심 가치를 소개",
    },
    {
      src: "/projects/bluememories/calendar.png",
      alt: "BlueMemories 2026년 9월 달력에 작성한 일기의 감정이 웃음·무표정·슬픔 아이콘으로 표시된 화면",
      caption: "감정 캘린더 — 일기별 감정 분석 결과를 월간 흐름으로 시각화",
    },
    {
      src: "/projects/bluememories/community.png",
      alt: "BlueMemories 커뮤니티에 비 온 뒤 맑아진 오후 등 이미지가 포함된 여섯 개의 공개 일기 카드가 배치된 화면",
      caption: "커뮤니티 — 공개 일기를 이미지 카드로 탐색하고 상세 화면으로 이동",
    },
    {
      src: "/projects/bluememories/detail.png",
      alt: "BlueMemories 일기 상세 화면에서 비 온 뒤 맑아진 오후 본문과 긍정 76퍼센트 감정 분석 결과를 확인하는 모습",
      caption: "일기 상세 — 본문, 날씨, 감정 점수, 콘텐츠 추천을 함께 제공",
    },
  ],

  architectureImage: {
    src: "/projects/bluememories/architecture.png",
    alt: "BlueMemories React 프론트엔드, Spring Boot 백엔드, MySQL, 외부 AI·영상 API와 AWS S3 구조를 보여주는 시스템 아키텍처",
    width: 1208,
    height: 591,
  },

  highlights: ["AI 응답 JSON 계약·Fallback", "N:M 공유 일기장 확장", "DTO Projection 목록 조회"],

  features: [
    {
      title: "일기 CRUD 구현",
      desc: "일기 작성, 조회, 수정, 삭제를 위한 안정적인 REST API 및 사용자 인터페이스 구현",
    },
    {
      title: "AI 감정 분석 연동",
      desc: "초기에는 Naver Clova로 일기의 감정을 분석했으며, 이후 OpenAI 또는 Ollama를 설정으로 선택하고 JSON 감정 점수를 검증하는 구조로 사후 리팩터링했습니다.",
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
    {
      title: "커뮤니티 목록 DTO Projection",
      desc: "Entity 조회 후 작성자·댓글·좋아요를 후처리하던 구조를 작성자 정보와 집계값을 직접 반환하는 DTO Projection으로 사후 리팩터링했습니다.",
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
      role: "OpenAI 또는 Ollama로 감정·추천 JSON을 생성하고 YouTube API로 콘텐츠 검색, 초기 버전에서는 Naver Clova 사용",
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
    "감정 분석과 추천처럼 외부 응답에 의존하는 구간에 JSON 검증·제한된 재시도·기본값 fallback을 적용해 일기 저장 흐름이 중단되지 않도록 구성했습니다.",

  troubleshooting: [
    {
      id: "gpt-json-contract",
      title: "AI 응답 파싱 구조 사후 리팩터링",
      problem:
        "2026년 포트폴리오 사후 리팩터링에서 정규식으로 AI 응답을 파싱하던 구조를 JSON 계약 + DTO 검증 + fallback 구조로 변경했습니다.",
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
        "현재 코드는 응답 형식이 흔들려도 추천 실패를 감지하고 검증된 데이터만 사용합니다. 이 개선은 2024년 프로젝트 당시 구현과 구분해 2026년 사후 리팩터링으로 표기합니다.",
    },
  ],

  performance: [],

  demo: [
    {
      id: "write",
      label: "일기 작성 · 감정 분석",
      caption:
        "일기를 저장하면 설정된 OpenAI 또는 Ollama 제공자가 JSON 감정 점수를 반환하고, 서버가 점수 범위를 검증한 뒤 Diary 레코드에 저장합니다.",
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
        "작성자 정보와 댓글·좋아요 수를 DTO Projection으로 함께 조회하는 목록 화면입니다. 정량 성능 수치는 별도 측정 자료가 없어 표기하지 않습니다.",
    },
  ],
};
