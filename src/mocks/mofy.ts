/** Mock data for MOFY — colour-palette extraction, style feed, market board,
 *  TF-IDF search suggestions and the profile fields from the Django models. */

/** Stand-in "photos". Real uploads went to Media Storage; here each item is a
 *  CSS gradient so the demo needs no binary assets. */
export type Shot = {
  id: string;
  label: string;
  /** background for the mock photo */
  bg: string;
  /** what the subject occupies, used to fake the rembg cut-out */
  subject: string;
  palette: { hex: string; ratio: number; name: string }[];
  tone: string;
};

export const shots: Shot[] = [
  {
    id: "s1",
    label: "가을 니트 코디",
    bg: "linear-gradient(135deg,#c8b8a4 0%,#8f7f6b 60%,#6b5c4a 100%)",
    subject: "linear-gradient(160deg,#8c4a2f 0%,#b5673f 45%,#3d2b21 100%)",
    palette: [
      { hex: "#8C4A2F", ratio: 38.2, name: "테라코타" },
      { hex: "#B5673F", ratio: 24.6, name: "카멜" },
      { hex: "#3D2B21", ratio: 18.1, name: "다크 브라운" },
      { hex: "#D9C4A9", ratio: 12.4, name: "오트밀" },
      { hex: "#5E4630", ratio: 6.7, name: "코코아" },
    ],
    tone: "웜 오텀",
  },
  {
    id: "s2",
    label: "여름 린넨 셋업",
    bg: "linear-gradient(135deg,#dbe6ec 0%,#a9bfcc 60%,#7d95a3 100%)",
    subject: "linear-gradient(160deg,#e8eef2 0%,#9fc0d4 50%,#4f7b96 100%)",
    palette: [
      { hex: "#E8EEF2", ratio: 33.5, name: "아이스 화이트" },
      { hex: "#9FC0D4", ratio: 27.9, name: "스카이" },
      { hex: "#4F7B96", ratio: 19.8, name: "딥 블루" },
      { hex: "#C3D6E0", ratio: 11.2, name: "페일 블루" },
      { hex: "#2E4657", ratio: 7.6, name: "네이비" },
    ],
    tone: "쿨 서머",
  },
  {
    id: "s3",
    label: "스트릿 레이어드",
    bg: "linear-gradient(135deg,#2a2a2e 0%,#3d3d44 60%,#1a1a1d 100%)",
    subject: "linear-gradient(160deg,#1f1f22 0%,#4b4b52 40%,#c9403f 100%)",
    palette: [
      { hex: "#1F1F22", ratio: 41.7, name: "차콜" },
      { hex: "#4B4B52", ratio: 22.3, name: "그레이" },
      { hex: "#C9403F", ratio: 16.9, name: "레드 포인트" },
      { hex: "#8A8A93", ratio: 12.1, name: "라이트 그레이" },
      { hex: "#E5E5E8", ratio: 7.0, name: "오프 화이트" },
    ],
    tone: "쿨 윈터",
  },
];

export const pipelineSteps = [
  { label: "upload", detail: "이미지를 Media Storage에 저장", lib: "Django FileField" },
  { label: "배경 제거", detail: "인물·의상만 남기고 배경을 투명 처리", lib: "rembg" },
  { label: "색상 추출", detail: "남은 영역의 주요 색상과 점유 비율 계산", lib: "extcolors" },
  { label: "팔레트 구성", detail: "비율 순 정렬 후 상위 5색을 저장", lib: "PIL" },
];

/* ---------------- style board (OOTD) ---------------- */

export type StylePost = {
  id: number;
  author: string;
  title: string;
  tags: string[];
  likes: number;
  comments: number;
  bg: string;
  height: number;
};

export const stylePosts: StylePost[] = [
  { id: 1, author: "seo_dan", title: "가을 첫 니트", tags: ["Casual", "Retro"], likes: 214, comments: 18, bg: "linear-gradient(150deg,#a8724f,#5c3d2b)", height: 190 },
  { id: 2, author: "min_wear", title: "블랙 셋업 하나면", tags: ["Minimal", "Modern"], likes: 341, comments: 27, bg: "linear-gradient(150deg,#3a3a41,#141417)", height: 230 },
  { id: 3, author: "hey_jun", title: "린넨 셔츠 코디", tags: ["Simple", "Urban"], likes: 158, comments: 11, bg: "linear-gradient(150deg,#b9cad6,#5d7d92)", height: 170 },
  { id: 4, author: "ourfit", title: "데님 온 데님", tags: ["Street", "Casual"], likes: 402, comments: 44, bg: "linear-gradient(150deg,#5b7ba6,#26364d)", height: 215 },
  { id: 5, author: "so_yeon", title: "톤온톤 베이지", tags: ["Feminine", "Classic"], likes: 276, comments: 21, bg: "linear-gradient(150deg,#e0d0ba,#a3866a)", height: 185 },
  { id: 6, author: "kdw_", title: "러닝 후 캐주얼", tags: ["Sporty", "Casual"], likes: 133, comments: 8, bg: "linear-gradient(150deg,#7fa88b,#2f4a3a)", height: 200 },
];

/* ---------------- market ---------------- */

export type MarketItem = {
  id: number;
  title: string;
  price: number;
  state: boolean;
  address: string;
  seller: string;
  size: string;
  tags: string[];
  bg: string;
};

export const marketItems: MarketItem[] = [
  { id: 101, title: "울 블렌드 더블 코트", price: 68000, state: true, address: "서울 마포구", seller: "seo_dan", size: "M", tags: ["Classic", "Modern"], bg: "linear-gradient(150deg,#6b5c4a,#33291f)" },
  { id: 102, title: "빈티지 워시 데님 자켓", price: 42000, state: true, address: "경기 성남시", seller: "ourfit", size: "L", tags: ["Retro", "Street"], bg: "linear-gradient(150deg,#5b7ba6,#26364d)" },
  { id: 103, title: "케이블 니트 (오트밀)", price: 25000, state: false, address: "부산 해운대구", seller: "min_wear", size: "S", tags: ["Casual", "Simple"], bg: "linear-gradient(150deg,#d9c4a9,#9b8264)" },
  { id: 104, title: "린넨 셋업 (셔츠+팬츠)", price: 55000, state: true, address: "서울 성동구", seller: "hey_jun", size: "M", tags: ["Minimal", "Urban"], bg: "linear-gradient(150deg,#c3d6e0,#6d8a9c)" },
  { id: 105, title: "러닝 윈드브레이커", price: 31000, state: true, address: "대구 수성구", seller: "kdw_", size: "L", tags: ["Sporty"], bg: "linear-gradient(150deg,#7fa88b,#2f4a3a)" },
  { id: 106, title: "체크 플리츠 스커트", price: 19000, state: false, address: "인천 연수구", seller: "so_yeon", size: "S", tags: ["Feminine", "Retro"], bg: "linear-gradient(150deg,#b08a92,#4e3238)" },
];

/* ---------------- TF-IDF search ---------------- */

/** Pre-computed cosine similarities standing in for the Scikit-learn model
 *  that ran over the search log. */
export const searchCorpus: Record<string, { term: string; score: number }[]> = {
  니트: [
    { term: "케이블 니트", score: 0.82 },
    { term: "울 니트 가디건", score: 0.74 },
    { term: "오트밀 스웨터", score: 0.61 },
    { term: "가을 이너", score: 0.47 },
  ],
  데님: [
    { term: "데님 자켓", score: 0.88 },
    { term: "워시 진", score: 0.71 },
    { term: "데님 온 데님", score: 0.66 },
    { term: "빈티지 청바지", score: 0.58 },
  ],
  코트: [
    { term: "울 블렌드 코트", score: 0.85 },
    { term: "더블 코트", score: 0.79 },
    { term: "겨울 아우터", score: 0.63 },
    { term: "핸드메이드 코트", score: 0.52 },
  ],
  린넨: [
    { term: "린넨 셔츠", score: 0.86 },
    { term: "여름 셋업", score: 0.68 },
    { term: "시원한 소재", score: 0.55 },
    { term: "리넨 팬츠", score: 0.51 },
  ],
};

export const searchSeeds = Object.keys(searchCorpus);

export const weatherNow = {
  city: "서울",
  temp: 12,
  feels: 10,
  condition: "구름 조금",
  icon: "⛅",
  advice: [
    "얇은 니트 + 가벼운 아우터가 적당합니다",
    "일교차가 8도 이상이라 겉옷을 챙기세요",
  ],
  suggestTags: ["Casual", "Classic"],
};

/* ---------------- profile ---------------- */

export const CLOTH_TYPES = [
  "Simple", "Modern", "Feminine", "Dandy", "Retro", "Minimal",
  "Casual", "Street", "Sporty", "Urban", "Classic",
] as const;

export const SKIN_TYPES = ["normal", "dry", "oily", "combination", "sensitive", "acne"] as const;

export const profileDefaults = {
  userID: "seo_dan",
  name: "서단",
  height: 172,
  weight: 61,
  shoeType: 265,
  clothType: ["Casual", "Minimal", "Classic"] as string[],
  skinType: ["combination"] as string[],
};
