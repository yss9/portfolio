/**
 * 너울터(Neoulteo) demo clips: the original Vue 3 frontend (frontend/ of the
 * project repo), built with `vite build` and served by `vite preview`, driven
 * with demo fixtures. The Spring backend, Spring AI (GMS OpenAI), TourAPI and
 * Kakao Map are not running here, so every `/api` and `/app` call is answered
 * with plausible demo data and Kakao Map is replaced by a small offline stub
 * (paper background, the app's own pins, route line and info window).
 *
 * Build and serve the frontend first (outside this repo; the key is a dummy so
 * the map code path runs — the Kakao SDK is never requested):
 *   VITE_KAKAO_MAP_APP_KEY=local-demo-stub npx pnpm@11.5.0 build
 *   ./node_modules/.bin/vite preview --host 127.0.0.1 --port 4321 --strictPort
 * NEOULTEO_URL overrides the served address.
 *
 * Place photos are crops of the portfolio's own Neoulteo screenshots
 * (public/projects/neoulteo) and of the frontend's intro images.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP_URL = process.env.NEOULTEO_URL ?? "http://127.0.0.1:4321";
const APP_ORIGIN = new URL(APP_URL).origin;
const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS_DIR = join(HERE, "../../public/projects/neoulteo");
const FRONTEND_DIR =
  process.env.NEOULTEO_FRONTEND_DIR ??
  join(HERE, "../../../.capture/neoulteo-frontend/frontend");

/* ---------------------------------------------------------------- */
/* Media                                                             */
/* ---------------------------------------------------------------- */

/** [name, source, ffmpeg crop] — TourAPI photos already shown in the portfolio stills. */
const CROPS = [
  ["haeundae", join(SHOTS_DIR, "detail.png"), "600:355:330:545"],
  ["haeundae-wide", join(SHOTS_DIR, "detail.png"), "1010:355:215:545"],
  ["gamcheon", join(SHOTS_DIR, "hotplaces.png"), "280:164:726:346"],
  ["gwangalli", join(SHOTS_DIR, "hotplaces.png"), "278:164:1032:346"],
  ["oryukdo", join(SHOTS_DIR, "hotplaces.png"), "280:134:115:766"],
  ["gogh", join(FRONTEND_DIR, "public/intro-hotplaces.png"), "224:132:519:111"],
  ["yeongildae", join(FRONTEND_DIR, "public/intro-hotplaces.png"), "224:132:31:111"],
  ["seongsan", join(FRONTEND_DIR, "public/intro-hotplaces.png"), "224:132:764:111"],
  ["homigot", join(FRONTEND_DIR, "public/intro-hotplaces.png"), "224:132:31:464"],
];
let mediaDir;
function prepareMedia() {
  mediaDir = mkdtempSync(join(tmpdir(), "neoulteo-media-"));
  for (const [name, source, crop] of CROPS) {
    const result = spawnSync(process.env.FFMPEG_PATH ?? "ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", source,
      "-vf", `crop=${crop},scale=iw*2:-2:flags=lanczos`, "-q:v", "3",
      join(mediaDir, `${name}.jpg`),
    ]);
    if (result.status !== 0) throw new Error(`crop ${name} failed: ${result.stderr}`);
  }
}
const media = (name) => `/demo-media/${name}.jpg`;

/* ---------------------------------------------------------------- */
/* Places (TourAPI-shaped)                                           */
/* ---------------------------------------------------------------- */

const ATTRACTIONS = [
  // [contentid, title, addr1, areacode, sigungucode, contenttypeid, mapy, mapx, image, overview]
  [126081, "해운대해수욕장", "부산광역시 해운대구 해운대해변로 264", 6, 16, 12, 35.1587, 129.1604, "haeundae", "1.5km 백사장을 따라 바다 산책을 즐기는 부산 대표 해변입니다."],
  [126082, "광안리해수욕장", "부산광역시 수영구 광안해변로 219", 6, 12, 12, 35.1532, 129.1186, "gwangalli", "광안대교 야경과 바다를 정면으로 보는 해변으로 카페 거리가 이어집니다."],
  [126084, "오륙도스카이워크", "부산광역시 남구 오륙도로 137", 6, 5, 12, 35.1007, 129.1245, "oryukdo", "바다 위로 뻗은 유리 전망대에서 오륙도와 수평선을 내려다봅니다."],
  [126083, "감천문화마을", "부산광역시 사하구 감내2로 203", 6, 10, 12, 35.0975, 129.0106, "gamcheon", "산비탈 계단식 골목에 알록달록한 집과 작은 전시 공간이 모여 있습니다."],
  [126085, "고흐의 길", "부산광역시 해운대구 해운대로 898", 6, 16, 12, 35.1696, 129.1758, "gogh", "메타세쿼이아가 늘어선 숲길로 해운대에서 가볍게 걷기 좋습니다."],
  [126086, "동백섬", "부산광역시 해운대구 우동 710-1", 6, 16, 12, 35.1531, 129.1522, null, null],
  [126087, "흰여울문화마을", "부산광역시 영도구 영선동4가 1044-6", 6, 14, 12, 35.0784, 129.0448, null, null],
  [126088, "자갈치시장", "부산광역시 중구 자갈치해안로 52", 6, 15, 38, 35.0966, 129.0306, null, null],
  [126101, "영일대해수욕장", "경상북도 포항시 북구 두호동", 35, 23, 12, 36.0563, 129.3784, "yeongildae", null],
  [126102, "호미곶해맞이광장", "경상북도 포항시 남구 호미곶면 대보리", 35, 23, 12, 36.0766, 129.5689, "homigot", null],
  [126103, "성산일출봉", "제주특별자치도 서귀포시 성산읍 일출로 284-12", 39, 3, 12, 33.4589, 126.9425, "seongsan", null],
  [126111, "경복궁", "서울특별시 종로구 사직로 161", 1, 23, 14, 37.5796, 126.977, null, null],
  [126112, "북촌한옥마을", "서울특별시 종로구 계동길 37", 1, 23, 12, 37.5826, 126.9837, null, null],
  [126113, "남산서울타워", "서울특별시 용산구 남산공원길 105", 1, 21, 12, 37.5512, 126.9882, null, null],
  [126121, "전주한옥마을", "전북특별자치도 전주시 완산구 기린대로 99", 37, 12, 12, 35.8147, 127.1526, null, null],
  [126131, "경포해변", "강원특별자치도 강릉시 창해로 514", 32, 1, 12, 37.8055, 128.9085, null, null],
  [126141, "순천만습지", "전라남도 순천시 순천만길 513-25", 38, 11, 12, 34.8886, 127.5093, null, null],
  [126151, "대왕암공원", "울산광역시 동구 등대로 95", 7, 2, 12, 35.4945, 129.4351, null, null],
  [126152, "김광석다시그리기길", "대구광역시 중구 달구벌대로 2238", 4, 4, 12, 35.8601, 128.6065, null, null],
  [126153, "월미도", "인천광역시 중구 월미문화로 36", 2, 10, 12, 37.4757, 126.5974, null, null],
  [126154, "수원화성", "경기도 수원시 팔달구 정조로 825", 31, 13, 14, 37.2869, 127.0119, null, null],
  [126155, "대청호", "대전광역시 동구 추동", 3, 1, 12, 36.3753, 127.4867, null, null],
  [126156, "양림동 펭귄마을", "광주광역시 남구 천변좌로446번길 7", 5, 3, 12, 35.1394, 126.9146, null, null],
  [126157, "세종호수공원", "세종특별자치시 다솜로 216", 8, 1, 12, 36.4987, 127.2725, null, null],
  [126158, "단양 도담삼봉", "충청북도 단양군 매포읍 삼봉로 644-13", 33, 1, 12, 37.0019, 128.3443, null, null],
  [126159, "공주 공산성", "충청남도 공주시 웅진로 280", 34, 1, 14, 36.4628, 127.1257, null, null],
  [126160, "통영 동피랑마을", "경상남도 통영시 동피랑1길 6-18", 36, 17, 12, 34.8456, 128.4271, null, null],
].map(([contentid, title, addr1, areacode, sigungucode, contenttypeid, mapy, mapx, image, overview]) => ({
  contentid,
  title,
  addr1,
  areacode,
  sigungucode,
  contenttypeid,
  mapy,
  mapx,
  firstimage: image ? media(image) : "",
  overview: overview ?? "",
}));
const place = (title) => ATTRACTIONS.find((item) => item.title === title);
const TYPE_NAMES = { 12: "관광지", 14: "문화시설", 15: "축제/공연", 38: "쇼핑", 39: "음식점" };

/* ---------------------------------------------------------------- */
/* User, hotplaces                                                   */
/* ---------------------------------------------------------------- */

const ME = { success: true, id: 9001, name: "여행러 민서", email: "minseo@neoulteo.demo" };

/** How many people registered each place as a hotplace (fictional users). */
const HOTPLACE_COUNTS = {
  해운대해수욕장: 18, 감천문화마을: 15, 광안리해수욕장: 14, 오륙도스카이워크: 11, "고흐의 길": 9,
  // Nationwide TOP 5 = places that have a demo photo.
  성산일출봉: 8, 경복궁: 8, 전주한옥마을: 8, 남산서울타워: 7, 북촌한옥마을: 6,
  경포해변: 7, 영일대해수욕장: 7, 순천만습지: 6, 호미곶해맞이광장: 6,
  수원화성: 7, 대왕암공원: 5, 김광석다시그리기길: 6, 월미도: 4, 대청호: 3,
  "양림동 펭귄마을": 4, 세종호수공원: 3, "단양 도담삼봉": 5, "공주 공산성": 4, "통영 동피랑마을": 7,
};
const WRITERS = ["여행러 민서", "바다러버 하윤", "사진여행 라온", "야경수집 하린", "로컬탐방 도윤", "혼행러 시오", "도보여행 준호", "숲길산책 유나", "주말여행 서준", "카페투어 나은"];
const NOTES = {
  해운대해수욕장: "해 질 무렵 산책하기 좋고 주변 맛집까지 이어 가기 편해요.",
  감천문화마을: "알록달록한 골목마다 작은 전시와 전망 포인트가 이어집니다.",
  광안리해수욕장: "광안대교가 켜지는 시간에 맞춰 방문하면 야경이 멋져요.",
  오륙도스카이워크: "해안 산책로와 함께 묶으면 반나절 코스로 알찹니다.",
  "고흐의 길": "해운대 바다와 묶어서 산책하기 좋은 숲길이에요.",
};
const HOTPLACES = Object.entries(HOTPLACE_COUNTS).flatMap(([title, count], placeIndex) => {
  const item = place(title);
  return Array.from({ length: count }, (_, index) => ({
    id: 500 + placeIndex * 40 + index,
    attractionContentId: item.contentid,
    writerName: WRITERS[(placeIndex + index) % WRITERS.length],
    date: `2026-10-${String(14 - ((placeIndex + index) % 13)).padStart(2, "0")}`,
    description: NOTES[title] ?? "다음 여행에도 꼭 다시 들르고 싶은 곳이에요.",
    name: item.title,
    address: item.addr1,
    imageUrl: item.firstimage,
    type: TYPE_NAMES[item.contenttypeid],
    areaCode: item.areacode,
  }));
});
function popular(areaCode, limit) {
  const byPlace = new Map();
  for (const item of HOTPLACES) {
    if (areaCode && String(item.areaCode) !== String(areaCode)) continue;
    if (!byPlace.has(item.name)) byPlace.set(item.name, { ...item, hotplaceCount: HOTPLACE_COUNTS[item.name] });
  }
  return [...byPlace.values()].sort((a, b) => b.hotplaceCount - a.hotplaceCount).slice(0, limit);
}

/* ---------------------------------------------------------------- */
/* Saved places, plans                                               */
/* ---------------------------------------------------------------- */

const asPlanPlace = (title, dayNo) => {
  const item = place(title);
  return {
    attractionContentId: item.contentid,
    dayNo,
    contentTypeId: item.contenttypeid,
    contentTypeName: TYPE_NAMES[item.contenttypeid],
    name: item.title,
    address: item.addr1,
    imageUrl: item.firstimage,
    latitude: item.mapy,
    longitude: item.mapx,
  };
};

const SAVED_TITLES = ["고흐의 길", "해운대해수욕장", "광안리해수욕장"];
const savedPlace = (title, index) => {
  const item = place(title);
  return {
    id: 701 + index,
    attractionContentId: item.contentid,
    sourceType: "ATTRACTION",
    name: item.title,
    address: item.addr1,
    imageUrl: item.firstimage,
    latitude: item.mapy,
    longitude: item.mapx,
    contentTypeId: item.contenttypeid,
  };
};
let savedPlaces = SAVED_TITLES.map(savedPlace);

const PLANS = [
  {
    id: "1782190455120",
    title: "부산 1박 2일 바다 코스",
    durationDays: 2,
    createdAt: "2026-10-12",
    shared: true,
    places: [
      asPlanPlace("해운대해수욕장", 1),
      asPlanPlace("동백섬", 1),
      asPlanPlace("광안리해수욕장", 1),
      asPlanPlace("오륙도스카이워크", 2),
      asPlanPlace("흰여울문화마을", 2),
      asPlanPlace("감천문화마을", 2),
    ],
  },
  {
    id: "1782187320544",
    title: "서울 궁궐 산책",
    durationDays: 1,
    createdAt: "2026-10-03",
    shared: false,
    places: [asPlanPlace("경복궁", 1), asPlanPlace("북촌한옥마을", 1), asPlanPlace("남산서울타워", 1)],
  },
];

/** A road-like route: each leg runs through a few offset waypoints instead of a straight line. */
const LEG_SHAPES = [
  [[0.22, 0.05], [0.48, -0.04], [0.74, 0.03]],
  [[0.2, -0.06], [0.5, 0.02], [0.8, -0.04]],
];
function roadRoute(places, mode) {
  const points = [];
  let km = 0;
  places.forEach((a, i) => {
    points.push({ latitude: a.latitude, longitude: a.longitude });
    const b = places[i + 1];
    if (!b) return;
    const dLat = b.latitude - a.latitude;
    const dLng = b.longitude - a.longitude;
    for (const [t, offset] of LEG_SHAPES[i % LEG_SHAPES.length]) {
      points.push({ latitude: a.latitude + dLat * t + dLng * offset, longitude: a.longitude + dLng * t - dLat * offset });
    }
    const x = dLng * Math.cos((((a.latitude + b.latitude) / 2) * Math.PI) / 180) * 111.32;
    km += Math.hypot(x, dLat * 110.57) * 1.32;
  });
  const speed = mode === "WALK" ? 4.2 : 24;
  return {
    path: points,
    distanceMeters: Math.round(km * 1000),
    durationSeconds: Math.round((km / speed) * 3600),
    orderedKeys: places.map((p) => p.key),
  };
}

/* ---------------------------------------------------------------- */
/* AI                                                                */
/* ---------------------------------------------------------------- */

const ASK = "이번 주말 부산 바다 여행, 날씨랑 갈 만한 곳 알려 줘";
const ANSWER =
  "토요일 부산은 맑고 최고 22℃, 일요일 오후엔 약한 비 소식이 있어요. 토요일에는 해운대해수욕장에서 동백섬 산책로를 걷고, 저녁엔 광안리해수욕장에서 광안대교 야경을 보세요. 일요일에는 비가 오기 전 오전에 감천문화마을 골목을 둘러보는 코스를 추천해요.";
const ASSISTANT_REPLY = {
  success: true,
  message: "응답 생성 성공",
  data: {
    answer: ANSWER,
    ragSources: ["해운대해수욕장", "광안리해수욕장", "감천문화마을"].map((title, index) => ({
      title,
      sourceType: "ATTRACTION",
      content: place(title).overview,
      score: 0.91 - index * 0.06,
      metadata: { contentId: place(title).contentid, areaCode: 6 },
    })),
    toolResults: [
      { toolName: "WeatherTool", input: { region: "부산" }, result: null, success: true, message: "Tool execution succeeded", elapsedMillis: 182 },
      { toolName: "AttractionTool", input: { region: "부산", keyword: "바다" }, result: null, success: true, message: "Tool execution succeeded", elapsedMillis: 41 },
    ],
  },
};

const EVALUATION = {
  score: 84,
  summary: "바다를 따라 동선이 잘 묶인 코스지만 2일차 이동이 조금 깁니다.",
  feedback: [
    "1일차는 해운대–동백섬–광안리가 해안선을 따라 이어져 이동 부담이 적습니다.",
    "2일차는 오륙도에서 감천문화마을까지 도심을 가로질러 이동 시간이 깁니다.",
    "관광지 위주라 2일차 점심에 자갈치시장 같은 식사 장소를 넣으면 균형이 좋아집니다.",
  ],
  advice:
    "1일차는 그대로 두고, 2일차는 흰여울문화마을과 감천문화마을을 먼저 묶은 뒤 자갈치시장에서 점심을 먹고 오륙도스카이워크로 마무리하면 이동 거리를 줄일 수 있어요.",
};

/* ---------------------------------------------------------------- */
/* Community                                                         */
/* ---------------------------------------------------------------- */

const POSTS = [
  { id: 93001, userId: 9001, userName: "여행러 민서", category: "PLAN_SHARE", title: "부산 1박 2일 바다 여행 코스 공유합니다", content: "해운대와 광안리를 먼저 보고 다음 날 감천문화마을을 천천히 걷는 코스입니다.", travelPlanId: "1782190455120", views: 142, likeCount: 36, commentCount: 8, createdAt: "2026-10-14T10:10:00" },
  { id: 93003, userId: 9003, userName: "맛집헌터 지훈", category: "REVIEW", title: "[핫플 추천] 해운대해수욕장", content: "부산역에서 이동하기 편하고 주변 맛집이 많아 여행 첫날 코스로 좋았습니다.", imageUrl: media("haeundae-wide"), views: 118, likeCount: 29, commentCount: 6, createdAt: "2026-10-13T19:20:00" },
  { id: 93005, userId: 9005, userName: "야경수집 하린", category: "PLAN_SHARE", title: "서울 궁궐과 야경 1박 2일", content: "경복궁, 북촌, 남산을 묶은 서울 도심 코스입니다.", travelPlanId: "1782187320544", views: 139, likeCount: 31, commentCount: 7, createdAt: "2026-10-12T18:00:00" },
  { id: 93010, userId: 9010, userName: "혼행러 시오", category: "REVIEW", title: "[핫플 추천] 광안리해수욕장", content: "광안대교 야경이 좋아 저녁 일정으로 추천합니다.", imageUrl: media("gwangalli"), views: 128, likeCount: 24, commentCount: 4, createdAt: "2026-10-11T21:00:00" },
  { id: 93018, userId: 9018, userName: "계획공유 유나", category: "FREE", title: "여행 계획 공유 코드 기능 좋네요", content: "마음에 드는 여행 코스를 코드로 가져올 수 있어서 편합니다.", views: 76, likeCount: 17, commentCount: 5, createdAt: "2026-10-10T18:30:00" },
  { id: 93020, userId: 9020, userName: "숨은명소 다인", category: "QNA", title: "부산 비 오는 날 어디가 좋을까요?", content: "실내 위주로 갈 만한 부산 코스를 추천받고 싶습니다.", views: 63, likeCount: 9, commentCount: 9, createdAt: "2026-10-08T19:20:00" },
  { id: 93024, userId: 9004, userName: "너울터 운영팀", category: "NOTICE", title: "가을 여행 추천 데이터가 업데이트되었습니다", content: "지역별 관광지와 인기 핫플레이스 정보를 새로 반영했습니다.", views: 163, likeCount: 42, commentCount: 2, createdAt: "2026-10-07T09:00:00" },
];
const COMMENTS = [
  { id: 1, userId: 9002, userName: "바다러버 하윤", content: "저녁에 광안리까지 이어서 가도 동선이 좋더라고요!", createdAt: "2026-10-14T09:10:00" },
  { id: 2, userId: 9007, userName: "카페투어 수아", content: "주변 카페 정보도 참고해서 다음 일정에 넣어볼게요.", createdAt: "2026-10-14T08:25:00" },
];

/* ---------------------------------------------------------------- */
/* Kakao Map stub                                                    */
/* ---------------------------------------------------------------- */

/**
 * The slice of the Kakao Maps JS API that KakaoMap.vue uses (Map, LatLng,
 * LatLngBounds, Marker, MarkerImage, InfoWindow, Polyline, event), drawn on a
 * plain paper background so pins, the route line and the info window render
 * offline. There are no map tiles: the real service shows Kakao Map here.
 */
const KAKAO_STUB = String.raw`
(() => {
  const listeners = new WeakMap();
  const PAD_X = 130, PAD_TOP = 92, PAD_BOTTOM = 52, GRID = 56;
  class LatLng { constructor(lat, lng) { this.lat = +lat; this.lng = +lng; } getLat() { return this.lat; } getLng() { return this.lng; } }
  class LatLngBounds {
    constructor() { this.min = null; this.max = null; }
    extend(p) {
      if (!this.min) { this.min = new LatLng(p.lat, p.lng); this.max = new LatLng(p.lat, p.lng); return; }
      this.min = new LatLng(Math.min(this.min.lat, p.lat), Math.min(this.min.lng, p.lng));
      this.max = new LatLng(Math.max(this.max.lat, p.lat), Math.max(this.max.lng, p.lng));
    }
    isEmpty() { return !this.min; }
  }
  class Size { constructor(w, h) { this.width = w; this.height = h; } }
  class Point { constructor(x, y) { this.x = x; this.y = y; } }
  class MarkerImage { constructor(src, size, options) { this.src = src; this.size = size; this.offset = (options && options.offset) || new Point(size.width / 2, size.height); } }

  const css = [
    ".demo-map { position: relative; width: 100%; height: 100%; overflow: hidden; background: #f3efe6; }",
    ".demo-map-paper { position: absolute; inset: 0; background: url(/hanji-paper-2.jpg) center / cover; opacity: .9; }",
    ".demo-map-tint { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 45%, rgba(250,247,240,.35), rgba(236,229,214,.55)); }",
    ".demo-map-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(122,111,93,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(122,111,93,.08) 1px, transparent 1px); background-size: " + GRID + "px " + GRID + "px; }",
    ".demo-map svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }",
    ".demo-map-marker { position: absolute; cursor: pointer; filter: drop-shadow(0 3px 3px rgba(60,50,40,.3)); }",
    ".demo-map-info { position: absolute; background: #fff; border: 1px solid #8f8f8f; box-shadow: 0 2px 6px rgba(0,0,0,.12); white-space: nowrap; font-size: 13px; z-index: 3; }",
    ".demo-map-info::after { content: ''; position: absolute; left: var(--tail, 50%); bottom: -8px; margin-left: -7px; border: 7px solid transparent; border-top-color: #fff; border-bottom: 0; filter: drop-shadow(0 1px 0 #8f8f8f); }",
    ".demo-map-info .map-info { padding-right: 1.7rem; }",
    ".demo-map-close { position: absolute; top: 5px; right: 7px; color: #777; font-size: 14px; line-height: 1; cursor: pointer; }",
    ".demo-map-scale { position: absolute; left: 12px; bottom: 10px; font: 600 11px/1 system-ui, sans-serif; color: #5b554c; display: flex; align-items: flex-end; gap: 6px; }",
    ".demo-map-scale i { display: block; height: 5px; border: 2px solid #5b554c; border-top: 0; }",
  ].join("\n");

  class MapView {
    constructor(el, options) {
      this.center = options.center;
      this.scale = 1800; // px per degree of latitude
      this.items = new Set();
      this.fitted = null;
      if (!document.getElementById("demo-map-style")) {
        const style = document.createElement("style");
        style.id = "demo-map-style";
        style.textContent = css;
        document.head.appendChild(style);
      }
      el.innerHTML = "";
      this.root = document.createElement("div");
      this.root.className = "demo-map";
      const paper = document.createElement("div");
      paper.className = "demo-map-paper";
      const tint = document.createElement("div");
      tint.className = "demo-map-tint";
      this.grid = document.createElement("div");
      this.grid.className = "demo-map-grid";
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.layer = document.createElement("div");
      this.scaleBar = document.createElement("div");
      this.scaleBar.className = "demo-map-scale";
      this.root.append(paper, tint, this.grid, this.svg, this.layer, this.scaleBar);
      el.appendChild(this.root);
      this.render();
    }
    size() { return { w: this.root.clientWidth || 600, h: this.root.clientHeight || 400 }; }
    k() { return Math.cos((this.center.lat * Math.PI) / 180); }
    project(p) {
      const { w, h } = this.size();
      return { x: w / 2 + (p.lng - this.center.lng) * this.k() * this.scale, y: h / 2 - (p.lat - this.center.lat) * this.scale };
    }
    lift() { return (PAD_TOP - PAD_BOTTOM) / 2 / this.scale; }
    relayout() { if (this.fitted) this.fit(this.fitted); else this.render(); }
    setBounds(bounds) { if (bounds && !bounds.isEmpty()) { this.panning = null; this.fitted = bounds; this.fit(bounds); } }
    fit(bounds) {
      const { w, h } = this.size();
      const midLat = (bounds.min.lat + bounds.max.lat) / 2;
      const k = Math.cos((midLat * Math.PI) / 180);
      const spanLng = Math.max((bounds.max.lng - bounds.min.lng) * k, 1e-6);
      const spanLat = Math.max(bounds.max.lat - bounds.min.lat, 1e-6);
      this.scale = Math.min(16000, 0.64 * Math.min((w - PAD_X * 2) / spanLng, (h - PAD_TOP - PAD_BOTTOM) / spanLat));
      this.center = new LatLng(midLat + this.lift(), (bounds.min.lng + bounds.max.lng) / 2);
      this.render();
    }
    panTo(target) {
      this.fitted = null;
      const from = this.center;
      const to = new LatLng(target.lat + this.lift(), target.lng);
      const start = performance.now();
      const token = (this.panning = {});
      const step = (now) => {
        if (this.panning !== token) return;
        const t = Math.min(1, (now - start) / 450);
        const e = 1 - Math.pow(1 - t, 3);
        this.center = new LatLng(from.lat + (to.lat - from.lat) * e, from.lng + (to.lng - from.lng) * e);
        this.render();
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    render() {
      const ox = -(this.center.lng * this.k() * this.scale) % GRID;
      const oy = (this.center.lat * this.scale) % GRID;
      this.grid.style.backgroundPosition = ox + "px " + oy + "px";
      for (const item of this.items) item.draw();
      const kmPx = this.scale / 110.57;
      const nice = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50].find((km) => km * kmPx >= 56) || 50;
      this.scaleBar.innerHTML = "<i style='width:" + Math.round(nice * kmPx) + "px'></i>" + (nice < 1 ? nice * 1000 + "m" : nice + "km");
    }
  }

  class Marker {
    constructor(options) {
      this.position = options.position;
      this.image = options.image;
      this.el = document.createElement("img");
      this.el.className = "demo-map-marker";
      this.el.src = this.image ? this.image.src : "/map-pin.svg";
      this.el.width = this.image ? this.image.size.width : 34;
      this.el.height = this.image ? this.image.size.height : 42;
      this.el.addEventListener("click", () => ((listeners.get(this) || {}).click || []).forEach((fn) => fn()));
      if (options.map) this.setMap(options.map);
    }
    setMap(map) {
      if (this.map) { this.map.items.delete(this); this.el.remove(); }
      this.map = map;
      if (map) { map.items.add(this); map.layer.appendChild(this.el); this.draw(); }
    }
    draw() {
      if (!this.map) return;
      const p = this.map.project(this.position);
      const off = this.image ? this.image.offset : new Point(17, 42);
      this.el.style.left = p.x - off.x + "px";
      this.el.style.top = p.y - off.y + "px";
    }
  }

  class InfoWindow {
    constructor(options) {
      this.el = document.createElement("div");
      this.el.className = "demo-map-info";
      this.el.innerHTML = options.content + (options.removable ? "<span class='demo-map-close'>×</span>" : "");
      const close = this.el.querySelector(".demo-map-close");
      if (close) close.addEventListener("click", () => this.close());
    }
    open(map, marker) {
      this.close();
      this.map = map;
      this.marker = marker;
      map.items.add(this);
      map.layer.appendChild(this.el);
      this.draw();
    }
    close() { if (this.map) { this.map.items.delete(this); this.el.remove(); this.map = null; } }
    draw() {
      if (!this.map || !this.marker) return;
      const p = this.map.project(this.marker.position);
      const lift = this.marker.image ? this.marker.image.offset.y : 42;
      const { w } = this.map.size();
      const bw = this.el.offsetWidth, bh = this.el.offsetHeight;
      const left = Math.max(8, Math.min(w - bw - 8, p.x - bw / 2));
      this.el.style.left = left + "px";
      this.el.style.top = p.y - lift - 10 - bh + "px";
      this.el.style.setProperty("--tail", Math.max(14, Math.min(bw - 14, p.x - left)) + "px");
    }
  }

  class Polyline {
    constructor(options) {
      this.options = options;
      this.el = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      this.el.setAttribute("fill", "none");
      this.el.setAttribute("stroke", options.strokeColor || "#2563eb");
      this.el.setAttribute("stroke-width", options.strokeWeight || 5);
      this.el.setAttribute("stroke-opacity", options.strokeOpacity == null ? 0.82 : options.strokeOpacity);
      this.el.setAttribute("stroke-linecap", "round");
      this.el.setAttribute("stroke-linejoin", "round");
      if (options.map) this.setMap(options.map);
    }
    setMap(map) {
      if (this.map) { this.map.items.delete(this); this.el.remove(); }
      this.map = map;
      if (map) { map.items.add(this); map.svg.appendChild(this.el); this.draw(); }
    }
    draw() {
      if (!this.map) return;
      this.el.setAttribute("points", this.options.path.map((p) => { const q = this.map.project(p); return q.x.toFixed(1) + "," + q.y.toFixed(1); }).join(" "));
    }
  }

  const event = {
    addListener(target, type, fn) {
      const map = listeners.get(target) || {};
      (map[type] = map[type] || []).push(fn);
      listeners.set(target, map);
    },
  };

  window.kakao = { maps: { load: (cb) => cb(), LatLng, LatLngBounds, Size, Point, MarkerImage, Map: MapView, Marker, InfoWindow, Polyline, event } };
})();
`;

/* ---------------------------------------------------------------- */
/* Request handling                                                  */
/* ---------------------------------------------------------------- */

const json = (route, data, delay = 0) => {
  const send = () => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(data) });
  return delay ? new Promise((resolve) => setTimeout(resolve, delay)).then(send) : send();
};

function searchAttractions(params) {
  const area = params.get("areaCode");
  const gugun = params.get("gugunCode");
  const type = params.get("contentTypeId");
  const keyword = (params.get("keyword") ?? "").trim();
  return ATTRACTIONS.filter(
    (item) =>
      (!area || String(item.areacode) === area) &&
      (!gugun || String(item.sigungucode) === gugun) &&
      (!type || String(item.contenttypeid) === type) &&
      (!keyword || `${item.title} ${item.addr1} ${item.overview}`.includes(keyword)) &&
      // Only places with a demo photo appear in search results.
      item.firstimage,
  );
}

async function handle(route, unmatched, overrides) {
  const request = route.request();
  const url = new URL(request.url());

  // Nothing leaves the machine: Kakao SDK, fonts, the FastAPI server and other hosts are refused.
  if (url.origin !== APP_ORIGIN) return route.abort();
  if (url.pathname.startsWith("/demo-media/")) {
    const body = readFileSync(join(mediaDir, url.pathname.slice("/demo-media/".length)));
    return route.fulfill({ status: 200, contentType: "image/jpeg", body });
  }
  if (!/^\/(api|app|uploads)\//.test(url.pathname)) return route.continue();

  const key = `${request.method()} ${url.pathname}`;
  for (const [pattern, reply] of Object.entries(overrides ?? {})) {
    const [method, path] = pattern.split(" ");
    if (method === request.method() && new RegExp(`^${path}$`).test(url.pathname)) return reply(route, url);
  }

  const params = url.searchParams;
  switch (key) {
    case "GET /api/users/me":
      return json(route, ME);
    case "GET /api/hotplaces": {
      const area = params.get("areaCode");
      return json(route, { items: area ? HOTPLACES.filter((h) => String(h.areaCode) === area) : HOTPLACES });
    }
    case "GET /api/hotplaces/popular":
      return json(route, { items: popular(params.get("areaCode"), Number(params.get("limit") ?? 5)) }, 380);
    case "GET /api/hotplaces/me":
      return json(route, { items: HOTPLACES.filter((h) => h.writerName === ME.name) });
    case "GET /api/attractions/sidos":
    case "GET /api/attractions/guguns":
      // The page merges these with its own region constants.
      return json(route, { items: [] });
    case "GET /api/attractions":
      return json(route, { items: searchAttractions(params) }, 420);
    case "GET /api/saved-places":
      return json(route, { items: savedPlaces });
    case "POST /api/saved-places":
      return json(route, { success: true, message: "관광지를 저장했습니다." });
    case "GET /api/plans":
      return json(route, { items: PLANS });
    case "POST /api/routes/plan": {
      const body = request.postDataJSON();
      return json(route, roadRoute(body.places ?? [], body.mode), 220);
    }
    case "POST /app/ai/evaluate-plan":
      return json(route, { success: true, message: "코스 평가 성공", data: { answer: JSON.stringify(EVALUATION) } }, 1300);
    case "POST /app/ai/travel-assistant":
      return json(route, ASSISTANT_REPLY, 1100);
    case "GET /api/posts": {
      const category = params.get("category");
      return json(route, { posts: POSTS.filter((p) => !category || category === "ALL" || p.category === category) });
    }
    default:
      break;
  }

  const saved = url.pathname.match(/^\/api\/saved-places\/(\d+)$/);
  if (saved && request.method() === "DELETE") {
    savedPlaces = savedPlaces.filter((item) => item.id !== Number(saved[1]));
    return json(route, { success: true, message: "저장한 관광지를 삭제했습니다." });
  }
  const post = url.pathname.match(/^\/api\/posts\/(\d+)$/);
  if (post && request.method() === "GET") return json(route, POSTS.find((p) => p.id === Number(post[1])) ?? POSTS[0]);
  if (/^\/api\/posts\/\d+\/comments$/.test(url.pathname)) return json(route, { items: COMMENTS });
  const shared = url.pathname.match(/^\/api\/plans\/shared\/(.+)$/);
  if (shared) {
    const plan = PLANS.find((p) => p.id === decodeURIComponent(shared[1])) ?? PLANS[0];
    return json(route, { ...plan, writerEmail: ME.name });
  }

  unmatched.add(`${key}${url.search}`);
  return json(route, {});
}

/* ---------------------------------------------------------------- */
/* Helpers                                                           */
/* ---------------------------------------------------------------- */

/** Network idle, fonts ready and every <img> decoded, so no frame shows a half-loaded page. */
async function settle(page, ms = 300) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))));
  });
  await page.waitForTimeout(ms);
}

/** Opens the map home (the intro carousel is skipped off camera). */
async function openHome(page) {
  await page.goto(`${APP_URL}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "시작하기" }).evaluate((button) => button.click());
  await settle(page, 500);
}

/** Smoothly scrolls an inner scroll container by `dy` pixels. */
async function scrollInside(page, selector, dy, ms = 700) {
  await page.locator(selector).evaluate(
    (el, [delta, duration]) =>
      new Promise((resolve) => {
        const from = el.scrollTop;
        const start = performance.now();
        const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          el.scrollTop = from + delta * ease(t);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      }),
    [dy, ms],
  );
}

/* ---------------------------------------------------------------- */
/* Scenario                                                          */
/* ---------------------------------------------------------------- */

const scenario = {
  viewport: { width: 1280, height: 800 },
  scale: 2,
  outWidth: 1600,
  contextOptions: { colorScheme: "light" },
  start: prepareMedia,
  stop: () => rmSync(mediaDir, { recursive: true, force: true }),
  async setup(context, { clip, unmatched }) {
    savedPlaces = SAVED_TITLES.map(savedPlace);
    await context.addInitScript(() => localStorage.setItem("neoulteo.jwt", "demo-local-token"));
    await context.addInitScript(KAKAO_STUB);
    await context.route("**/*", (route) => handle(route, unmatched, clip.api));
  },
  clips: [
    {
      id: "neoulteo-home-map",
      title: "지도 홈",
      caption: "대한민국 지도에서 지역을 고르면 그 지역의 인기 핫플레이스가 바로 열림",
      async prepare(page) {
        await openHome(page);
        await page.mouse.move(250, 560);
      },
      async run(page, h) {
        const region = (name) => page.locator(`path[aria-label^="${name} 선택"]`);
        await h.moveTo(page, region("서울특별시"), 20);
        await page.waitForTimeout(450);
        await h.moveTo(page, region("경상남도"), 20);
        await page.waitForTimeout(300);
        await h.clickOn(page, region("부산광역시"), 14);
        await page.waitForTimeout(900);
        // Glide down the opened list of Busan hotplaces.
        await page.mouse.move(905, 520, { steps: 16 });
      },
    },
    {
      id: "neoulteo-attractions",
      title: "관광지 검색",
      caption: "지역과 키워드로 TourAPI 관광지를 찾고 결과를 누르면 지도 핀으로 이동",
      async prepare(page) {
        await page.goto(`${APP_URL}/attractions?area=${encodeURIComponent("부산")}`, { waitUntil: "networkidle" });
        await settle(page, 600);
        await page.mouse.move(200, 470);
      },
      async run(page, h) {
        await h.clickOn(page, page.getByPlaceholder("예: 바다, 한옥, 축제"), 14);
        await page.keyboard.type("바다", { delay: 80 });
        await page.waitForTimeout(100);
        await h.clickOn(page, page.locator(".filter-actions button[type=submit]"), 12);
        await page.waitForTimeout(750);
        await h.clickOn(page, page.locator(".attraction-result-card", { hasText: "광안리해수욕장" }).locator(".attraction-result-title"), 18);
        // Off the card, so it shows its selected state, and over to the pin on the map.
        await page.mouse.move(640, 520, { steps: 14 });
      },
    },
    {
      id: "neoulteo-plan-builder",
      title: "여행 계획 만들기",
      caption: "저장한 관광지를 일차별 코스에 담으면 지도에 이동 경로가 바로 그려짐",
      async prepare(page) {
        await page.goto(`${APP_URL}/plans`, { waitUntil: "networkidle" });
        await settle(page);
        await page.getByRole("button", { name: "코스 만들기" }).first().click();
        await settle(page);
        await page.getByPlaceholder("예: 부산 2박 3일 바다 코스").fill("부산 1박 2일 바다 코스");
        await page.getByRole("button", { name: "하루 추가" }).click();
        await page.locator(".plan-day-tab", { hasText: "1일차" }).click();
        const saved = page.locator(".plan-saved-picker .saved-place-card");
        await saved.filter({ hasText: "고흐의 길" }).getByRole("button", { name: "코스 추가" }).click();
        await saved.filter({ hasText: "해운대해수욕장" }).getByRole("button", { name: "코스 추가" }).click();
        await settle(page, 400);
        // Day tabs, the saved list and the course being written in one view.
        await page.locator(".plan-builder-panel").evaluate((el) => el.scrollTo(0, 168));
        await page.waitForTimeout(300);
        await page.mouse.move(592, 250);
      },
      async run(page, h) {
        const saved = page.locator(".plan-saved-picker .saved-place-card");
        await h.clickOn(page, saved.filter({ hasText: "광안리해수욕장" }).getByRole("button", { name: "코스 추가" }), 20);
        await page.waitForTimeout(250);
        await page.mouse.move(592, 420, { steps: 12 });
        await page.waitForTimeout(500);
        await scrollInside(page, ".plan-builder-panel", 200, 800);
        await page.waitForTimeout(200);
      },
    },
    {
      id: "neoulteo-plan-ai",
      title: "AI 코스 평가",
      caption: "저장한 일차별 코스를 Spring AI가 동선·일정 강도·카테고리 균형으로 평가",
      async prepare(page, h) {
        await page.goto(`${APP_URL}/plans`, { waitUntil: "networkidle" });
        await settle(page, 500);
        // The saved course on the map, its days and the AI panel's button at the bottom.
        await h.smoothScroll(page, 370, 10);
        await page.waitForTimeout(300);
        await page.mouse.move(1000, 260);
      },
      async run(page, h) {
        await h.clickOn(page, page.locator(".plan-route-day-title", { hasText: "2일차" }), 14);
        await page.waitForTimeout(500);
        await h.clickOn(page, page.locator(".plan-ai-panel-wide .plan-ai-header button"), 16);
        await page.mouse.move(560, 470, { steps: 8 });
        await h.smoothScroll(page, 840, 900);
        await page.waitForTimeout(300);
      },
    },
    {
      id: "neoulteo-ai-chat",
      title: "AI 여행 도우미",
      caption: "질문에 맞춰 날씨·관광지 도구와 DB 관광지 문서를 근거로 답하는 여행 도우미",
      async prepare(page) {
        // Opened over the hotplace ranking, so the poster already shows the assistant.
        await page.goto(`${APP_URL}/hotplaces`, { waitUntil: "networkidle" });
        await settle(page, 300);
        await page.locator(".chatbot-button").click();
        await settle(page, 300);
        await page.mouse.move(760, 560);
      },
      async run(page, h) {
        await h.clickOn(page, page.getByPlaceholder("여행에 대해 질문하기"), 14);
        await page.keyboard.type(ASK, { delay: 30 });
        await page.waitForTimeout(150);
        await h.clickOn(page, page.locator(".chatbot-input-row button[type=submit]"), 8);
        await page.mouse.move(700, 236, { steps: 14 });
        await page.waitForTimeout(1000);
      },
    },
  ],
};

export default scenario;
