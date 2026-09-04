import type { Project } from "../types";

export const mofy: Project = {
  slug: "mofy",
  no: "05",
  name: "MOFY",
  tagline: "퍼스널 컬러 기반 패션 커뮤니티 · 중고 거래",
  summary:
    "단순한 중고 의류 거래를 넘어, 사용자들이 소통하며 자신만의 패션 스타일을 발견할 수 있도록 돕는 커뮤니티형 중고 거래 플랫폼입니다. AI 이미지 분석으로 업로드한 사진에서 퍼스널 컬러 팔레트를 자동 추출해 스타일을 객관화합니다.",
  period: "팀 프로젝트",
  team: "팀 프로젝트",
  role: "프론트엔드 · 백엔드",
  teamShort: "팀 프로젝트 · FE/BE",

  stack: [
    { group: "Frontend", items: ["Next.js", "React", "styled-components", "Ant Design", "Axios"] },
    { group: "Backend", items: ["Django REST Framework", "Python 3.9+", "SimpleJWT"] },
    { group: "Data", items: ["SQLite", "Media Storage"] },
    { group: "AI / Data", items: ["Rembg", "Pillow", "Extcolors", "Scikit-learn (TF-IDF)"] },
    { group: "External APIs", items: ["OpenWeatherMap"] },
  ],
  stackFlat: ["Next.js", "Django DRF", "SQLite", "JWT", "Rembg", "Extcolors", "Scikit-learn"],

  links: [{ label: "GitHub", href: "https://github.com/yss9/Mofy", kind: "github" }],

  preview: {
    src: "/shots/mofy-palette.png",
    alt:
      "MOFY 퍼스널 컬러 분석 데모 — 배경 제거와 색상 추출 파이프라인이 끝나고 비율 순 팔레트가 만들어진 상태",
  },

  highlights: ["Rembg → Extcolors 파이프라인", "TF-IDF 검색어 추천", "boardType 기반 게시판 분리"],

  features: [
    {
      title: "AI 퍼스널 컬러 팔레트 추출",
      desc: "rembg로 배경을 제거하고 extcolors로 의상의 주요 색상을 추출해 시각적인 팔레트로 제공, 사용자가 자신의 옷이 어떤 컬러 톤인지 직관적으로 확인",
    },
    {
      title: "스타일 공유 (OOTD)",
      desc: "데일리룩을 공유하고 좋아요·댓글로 소통하며 스타일 랭킹에 도전",
    },
    {
      title: "중고 거래",
      desc: "입지 않는 옷을 판매하거나 취향에 맞는 옷을 구매, boardType으로 일반 커뮤니티 글과 거래 글을 명확히 구분",
    },
    {
      title: "스마트 검색 및 추천",
      desc: "Scikit-learn TF-IDF로 검색 기록을 분석해 유사 키워드를 추천하고, OpenWeatherMap과 연동해 날씨·기온에 맞는 옷차림 제안",
    },
    {
      title: "사용자 관리 및 편의성",
      desc: "SimpleJWT 토큰 기반 인증과 키·몸무게·신발 사이즈 등 거래에 필요한 신체 정보 관리로 사이즈 실패 없는 거래 지원",
    },
  ],

  architecture: [
    {
      id: "next",
      label: "Next.js",
      role: "UI/UX 구성, Axios를 통한 API 요청, 상태 관리",
      band: "client",
    },
    {
      id: "drf",
      label: "Django REST Framework",
      role: "REST API ViewSet, SimpleJWT 인증, ORM 기반 DB 제어",
      band: "server",
    },
    {
      id: "imagepipe",
      label: "Rembg → Extcolors",
      role: "업로드 이미지의 배경을 제거한 뒤 의상 영역에서 주요 색상을 추출해 팔레트 생성",
      band: "external",
    },
    {
      id: "recsys",
      label: "Scikit-learn",
      role: "TF-IDF / Cosine Similarity 기반 검색어 및 스타일 추천",
      band: "external",
    },
    {
      id: "db",
      label: "SQLite · Media Storage",
      role: "사용자·게시글·거래 데이터와 업로드 이미지 저장",
      band: "data",
    },
    {
      id: "weather",
      label: "OpenWeatherMap",
      role: "현재 위치의 날씨·기온 조회 후 옷차림 추천에 반영",
      band: "external",
    },
  ],
  architectureIntent:
    "이미지 처리와 추천 연산을 API 뒤로 감춰, 프론트는 결과 팔레트와 추천 목록만 받아 렌더링하도록 나눴습니다.",

  troubleshooting: [],

  designNotes: [
    {
      id: "color-pipeline",
      title: "퍼스널 컬러 추출 파이프라인",
      problem:
        "사진을 그대로 색상 추출에 넣으면 배경색이 상위 팔레트를 차지해 정작 의상 색이 밀립니다. 배경 제거를 전처리 단계로 분리했습니다.",
      steps: [
        { label: "1", title: "업로드", body: "사용자가 패션 사진을 업로드하면 Media Storage에 저장합니다." },
        { label: "2", title: "배경 제거", body: "rembg로 인물·의상만 남기고 배경을 투명 처리합니다." },
        {
          label: "3",
          title: "색상 추출",
          body: "extcolors로 남은 영역의 주요 색상과 비율을 뽑아냅니다.",
        },
        {
          label: "4",
          title: "팔레트 구성",
          body: "추출된 색상 데이터를 비율 순으로 정렬해 시각적 팔레트로 제공합니다.",
        },
      ],
      takeaway:
        "전처리를 한 단계 앞에 두는 것만으로 추출 품질이 크게 달라졌습니다. 이미지 파이프라인은 단계를 나눠 각각 검증하는 편이 디버깅에 유리했습니다.",
    },
    {
      id: "boardtype",
      title: "boardType으로 게시판 분리",
      problem:
        "자유 게시글, 패션 공유글, 거래글은 화면과 필요한 필드가 다릅니다. 테이블을 나누는 대신 하나의 Board에 boardType을 두고 구분했습니다.",
      steps: [
        {
          label: "선택",
          title: "단일 테이블 + 타입 컬럼",
          body: "Board에 boardType(SmallInteger)을 두고 자유·패션·거래를 구분했습니다. 거래글만 쓰는 price·state·address는 같은 테이블에 nullable로 두었습니다.",
        },
        {
          label: "이유",
          title: "공통 기능 재사용",
          body: "제목·본문·이미지·좋아요·댓글은 세 타입이 모두 공유하므로, 목록 조회와 댓글·좋아요 로직을 한 벌만 유지하면 됩니다.",
        },
        {
          label: "대가",
          title: "타입별 필드가 비게 됨",
          body: "거래 전용 필드가 다른 타입에서는 비어 있게 됩니다. 게시판 규모가 커지면 타입별 테이블 분리를 검토할 지점입니다.",
        },
      ],
      takeaway:
        "프로젝트 규모에서는 공통 로직 재사용 이득이 컸지만, 타입별 필드가 늘어나면 분리하는 편이 낫다고 판단했습니다.",
    },
  ],

  performance: [],

  demo: [
    {
      id: "palette",
      label: "퍼스널 컬러 분석",
      caption:
        "이미지를 고르면 배경 제거 → 색상 추출 파이프라인이 단계별로 진행되고, 비율 순 팔레트가 만들어집니다.",
    },
    {
      id: "style",
      label: "스타일 보드",
      caption: "데일리룩을 공유하고 좋아요·댓글로 소통하는 OOTD 피드입니다.",
    },
    {
      id: "market",
      label: "중고 거래",
      caption:
        "boardType으로 거래글만 걸러낸 마켓 화면입니다. 가격·판매 상태·지역이 함께 표시됩니다.",
    },
    {
      id: "search",
      label: "검색 · 추천",
      caption:
        "검색어를 넣으면 TF-IDF 코사인 유사도로 유사 키워드를 추천하고, 날씨에 맞는 옷차림도 함께 제안합니다.",
    },
    {
      id: "profile",
      label: "프로필 · 신체 정보",
      caption:
        "키·몸무게·신발 사이즈와 선호 스타일 태그를 관리해 거래 시 사이즈 실패를 줄입니다.",
    },
  ],
};
