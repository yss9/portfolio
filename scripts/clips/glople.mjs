/**
 * Glople demo clips: the original React (CRA) frontend, built with
 * `react-scripts build` and served with SPA fallback, driven with demo fixtures.
 * The Spring backend (http://localhost:8080 and the relative /api calls), the
 * STOMP-over-SockJS chat, Google Maps/Places, Static Maps and Wikipedia are not
 * running or not called: every request is answered here with demo data and every
 * other external request is aborted.
 *
 * Build and serve the frontend first (outside this repo):
 *   cd ../.capture/glople-frontend/frontend
 *   npm install --legacy-peer-deps && CI=false GENERATE_SOURCEMAP=false npx react-scripts build
 *   node ../serve.mjs 4323
 * GLOPLE_URL overrides the served address, GLOPLE_FRONTEND_DIR the source checkout.
 *
 * The app's layout is hard-coded to a 1500px-wide top bar, so the clips use the
 * 1440×900 viewport of the project's own screenshots instead of 1280×800.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP_URL = process.env.GLOPLE_URL ?? "http://localhost:4323";
const API = "http://localhost:8080";
const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR =
  process.env.GLOPLE_FRONTEND_DIR ?? join(HERE, "../../../.capture/glople-frontend/frontend");
const SHOTS_DIR = join(HERE, "../../public/projects/glople");

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const ago = (ms) => new Date(NOW - ms).toISOString();

/* ---------------------------------------------------------------- */
/* Demo user (fictional)                                             */
/* ---------------------------------------------------------------- */

const ME = {
  id: 7,
  userId: "yunseul01",
  nickname: "여행하는윤슬",
  name: "한윤슬",
  dateOfBirth: "20010412",
  gender: "F",
  mbti: "I68/S61/T57/P72",
};

const b64url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
/** Unsigned demo token: the frontend only decodes it (jwt-decode), nothing verifies it. */
const DEMO_JWT = [
  b64url({ alg: "HS256", typ: "JWT" }),
  b64url({
    sub: ME.userId,
    id: ME.id,
    userId: ME.id,
    nickname: ME.nickname,
    iat: Math.floor(NOW / 1000),
    exp: Math.floor(NOW / 1000) + 30 * 24 * 3600,
  }),
  "demo-signature",
].join(".");

const myInfo = {
  id: ME.id,
  userId: ME.userId,
  name: ME.name,
  nickname: ME.nickname,
  dateOfBirth: ME.dateOfBirth,
  gender: ME.gender,
  mbti: ME.mbti,
  agent: false,
  points: 12000,
  profilePicture: null,
};

/* ---------------------------------------------------------------- */
/* Media: the frontend's own photos plus crops of the project's      */
/* screenshots (public/projects/glople), converted once per run.     */
/* ---------------------------------------------------------------- */

const MEDIA = {
  // Destination photos shipped with the frontend.
  moraine: ["src/public/Img/morein.png"],
  louise: ["src/public/Img/louis.png"],
  chamonix: ["src/public/Img/alps.png"],
  "new-zealand": ["public/keywordBackground.png", "crop=1700:1500:600:300"],
  sydney: ["src/public/Img/sydney.png"],
  kyoto: ["src/public/Img/kyoto.png"],
  trocadero: ["src/public/Img/paris.png"],
  eiffel: ["src/public/Img/apeltower.png"],
  "osaka-castle": ["public/Img/osaka/img.png"],
  dotonbori: ["src/public/Img/osaka.png"],
  shinsekai: ["public/Img/osaka/img_1.png"],
  "umeda-sky": ["public/Img/osaka/img_3.png"],
  "grand-front": ["public/Img/osaka/img_7.png"],
  "red-square": ["src/public/Img/moscow.png"],
  peterhof: ["src/public/Img/russia.png"],
  catherine: ["src/public/Img/russia2.png"],
  patong: ["src/public/Img/bbatong.png"],
  "floating-market": ["src/public/Img/thaimarket.png"],
  // Crops of the keyword-result screenshot (real results of the original service).
  taupo: ["@keyword-result.png", "crop=188:180:66:142"],
  reef: ["@keyword-result.png", "crop=188:180:274:142"],
  bondi: ["@keyword-result.png", "crop=188:180:482:142"],
  // People: profile photos shipped with the frontend.
  "agent-1": ["src/public/Img/forprofile/AgentProfile6.png"],
  "agent-2": ["src/public/Img/forprofile/AgentProfile5.png"],
  "agent-3": ["src/public/Img/forprofile/AgentProfile3.png"],
  "agent-4": ["src/public/Img/forprofile/AgentProfile4.png"],
  "reviewer-1": ["src/public/Img/forprofile/myprofile.png"],
  "reviewer-2": ["src/public/Img/forprofile/AgentProfile2.png"],
  "reviewer-3": ["src/public/Img/forprofile/AgentProfile.png"],
};

let mediaDir;
function prepareMedia() {
  mediaDir = mkdtempSync(join(tmpdir(), "glople-media-"));
  for (const [key, [source, crop]] of Object.entries(MEDIA)) {
    const input = source.startsWith("@")
      ? join(SHOTS_DIR, source.slice(1))
      : join(FRONTEND_DIR, source);
    const filters = [crop, "scale='min(1000,iw)':-2:flags=lanczos"].filter(Boolean).join(",");
    const result = spawnSync(process.env.FFMPEG_PATH ?? "ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", input,
      "-vf", filters, "-q:v", "2", join(mediaDir, `${key}.jpg`),
    ]);
    if (result.status !== 0) throw new Error(`media ${key}: ${result.stderr}`);
  }
}
const media = (key) => `/demo-media/${key}.jpg`;

/* ---------------------------------------------------------------- */
/* Google Maps / Places stub                                         */
/* ---------------------------------------------------------------- */

/** Place name (as the frontend queries it) → photo, Places details and map position. */
const PLACES = {
  // Keyword recommendation
  "모레인 호수": { photo: "moraine", address: "캐나다 앨버타주 레이크 루이스", at: [51.3217, -116.186] },
  "레이크 루이스": { photo: "louise", address: "캐나다 앨버타주 레이크 루이스", at: [51.4254, -116.1773] },
  "샤모니 몽블랑": { photo: "chamonix", address: "프랑스 오베르뉴론알프 샤모니몽블랑" },
  "타우포 호수": { photo: "taupo", address: "뉴질랜드 와이카토 타우포" },
  "그레이트 배리어 리프": { photo: "reef", address: "호주 퀸즐랜드" },
  "본다이 비치": { photo: "bondi", address: "호주 뉴사우스웨일스 본다이 비치" },
  "파통 비치": { photo: "patong", address: "태국 푸껫 파통", at: [7.8961, 98.2966] },
  // MBTI recommendation (ISTP)
  "밴프 국립공원, 캐나다": { photo: "moraine", name: "밴프 국립공원", address: "캐나다 앨버타주 밴프" },
  "뉴질랜드": { photo: "new-zealand", name: "뉴질랜드", address: "뉴질랜드" },
  "스위스 알프스": { photo: "chamonix", name: "스위스 알프스", address: "스위스" },
  // Similar users' routes
  "오사카 성": { photo: "osaka-castle", at: [34.6873, 135.5262] },
  "도톤보리": { photo: "dotonbori", at: [34.6687, 135.5013] },
  "신세카이": { photo: "shinsekai", at: [34.6525, 135.5063] },
  "우메다 스카이 빌딩": { photo: "umeda-sky", at: [34.7053, 135.4903] },
  "그랜드 프런트 오사카": { photo: "grand-front", at: [34.7046, 135.495] },
  "교토": { photo: "kyoto", at: [34.9987, 135.7783] },
  "붉은 광장": { photo: "red-square", at: [55.7539, 37.6208] },
  "예카테리나 궁전": { photo: "catherine", at: [59.7163, 30.3956] },
  "페테르고프 궁전": { photo: "peterhof", at: [59.8854, 29.9086] },
  "담넌 사두억 수상시장": { photo: "floating-market", at: [13.5193, 99.959] },
  "에펠탑": { photo: "eiffel", at: [48.8584, 2.2945] },
  "트로카데로 광장": { photo: "trocadero", at: [48.8616, 2.2893] },
};

/**
 * The MBTI page renders its default type (ENTJ) for a moment before the user's
 * MBTI arrives and asks Places for those photos; that render is never on camera.
 */
const OFF_CAMERA_QUERIES = ["런던, 영국", "두바이, 아랍에미리트", "싱가포르", "샌프란시스코, 미국", "뉴욕, 미국", "도쿄, 일본"];

const GOOGLE_STUB = (places) => `
(function () {
  if (window.google && window.google.maps && window.google.maps.places) return;
  var PLACES = ${JSON.stringify(places)};
  var OFF_CAMERA = ${JSON.stringify(OFF_CAMERA_QUERIES)};
  function find(query) {
    var q = String(query || "").trim();
    if (PLACES[q]) return q;
    var first = q.split(",")[0].trim();
    if (PLACES[first]) return first;
    if (OFF_CAMERA.indexOf(q) < 0) {
      try { fetch("/demo-media/__missing?q=" + encodeURIComponent(q)); } catch (e) {}
    }
    return null;
  }
  function place(key) {
    var p = PLACES[key];
    return {
      place_id: key,
      name: p.name || key,
      formatted_address: p.address || "",
      photos: [{ getUrl: function () { return "/demo-media/" + p.photo + ".jpg"; } }]
    };
  }
  function PlacesService() {}
  PlacesService.prototype.findPlaceFromQuery = function (request, callback) {
    var key = find(request && request.query);
    callback(key ? [place(key)] : null, key ? "OK" : "ZERO_RESULTS");
  };
  PlacesService.prototype.getDetails = function (request, callback) {
    var key = find(request && request.placeId);
    callback(key ? place(key) : null, key ? "OK" : "NOT_FOUND");
  };
  window.google = window.google || {};
  window.google.maps = window.google.maps || {};
  window.google.maps.places = {
    PlacesService: PlacesService,
    PlacesServiceStatus: { OK: "OK", ZERO_RESULTS: "ZERO_RESULTS", NOT_FOUND: "NOT_FOUND" }
  };
})();
`;

/* ---------------------------------------------------------------- */
/* Static route map stand-in (generated SVG, no map tiles)            */
/* ---------------------------------------------------------------- */

function seeded(text) {
  let s = 0;
  for (const ch of text) s = (Math.imul(s, 31) + ch.codePointAt(0)) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A plain street-map style SVG with numbered pins and the route line, laid out so
 * the 220×220 `object-fit: cover` crop of the 600×300 image shows every pin.
 */
function routeMapSvg(names) {
  const rand = seeded(names.join("|"));
  const points = names.map((name) => PLACES[name]?.at ?? null);
  const known = points.filter(Boolean);
  const lat0 = known.reduce((sum, p) => sum + p[0], 0) / Math.max(1, known.length);
  const xy = points.map((p, i) =>
    p ? [p[1] * Math.cos((lat0 * Math.PI) / 180), -p[0]] : [i, 0],
  );
  const xs = xy.map((p) => p[0]);
  const ys = xy.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const box = { x: 230, y: 90, size: 140 };
  const pins = xy.map(([x, y]) => [
    box.x + ((x - minX) / span) * box.size + (box.size - ((maxX - minX) / span) * box.size) / 2,
    box.y + ((y - minY) / span) * box.size + (box.size - ((maxY - minY) / span) * box.size) / 2,
  ]);
  // Keep neighbouring pins readable: push apart pins closer than 50px, inside
  // the part of the image that the 220×220 crop shows.
  const clamp = (pin) => {
    pin[0] = Math.min(415, Math.max(185, pin[0]));
    pin[1] = Math.min(285, Math.max(45, pin[1]));
  };
  for (let round = 0; round < 80; round++) {
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const dx = pins[j][0] - pins[i][0] || 0.5;
        const dy = pins[j][1] - pins[i][1] || 0.5;
        const distance = Math.hypot(dx, dy);
        if (distance >= 50) continue;
        const push = (50 - distance) / 2 / distance;
        pins[i][0] -= dx * push;
        pins[i][1] -= dy * push;
        pins[j][0] += dx * push;
        pins[j][1] += dy * push;
      }
    }
    pins.forEach(clamp);
  }

  const streets = [];
  const angle = rand() * 30 - 15;
  for (let i = 0; i < 22; i++) {
    const offset = -60 + i * 34 + rand() * 12;
    streets.push(`<line x1="${offset}" y1="-40" x2="${offset + rand() * 40 - 20}" y2="340"/>`);
  }
  for (let i = 0; i < 12; i++) {
    const offset = -20 + i * 30 + rand() * 10;
    streets.push(`<line x1="-40" y1="${offset}" x2="640" y2="${offset + rand() * 30 - 15}"/>`);
  }
  const parks = Array.from({ length: 4 }, () => {
    const x = 120 + rand() * 360;
    const y = 30 + rand() * 230;
    return `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(26 + rand() * 40).toFixed(0)}" height="${(18 + rand() * 30).toFixed(0)}" rx="5"/>`;
  });
  const riverY = 60 + rand() * 180;
  const river = `M-20 ${riverY.toFixed(0)} C 140 ${(riverY - 70).toFixed(0)}, 260 ${(riverY + 90).toFixed(0)}, 380 ${(riverY + 10).toFixed(0)} S 560 ${(riverY - 60).toFixed(0)}, 640 ${(riverY + 20).toFixed(0)}`;
  const majors = [
    `M-20 ${(80 + rand() * 140).toFixed(0)} L640 ${(80 + rand() * 140).toFixed(0)}`,
    `M${(220 + rand() * 160).toFixed(0)} -20 L${(220 + rand() * 160).toFixed(0)} 320`,
    `M-20 ${(rand() * 300).toFixed(0)} L640 ${(rand() * 300).toFixed(0)}`,
  ];
  const route = pins.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const markers = pins
    .map(
      ([x, y], i) => `
    <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <path d="M0 0 C-4 -7 -10 -11 -10 -19 A10 10 0 1 1 10 -19 C10 -11 4 -7 0 0Z" fill="#ea4335" stroke="#a52714" stroke-width="1.2"/>
      <text x="0" y="-14.5" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">${i + 1}</text>
    </g>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
  <rect width="600" height="300" fill="#f1efea"/>
  <g fill="#c9e7c3">${parks.join("")}</g>
  <g transform="rotate(${angle.toFixed(1)} 300 150)" stroke="#ffffff" stroke-width="2.4">${streets.join("")}</g>
  <path d="${river}" fill="none" stroke="#a9d3f5" stroke-width="13" stroke-linecap="round"/>
  <g fill="none" stroke-linecap="round">
    ${majors.map((d) => `<path d="${d}" stroke="#eccb7a" stroke-width="6.5"/><path d="${d}" stroke="#fde7a6" stroke-width="4.5"/>`).join("")}
  </g>
  <polyline points="${route}" fill="none" stroke="#2f3cf0" stroke-opacity="0.78" stroke-width="5" stroke-linejoin="round"/>
  ${markers}
</svg>`;
}

/* ---------------------------------------------------------------- */
/* Fixtures                                                          */
/* ---------------------------------------------------------------- */

/** Home map popup: recent reviews per country. */
const countryPosts = {
  일본: [
    ["오사카 3박 4일 먹방 루트", "dotonbori", 2],
    ["교토 단풍 명소 총정리", "kyoto", 5],
    ["오사카 성 벚꽃 산책", "osaka-castle", 9],
    ["신세카이 쿠시카츠 골목", "shinsekai", 12],
  ],
  호주: [
    ["시드니 오페라하우스 야경", "sydney", 3],
    ["본다이 비치 코스탈 워크", "bondi", 8],
  ],
  러시아: [
    ["모스크바 붉은 광장 산책", "red-square", 4],
    ["상트페테르부르크 궁전 투어", "catherine", 10],
  ],
  캐나다: [
    ["레이크 루이스 카누 체험", "louise", 2],
    ["밴프 모레인 호수 일출", "moraine", 7],
  ],
};

/** Keyword search (bit-mask filter + BIT_COUNT order): top 9 + 12 course candidates. */
const KEYWORD_RESULTS = [
  "모레인 호수", "레이크 루이스", "샤모니 몽블랑",
  "밴프 국립공원", "요세미티 국립공원", "할슈타트", "플리트비체 호수", "체르마트", "블레드 호수",
  "타우포 호수", "그레이트 배리어 리프", "본다이 비치", "파통 비치",
  "그랜드 캐니언", "옐로스톤 국립공원", "울루루", "밀포드 사운드", "인터라켄", "돌로미티", "코모 호수", "아이슬란드 링로드",
].map((destName, index) => ({ destId: 300 + index, destName, matchCount: Math.max(1, 6 - Math.floor(index / 4)) }));

/** Users similar to ME by gender, birth year and MBTI, with the routes they travelled. */
const SIMILAR_USERS = [
  { id: 41, age: "20000917", gender: "F", mbti: "ISTP", travelDestinations: ["오사카 성", "도톤보리", "신세카이", "우메다 스카이 빌딩"] },
  { id: 42, age: "20020305", gender: "F", mbti: "ISFP", travelDestinations: ["붉은 광장", "예카테리나 궁전", "페테르고프 궁전"] },
  { id: 43, age: "19990621", gender: "F", mbti: "ISTJ", travelDestinations: ["교토", "그랜드 프런트 오사카", "도톤보리"] },
  { id: 44, age: "20011108", gender: "F", mbti: "ISTP", travelDestinations: ["레이크 루이스", "모레인 호수"] },
  { id: 45, age: "20000102", gender: "F", mbti: "ESTP", travelDestinations: ["담넌 사두억 수상시장", "파통 비치"] },
];
const SAVED_ROUTES = [
  { id: 91, age: "20000917", gender: "F", mbti: "ISTP", travelDestinations: ["에펠탑", "트로카데로 광장"] },
  { id: 92, age: "20020305", gender: "F", mbti: "ISFP", travelDestinations: ["레이크 루이스", "모레인 호수"] },
];

/** Place information page: an original short Korean summary instead of the Wikipedia call. */
const PLACE_SUMMARY = {
  "밴프 국립공원":
    "밴프 국립공원은 캐나다 앨버타주 로키산맥에 자리한 캐나다 최초의 국립공원으로, 1885년에 지정되었다. 빙하가 녹아 흘러든 에메랄드빛 호수와 3,000m급 봉우리, 울창한 침엽수림이 어우러진 풍경으로 유명하다. 레이크 루이스와 모레인 호수, 설퍼산 곤돌라, 보우 폭포가 대표 명소이며, 공원 안의 밴프 타운은 온천과 숙소를 갖춘 여행 거점이다.",
  뉴질랜드:
    "뉴질랜드는 남태평양의 북섬과 남섬으로 이루어진 나라로, 빙하 호수와 피오르, 화산 지형이 한 나라 안에 모여 있다. 트레킹과 캠핑, 번지점프 같은 야외 활동의 천국으로 불린다.",
  "스위스 알프스":
    "스위스 알프스는 마테호른과 융프라우 등 4,000m급 봉우리가 이어지는 산악 지대로, 산악 열차와 하이킹 코스가 잘 갖춰져 있어 사계절 내내 여행객이 찾는다.",
};
const placeReviews = {
  "밴프 국립공원": [
    { boardID: 501, title: "모레인 호수 일출 보려고 새벽 4시에 출발한 날", profilePicture: "profiles/reviewer-1.jpg" },
    { boardID: 502, title: "밴프 3일 렌터카 루트와 주차 꿀팁", profilePicture: "profiles/reviewer-2.jpg" },
    { boardID: 503, title: "레이크 루이스 카누, 이건 꼭 하세요", profilePicture: "profiles/reviewer-3.jpg" },
  ],
};

/** Local experts (글로플러) and chat. */
const AGENTS = ["오사카토박이하루", "교토산책유키", "삿포로설경준", "도쿄미식가렌"];
const AGENT_PHOTO = Object.fromEntries(AGENTS.map((name, i) => [name, `agent-${i + 1}`]));
const AGENT_PROGRESS = { 오사카토박이하루: 2, 교토산책유키: 1, 삿포로설경준: 1, 도쿄미식가렌: 4 };
const ROOM_ID = "room-yunseul-haru";
const chatHistory = (agent) => [
  { sender: agent, content: "안녕하세요, 윤슬 님! 글로플러 하루예요.", type: "CHAT" },
  { sender: ME.nickname, content: "첫날은 오사카 성이랑 도톤보리 가고 싶어요.", type: "CHAT" },
  { sender: agent, content: "그럼 오사카 성과 도톤보리 야경 코스로 짤게요.", type: "CHAT" },
];
const CHAT_ASK = "둘째 날은 교토도 다녀올 수 있을까요?";
const CHAT_REPLY = "물론이죠! 한큐 전철로 40분이면 가요. 기요미즈데라와 기온 거리 코스로 짜 드릴게요.";

/* ---------------------------------------------------------------- */
/* Request handling                                                  */
/* ---------------------------------------------------------------- */

const CORS = {
  "access-control-allow-origin": APP_URL,
  "access-control-allow-credentials": "true",
  "access-control-allow-headers": "Authorization, Content-Type, Accept",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
};
function json(route, data, delay = 0) {
  const send = () =>
    route.fulfill({
      status: 200,
      headers: CORS,
      contentType: "application/json; charset=utf-8",
      body: JSON.stringify(data),
    });
  return delay ? new Promise((r) => setTimeout(r, delay)).then(send) : send();
}
function file(route, path, contentType = "image/jpeg") {
  return route.fulfill({ status: 200, headers: CORS, contentType, body: readFileSync(path) });
}

/** `delays`: per-clip response delays in ms, keyed by path. */
async function handleApi(route, unmatched, delays = {}) {
  const request = route.request();
  const url = new URL(request.url());
  const method = request.method();
  if (method === "OPTIONS") return route.fulfill({ status: 204, headers: CORS });
  const path = decodeURIComponent(url.pathname);
  const q = (name) => url.searchParams.get(name);
  if (delays[path]) await new Promise((resolve) => setTimeout(resolve, delays[path]));

  // Uploaded pictures served by the backend (profile pictures).
  const profile = path.match(/^\/(?:profiles|agents)\/([\w-]+)\.jpg$/);
  if (profile) return file(route, join(mediaDir, `${profile[1]}.jpg`));
  // The chat list renders `${API}/${undefined}` until the pictures arrive.
  if (path === "/undefined") return route.fulfill({ status: 404, headers: CORS, body: "" });

  // Relative calls on the app origin.
  if (method === "POST" && path === "/api/search") return json(route, KEYWORD_RESULTS, 250);
  if (method === "POST" && path === "/api/info-recommend") return json(route, SIMILAR_USERS);

  if (path === "/api/users/my-info") return json(route, myInfo);
  if (path === "/api/get-routes") return json(route, SAVED_ROUTES);
  const countryMatch = path.match(/^\/api\/posts\/([^/]+)$/);
  if (method === "GET" && countryMatch && countryPosts[countryMatch[1]]) {
    return json(
      route,
      countryPosts[countryMatch[1]].map(([title, photo, days], index) => ({
        boardID: 200 + index,
        title,
        thumbnail: media(photo),
        createDate: ago(days * DAY),
      })),
    );
  }
  const titles = path.match(/^\/api\/posts\/titles\/(.+)$/);
  if (titles) return json(route, placeReviews[titles[1]] ?? []);

  // Chat with local experts.
  if (path === "/chat/userRooms") return json(route, AGENTS);
  if (path === "/api/booking/progress") return json(route, AGENT_PROGRESS[q("agentId")] ?? 1);
  if (path === "/api/booking/check-sended") return json(route, false);
  const picture = path.match(/^\/api\/users\/profile-picture\/(.+)$/);
  if (picture) {
    return route.fulfill({
      status: 200,
      headers: CORS,
      contentType: "text/plain; charset=utf-8",
      body: `agents/${AGENT_PHOTO[picture[1]] ?? "agent-1"}.jpg`,
    });
  }
  if (method === "POST" && path === "/chat/createRoom") {
    return route.fulfill({ status: 200, headers: CORS, contentType: "text/plain", body: ROOM_ID });
  }
  const history = path.match(/^\/chat\/history\/(.+)$/);
  if (history) return json(route, chatHistory(AGENTS[0]));
  if (path === "/ws/info") {
    return json(route, { entropy: 1234567, origins: ["*:*"], cookie_needed: false, websocket: true });
  }

  unmatched.add(`${method} ${url.origin === API ? "" : url.origin}${path}${url.search}`);
  return json(route, []);
}

const WIKI_PAGE = (title) => ({
  batchcomplete: "",
  query: { pages: { 100: { pageid: 100, ns: 0, title, extract: PLACE_SUMMARY[title] ?? "" } } },
});

/**
 * STOMP over a SockJS websocket: answers CONNECT, remembers SUBSCRIBE ids and
 * echoes SEND frames back to the room topic; the local expert replies once.
 */
function stompServer(ws) {
  const subscriptions = new Map();
  let messageId = 0;
  const sockjs = (frames) => ws.send(`a${JSON.stringify(frames)}`);
  const frame = (command, headers, body = "") =>
    `${command}\n${Object.entries(headers).map(([k, v]) => `${k}:${v}`).join("\n")}\n\n${body}\u0000`;
  const publish = (destination, payload) => {
    const id = subscriptions.get(destination);
    if (id == null) return;
    sockjs([
      frame(
        "MESSAGE",
        { destination, subscription: id, "message-id": `m-${++messageId}`, "content-type": "application/json" },
        JSON.stringify(payload),
      ),
    ]);
  };
  let replied = false;
  ws.send("o");
  ws.onMessage((raw) => {
    let frames;
    try {
      frames = JSON.parse(String(raw));
    } catch {
      return;
    }
    for (const text of frames) {
      const [head, ...rest] = text.split("\n\n");
      const lines = head.split("\n").filter(Boolean);
      const command = lines[0];
      const headers = Object.fromEntries(lines.slice(1).map((l) => [l.slice(0, l.indexOf(":")), l.slice(l.indexOf(":") + 1)]));
      const body = rest.join("\n\n").replace(/\u0000$/, "");
      if (command === "CONNECT" || command === "STOMP") {
        sockjs([frame("CONNECTED", { version: "1.2", "heart-beat": "0,0" })]);
      } else if (command === "SUBSCRIBE") {
        subscriptions.set(headers.destination, headers.id);
      } else if (command === "SEND") {
        const room = headers.destination.split("/").pop();
        const topic = `/topic/public/${room}`;
        const message = JSON.parse(body);
        publish(topic, message);
        if (!replied && message.sender === ME.nickname) {
          replied = true;
          setTimeout(() => publish(topic, { sender: AGENTS[0], content: CHAT_REPLY, type: "CHAT" }), 1100);
        }
      }
    }
  });
}

const scenario = {
  viewport: { width: 1440, height: 900 },
  scale: 2,
  outWidth: 1600,
  appUrl: APP_URL,
  start: prepareMedia,
  stop: () => mediaDir && rmSync(mediaDir, { recursive: true, force: true }),
  async setup(context, { clip, unmatched }) {
    if (clip.signedIn !== false) {
      await context.addCookies([{ name: "jwt", value: DEMO_JWT, url: APP_URL }]);
    }
    // Deterministic Math.random so random nicknames, hashtags and shuffles repeat.
    await context.addInitScript((seed) => {
      let s = seed >>> 0;
      Math.random = () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }, clip.seed ?? 11);
    const stub = GOOGLE_STUB(PLACES);
    await context.addInitScript(stub);

    // Anything external that is not stubbed below is aborted.
    await context.route(/^https?:\/\/(?!localhost[:/])/, (route) => {
      unmatched.add(`external ${route.request().url().slice(0, 90)}`);
      return route.abort();
    });
    await context.route("https://maps.googleapis.com/maps/api/js**", (route) =>
      route.fulfill({ status: 200, contentType: "text/javascript", body: stub }),
    );
    await context.route("https://maps.googleapis.com/maps/api/staticmap**", (route) => {
      const url = new URL(route.request().url());
      const names = url.searchParams.getAll("markers").map((m) => m.split("|").pop());
      return route.fulfill({ status: 200, contentType: "image/svg+xml", body: routeMapSvg(names) });
    });
    await context.route("https://ko.wikipedia.org/w/api.php**", (route) => {
      const title = new URL(route.request().url()).searchParams.get("titles") ?? "";
      return route.fulfill({
        status: 200,
        headers: { "access-control-allow-origin": "*" },
        contentType: "application/json; charset=utf-8",
        body: JSON.stringify(WIKI_PAGE(title)),
      });
    });
    await context.route(`${API}/**`, (route) => handleApi(route, unmatched, clip.delays));
    await context.route(`${APP_URL}/api/**`, (route) => handleApi(route, unmatched, clip.delays));
    await context.route(`${APP_URL}/demo-media/**`, (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith("__missing")) {
        unmatched.add(`place photo: ${url.searchParams.get("q")}`);
        return route.fulfill({ status: 204 });
      }
      return file(route, join(mediaDir, url.pathname.split("/").pop()));
    });
    await context.routeWebSocket(/\/ws\/.+\/websocket$/, stompServer);
  },
  clips: [
    {
      id: "glople-home-map",
      title: "세계 지도 홈",
      caption: "지도에서 나라를 고르면 최근 여행 리뷰와 예약 바로가기가 열림",
      async prepare(page) {
        await page.goto(`${APP_URL}/`, { waitUntil: "networkidle" });
        await preload(page, countryPosts["캐나다"].map(([, photo]) => media(photo)));
        await page.waitForTimeout(600);
        await page.mouse.move(600, 520);
      },
      async run(page) {
        const usa = await countryPoint(page, "미국");
        const canada = await countryPoint(page, "캐나다");
        await page.waitForTimeout(150);
        await page.mouse.move(usa.x, usa.y, { steps: 26 });
        await drift(page, 600, 8, -4);
        await page.mouse.move(canada.x, canada.y, { steps: 16 });
        await drift(page, 350, 4, 2);
        await page.mouse.down();
        await page.waitForTimeout(90);
        await page.mouse.up();
        await drift(page, 1900, 14, 6);
      },
      hold: 100,
    },
    {
      id: "glople-keyword",
      title: "키워드 맞춤 추천",
      caption: "고른 키워드와 겹치는 키워드가 많은 여행지부터 추천",
      seed: 14,
      async prepare(page) {
        await page.goto(`${APP_URL}/keyword`, { waitUntil: "networkidle" });
        for (const keyword of ["호수", "산", "자연", "경치"]) {
          await page.getByRole("button", { name: keyword, exact: true }).click();
        }
        for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "다음" }).click();
        await page.getByRole("button", { name: "국립공원", exact: true }).click();
        await preload(page, ["moraine", "louise", "chamonix", "taupo", "reef", "bondi", "patong"].map(media));
        await page.mouse.move(1180, 760);
        await page.waitForTimeout(500);
      },
      async run(page, h) {
        await page.waitForTimeout(100);
        await h.clickOn(page, page.getByRole("button", { name: "하이킹 코스", exact: true }), 18);
        await page.waitForTimeout(250);
        await h.clickOn(page, page.getByRole("button", { name: "완료" }), 18);
        // Off the results while they load, so the cursor does not cover a title.
        await page.mouse.move(1290, 790, { steps: 20 });
        await page.locator("img[alt='샤모니 몽블랑']").waitFor();
        await drift(page, 750, -10, -4);
        await scrollBox(page, "end", 900);
        await drift(page, 420, -8, -3);
      },
      hold: 100,
    },
    {
      id: "glople-mbti",
      title: "MBTI 여행지 추천",
      caption: "내 MBTI에 맞는 여행지에서 소개·리뷰·루트 추천으로 이동",
      seed: 46,
      delays: { "/api/users/my-info": 300 },
      async prepare(page) {
        await page.goto(`${APP_URL}/recomendation/mbti`, { waitUntil: "networkidle" });
        await page.locator("img[alt='스위스 알프스']").waitFor();
        await preload(page, [
          ...["moraine", "new-zealand", "chamonix"].map(media),
          `${API}/profiles/reviewer-1.jpg`,
          `${API}/profiles/reviewer-2.jpg`,
        ]);
        // Keep the "MBTI 검사하기" button whole at the top and the cards below.
        await scrollBox(page, "MBTI 검사하기", 0, 22);
        await page.waitForTimeout(400);
        await page.mouse.move(1130, 330);
      },
      async run(page, h) {
        await page.waitForTimeout(150);
        // Over the MBTI letters (each one toggles), then on to the first destination.
        const first = await page.getByText("I", { exact: true }).boundingBox();
        const last = await page.getByText("P", { exact: true }).boundingBox();
        await page.mouse.move(first.x + first.width / 2, first.y + first.height * 0.72, { steps: 18 });
        await drift(page, 550, last.x - first.x, 0);
        const card = page.locator("img[alt='밴프 국립공원, 캐나다']");
        await h.moveTo(page, card, 20);
        await page.waitForTimeout(250);
        await h.clickOn(page, card, 3);
        await page.getByText("밴프 3일 렌터카").waitFor();
        await drift(page, 350, 6, 4);
        const button = await page.getByRole("button", { name: "루트 추천" }).boundingBox();
        await page.mouse.move(button.x + button.width * 0.82, button.y + button.height * 0.6, { steps: 24 });
        await drift(page, 1000, 6, 2);
      },
      hold: 100,
    },
    {
      id: "glople-route",
      title: "유사 사용자 여행 루트",
      caption: "성별·나이·MBTI가 비슷한 사용자의 루트를 지도와 함께 넘겨 보기",
      seed: 2,
      async prepare(page) {
        await page.goto(`${APP_URL}/recomendation/similarity`, { waitUntil: "networkidle" });
        await page.locator("img[alt='우메다 스카이 빌딩']").first().waitFor();
        await preload(page, Object.values(PLACES).map((p) => media(p.photo)));
        await page.waitForTimeout(500);
        await page.mouse.move(1010, 330);
      },
      async run(page, h) {
        const next = page.locator("button:has(svg)").last();
        await page.waitForTimeout(300);
        await h.clickOn(page, next, 26);
        await drift(page, 1250, 5, 3);
        await h.clickOn(page, next, 3);
        await drift(page, 1400, 6, 3);
      },
      hold: 100,
    },
    {
      id: "glople-chat",
      title: "글로플러 실시간 채팅",
      caption: "현지 전문가와 WebSocket 채팅으로 여행 일정 조율",
      async prepare(page) {
        await page.goto(`${APP_URL}/chat`, { waitUntil: "networkidle" });
        await page.getByText(AGENTS[0]).first().click();
        await page.getByText("도톤보리 야경 코스로").waitFor();
        // No spell-check squiggles under the Korean text being typed.
        await page.evaluate(() => document.querySelectorAll("input").forEach((el) => (el.spellcheck = false)));
        await page.waitForTimeout(700);
        await page.mouse.move(1150, 700);
      },
      async run(page, h) {
        const input = page.getByPlaceholder("메세지를 보내서 글로플러와 예약을 진행해 보세요.");
        await page.waitForTimeout(100);
        await h.clickOn(page, input, 16);
        await page.keyboard.type(CHAT_ASK, { delay: 50 });
        await page.waitForTimeout(200);
        await page.keyboard.press("Enter");
        await drift(page, 1150, 10, 3);
        await page.getByText("기요미즈데라").waitFor();
        await drift(page, 950, 8, 2);
      },
      hold: 100,
    },
  ],
};

/**
 * Nudge the cursor a few pixels over `ms`. The screencast only sends frames when
 * something changes, so a still ending would leave the last frame's duration to
 * the encoder; a slow drift keeps frames coming until the clip ends.
 */
async function drift(page, ms, dx = 10, dy = 4) {
  const from = await page.evaluate(() => {
    const dot = document.getElementById("__demo-cursor");
    return dot && dot.style.left ? [parseFloat(dot.style.left), parseFloat(dot.style.top)] : null;
  });
  if (!from) return page.waitForTimeout(ms);
  const steps = Math.max(1, Math.round(ms / 60));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ease = t * (2 - t);
    await page.mouse.move(from[0] + dx * ease, from[1] + dy * ease);
    await page.waitForTimeout(ms / steps);
  }
}

/** Warm the browser cache so photos show at once when their page renders. */
async function preload(page, urls) {
  await page.evaluate(
    (list) =>
      Promise.all(
        list.map(
          (src) =>
            new Promise((resolve) => {
              const image = new Image();
              image.onload = image.onerror = resolve;
              image.src = src;
            }),
        ),
      ),
    [...new Set(urls)],
  );
}

/** A point inside the clickable country shape on the home map (by the country name its handler passes). */
async function countryPoint(page, country) {
  return page.evaluate((name) => {
    for (const el of document.querySelectorAll("svg path")) {
      const key = Object.keys(el).find((k) => k.startsWith("__reactProps"));
      const handler = key && el[key].onClick;
      if (!handler) continue;
      const literal = handler.toString().match(/"((?:[^"\\]|\\.)*)"/);
      if (!literal || JSON.parse(literal[0]) !== name) continue;
      const box = el.getBBox();
      const svg = el.ownerSVGElement;
      let best = null;
      for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
          const p = svg.createSVGPoint();
          p.x = box.x + (box.width * i) / 20;
          p.y = box.y + (box.height * j) / 20;
          if (!el.isPointInFill(p)) continue;
          const d = Math.hypot(i - 10, j - 10);
          if (!best || d < best.d) {
            const s = p.matrixTransform(el.getScreenCTM());
            best = { d, x: Math.round(s.x), y: Math.round(s.y) };
          }
        }
      }
      return best;
    }
    throw new Error(`no map shape for ${name}`);
  }, country);
}

/**
 * Scroll the page's own scroll container (these pages scroll an 84vh box, not the
 * window): to its end, or so the element with the given text sits near its top.
 */
async function scrollBox(page, target, ms, margin = 40) {
  await page.evaluate(
    ([target, duration, margin]) =>
      new Promise((resolve) => {
        const box = [...document.querySelectorAll("div")].find(
          (el) => getComputedStyle(el).overflowY === "scroll" && el.scrollHeight > el.clientHeight,
        );
        if (!box) return resolve();
        const from = box.scrollTop;
        let to = box.scrollHeight - box.clientHeight;
        if (target !== "end") {
          const el = [...box.querySelectorAll("*")].find((node) => node.textContent.trim() === target);
          to = from + el.getBoundingClientRect().top - box.getBoundingClientRect().top - margin;
        }
        if (!duration) {
          box.scrollTop = to;
          return resolve();
        }
        const start = performance.now();
        const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          box.scrollTop = from + (to - from) * ease(t);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      }),
    [target, ms, margin],
  );
}

export default scenario;
