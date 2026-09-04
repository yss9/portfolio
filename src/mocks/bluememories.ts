/** Mock data shaped after the BlueMemories entities
 *  (Diary with Clova sentiment confidences + keywords, SharedDiary, Comment). */

export type Sentiment = "positive" | "neutral" | "negative";

export type Diary = {
  id: number;
  title: string;
  date: string;
  weather: string;
  content: string;
  isPrivate: boolean;
  likeNum: number;
  commentNum: number;
  author: string;
  sentiment: Sentiment;
  confidence: { positive: number; neutral: number; negative: number };
  keywords: string[];
};

export const SENTIMENT_LABEL: Record<Sentiment, string> = {
  positive: "긍정",
  neutral: "중립",
  negative: "부정",
};

export const SENTIMENT_COLOR: Record<Sentiment, string> = {
  positive: "#5ee9a0",
  neutral: "#7f8194",
  negative: "#ff6b6b",
};

export const diaries: Diary[] = [
  {
    id: 1,
    title: "오랜만에 걷기 좋은 날",
    date: "2024-08-02",
    weather: "맑음",
    content:
      "퇴근길에 한 정거장 먼저 내려서 천변을 따라 걸었다. 바람이 선선해서 그런지 걷는 내내 기분이 좋았다.",
    isPrivate: false,
    likeNum: 24,
    commentNum: 5,
    author: "haneul",
    sentiment: "positive",
    confidence: { positive: 91.2, neutral: 7.4, negative: 1.4 },
    keywords: ["산책", "선선함", "퇴근길", "여유"],
  },
  {
    id: 2,
    title: "발표가 생각만큼 안 됐다",
    date: "2024-08-05",
    weather: "흐림",
    content:
      "준비한 만큼 말이 안 나왔다. 질문을 받고 나서야 빠뜨린 부분이 떠올랐다. 다음엔 리허설을 한 번 더 해야겠다.",
    isPrivate: false,
    likeNum: 41,
    commentNum: 12,
    author: "jinwoo",
    sentiment: "negative",
    confidence: { positive: 4.1, neutral: 18.6, negative: 77.3 },
    keywords: ["발표", "아쉬움", "리허설", "준비"],
  },
  {
    id: 3,
    title: "그냥 그런 하루",
    date: "2024-08-07",
    weather: "비",
    content: "특별한 일은 없었다. 비가 와서 하루 종일 집에 있었고, 밀린 드라마를 봤다.",
    isPrivate: false,
    likeNum: 8,
    commentNum: 1,
    author: "somin",
    sentiment: "neutral",
    confidence: { positive: 21.3, neutral: 66.8, negative: 11.9 },
    keywords: ["비", "휴식", "드라마", "집"],
  },
  {
    id: 4,
    title: "친구가 이사 왔다",
    date: "2024-08-11",
    weather: "맑음",
    content:
      "가까운 동네로 친구가 이사를 왔다. 이제 마음먹으면 저녁에 볼 수 있다는 게 좋다.",
    isPrivate: false,
    likeNum: 37,
    commentNum: 9,
    author: "yeeun",
    sentiment: "positive",
    confidence: { positive: 88.5, neutral: 9.8, negative: 1.7 },
    keywords: ["친구", "이사", "동네", "반가움"],
  },
  {
    id: 5,
    title: "잠이 잘 안 온다",
    date: "2024-08-14",
    weather: "구름많음",
    content: "며칠째 새벽에 자꾸 깬다. 생각이 많아서인지 누워 있어도 머리가 안 쉰다.",
    isPrivate: false,
    likeNum: 52,
    commentNum: 18,
    author: "minseo",
    sentiment: "negative",
    confidence: { positive: 3.2, neutral: 22.1, negative: 74.7 },
    keywords: ["불면", "새벽", "생각", "피로"],
  },
  {
    id: 6,
    title: "작은 성취",
    date: "2024-08-18",
    weather: "맑음",
    content: "미뤄두던 정리를 끝냈다. 별거 아닌데 하고 나니 후련하다.",
    isPrivate: false,
    likeNum: 19,
    commentNum: 3,
    author: "doyun",
    sentiment: "positive",
    confidence: { positive: 84.9, neutral: 12.6, negative: 2.5 },
    keywords: ["정리", "후련함", "성취", "마무리"],
  },
];

/** Values used to paint the emotion calendar. */
export const calendarMonth = {
  year: 2024,
  month: 8,
  /** day → sentiment; days not listed have no entry */
  entries: {
    2: "positive",
    5: "negative",
    7: "neutral",
    9: "positive",
    11: "positive",
    14: "negative",
    15: "neutral",
    18: "positive",
    20: "neutral",
    22: "positive",
    25: "negative",
    27: "positive",
    29: "neutral",
    30: "positive",
  } as Record<number, Sentiment>,
};

/* ---------------- sentiment scoring (mock of Clova) ---------------- */

const POSITIVE_WORDS = [
  "좋", "행복", "즐거", "설레", "고마", "뿌듯", "후련", "웃", "반가", "선선",
  "편안", "성취", "괜찮", "사랑", "기대", "맛있", "재밌", "여유",
];
const NEGATIVE_WORDS = [
  "슬프", "힘들", "아쉽", "화가", "짜증", "불안", "우울", "지치", "외로", "실수",
  "실패", "못했", "안 나", "피곤", "무섭", "괴로", "답답", "걱정", "잠이 잘 안",
];

/** Deterministic stand-in for the Naver Clova Sentiment response. */
export function analyseSentiment(text: string): {
  sentiment: Sentiment;
  confidence: { positive: number; neutral: number; negative: number };
} {
  const pos = POSITIVE_WORDS.filter((w) => text.includes(w)).length;
  const neg = NEGATIVE_WORDS.filter((w) => text.includes(w)).length;
  const base = 12 + Math.min(text.length, 200) / 20;

  const rawP = 20 + pos * 26;
  const rawN = 20 + neg * 26;
  const rawNeu = base + Math.max(0, 30 - (pos + neg) * 12);
  const sum = rawP + rawN + rawNeu;

  const confidence = {
    positive: Number(((rawP / sum) * 100).toFixed(1)),
    neutral: Number(((rawNeu / sum) * 100).toFixed(1)),
    negative: Number(((rawN / sum) * 100).toFixed(1)),
  };

  let sentiment: Sentiment = "neutral";
  if (confidence.positive >= confidence.neutral && confidence.positive >= confidence.negative)
    sentiment = "positive";
  else if (confidence.negative >= confidence.neutral) sentiment = "negative";

  return { sentiment, confidence };
}

export const writePresets = [
  {
    label: "좋았던 하루",
    title: "오랜만에 걷기 좋은 날",
    content:
      "퇴근길에 한 정거장 먼저 내려서 천변을 따라 걸었다. 바람이 선선해서 그런지 걷는 내내 기분이 좋았다. 오랜만에 여유로웠다.",
  },
  {
    label: "지친 하루",
    title: "잠이 잘 안 온다",
    content:
      "며칠째 새벽에 자꾸 깬다. 생각이 많아서인지 누워 있어도 머리가 안 쉰다. 하루 종일 피곤하고 답답했다.",
  },
  {
    label: "평범한 하루",
    title: "그냥 그런 하루",
    content: "특별한 일은 없었다. 비가 와서 하루 종일 집에 있었고, 밀린 드라마를 봤다.",
  },
];

/* ---------------- AI recommendation ---------------- */

/** The shape the server pins the model to, after the regex parser was dropped. */
export const gptJsonResponse = `{
  "songs": [
    { "title": "밤편지", "artist": "아이유" },
    { "title": "잠 못 드는 밤 비는 내리고", "artist": "김건모" }
  ],
  "searchKeywords": [
    "잔잔한 새벽 플레이리스트",
    "마음이 편해지는 영상"
  ]
}`;

/** A realistic "형식이 흔들린" response — the kind that broke the regex parser. */
export const gptLooseResponse = `추천드릴게요!

먼저 검색어부터 말씀드리면 "마음이 편해지는 영상"이 좋겠고요,
노래는 아이유의 밤편지를 추천합니다. 그리고 "잔잔한 새벽 플레이리스트"도
찾아보시면 좋아요. 김건모 - 잠 못 드는 밤 비는 내리고 도 함께 들어보세요.`;

export const youtubeResults = [
  { id: "y1", title: "새벽 감성 플레이리스트 · 잠들기 전에 듣는 노래", channel: "moodlist", duration: "1:02:14" },
  { id: "y2", title: "아이유 - 밤편지 (Lyrics)", channel: "IU Official", duration: "4:15" },
  { id: "y3", title: "비 오는 날 창밖 소리 ASMR", channel: "calmroom", duration: "3:00:00" },
];

export const fallbackRecommendation = {
  songs: [{ title: "기본 추천 · 잔잔한 곡", artist: "—" }],
  searchKeywords: ["편안한 음악"],
};

/* ---------------- shared diary ---------------- */

export type SharedDiaryBook = {
  id: number;
  title: string;
  coverEmoji: string;
  members: string[];
  entries: { author: string; date: string; text: string }[];
};

export const sharedBooks: SharedDiaryBook[] = [
  {
    id: 1,
    title: "우리 넷의 여름",
    coverEmoji: "🌊",
    members: ["haneul", "jinwoo", "somin", "yeeun"],
    entries: [
      { author: "haneul", date: "08-12", text: "다들 바쁜 와중에 모여서 좋았다. 다음엔 1박으로 가자." },
      { author: "somin", date: "08-13", text: "사진 정리해서 올려둘게. 바다에서 찍은 게 제일 잘 나왔어." },
      { author: "jinwoo", date: "08-15", text: "돌아오는 길 운전은 좀 힘들었지만 그만한 가치가 있었음." },
    ],
  },
  {
    id: 2,
    title: "스터디 회고",
    coverEmoji: "📗",
    members: ["minseo", "doyun", "haneul"],
    entries: [
      { author: "minseo", date: "08-09", text: "이번 주 목표는 다 못 지켰다. 범위를 너무 크게 잡은 듯." },
      { author: "doyun", date: "08-10", text: "나도 비슷. 다음 주는 절반으로 줄여보자." },
    ],
  },
];

/* ---------------- community payload sizes ---------------- */

export const communityMetrics = {
  before: { queries: 1001, payload: "748KB", avg: "147.85ms", p95: "161.95ms" },
  after: { queries: 1, payload: "4KB", avg: "3.63ms", p95: "5ms" },
};
