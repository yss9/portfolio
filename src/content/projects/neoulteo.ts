import type { Project } from "../types";

export const neoulteo: Project = {
  slug: "neoulteo",
  no: "04",
  name: "Neoulteo",
  tagline: "공공 관광 데이터 기반 여행 계획 플랫폼",
  summary:
    "공공 관광 데이터, 지도, 사용자 기록, 커뮤니티, AI 추천을 하나로 묶은 여행 계획 웹 서비스입니다. 지역별 관광지를 지도에서 탐색하고 마음에 드는 장소를 저장해 일차별 여행 코스를 만들 수 있으며, Spring AI 기반 여행 도우미가 코스 피드백과 지역 추천을 제공합니다.",
  period: "SSAFY 관통 프로젝트",
  team: "팀 프로젝트",
  role: "백엔드 · AI 연동 · 프론트엔드",
  teamShort: "팀 프로젝트 · BE/AI",

  stack: [
    { group: "Backend", items: ["Spring Boot", "Spring Security", "Spring AI", "Spring Batch"] },
    { group: "Frontend", items: ["Vue 3", "Vite", "Vue Router"] },
    { group: "Data", items: ["MySQL", "MyBatis"] },
    { group: "AI", items: ["Spring AI", "RAG", "Tool Calling", "GMS OpenAI", "FastAPI", "ChromaDB"] },
    { group: "Map / Data", items: ["Kakao Map API", "SVG Korea Map", "한국관광공사 TourAPI"] },
    { group: "Auth", items: ["JWT", "Remember-me Cookie"] },
  ],
  stackFlat: ["Spring Boot", "Vue 3", "MySQL", "MyBatis", "Spring AI", "Spring Batch", "Kakao Map"],

  links: [{ label: "GitHub", href: "https://github.com/yss9/neoulteo", kind: "github" }],

  preview: {
    src: "/shots/neoulteo-attractions.png",
    alt:
      "Neoulteo 관광지 검색 데모 — 지도 마커에서 경복궁을 선택해 상세 정보가 열린 상태",
  },

  highlights: ["Spring AI Tool Calling", "TourAPI 배치 동기화", "RAG 기반 검색 보강"],

  features: [
    {
      title: "회원과 인증",
      desc: "JWT 기반 인증과 Spring Security 접근 제어, Remember-me 로그인 유지, 프로필 관리 및 회원 탈퇴",
    },
    {
      title: "관광지 검색",
      desc: "한국관광공사 TourAPI 데이터를 지역·구군·카테고리·키워드 조건으로 검색하고 Kakao Map 마커로 표시",
    },
    {
      title: "여행 계획",
      desc: "일차별 장소 관리와 순서 변경, 경로 표시, 공유 코드로 다른 사용자의 코스 가져오기",
    },
    {
      title: "핫플레이스",
      desc: "관광지를 기반으로 내 핫플레이스를 등록하고 설명·이미지를 저장, 많이 등록된 상위 목록 제공",
    },
    {
      title: "커뮤니티",
      desc: "공지사항·자유게시판·여행 후기·Q&A·여행 계획 공유 게시판, 댓글과 좋아요, 이미지 업로드",
    },
    {
      title: "AI 여행 도우미",
      desc: "Spring AI 기반 챗봇이 Tool Calling과 RAG로 DB 관광지 정보를 근거 삼아 답하고, 여행 계획의 일정 강도·동선·카테고리 균형을 평가",
    },
    {
      title: "관광지 데이터 배치",
      desc: "Spring Batch로 TourAPI를 동기화하고 기존 DB와 비교해 신규·수정 관광지를 반영, 비교 결과를 PDF 리포트로 생성",
    },
  ],

  architecture: [
    {
      id: "vue",
      label: "Vue 3 + Vite",
      role: "SVG 지도 홈, 관광지 검색, 일차별 여행 계획, 커뮤니티 화면 담당",
      band: "client",
    },
    {
      id: "spring",
      label: "Spring Boot",
      role: "회원·관광지·핫플레이스·여행계획·커뮤니티 도메인 API와 Spring Security 접근 제어",
      band: "server",
    },
    {
      id: "ai",
      label: "Spring AI",
      role: "질문 의도 분석 후 관광지 검색 Tool·RAG 호출, 프롬프트 보강 후 최종 답변 생성",
      band: "server",
    },
    {
      id: "batch",
      label: "Spring Batch",
      role: "TourAPI 콘텐츠 타입별 수집, 기존 DB와 비교해 변경분 반영 및 PDF 리포트 생성",
      band: "infra",
    },
    {
      id: "mysql",
      label: "MySQL + MyBatis",
      role: "관광지 메타데이터, 여행 계획, 핫플레이스, 커뮤니티 데이터 관리",
      band: "data",
    },
    {
      id: "external",
      label: "TourAPI · Kakao Map · ChromaDB",
      role: "공공 관광 데이터 수집, 지도 렌더링, RAG 문서 벡터 검색(FastAPI 서버)",
      band: "external",
    },
  ],
  architectureIntent:
    "공공 데이터는 배치로 미리 동기화해두고, AI는 그 DB를 근거로만 답하도록 Tool Calling과 RAG를 붙였습니다.",

  troubleshooting: [],

  designNotes: [
    {
      id: "spring-ai-tool-calling",
      title: "Spring AI Tool Calling · RAG 동작 설계",
      problem:
        "일반 지식만으로 답하는 챗봇은 프로젝트 DB에 있는 실제 관광지를 추천하지 못합니다. 질문을 받으면 필요한 도구를 먼저 호출하고, 그 결과를 근거로 답하도록 설계했습니다.",
      steps: [
        { label: "1", title: "질문 입력", body: "사용자가 여행 관련 질문을 입력합니다." },
        { label: "2", title: "의도 분석", body: "Spring AI가 질문 의도를 분석해 어떤 도구가 필요한지 판단합니다." },
        {
          label: "3",
          title: "Tool / RAG 호출",
          body: "필요한 경우 관광지 검색 Tool이나 RAG 검색을 호출합니다. 날씨 Tool과 외부 여행 검색 Tool은 확장 포인트로 열어 두었습니다.",
        },
        {
          label: "4",
          title: "프롬프트 보강",
          body: "DB 관광지 정보와 검색 결과를 프롬프트에 덧붙여 모델이 실제 데이터를 근거로 삼도록 합니다.",
        },
        { label: "5", title: "답변 생성", body: "GMS OpenAI 모델이 보강된 컨텍스트로 최종 답변을 생성합니다." },
      ],
      takeaway:
        "모델이 알고 있는 일반 지식이 아니라 프로젝트 DB의 관광지 정보를 근거로 답하게 되어, 추천 결과를 서비스 안에서 바로 여행 계획으로 이어붙일 수 있습니다.",
    },
    {
      id: "tourapi-batch",
      title: "TourAPI 동기화 배치 설계",
      problem:
        "공공 관광 데이터는 수시로 갱신되지만 매 요청마다 외부 API를 호출하면 응답 지연과 호출 한도 문제가 생깁니다. 배치로 미리 동기화하는 구조를 택했습니다.",
      steps: [
        { label: "1", title: "수집", body: "Spring Batch로 콘텐츠 타입별 관광지 데이터를 수집합니다." },
        { label: "2", title: "비교", body: "기존 DB 데이터와 API 응답을 비교해 신규·수정 대상을 가려냅니다." },
        { label: "3", title: "반영", body: "변경분만 DB에 반영해 전체 재적재를 피합니다." },
        {
          label: "4",
          title: "리포트",
          body: "비교 결과를 PDF 리포트로 생성하고, GMS OpenAI로 변경 내역을 요약합니다.",
        },
      ],
      takeaway:
        "조회 경로에서 외부 API 의존을 걷어내 검색 응답을 DB 조회만으로 처리할 수 있게 됐습니다.",
    },
  ],

  performance: [],

  demo: [
    {
      id: "home",
      label: "지도 홈",
      caption: "대한민국 SVG 지도에서 지역을 고르면 해당 지역의 관광지 통계로 이동합니다.",
    },
    {
      id: "attractions",
      label: "관광지 검색",
      caption:
        "지역·구군·카테고리·키워드를 조합해 TourAPI 관광지를 검색하고 지도 마커로 확인합니다. 실제 서비스는 Kakao Map을 사용합니다.",
    },
    {
      id: "plans",
      label: "여행 계획",
      caption:
        "일차별로 장소를 담고 순서를 바꿉니다. 공유 코드를 입력하면 다른 사용자의 코스를 가져올 수 있습니다.",
    },
    {
      id: "hotplaces",
      label: "핫플레이스",
      caption: "관광지를 기반으로 내 핫플레이스를 등록하고, 많이 등록된 순으로 상위 목록을 봅니다.",
    },
    {
      id: "community",
      label: "커뮤니티",
      caption:
        "게시판 타입별로 글을 나눠 보여줍니다. 여행 계획 공유글은 카드형으로 강조되고, 공지사항은 관리자만 작성할 수 있습니다.",
    },
    {
      id: "ai",
      label: "AI 여행 도우미",
      caption:
        "질문을 넣으면 어떤 Tool이 호출되고 어떤 문서가 근거로 붙는지 단계별로 보여줍니다. 여행 계획 평가도 여기서 실행합니다.",
    },
    {
      id: "batch",
      label: "TourAPI 동기화",
      caption:
        "Spring Batch가 API 응답과 DB를 비교해 신규·수정 건을 가려내고 리포트를 만드는 과정입니다.",
    },
  ],
};
