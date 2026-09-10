import type { Project } from "../types";

export const neoulteo: Project = {
  slug: "neoulteo",
  no: "02",
  name: "Neoulteo",
  tagline: "공공 관광 데이터 기반 여행 계획 플랫폼",
  summary:
    "공공 관광 데이터, 지도, 사용자 기록, 커뮤니티, AI 추천을 하나로 묶은 여행 계획 웹 서비스입니다. 지역별 관광지를 지도에서 탐색하고 마음에 드는 장소를 저장해 일차별 여행 코스를 만들 수 있으며, Spring AI 기반 여행 도우미가 코스 피드백과 지역 추천을 제공합니다.",
  period: "2026.05 ~ 2026.06",
  team: "2인 팀",
  role: "백엔드 중심 · AI 연동 · 프론트 일부",
  teamShort: "2인 팀 · BE/AI/FE",

  stack: [
    { group: "Backend", items: ["Spring Boot", "Spring Security", "Spring AI", "Spring Batch"] },
    { group: "Frontend", items: ["Vue 3", "Vite", "Vue Router"] },
    { group: "Data", items: ["MySQL", "MyBatis"] },
    { group: "AI", items: ["Spring AI", "Hybrid RAG", "GMS OpenAI", "FastAPI", "ChromaDB (별도 실험)"] },
    { group: "Map / Data", items: ["Kakao Map API", "SVG Korea Map", "한국관광공사 TourAPI"] },
    { group: "Auth", items: ["JWT", "localStorage / sessionStorage"] },
  ],
  stackFlat: ["Spring Boot", "Vue 3", "MySQL", "MyBatis", "Spring AI", "Spring Batch", "Kakao Map"],

  links: [{ label: "GitHub", href: "https://github.com/yss9/neoulteo", kind: "github" }],

  preview: {
    src: "/projects/neoulteo/overview.png",
    alt:
      "Neoulteo 대한민국 SVG 지도에서 부산광역시를 선택해 인기 장소와 등록 수가 열린 홈 화면",
  },

  screenshots: [
    {
      src: "/projects/neoulteo/overview.png",
      alt: "Neoulteo 한지 질감의 대한민국 지도에서 부산광역시를 선택해 해운대와 감천문화마을 인기 정보를 확인하는 홈 화면",
      caption: "지역 지도 홈 — 시도별 핫플레이스 수를 보고 부산 인기 장소를 지도에서 바로 탐색",
    },
    {
      src: "/projects/neoulteo/hotplaces.png",
      alt: "Neoulteo 인기 핫플레이스 TOP 5에 해운대, 감천문화마을, 광안리 사진과 등록 수, 사용자 후기가 표시된 화면",
      caption: "핫플레이스 — 사용자 등록 수 기반 인기 순위와 장소별 후기·저장·공유 기능",
    },
    {
      src: "/projects/neoulteo/community.png",
      alt: "Neoulteo 커뮤니티에서 공지, 자유, 후기, Q&A, 여행 계획 공유 카테고리와 여덟 개 게시글 카드가 보이는 목록 화면",
      caption: "여행 커뮤니티 — 여섯 카테고리, 검색·정렬과 코스 공유 전용 카드 표현",
    },
    {
      src: "/projects/neoulteo/detail.png",
      alt: "Neoulteo 해운대해수욕장 후기 상세에서 작성자, 조회와 좋아요 수, 해운대 사진을 확인하는 화면",
      caption: "후기 상세 — 여행지 이미지, 작성자·조회·좋아요와 댓글 소통 흐름",
    },
  ],

  highlights: ["Spring AI 여행 도우미", "TourAPI Spring Batch", "DB 기반 Hybrid RAG"],

  features: [
    {
      title: "회원과 인증",
      desc: "Spring Security 기반 Stateless JWT 인증과 접근 제어를 구현했습니다. 로그인 유지 선택에 따라 프론트엔드가 토큰을 localStorage 또는 sessionStorage에 저장하며, 프로필 관리와 회원 탈퇴 흐름을 제공합니다.",
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
      desc: "질문의 키워드를 기준으로 관광지·날씨·검색 도구를 애플리케이션에서 조합하고, 도구 결과와 DB 기반 RAG 문맥을 Spring AI ChatClient에 전달해 답변과 여행 계획 피드백을 생성합니다.",
    },
    {
      title: "관광지 데이터 배치",
      desc: "Spring Batch로 TourAPI 데이터를 수집하고 기존 DB와 비교해 신규·수정·유지 항목을 집계합니다. 저장 단계에서는 전체 수집 항목을 ON DUPLICATE KEY UPDATE 방식으로 upsert하고 비교 결과를 PDF 리포트로 생성합니다.",
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
      role: "키워드 조건으로 관광지·날씨·검색 도구를 조합하고 DB 기반 RAG 문맥으로 프롬프트를 보강해 답변 생성",
      band: "server",
    },
    {
      id: "batch",
      label: "Spring Batch",
      role: "TourAPI 콘텐츠 타입별 수집, 기존 DB와 비교·집계, 전체 항목 upsert 및 PDF 리포트 생성",
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
      label: "TourAPI · Kakao Map · FastAPI/ChromaDB",
      role: "공공 관광 데이터 수집과 지도 렌더링을 담당하며, FastAPI·ChromaDB는 Spring RAG와 분리된 실험 endpoint로 구성",
      band: "external",
    },
  ],
  architectureIntent:
    "공공 데이터는 배치로 미리 동기화하고, 애플리케이션이 질문에 필요한 도구와 DB 기반 RAG 문맥을 조합해 AI가 실제 관광지 데이터를 근거로 답하도록 구성했습니다.",

  troubleshooting: [],

  designNotes: [
    {
      id: "spring-ai-tool-calling",
      title: "Spring AI 도구 오케스트레이션 · RAG 설계",
      problem:
        "일반 지식만으로 답하는 챗봇은 프로젝트 DB에 있는 실제 관광지를 추천하지 못합니다. 애플리케이션이 질문의 키워드에 따라 필요한 도구를 선택하고, 조회 결과를 근거로 답하도록 설계했습니다.",
      steps: [
        { label: "1", title: "질문 입력", body: "사용자가 여행 관련 질문을 입력합니다." },
        { label: "2", title: "키워드 분석", body: "애플리케이션이 질문의 키워드를 검사해 날씨·웹 검색 도구의 실행 여부를 결정합니다." },
        {
          label: "3",
          title: "Tool / RAG 호출",
          body: "관광지 검색과 RAG를 실행하고, 질문에 관련 키워드가 있을 때 날씨 또는 외부 검색 도구를 추가로 호출합니다.",
        },
        {
          label: "4",
          title: "프롬프트 보강",
          body: "DB 관광지 정보와 검색 결과를 프롬프트에 덧붙여 모델이 실제 데이터를 근거로 삼도록 합니다.",
        },
        { label: "5", title: "답변 생성", body: "GMS OpenAI 모델이 보강된 컨텍스트로 최종 답변을 생성합니다." },
      ],
      takeaway:
        "LLM에 도구 선택을 완전히 위임하지 않고 애플리케이션이 호출 조건을 통제해 실행 흐름을 예측 가능하게 유지하면서, 프로젝트 DB의 관광지 정보를 답변 근거로 제공했습니다.",
    },
    {
      id: "tourapi-batch",
      title: "TourAPI 동기화 배치 설계",
      problem:
        "공공 관광 데이터는 수시로 갱신되지만 매 요청마다 외부 API를 호출하면 응답 지연과 호출 한도 문제가 생깁니다. 배치로 미리 동기화하는 구조를 택했습니다.",
      steps: [
        { label: "1", title: "수집", body: "Spring Batch로 콘텐츠 타입별 관광지 데이터를 수집합니다." },
        { label: "2", title: "비교", body: "기존 DB 데이터와 API 응답을 비교해 신규·수정·유지 항목을 분류하고 집계합니다." },
        { label: "3", title: "반영", body: "전체 수집 항목에 대해 ON DUPLICATE KEY UPDATE 방식으로 upsert해 truncate 후 재적재 없이 데이터를 갱신합니다." },
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
        "질문 키워드에 따라 어떤 도구가 실행되고 어떤 DB 문서가 근거로 붙는지 단계별로 보여줍니다. 여행 계획 평가도 여기서 실행합니다.",
    },
    {
      id: "batch",
      label: "TourAPI 동기화",
      caption:
        "Spring Batch가 API 응답과 DB를 비교·집계하고 전체 항목을 upsert한 뒤 리포트를 만드는 과정입니다.",
    },
  ],
};
