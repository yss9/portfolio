/** Mock data for Neoulteo — regions, TourAPI-shaped attractions, travel plans,
 *  hotplaces, community posts, Spring AI traces and a batch run. */

/** Region list and area codes copied from the project's own constants file.
 *  `x`/`y` place each region on a schematic 100×100 board that mirrors the
 *  peninsula's rough geography — it stands in for the SVG Korea map. */
export type Region = {
  code: string;
  name: string;
  displayName: string;
  areaCode: string;
  x: number;
  y: number;
  attractions: number;
};

export const REGIONS: Region[] = [
  { code: "GYEONGGI", name: "경기", displayName: "경기도", areaCode: "31", x: 33, y: 20, attractions: 4128 },
  { code: "SEOUL", name: "서울", displayName: "서울특별시", areaCode: "1", x: 30, y: 26, attractions: 2841 },
  { code: "INCHEON", name: "인천", displayName: "인천광역시", areaCode: "2", x: 18, y: 26, attractions: 986 },
  { code: "GANGWON", name: "강원", displayName: "강원특별자치도", areaCode: "32", x: 62, y: 17, attractions: 3204 },
  { code: "CHUNGBUK", name: "충북", displayName: "충청북도", areaCode: "33", x: 48, y: 36, attractions: 1517 },
  { code: "CHUNGNAM", name: "충남", displayName: "충청남도", areaCode: "34", x: 25, y: 40, attractions: 1873 },
  { code: "SEJONG", name: "세종", displayName: "세종특별자치시", areaCode: "8", x: 37, y: 40, attractions: 214 },
  { code: "DAEJEON", name: "대전", displayName: "대전광역시", areaCode: "3", x: 39, y: 47, attractions: 462 },
  { code: "GYEONGBUK", name: "경북", displayName: "경상북도", areaCode: "35", x: 68, y: 40, attractions: 3391 },
  { code: "DAEGU", name: "대구", displayName: "대구광역시", areaCode: "4", x: 65, y: 53, attractions: 638 },
  { code: "JEONBUK", name: "전북", displayName: "전북특별자치도", areaCode: "37", x: 30, y: 56, attractions: 1746 },
  { code: "GWANGJU", name: "광주", displayName: "광주광역시", areaCode: "5", x: 24, y: 68, attractions: 401 },
  { code: "JEONNAM", name: "전남", displayName: "전라남도", areaCode: "38", x: 30, y: 74, attractions: 2652 },
  { code: "GYEONGNAM", name: "경남", displayName: "경상남도", areaCode: "36", x: 56, y: 66, attractions: 2233 },
  { code: "ULSAN", name: "울산", displayName: "울산광역시", areaCode: "7", x: 79, y: 57, attractions: 372 },
  { code: "BUSAN", name: "부산", displayName: "부산광역시", areaCode: "6", x: 72, y: 68, attractions: 1109 },
  { code: "JEJU", name: "제주", displayName: "제주특별자치도", areaCode: "39", x: 24, y: 92, attractions: 1487 },
];

/** TourAPI content types. */
export const CONTENT_TYPES = [
  { id: "12", label: "관광지" },
  { id: "14", label: "문화시설" },
  { id: "15", label: "축제·공연" },
  { id: "28", label: "레포츠" },
  { id: "39", label: "음식점" },
] as const;

export type Attraction = {
  contentId: number;
  title: string;
  contentTypeId: string;
  areaCode: string;
  sigungu: string;
  addr: string;
  /** normalised 0-100 position inside the demo map pane */
  mx: number;
  my: number;
  desc: string;
};

export const attractions: Attraction[] = [
  { contentId: 126508, title: "경복궁", contentTypeId: "12", areaCode: "1", sigungu: "종로구", addr: "서울 종로구 사직로 161", mx: 42, my: 30, desc: "조선의 법궁. 근정전과 경회루가 중심이며 수문장 교대식이 열립니다." },
  { contentId: 264337, title: "북촌한옥마을", contentTypeId: "12", areaCode: "1", sigungu: "종로구", addr: "서울 종로구 계동길", mx: 52, my: 26, desc: "한옥이 밀집한 주거지. 골목마다 전망 좋은 지점이 있습니다." },
  { contentId: 129854, title: "국립중앙박물관", contentTypeId: "14", areaCode: "1", sigungu: "용산구", addr: "서울 용산구 서빙고로 137", mx: 46, my: 52, desc: "상설전시관과 야외 정원. 반나절 이상 여유를 두는 편이 좋습니다." },
  { contentId: 264570, title: "남산서울타워", contentTypeId: "12", areaCode: "1", sigungu: "중구", addr: "서울 중구 남산공원길 105", mx: 50, my: 44, desc: "서울 전경을 볼 수 있는 전망대. 해질 무렵 대기가 깁니다." },
  { contentId: 132560, title: "광장시장", contentTypeId: "39", areaCode: "1", sigungu: "종로구", addr: "서울 종로구 창경궁로 88", mx: 58, my: 34, desc: "빈대떡과 마약김밥으로 알려진 전통시장." },
  { contentId: 128455, title: "롯데월드", contentTypeId: "28", areaCode: "1", sigungu: "송파구", addr: "서울 송파구 올림픽로 240", mx: 76, my: 50, desc: "실내외 테마파크. 주말은 대기 시간이 깁니다." },
  { contentId: 264348, title: "서울숲", contentTypeId: "12", areaCode: "1", sigungu: "성동구", addr: "서울 성동구 뚝섬로 273", mx: 64, my: 40, desc: "사슴방사장과 산책로가 있는 도심 공원." },
  { contentId: 133236, title: "DDP 동대문디자인플라자", contentTypeId: "14", areaCode: "1", sigungu: "중구", addr: "서울 중구 을지로 281", mx: 62, my: 38, desc: "자하 하디드 설계. 야간 조명과 전시가 함께 열립니다." },
];

/* ---------------- travel plan ---------------- */

export type PlanPlace = { id: number; name: string; type: string; stayMin: number };
export type PlanDay = { day: number; places: PlanPlace[] };

export const initialPlan: PlanDay[] = [
  {
    day: 1,
    places: [
      { id: 1, name: "경복궁", type: "관광지", stayMin: 90 },
      { id: 2, name: "북촌한옥마을", type: "관광지", stayMin: 60 },
      { id: 3, name: "광장시장", type: "음식점", stayMin: 60 },
    ],
  },
  {
    day: 2,
    places: [
      { id: 4, name: "국립중앙박물관", type: "문화시설", stayMin: 150 },
      { id: 5, name: "남산서울타워", type: "관광지", stayMin: 90 },
    ],
  },
  {
    day: 3,
    places: [
      { id: 6, name: "서울숲", type: "관광지", stayMin: 60 },
      { id: 7, name: "DDP 동대문디자인플라자", type: "문화시설", stayMin: 80 },
      { id: 8, name: "롯데월드", type: "레포츠", stayMin: 240 },
    ],
  },
];

export const SHARE_CODE = "NEO-7K2M";

export const sharedPlanPreview: PlanDay[] = [
  {
    day: 1,
    places: [
      { id: 21, name: "성산일출봉", type: "관광지", stayMin: 90 },
      { id: 22, name: "섭지코지", type: "관광지", stayMin: 70 },
    ],
  },
  {
    day: 2,
    places: [
      { id: 23, name: "한라산 어리목", type: "레포츠", stayMin: 300 },
      { id: 24, name: "제주 동문시장", type: "음식점", stayMin: 60 },
    ],
  },
];

/* ---------------- hotplaces ---------------- */

export type Hotplace = {
  id: number;
  title: string;
  region: string;
  emoji: string;
  registered: number;
  note: string;
  mine: boolean;
};

export const hotplaces: Hotplace[] = [
  { id: 1, title: "협재 해수욕장", region: "제주", emoji: "🏖️", registered: 412, note: "물빛이 가장 예쁜 시간은 오전 10시쯤", mine: true },
  { id: 2, title: "감천문화마을", region: "부산", emoji: "🎨", registered: 388, note: "언덕이라 편한 신발 필수", mine: false },
  { id: 3, title: "안목해변 커피거리", region: "강원", emoji: "☕", registered: 341, note: "주차는 조금 떨어진 공영주차장이 편함", mine: true },
  { id: 4, title: "전주 한옥마을", region: "전북", emoji: "🏯", registered: 306, note: "평일 오전이 사람이 적음", mine: false },
  { id: 5, title: "청산도 슬로길", region: "전남", emoji: "🌿", registered: 187, note: "배편 시간 미리 확인", mine: false },
  { id: 6, title: "월영교 야경", region: "경북", emoji: "🌉", registered: 154, note: "분수 시간대에 맞춰 가면 좋음", mine: true },
];

/* ---------------- community ---------------- */

export type BoardType = "공지사항" | "자유게시판" | "여행 후기" | "Q&A" | "여행 계획 공유";

export type Post = {
  id: number;
  boardType: BoardType;
  title: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  adminOnly?: boolean;
  planPreview?: { days: number; places: number; region: string };
};

export const posts: Post[] = [
  { id: 1, boardType: "공지사항", title: "관광지 데이터 동기화 일정 안내 (8월)", author: "admin", date: "08-01", likes: 12, comments: 0, adminOnly: true },
  { id: 2, boardType: "여행 계획 공유", title: "제주 2박 3일 — 동쪽 위주 코스", author: "somin", date: "08-04", likes: 87, comments: 21, planPreview: { days: 2, places: 4, region: "제주" } },
  { id: 3, boardType: "여행 후기", title: "강원 3일 다녀왔습니다 (사진 많음)", author: "jinwoo", date: "08-06", likes: 64, comments: 15 },
  { id: 4, boardType: "Q&A", title: "여행 코스 공유 코드는 어디서 확인하나요?", author: "haneul", date: "08-08", likes: 3, comments: 4 },
  { id: 5, boardType: "여행 계획 공유", title: "서울 3일 — 고궁과 박물관 중심", author: "yeeun", date: "08-10", likes: 52, comments: 9, planPreview: { days: 3, places: 8, region: "서울" } },
  { id: 6, boardType: "자유게시판", title: "혼자 여행 다니시는 분들 계신가요", author: "doyun", date: "08-11", likes: 29, comments: 33 },
];

/* ---------------- Spring AI ---------------- */

export type AiTrace = { label: string; detail: string; tool?: string };

export const aiScenarios: {
  q: string;
  trace: AiTrace[];
  answer: string;
}[] = [
  {
    q: "가을에 강원도에서 걷기 좋은 곳 알려줘",
    trace: [
      { label: "의도 분석", detail: "지역(강원) + 계절(가을) + 활동(걷기) 추출" },
      { label: "Tool 호출", detail: "areaCode=32, contentTypeId=12, keyword='둘레길'", tool: "searchAttractions" },
      { label: "RAG 검색", detail: "ChromaDB에서 관광지 설명 문서 4건 유사도 검색" },
      { label: "프롬프트 보강", detail: "DB 관광지 12건 + 문서 4건을 컨텍스트로 첨부" },
      { label: "응답 생성", detail: "GMS OpenAI 모델이 근거 기반 답변 작성" },
    ],
    answer:
      "강원에서는 오대산 선재길과 소금산 출렁다리 둘레길을 추천드립니다. 선재길은 월정사에서 상원사까지 약 9km로 경사가 완만해 가을 단풍철에 특히 걷기 좋습니다. 소금산 쪽은 출렁다리와 잔도가 이어져 있어 2시간 내외로 짧게 다녀오기 적당합니다.",
  },
  {
    q: "내 서울 3일 코스 어때? 무리한 일정인지 봐줘",
    trace: [
      { label: "의도 분석", detail: "여행 계획 평가 요청으로 분류" },
      { label: "계획 조회", detail: "planId=104 · 3일 · 장소 8곳", tool: "getTravelPlan" },
      { label: "평가", detail: "일정 강도 / 동선 효율 / 카테고리 균형 3축 계산" },
      { label: "응답 생성", detail: "일차별 피드백 생성" },
    ],
    answer:
      "3일차가 가장 빡빡합니다. 서울숲 → DDP → 롯데월드는 이동만 1시간 20분 이상이고 롯데월드에 4시간을 잡아 총 7시간이 넘습니다. 서울숲을 1일차 북촌 뒤로 옮기면 동선이 자연스러워집니다. 카테고리는 관광지 4 · 문화시설 2 · 음식점 1 · 레포츠 1로 균형은 무난합니다.",
  },
];

export const planEvaluation = [
  { axis: "일정 강도", score: 62, note: "3일차 이동 포함 7시간 20분 — 다소 빡빡" },
  { axis: "동선 효율", score: 48, note: "성동 → 중구 → 송파 왕복 구간 발생" },
  { axis: "카테고리 균형", score: 81, note: "관광지 4 · 문화시설 2 · 음식점 1 · 레포츠 1" },
];

/* ---------------- batch ---------------- */

export const batchSteps = [
  { label: "reader", detail: "TourAPI 호출 · contentTypeId=12 · 페이지 1..38", count: "3,742건 수신" },
  { label: "processor", detail: "기존 DB 행과 contentId 기준 비교", count: "신규 128 · 수정 341 · 동일 3,273" },
  { label: "writer", detail: "변경분만 upsert", count: "469건 반영" },
  { label: "report", detail: "비교 결과 PDF 생성 후 변경 내역 요약", count: "sync-2024-08-18.pdf" },
];

export const batchDiff = [
  { contentId: 126508, title: "경복궁", change: "수정", field: "overview 갱신" },
  { contentId: 998211, title: "노들섬 잔디마당", change: "신규", field: "—" },
  { contentId: 264348, title: "서울숲", change: "수정", field: "firstimage 교체" },
  { contentId: 998244, title: "문화비축기지", change: "신규", field: "—" },
];
