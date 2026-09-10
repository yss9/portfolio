import type { Project } from "../types";

export const mofy: Project = {
  slug: "mofy",
  no: "06",
  name: "MOFY",
  tagline: "색상 팔레트 추출과 메시지를 제공하는 패션 커뮤니티",
  summary:
    "사용자가 패션 이미지를 공유하고 중고 의류를 거래하며 메시지로 소통할 수 있는 팀 프로젝트입니다. 업로드 이미지의 배경을 제거하고 주요 색상을 추출해 팔레트로 제공하는 이미지 처리 기능을 포함합니다.",
  period: "2023.09 ~ 2023.11",
  team: "팀 프로젝트",
  role: "사용자 메시지 기능 공동 구현",
  teamShort: "팀 프로젝트 · 메시지",

  stack: [
    { group: "Frontend", items: ["React", "styled-components", "Ant Design", "Axios"] },
    { group: "Backend", items: ["Django REST Framework", "Python 3.9+", "SimpleJWT"] },
    { group: "Data", items: ["SQLite", "Media Storage"] },
    { group: "AI / Data", items: ["Rembg", "Pillow", "Extcolors", "Scikit-learn (TF-IDF)"] },
    { group: "External APIs", items: ["OpenWeatherMap"] },
  ],
  stackFlat: ["React", "Django DRF", "SQLite", "JWT", "Rembg", "Extcolors", "Scikit-learn"],

  links: [{ label: "GitHub", href: "https://github.com/yss9/Mofy", kind: "github" }],

  preview: {
    src: "/projects/mofy/overview.png",
    alt:
      "MOFY 홈 화면에 오늘의 스타일 랭킹, 사용자 프로필, 날씨, 커뮤니티와 중고 마켓 목록이 표시된 모습",
  },

  screenshots: [
    {
      src: "/projects/mofy/overview.png",
      alt: "MOFY 홈 화면에 패션 스타일 랭킹 4개, 김민서 프로필, 서울 날씨, 커뮤니티와 중고 마켓 최신 글이 채워진 모습",
      caption: "서비스 홈 — 스타일 게시물, 프로필, 현재 날씨와 최신 커뮤니티·마켓 글을 한 화면에 구성",
    },
    {
      src: "/projects/mofy/color-palette.png",
      alt: "MOFY에서 원본 패션 이미지의 배경을 제거하고 의상에서 추출한 여섯 가지 주요 색상을 팔레트로 보여주는 화면",
      caption: "컬러 팔레트 — 배경을 제거한 뒤 이미지의 주요 색상을 추출해 팔레트로 제공",
    },
  ],

  highlights: ["메시지 기능 공동 구현", "Rembg → Extcolors", "boardType 기반 게시판"],

  features: [
    {
      title: "사용자 메시지 기능",
      desc: "사용자 간 메시지를 작성하고 목록과 내용을 확인하는 프론트엔드·백엔드 흐름을 팀원과 공동 구현했습니다.",
      category: "나의 기여",
    },
    {
      title: "이미지 색상 팔레트 추출",
      desc: "rembg로 이미지 배경을 제거하고 Pillow·extcolors로 남은 영역의 주요 색상을 추출해 팔레트 이미지로 제공합니다. 퍼스널 컬러 계절형을 진단하는 기능은 아닙니다.",
      category: "팀 전체 기능",
    },
    {
      title: "스타일 공유 (OOTD)",
      desc: "데일리룩 게시물을 공유하고 좋아요·댓글로 소통하는 패션 게시판",
      category: "팀 전체 기능",
    },
    {
      title: "중고 거래",
      desc: "입지 않는 옷을 판매하거나 취향에 맞는 옷을 구매, boardType으로 일반 커뮤니티 글과 거래 글을 명확히 구분",
      category: "팀 전체 기능",
    },
    {
      title: "연관 검색어와 현재 날씨",
      desc: "전체 누적 검색어의 TF-IDF 코사인 유사도로 연관 검색어를 제공하고, OpenWeatherMap과 사용자 위치를 이용해 현재 기온과 날씨를 표시합니다.",
      category: "팀 전체 기능",
    },
    {
      title: "사용자 관리 및 편의성",
      desc: "SimpleJWT 토큰 기반 인증과 키·몸무게·신발 사이즈 등 거래에 필요한 신체 정보 관리로 사이즈 실패 없는 거래 지원",
      category: "팀 전체 기능",
    },
  ],

  architecture: [
    {
      id: "react",
      label: "React",
      role: "UI/UX 구성, Axios를 통한 API 요청, 상태 관리",
      band: "client",
    },
    {
      id: "drf",
      label: "Django REST Framework",
      role: "APIView·함수형 View 기반 REST API, SimpleJWT 인증, ORM 기반 DB 제어",
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
      role: "전체 누적 검색어의 TF-IDF / Cosine Similarity 기반 연관 검색어 제공",
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
      role: "현재 위치의 날씨·기온을 조회해 홈 화면에 표시",
      band: "external",
    },
  ],
  architectureIntent:
    "Django API가 게시판·메시지·이미지 처리·검색어 계산을 담당하고, React는 API 결과와 날씨 정보를 사용자 화면에 렌더링하도록 구성했습니다.",

  troubleshooting: [],

  designNotes: [
    {
      id: "color-pipeline",
      title: "이미지 색상 팔레트 추출 파이프라인",
      problem:
        "사진을 그대로 색상 추출에 넣으면 배경색이 상위 팔레트를 차지해 정작 의상 색이 밀립니다. 배경 제거를 전처리 단계로 분리했습니다.",
      steps: [
        { label: "1", title: "업로드", body: "사용자가 패션 사진을 업로드하면 Media Storage에 저장합니다." },
        { label: "2", title: "배경 제거", body: "rembg로 인물·의상만 남기고 배경을 투명 처리합니다." },
        {
          label: "3",
          title: "색상 추출",
          body: "extcolors로 남은 영역의 주요 색상 목록을 추출합니다.",
        },
        {
          label: "4",
          title: "팔레트 구성",
          body: "추출된 색상을 동일한 폭의 색상 블록으로 그려 시각적 팔레트 이미지로 제공합니다.",
        },
      ],
      takeaway:
        "이 기능은 이미지의 주요 색상을 보여주는 팔레트 추출이며, 개인의 퍼스널 컬러나 계절형을 판정하는 분석 기능으로 설명하지 않습니다.",
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
          body: "Board에 boardType(SmallInteger)을 두고 자유·패션·거래를 구분했습니다. price와 state는 기본값을 가진 공통 필드이고 address는 선택 필드로 두었습니다.",
        },
        {
          label: "이유",
          title: "공통 기능 재사용",
          body: "제목·본문·이미지·좋아요·댓글은 세 타입이 모두 공유하므로, 목록 조회와 댓글·좋아요 로직을 한 벌만 유지하면 됩니다.",
        },
        {
          label: "대가",
          title: "타입별 필드가 비게 됨",
          body: "게시판 타입별로 사용하지 않는 필드와 기본값이 함께 존재합니다. 타입별 속성이 늘어나면 별도 테이블 또는 하위 타입 분리를 검토할 지점입니다.",
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
      label: "컬러 팔레트",
      caption:
        "이미지를 고르면 배경 제거 → 주요 색상 추출 파이프라인이 진행되고 동일한 폭의 색상 블록으로 팔레트가 만들어집니다.",
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
        "검색어를 넣으면 전체 누적 검색어의 TF-IDF 코사인 유사도로 연관 키워드를 제공합니다. 홈에서는 현재 위치의 날씨를 별도로 표시합니다.",
    },
    {
      id: "profile",
      label: "프로필 · 신체 정보",
      caption:
        "키·몸무게·신발 사이즈와 선호 스타일 태그를 관리해 거래 시 사이즈 실패를 줄입니다.",
    },
  ],
};
