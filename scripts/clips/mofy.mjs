/**
 * MOFY demo clips: the original Next.js 12 frontend (Mofy/frontend), built with
 * `next build` and served by `next start`, driven with demo fixtures. The Django
 * backend is not running, so every call to it (127.0.0.1:8000 / localhost:8000)
 * is answered here. OpenWeatherMap and the weather icon CDN are intercepted as
 * well: nothing leaves the machine.
 *
 * Build and serve the frontend first (outside this repo, in the export at
 * ../.capture/mofy-frontend/frontend; the three empty page files
 * pages/getMyBoard, pages/mks/message/[mid] and pages/mks/messageget/[mmid]
 * are moved aside there because `next build` rejects pages without a component):
 *   npm ci
 *   NODE_OPTIONS="--require $PWD/../node23-fetch-shim.cjs" npx next build
 *   NODE_OPTIONS="--require $PWD/../node23-fetch-shim.cjs" npx next start -p 4325
 * The shim lets Next 12's image loader read its .wasm on Node 18+.
 * MOFY_URL overrides the served address.
 *
 * The app hard-codes http://localhost:3000 for most page links. Those requests
 * are answered from the build on MOFY_URL, so nothing reaches port 3000.
 *
 * Photos are crops of the project's own screenshots (public/projects/mofy and
 * the repo's docs/images); the palette colours are the ones the original
 * rembg → extcolors pipeline produced for that photo.
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP_URL = process.env.MOFY_URL ?? "http://localhost:4325";
const API = "http://127.0.0.1:8000";
const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(HERE, "../../public/projects/mofy");
const FRONTEND_DIR =
  process.env.MOFY_FRONTEND_DIR ?? join(HERE, "../../../.capture/mofy-frontend/frontend");
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";

/* ---------------------------------------------------------------- */
/* Dates (KST, relative to the recording)                            */
/* ---------------------------------------------------------------- */

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;
/** "YYYY-MM-DDTHH:MM:00+09:00", n days before the recording (KST calendar). */
function kst(daysAgo, hh, mm = 0) {
  const date = new Date(NOW - daysAgo * DAY + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return `${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00+09:00`;
}

/* ---------------------------------------------------------------- */
/* Demo media                                                        */
/* ---------------------------------------------------------------- */

let mediaDir;
const media = (name) => readFileSync(join(mediaDir, name));

function ff(args) {
  const result = spawnSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args]);
  if (result.status !== 0) throw new Error(`ffmpeg: ${result.stderr?.toString()}`);
}

/** The repo's palette for this photo (docs/images/color-palette.png). */
const PALETTE = ["6b6c75", "c5bbb2", "000000", "503820", "9a7b28", "b36b64"];

function prepareMedia() {
  mediaDir = mkdtempSync(join(tmpdir(), "mofy-media-"));
  const overview = join(SHOTS, "overview.png");
  const palette = join(SHOTS, "color-palette.png");

  // "Today's Mofy" rank photos (170×250 slots).
  [
    [174, 278],
    [363, 278],
    [553, 278],
    [743, 278],
  ].forEach(([x, y], index) => {
    ff(["-i", overview, "-vf", `crop=162:243:${x}:${y},scale=170:250:flags=lanczos`, "-q:v", "2", join(mediaDir, `rank-${index + 1}.jpg`)]);
  });

  // The OOTD photo and its background-removed version, inside the rounded corners.
  ff(["-i", palette, "-vf", "crop=476:488:57:30", join(mediaDir, "plaid.png")]);
  ff(["-i", palette, "-vf", "crop=476:488:565:30", join(mediaDir, "plaid-cut.png")]);
  ff(["-i", join(mediaDir, "plaid.png"), "-q:v", "2", join(mediaDir, "ootd-plaid.jpg")]);

  // Palette page: the app stretches each image to 996×480, so compose them at that size.
  ff([
    "-i", join(mediaDir, "plaid.png"),
    "-filter_complex",
    "[0]split[a][b];[a]scale=996:-1,crop=996:480,boxblur=40:3,eq=brightness=0.02:saturation=0.75[bg];[b]scale=-1:480:flags=lanczos[fg];[bg][fg]overlay=(W-w)/2:0",
    "-q:v", "2", join(mediaDir, "palette-before.jpg"),
  ]);
  ff([
    "-i", join(mediaDir, "plaid-cut.png"),
    "-vf", "scale=-1:480:flags=lanczos,pad=996:480:(ow-iw)/2:0:white",
    join(mediaDir, "palette-middle.png"),
  ]);
  // Like the backend: one equal-width block per extracted colour (drawn at the
  // display size so the block edges stay crisp when the page stretches it).
  const inputs = PALETTE.flatMap((hex) => ["-f", "lavfi", "-i", `color=c=0x${hex}:s=166x480:d=1`]);
  ff([
    ...inputs,
    "-filter_complex", `${PALETTE.map((_, i) => `[${i}]`).join("")}hstack=inputs=${PALETTE.length}`,
    "-frames:v", "1", join(mediaDir, "palette-result.png"),
  ]);

  // Market photos.
  ff([
    "-i", overview,
    "-filter_complex",
    "[0]crop=162:243:743:278,split[a][b];[a]scale=800:-1,crop=800:600:0:0,boxblur=30:3[bg];[b]scale=-1:600:flags=lanczos[fg];[bg][fg]overlay=(W-w)/2:0",
    "-q:v", "2", join(mediaDir, "market-outer.jpg"),
  ]);

  writeFileSync(join(mediaDir, "avatar.jpg"), readFileSync(join(FRONTEND_DIR, "public/images/firstImg.jpg")));
}

/** Line icons in place of the two flaticon PNGs on the weather card. */
const ICONS = {
  "4158502": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1f1f1f" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 39V11a6 6 0 0 1 12 0v28a11 11 0 1 1-12 0z"/><circle cx="30" cy="48" r="5" fill="#1f1f1f"/><path d="M30 43V21"/><path d="M42 14h6M42 20h6M42 26h6M42 32h4"/></svg>`,
  "3942043": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1f1f1f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="24" r="8"/><path d="M40 8v4M51.3 12.7l-2.8 2.8M56 24h-4M28.7 12.7l2.8 2.8M51.3 35.3l-2.8-2.8"/><path d="M16 52h27a9 9 0 0 0 1-17.9A13 13 0 0 0 19.3 38 7 7 0 0 0 16 52z" fill="#fff"/></svg>`,
};

/* ---------------------------------------------------------------- */
/* Fixtures                                                          */
/* ---------------------------------------------------------------- */

const ME = { username: "김민서" };

const communityBoards = [
  [31, "가을 옷장 정리, 오래 입는 니트 관리법", 0, 9, 15],
  [32, "160cm 트렌치코트 기장 고민이에요", 1, 19, 40],
  [33, "출근룩과 주말룩 같이 돌려 입는 방법", 2, 14, 20],
  [34, "체형별 와이드 데님 핏 고르는 팁", 3, 11, 5],
  [35, "미니멀 룩에 포인트 주는 액세서리", 4, 8, 30],
  [36, "이번 주 성수 팝업 같이 가실 분", 5, 16, 0],
].map(([boardID, title, days, hh, mm]) => ({
  boardID, title, content: "", boardType: 1, datetime: kst(days, hh, mm), image: null,
  like_num: 0, price: 0, state: true, userID: 2, address: null, tags: "",
}));

const styleBoards = [
  [1, "옐로 체크 셔츠로 완성한 캐주얼 데일리룩", 0, 11, 30],
  [2, "간절기 브라운 재킷 레이어드", 1, 17, 10],
  [3, "주말 성수동 데님 스타일링", 2, 13, 40],
  [4, "톤온톤으로 입어 본 출근 코디", 3, 9, 20],
  [5, "스니커즈 중심의 편안한 캠퍼스룩", 4, 15, 55],
  [6, "빈티지 셔츠와 와이드 팬츠 조합", 5, 18, 25],
  [7, "버건디 코트 하나로 끝낸 가을 코디", 6, 10, 10],
].map(([boardID, title, days, hh, mm]) => ({
  boardID, title, content: "", boardType: 2, datetime: kst(days, hh, mm), image: `/media/uploads/style-${boardID}.jpg`,
  like_num: 40 - boardID * 3, price: 0, state: true, userID: 1, address: null, tags: "",
}));

const styleDetail = {
  ...styleBoards[0],
  content:
    "연한 옐로 체크 셔츠를 루즈하게 걸치고 그레이 슬리브리스와 워싱 데님을 매치했어요. 소매는 한 번 걷어서 가볍게 연출했습니다.",
  image: "/media/uploads/ootd-plaid.jpg",
  like_num: 48,
  tags: "체크셔츠,데님,캐주얼,가을코디",
};

const marketBoards = [
  [21, "아우터 3벌 일괄 정리 (레더·니트·데님)", 89000, true, 0, 10, 0],
  [22, "COS 울 블렌드 가디건 크림", 68000, true, 1, 20, 30],
  [23, "뉴발란스 530 실버 245", 74000, true, 1, 12, 15],
  [24, "빈티지 레더 숄더백 브라운", 49000, false, 2, 16, 40],
  [25, "와이드 데님 팬츠 28 (연청)", 32000, true, 3, 13, 5],
  [26, "오버핏 스웨트셔츠 그레이 L", 42000, false, 4, 9, 50],
].map(([boardID, title, price, state, days, hh, mm]) => ({
  boardID, title, content: "", boardType: 3, datetime: kst(days, hh, mm), image: null,
  like_num: 0, price, state, userID: 3, address: null, tags: "",
}));

const marketDetail = {
  ...marketBoards[0],
  content:
    "옷장 정리하면서 아우터 세 벌을 한 번에 내놓아요. 레더 재킷 M, 아이보리 니트 카디건 FREE, 데님 재킷 M 모두 두세 번 착용했고 오염 없습니다. 직거래 우선이에요.",
  image: "/media/uploads/market-outer.jpg",
  address: "서울 마포구 연남동 경의선숲길 입구",
};

const comments = {
  1: ["체크 셔츠 색감이 너무 예뻐요! 어디 제품인지 궁금해요", "데님이랑 조합 최고네요 👍"],
  21: ["레더 재킷 실측 길이 알 수 있을까요?"],
};

const ranks = [
  { boardID: 2, usr_name: "민서의 옷장" },
  { boardID: 3, usr_name: "온더무드" },
  { boardID: 7, usr_name: "윤슬" },
  { boardID: 5, usr_name: "소프트데이" },
];

const received = [
  { id: 11, sendID: 4, receiveID: 1, send_name: "윤슬", message: "체크 셔츠 너무 예뻐요! 어디 제품이에요?" },
  { id: 14, sendID: 5, receiveID: 1, send_name: "소프트데이", message: "아우터 일괄 구매 가능할까요?" },
  { id: 17, sendID: 3, receiveID: 1, send_name: "온더무드", message: "토요일 3시 연남동에서 괜찮으세요?" },
];

const SENT_BEFORE = [
  { id: 15, sendID: 1, receiveID: 5, message: "네, 아직 판매 중이에요. 토요일 오후 괜찮아요!" },
  { id: 18, sendID: 1, receiveID: 3, message: "좋아요! 토요일 3시에 경의선숲길 입구에서 봬요 :)" },
];
let sent = [...SENT_BEFORE];
// Words the macOS spellchecker knows, so no red squiggle shows while typing.
const REPLY = "구매 링크 보내드릴게요!";

const searchHistory = ["체크 셔츠", "트렌치코트", "와이드 데님", "니트 조끼", "가디건"].map((query, index) => ({
  id: 40 - index,
  query,
  user: 1,
}));
const suggestions = {
  suggest_results1: "옐로 체크 셔츠",
  suggest_results2: "체크 셔츠 코디",
  suggest_results3: "오버핏 셔츠",
  suggest_results4: "셔츠 레이어드",
  suggest_results5: "체크 패턴",
};
const popular = {
  popular_results1: "트렌치코트",
  popular_results2: "가디건",
  popular_results3: "가을 코디",
  popular_results4: "레더 재킷",
  popular_results5: "니트",
};

const WEATHER = {
  coord: { lon: 126.9236, lat: 37.5563 },
  weather: [{ id: 801, main: "Clouds", description: "구름 조금", icon: "02d" }],
  base: "stations",
  main: { temp: 17.6, feels_like: 16.9, temp_min: 16.2, temp_max: 18.7, pressure: 1021, humidity: 52 },
  visibility: 10000,
  wind: { speed: 2.6, deg: 290 },
  clouds: { all: 20 },
  name: "Seoul",
  cod: 200,
};

/* ---------------------------------------------------------------- */
/* Request handling                                                  */
/* ---------------------------------------------------------------- */

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
};

function json(route, data, status = 200) {
  return route.fulfill({ status, contentType: "application/json", headers: CORS, body: JSON.stringify(data) });
}

function file(route, name) {
  const type = name.endsWith(".png") ? "image/png" : "image/jpeg";
  return route.fulfill({ status: 200, contentType: type, headers: CORS, body: media(name) });
}

const MEDIA = {
  "/media/uploads/ootd-plaid.jpg": "ootd-plaid.jpg",
  "/media/uploads/market-outer.jpg": "market-outer.jpg",
  "/media/uploads/before.jpg": "palette-before.jpg",
  "/media/uploads/mid_result.png": "palette-middle.png",
  "/media/uploads/result.png": "palette-result.png",
  "/media/profile/minseo.jpg": "avatar.jpg",
};

function backend(route, url, unmatched, overrides) {
  const request = route.request();
  const method = request.method();
  if (method === "OPTIONS") return route.fulfill({ status: 204, headers: CORS, body: "" });
  const path = url.pathname;
  const key = `${method} ${path}`;

  for (const [pattern, reply] of Object.entries(overrides ?? {})) {
    const [m, rest] = pattern.split(" ");
    if (m === method && new RegExp(`^${rest}$`).test(path)) return reply(route, url, request);
  }

  if (MEDIA[path]) return file(route, MEDIA[path]);
  const rankPhoto = path.match(/^\/media\/uploads\/rank-(\d)\.jpg$/);
  if (rankPhoto) return file(route, `rank-${rankPhoto[1]}.jpg`);

  if (key === "GET /userinfo/") return json(route, ME);
  if (key === "GET /user_image/") return json(route, { profile_image_url: `${API}/media/profile/minseo.jpg` });
  const rank = path.match(/^\/board\/stylerank\/([1-4])\/$/);
  if (method === "GET" && rank) {
    const n = Number(rank[1]);
    return json(route, { image: `/media/uploads/rank-${n}.jpg`, ...ranks[n - 1] });
  }
  if (key === "GET /boardType/1/") return json(route, communityBoards);
  if (key === "GET /boardType/2/") return json(route, styleBoards);
  if (key === "GET /boardType/3/") return json(route, marketBoards);
  const comment = path.match(/^\/board\/(\d+)\/comment\/$/);
  if (method === "GET" && comment) {
    const id = Number(comment[1]);
    return json(route, (comments[id] ?? []).map((text, index) => ({
      id: id * 10 + index, comment: text, datetime: kst(0, 12 + index), boardID: id, userID: 2 + index,
    })));
  }
  const board = path.match(/^\/board\/(\d+)\/$/);
  if (method === "GET" && board) {
    const id = Number(board[1]);
    if (id === marketDetail.boardID) return json(route, marketDetail);
    if (id === styleDetail.boardID) return json(route, styleDetail);
    const any = [...styleBoards, ...marketBoards, ...communityBoards].find((b) => b.boardID === id);
    return json(route, { ...(any ?? styleDetail), image: "/media/uploads/ootd-plaid.jpg", tags: any?.tags || "데일리룩" });
  }
  const like = path.match(/^\/board\/(\d+)\/like\/$/);
  if (method === "POST" && like) return json(route, { boardID: Number(like[1]), userID: 1 });
  if (key === "GET /search/") return json(route, []);
  if (key === "GET /search/history/") return json(route, searchHistory);
  if (key === "GET /search/suggestions/") return json(route, suggestions);
  if (key === "GET /search/popular/") return json(route, popular);
  if (key === "GET /message_box/1/") return json(route, sent);
  if (key === "GET /message_box/2/") return json(route, received);
  if (key === "POST /chat/") {
    const body = request.postDataJSON?.() ?? {};
    sent = [...sent, { id: 21, sendID: 1, receiveID: 4, message: body.message ?? "" }];
    return route.fulfill({ status: 200, headers: CORS, body: "" });
  }
  if (key === "GET /palcreate/") {
    return json(route, {
      id: 9,
      before_image: "/media/uploads/before.jpg",
      middle_image: "/media/uploads/mid_result.png",
      result_image: "/media/uploads/result.png",
    });
  }
  if (key === "POST /palcreate/") return route.fulfill({ status: 200, headers: CORS, body: "" });

  unmatched.add(`${key}${url.search}`);
  return json(route, {});
}

async function handle(route, unmatched, overrides) {
  const url = new URL(route.request().url());

  // Hard-coded links to the dev server: answer them from the build instead.
  if (url.host === "localhost:3000" || url.host === "127.0.0.1:3000") {
    const response = await route.fetch({ url: `${APP_URL}${url.pathname}${url.search}` });
    return route.fulfill({ response });
  }
  if (url.host === "127.0.0.1:8000" || url.host === "localhost:8000") {
    return backend(route, url, unmatched, overrides);
  }
  if (url.hostname === "api.openweathermap.org") return json(route, WEATHER);
  if (url.hostname === "cdn-icons-png.flaticon.com") {
    const icon = Object.entries(ICONS).find(([id]) => url.pathname.includes(`/${id}.`));
    if (icon) return route.fulfill({ status: 200, contentType: "image/svg+xml", body: icon[1] });
  }
  if (url.origin === new URL(APP_URL).origin || url.protocol === "data:" || url.protocol === "blob:") {
    return route.continue();
  }
  unmatched.add(`external ${url.host}${url.pathname}`);
  return route.fulfill({ status: 404, body: "" });
}

/* ---------------------------------------------------------------- */
/* Clips                                                             */
/* ---------------------------------------------------------------- */

/**
 * The team built MOFY on Korean Windows, where Chrome's default font for Korean
 * is a gothic (sans) face. macOS Chrome falls back to a serif Myungjo face for
 * the many elements without a font-family, so set the browser's default fonts
 * (a browser preference, not the app's CSS) to the system Korean sans.
 */
async function koreanDefaultFonts(page) {
  const cdp = await page.context().newCDPSession(page);
  const sans = { standard: "Apple SD Gothic Neo", sansSerif: "Apple SD Gothic Neo", fixed: "Apple SD Gothic Neo" };
  await cdp.send("Page.setFontFamilies", {
    fontFamilies: sans,
    forScripts: [{ script: "Hang", fontFamilies: sans }],
  });
}

async function open(page, path) {
  await koreanDefaultFonts(page);
  await page.goto(`${APP_URL}${path}`, { waitUntil: "networkidle" });
}

/**
 * Board titles are split into one <span> per character and the row handler reads
 * event.target.id, so a click has to land on the title cell itself: just past
 * the end of the text, as a user clicking the row would.
 */
async function clickRow(page, h, id, steps = 20) {
  const cell = page.locator(`[id="${id}"]`);
  const box = await cell.boundingBox();
  const right = await cell.evaluate((el) =>
    Math.max(...[...el.querySelectorAll("span")].map((span) => span.getBoundingClientRect().right)),
  );
  await page.mouse.move(right + 22, box.y + box.height / 2, { steps });
  await page.waitForTimeout(220);
  await page.mouse.down();
  await page.waitForTimeout(90);
  await page.mouse.up();
}

/** Moves the cursor onto part of an element (fx = 0..1 across it) so its label stays readable. */
async function hoverPart(page, locator, fx, steps) {
  const box = await locator.boundingBox();
  await page.mouse.move(box.x + box.width * fx, box.y + box.height / 2, { steps });
}

async function settle(page, ms = 600) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((resolve) => img.addEventListener("load", resolve, { once: true })),
      ),
    );
  });
  await page.waitForTimeout(ms);
}

/**
 * The boards and the palette page use a fixed 1200px wrapper with a 100px margin,
 * which cuts off the date column at 1280px. Those clips use 1440×900 (same 16:10
 * shape, so the output is still 1600×1000).
 */
const WIDE = { width: 1440, height: 900 };

const scenario = {
  viewport: { width: 1280, height: 800 },
  scale: 2,
  outWidth: 1600,
  appUrl: APP_URL,
  contextOptions: {
    colorScheme: "light",
    geolocation: { latitude: 37.5563, longitude: 126.9236 },
    permissions: ["geolocation"],
  },
  start: prepareMedia,
  stop: () => mediaDir && rmSync(mediaDir, { recursive: true, force: true }),
  handle,
  async setup(context, { clip, unmatched }) {
    sent = [...SENT_BEFORE];
    await context.addCookies([
      { name: "access_token", value: "demo-access-token", domain: "localhost", path: "/" },
      { name: "refresh_token", value: "demo-refresh-token", domain: "localhost", path: "/" },
    ]);
    await context.route("**/*", (route) => handle(route, unmatched, clip.api));
  },
  clips: [
    {
      id: "mofy-message",
      title: "메시지 보내기",
      caption: "받는 사람 아이디와 내용을 적어 보내면 보낸 메세지함에 바로 쌓임",
      async prepare(page) {
        await open(page, "/mks/writeMessage");
        await settle(page);
        await page.mouse.move(860, 520);
      },
      async run(page, h) {
        await h.clickOn(page, page.getByPlaceholder("받는사람(아이디를 입력해주세요)"), 10);
        await page.keyboard.type("yoonseul", { delay: 22 });
        await h.clickOn(page, page.getByPlaceholder("내용을 입력하세요."), 6);
        await page.keyboard.type(REPLY, { delay: 30 });
        await page.waitForTimeout(150);
        await h.clickOn(page, page.getByRole("button", { name: "전송" }), 8);
        await page.waitForTimeout(300);
        await h.clickOn(page, page.getByRole("button", { name: "보낸 메세지" }), 10);
        await page.waitForURL("**/mks/mySendMessage");
        await page.getByText(REPLY).waitFor();
        await page.waitForTimeout(550);
      },
      hold: 500,
    },
    {
      id: "mofy-inbox",
      title: "받은 메시지함",
      caption: "메시지 메뉴에서 받은 메세지함을 열어 보낸 사람과 내용을 확인",
      async prepare(page) {
        await open(page, "/mks/welcomeMessage");
        await settle(page);
        await page.mouse.move(640, 600);
      },
      async run(page, h) {
        await page.waitForTimeout(150);
        await h.clickOn(page, page.getByRole("button", { name: "내가 받은 메세지" }), 12);
        await page.waitForURL("**/mks/myGetMessage");
        await page.getByText(received.at(-1).message, { exact: false }).waitFor();
        await page.waitForTimeout(250);
        await page.mouse.move(640, 470, { steps: 8 });
        await page.waitForTimeout(700);
      },
      hold: 1300,
    },
    {
      id: "mofy-style",
      viewport: WIDE,
      title: "스타일보드 · 게시물 상세",
      caption: "OOTD 게시물을 열어 태그·본문·착용 사진을 보고 좋아요",
      async prepare(page) {
        await open(page, "/styleBoard");
        await settle(page);
        await page.mouse.move(760, 880);
      },
      async run(page, h) {
        await clickRow(page, h, 1, 14);
        await page.waitForURL("**/styleBoard/1");
        await page.locator('img[alt="Fetched"]').waitFor();
        await settle(page, 250);
        await h.smoothScroll(page, 480, 550);
        await page.waitForTimeout(150);
        await hoverPart(page, page.getByRole("button", { name: "스타일 좋아요!" }), 0.85, 10);
        await page.waitForTimeout(120);
        await page.mouse.down();
        await page.waitForTimeout(90);
        await page.mouse.up();
        await page.waitForTimeout(700);
      },
      hold: 500,
    },
    {
      id: "mofy-palette",
      viewport: WIDE,
      title: "컬러 팔레트",
      caption: "사진을 올리면 배경을 지운 뒤 의상의 주요 색상을 팔레트로 보여 줌",
      async prepare(page) {
        await open(page, "/colorPalette/new");
        await settle(page);
        await page.mouse.move(700, 560);
      },
      async run(page, h) {
        const input = page.locator('input[type="file"]');
        const box = await input.boundingBox();
        const chooser = page.waitForEvent("filechooser");
        await page.mouse.move(box.x + 32, box.y + box.height / 2, { steps: 10 });
        await page.waitForTimeout(120);
        await page.mouse.down();
        await page.waitForTimeout(90);
        await page.mouse.up();
        await (await chooser).setFiles({ name: "ootd_체크셔츠.jpg", mimeType: "image/jpeg", buffer: media("ootd-plaid.jpg") });
        await page.waitForTimeout(250);
        await h.clickOn(page, page.getByRole("button", { name: "팔레트" }), 10);
        await page.waitForURL("**/colorPalette/detail**");
        await page.waitForFunction(() => document.querySelectorAll('img[alt="Fetched"]').length === 3);
        await settle(page, 150);
        await page.mouse.move(1370, 470, { steps: 8 });
        await page.waitForTimeout(150);
        await h.smoothScroll(page, 840, 750);
        await page.waitForTimeout(700);
      },
      hold: 500,
    },
    {
      id: "mofy-market",
      viewport: WIDE,
      title: "중고마켓 · 판매글 상세",
      caption: "가격·판매 상태가 보이는 거래글을 열고 만날 장소를 확인",
      async prepare(page) {
        await open(page, "/marketBoard");
        await settle(page);
        await page.mouse.move(760, 880);
      },
      async run(page, h) {
        await clickRow(page, h, 21, 14);
        await page.waitForURL("**/marketBoard/21");
        await page.getByText(marketDetail.title).last().waitFor();
        await settle(page, 300);
        await hoverPart(page, page.getByRole("button", { name: "여기서 만나요!" }), 0.9, 12);
        await page.waitForTimeout(1100);
      },
      hold: 1200,
    },
    {
      id: "mofy-home",
      title: "홈 · 추천 검색어와 날씨",
      caption: "검색창을 누르면 최근·추천·인기 검색어가 뜨고, 옆에는 현재 위치의 날씨",
      async prepare(page) {
        await open(page, "/mainPage");
        await page.getByText("구름 조금").waitFor();
        await settle(page, 900);
        await page.mouse.move(640, 600);
      },
      async run(page, h) {
        await page.waitForTimeout(300);
        await h.clickOn(page, page.getByPlaceholder("검색어를 입력하세요."), 12);
        await page.waitForTimeout(450);
        await hoverPart(page, page.getByText(suggestions.suggest_results2, { exact: true }), 0.88, 10);
        await page.waitForTimeout(1000);
      },
      hold: 500,
    },
  ],
};

export default scenario;
