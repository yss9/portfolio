/** Mock data for the Glople demos — travel destinations, MBTI-vectorised
 *  users, and local experts ("글로플러"). */

/* ---------------- keyword bitmask ---------------- */

/** Bit position = index. The real service stored this as `keyword_mask`
 *  so candidate filtering could happen in the WHERE clause. */
export const KEYWORDS = [
  "자연",
  "미식",
  "쇼핑",
  "역사",
  "액티비티",
  "휴양",
  "야경",
  "예술",
] as const;

export type Keyword = (typeof KEYWORDS)[number];

export function maskOf(keywords: readonly string[]): number {
  return keywords.reduce((m, k) => {
    const i = KEYWORDS.indexOf(k as Keyword);
    return i < 0 ? m : m | (1 << i);
  }, 0);
}

export function bitCount(n: number): number {
  let c = 0;
  while (n) {
    n &= n - 1;
    c++;
  }
  return c;
}

export type Destination = {
  id: number;
  destName: string;
  country: string;
  location: string;
  info: string;
  keywords: Keyword[];
};

export const destinations: Destination[] = [
  {
    id: 1,
    destName: "교토",
    country: "일본",
    location: "간사이",
    info: "천년 고도의 사찰과 정원, 골목마다 이어지는 노포 미식",
    keywords: ["역사", "미식", "예술", "자연"],
  },
  {
    id: 2,
    destName: "오사카",
    country: "일본",
    location: "간사이",
    info: "도톤보리 야경과 길거리 음식, 쇼핑 거리가 밀집한 도시",
    keywords: ["미식", "쇼핑", "야경"],
  },
  {
    id: 3,
    destName: "치앙마이",
    country: "태국",
    location: "북부",
    info: "산악 트레킹과 저렴한 물가, 느긋하게 머무르기 좋은 도시",
    keywords: ["자연", "휴양", "액티비티", "미식"],
  },
  {
    id: 4,
    destName: "바르셀로나",
    country: "스페인",
    location: "카탈루냐",
    info: "가우디 건축과 해변, 타파스 바가 어우러진 항구 도시",
    keywords: ["예술", "미식", "휴양", "역사"],
  },
  {
    id: 5,
    destName: "다낭",
    country: "베트남",
    location: "중부",
    info: "해변 리조트와 바나힐, 가성비 좋은 휴양지",
    keywords: ["휴양", "자연", "미식"],
  },
  {
    id: 6,
    destName: "홍콩",
    country: "홍콩",
    location: "홍콩섬",
    info: "빅토리아 피크 야경과 딤섬, 쇼핑몰이 촘촘한 도시",
    keywords: ["야경", "쇼핑", "미식"],
  },
  {
    id: 7,
    destName: "인터라켄",
    country: "스위스",
    location: "베른",
    info: "알프스 봉우리와 패러글라이딩, 호수 트레킹의 거점",
    keywords: ["자연", "액티비티"],
  },
  {
    id: 8,
    destName: "로마",
    country: "이탈리아",
    location: "라치오",
    info: "콜로세움과 바티칸, 도시 전체가 유적인 역사 도시",
    keywords: ["역사", "예술", "미식"],
  },
  {
    id: 9,
    destName: "발리",
    country: "인도네시아",
    location: "발리",
    info: "우붓의 논밭과 해변 리조트, 서핑과 요가",
    keywords: ["휴양", "자연", "액티비티"],
  },
  {
    id: 10,
    destName: "파리",
    country: "프랑스",
    location: "일드프랑스",
    info: "미술관과 야경, 미식과 쇼핑이 모두 모인 도시",
    keywords: ["예술", "야경", "미식", "쇼핑"],
  },
  {
    id: 11,
    destName: "제주",
    country: "한국",
    location: "제주도",
    info: "오름과 해안도로, 올레길 트레킹",
    keywords: ["자연", "휴양", "액티비티"],
  },
  {
    id: 12,
    destName: "이스탄불",
    country: "튀르키예",
    location: "마르마라",
    info: "동서양이 겹치는 모스크와 그랜드 바자르",
    keywords: ["역사", "쇼핑", "미식", "예술"],
  },
];

/* ---------------- MBTI vectorisation ---------------- */

/** Each axis is stored as a continuous value in [-1, 1] instead of a
 *  single 16-way label, so two people with the same MBTI can still differ. */
export type Axis4 = { ei: number; sn: number; tf: number; jp: number };

export const AXES: { key: keyof Axis4; low: string; high: string; question: string }[] = [
  { key: "ei", low: "I 내향", high: "E 외향", question: "여행지에서 새로운 사람과 어울리는 편인가요?" },
  { key: "sn", low: "S 감각", high: "N 직관", question: "계획을 세울 때 구체적 정보보다 분위기를 먼저 보나요?" },
  { key: "tf", low: "T 사고", high: "F 감정", question: "동행과 의견이 갈리면 효율보다 감정을 먼저 살피나요?" },
  { key: "jp", low: "P 즉흥", high: "J 계획", question: "일정을 미리 촘촘하게 정해두는 편인가요?" },
];

export function mbtiLabel(v: Axis4): string {
  return (
    (v.ei >= 0 ? "E" : "I") +
    (v.sn >= 0 ? "N" : "S") +
    (v.tf >= 0 ? "F" : "T") +
    (v.jp >= 0 ? "J" : "P")
  );
}

export type PeerUser = {
  id: number;
  nickname: string;
  gender: "M" | "F";
  birthYear: number;
  vector: Axis4;
  route: string;
};

export const peers: PeerUser[] = [
  { id: 1, nickname: "여행하는곰", gender: "M", birthYear: 1998, vector: { ei: 0.8, sn: 0.6, tf: 0.3, jp: -0.4 }, route: "교토 3박 · 사찰과 골목 미식" },
  { id: 2, nickname: "노을수집가", gender: "F", birthYear: 1997, vector: { ei: -0.5, sn: 0.7, tf: 0.8, jp: -0.2 }, route: "다낭 4박 · 해변에서 아무것도 안 하기" },
  { id: 3, nickname: "계획형J", gender: "F", birthYear: 1999, vector: { ei: 0.2, sn: -0.6, tf: -0.4, jp: 0.9 }, route: "로마 5박 · 유적 코스 분 단위 정리" },
  { id: 4, nickname: "산이좋아", gender: "M", birthYear: 1996, vector: { ei: -0.7, sn: -0.3, tf: -0.5, jp: 0.4 }, route: "인터라켄 3박 · 트레킹 위주" },
  { id: 5, nickname: "야시장러버", gender: "M", birthYear: 1998, vector: { ei: 0.9, sn: 0.2, tf: 0.5, jp: -0.7 }, route: "오사카 2박 · 야시장과 야경" },
  { id: 6, nickname: "미술관순례", gender: "F", birthYear: 1995, vector: { ei: -0.3, sn: 0.8, tf: 0.6, jp: 0.2 }, route: "파리 5박 · 미술관 7곳" },
  { id: 7, nickname: "서핑중독", gender: "M", birthYear: 2000, vector: { ei: 0.7, sn: 0.1, tf: 0.2, jp: -0.8 }, route: "발리 6박 · 서핑과 요가" },
  { id: 8, nickname: "고요한여행", gender: "F", birthYear: 1994, vector: { ei: -0.9, sn: 0.4, tf: 0.7, jp: 0.5 }, route: "치앙마이 5박 · 사원과 카페" },
  { id: 9, nickname: "쇼핑러", gender: "F", birthYear: 1999, vector: { ei: 0.6, sn: -0.5, tf: 0.4, jp: 0.6 }, route: "홍콩 3박 · 쇼핑 집중" },
  { id: 10, nickname: "역사덕후", gender: "M", birthYear: 1993, vector: { ei: -0.2, sn: -0.7, tf: -0.6, jp: 0.7 }, route: "이스탄불 4박 · 유적 답사" },
  { id: 11, nickname: "즉흥파", gender: "M", birthYear: 1997, vector: { ei: 0.5, sn: 0.9, tf: 0.1, jp: -0.9 }, route: "제주 2박 · 그때그때 결정" },
  { id: 12, nickname: "카페투어", gender: "F", birthYear: 1998, vector: { ei: 0.3, sn: 0.5, tf: 0.9, jp: -0.1 }, route: "교토 3박 · 카페와 디저트" },
  { id: 13, nickname: "혼행러", gender: "F", birthYear: 1996, vector: { ei: -0.8, sn: 0.3, tf: 0.2, jp: 0.3 }, route: "바르셀로나 4박 · 혼자 걷기" },
  { id: 14, nickname: "가족여행", gender: "M", birthYear: 1988, vector: { ei: 0.4, sn: -0.4, tf: 0.5, jp: 0.8 }, route: "제주 3박 · 아이와 함께" },
  { id: 15, nickname: "배낭러", gender: "M", birthYear: 2001, vector: { ei: 0.8, sn: 0.7, tf: -0.2, jp: -0.6 }, route: "동남아 3주 · 육로 이동" },
  { id: 16, nickname: "온천마니아", gender: "F", birthYear: 1992, vector: { ei: -0.6, sn: -0.2, tf: 0.6, jp: 0.1 }, route: "벳푸 3박 · 온천 순회" },
  { id: 17, nickname: "사진가", gender: "M", birthYear: 1995, vector: { ei: -0.1, sn: 0.8, tf: 0.3, jp: -0.3 }, route: "홍콩 3박 · 야경 촬영" },
  { id: 18, nickname: "미식탐험", gender: "F", birthYear: 1997, vector: { ei: 0.7, sn: 0.2, tf: 0.7, jp: -0.5 }, route: "오사카 3박 · 먹방 코스" },
];

export function cosine(a: Axis4, b: Axis4): number {
  const av = [a.ei, a.sn, a.tf, a.jp];
  const bv = [b.ei, b.sn, b.tf, b.jp];
  const dot = av.reduce((s, x, i) => s + x * bv[i], 0);
  const na = Math.sqrt(av.reduce((s, x) => s + x * x, 0));
  const nb = Math.sqrt(bv.reduce((s, x) => s + x * x, 0));
  if (na === 0 || nb === 0) return 0;
  return dot / (na * nb);
}

/* ---------------- chatbot ---------------- */

export const chatbotPresets = [
  {
    q: "10월에 3박으로 갈 만한 조용한 여행지 추천해줘",
    a: "10월이면 치앙마이가 좋습니다. 우기가 끝나 습도가 낮아지고, 님만해민 쪽 카페 거리와 도이수텝 사원을 3박이면 여유 있게 볼 수 있어요. 조용한 분위기를 원하시면 올드시티 안쪽 숙소보다 삥강 근처를 추천드립니다.",
  },
  {
    q: "교토랑 오사카 중에 어디가 나을까?",
    a: "차분하게 걷는 여행이면 교토, 먹고 마시는 밀도 높은 일정이면 오사카입니다. 교토는 사찰 간 이동에 버스 시간이 꽤 들고, 오사카는 도톤보리 반경 안에서 대부분 해결됩니다. 3박 이상이면 두 도시를 나눠 묵는 것도 괜찮습니다.",
  },
  {
    q: "혼자 가도 안전한 유럽 도시 있어?",
    a: "빈, 취리히, 코펜하겐이 야간 이동까지 비교적 안전한 편입니다. 셋 다 대중교통 촘촘하고 1인 식당 문화가 자리잡혀 있어 혼자 다니기 편합니다. 다만 물가는 셋 다 높은 편이라 숙박비를 먼저 잡아두시는 게 좋습니다.",
  },
];

/* ---------------- glopler matching ---------------- */

export type Glopler = {
  id: number;
  name: string;
  city: string;
  country: string;
  langs: string[];
  years: number;
  rating: number;
  specialties: string[];
  status: "online" | "away";
};

export const gloplers: Glopler[] = [
  {
    id: 1,
    name: "Yuki",
    city: "교토",
    country: "일본",
    langs: ["한국어", "일본어", "English"],
    years: 4,
    rating: 4.9,
    specialties: ["사찰 코스", "노포 미식", "료칸 예약"],
    status: "online",
  },
  {
    id: 2,
    name: "Marc",
    city: "바르셀로나",
    country: "스페인",
    langs: ["English", "Español"],
    years: 6,
    rating: 4.8,
    specialties: ["가우디 투어", "타파스 바", "당일 근교"],
    status: "online",
  },
  {
    id: 3,
    name: "Nok",
    city: "치앙마이",
    country: "태국",
    langs: ["한국어", "ไทย", "English"],
    years: 3,
    rating: 4.7,
    specialties: ["트레킹", "쿠킹 클래스", "야시장"],
    status: "away",
  },
];

export const matchingChat = [
  { from: "peer" as const, name: "Yuki", text: "안녕하세요! 교토 3박 일정 도와드릴게요.", at: "14:02" },
  { from: "me" as const, name: "나", text: "둘째 날 아라시야마 넣고 싶은데 괜찮을까요?", at: "14:03" },
  { from: "peer" as const, name: "Yuki", text: "좋아요. 다만 오전에 가야 대나무길이 한산해요. 8시 도착 기준으로 잡아드릴게요.", at: "14:04" },
];
