/**
 * BlueMemories demo clips: the original React frontend (Create React App,
 * frontend/ of the BlueMemories repo) built with `react-scripts build` and served
 * with SPA fallback, driven with demo fixtures. The Spring backend, the emotion
 * analysis (OpenAI / Ollama / Naver Clova) and the YouTube Data API are not
 * running, so every `/api` call is answered with the demo data below, and the
 * embedded YouTube player is replaced by a local stand-in that shows a
 * thumbnail-like placeholder per recommended video. No request leaves the machine.
 *
 * The app renders a bare "Loading..." page (or an empty list) until each request
 * resolves, and a context.route round trip always lands after the first paint, so
 * every page change flashed for one frame. The `/api` fixtures are therefore
 * answered in the page (an XMLHttpRequest shim fed with the same fixture data);
 * context.route still blocks external hosts, serves the demo images and records
 * any `/api` call the shim did not answer as unmatched.
 *
 * Build and serve the frontend first (outside this repo):
 *   CI=false GENERATE_SOURCEMAP=false npm run build
 *   node ../../bluememories-serve.mjs 4324      # SPA fallback server
 * BLUEMEMORIES_URL overrides the served address.
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP_URL = process.env.BLUEMEMORIES_URL ?? "http://127.0.0.1:4324";
const APP_ORIGIN = new URL(APP_URL).origin;
const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR =
  process.env.BLUEMEMORIES_FRONTEND_DIR ??
  join(HERE, "../../../.capture/bluememories-frontend/frontend");

/* ---------------------------------------------------------------- */
/* Dates (KST, relative to the recording day)                        */
/* ---------------------------------------------------------------- */

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;
/** KST calendar date n days before the recording, as YYYY-MM-DD. */
const kst = (daysAgo) => new Date(NOW - daysAgo * DAY + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
const TODAY_DAY = String(Number(kst(0).slice(8)));

/* ---------------------------------------------------------------- */
/* Media: crops of the frontend's own image assets                   */
/* ---------------------------------------------------------------- */

const SRC = (path) => join(FRONTEND_DIR, "src/pages", path);
const MEDIA = {
  // diary photos
  lake: [SRC("main/image/mainBackground.png"), "scale=1200:-2"],
  hills: [SRC("main/image/mainBackground.png"), "crop=820:600:0:172,scale=900:-2"],
  sky: [SRC("main/image/mainBackground.png"), "crop=900:600:540:0,scale=900:-2"],
  shore: [SRC("main/image/mainBackground.png"), "crop=960:640:480:132,scale=900:-2"],
  magnolia: [SRC("sharedDiary/image/coverImage3.png"), "crop=738:738:422:566,scale=720:-2"],
  cat: [SRC("sharedDiary/image/coverImage4.png"), "crop=1180:1180:202:240,scale=800:-2"],
  heart: [SRC("sharedDiary/image/coverImage5.png"), "crop=1100:1100:242:242,scale=800:-2"],
  noodles: [SRC("main/image/community.png"), "crop=264:236:0:54,scale=528:-2:flags=lanczos"],
  crosswalk: [SRC("main/image/community.png"), "crop=262:350:632:52,scale=524:-2:flags=lanczos"],
  doodle: [SRC("images/loading2.png"), "scale=450:-2:flags=lanczos"],
  // recommended video placeholders (16:9)
  "v-lake": [SRC("main/image/mainBackground.png"), "crop=1372:772:34:0,scale=1280:720"],
  "v-magnolia": [SRC("sharedDiary/image/coverImage3.png"), "crop=738:415:422:700,scale=1280:720"],
  "v-sky": [SRC("main/image/mainBackground.png"), "crop=1060:596:380:0,scale=1280:720"],
  "v-cat": [SRC("sharedDiary/image/coverImage4.png"), "crop=1584:891:0:420,scale=1280:720"],
};
let mediaDir;
function prepareMedia() {
  mediaDir = mkdtempSync(join(tmpdir(), "bluememories-media-"));
  for (const [name, [source, filter]] of Object.entries(MEDIA)) {
    const result = spawnSync(process.env.FFMPEG_PATH ?? "ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", source,
      "-vf", filter, "-q:v", "2", join(mediaDir, `${name}.jpg`),
    ]);
    if (result.status !== 0) throw new Error(`media ${name}: ${result.stderr}`);
  }
}
const img = (name) => `/demo-media/${name}.jpg`;

/* ---------------------------------------------------------------- */
/* Demo data                                                         */
/* ---------------------------------------------------------------- */

const ME = { id: 1, userId: "greenstar", nickname: "초록별" };

/** The diary written on camera in the first clip. */
const NEW_DIARY = {
  id: 116,
  daysAgo: 0,
  title: "은행잎 물든 점심 산책",
  weather: "맑음",
  firstLine: "점심을 먹고 동료와 호수공원을 한 바퀴 걸었다.",
  typed: "노랗게 물든 은행잎을 보니 기분이 한결 가벼워졌다.",
  scores: [81, 15, 4],
  image: "lake",
};
NEW_DIARY.content = `${NEW_DIARY.firstLine}\n${NEW_DIARY.typed}`;

const MY_DIARIES = [
  { id: 110, daysAgo: 1, title: "도서관에서 보낸 오후", weather: "선선함", scores: [35, 52, 13], image: "sky",
    content: "도서관 창가 자리에서 읽다 만 소설을 끝까지 읽었다.\n창밖 구름이 천천히 흘러가는 걸 보며 조용한 오후를 보냈다." },
  { id: 109, daysAgo: 2, title: "비 오는 날 고양이 그림", weather: "비", scores: [72, 23, 5], image: "cat",
    content: "비가 와서 집에 머물며 고양이 그림을 그렸다.\n서툴지만 끝까지 완성하고 나니 뿌듯했다." },
  { id: 108, daysAgo: 3, title: "늦잠 자서 허둥지둥", weather: "흐림", scores: [17, 35, 48], image: "doodle",
    content: "알람을 못 듣고 늦잠을 잤다. 아침도 거르고 뛰어나가서 하루 종일 정신이 없었다.\n오늘은 휴대폰을 내려놓고 일찍 자야지." },
  { id: 107, daysAgo: 5, title: "발표를 무사히 마쳤다", weather: "맑음", scores: [76, 19, 5], image: "magnolia",
    content: "며칠 동안 준비한 발표를 무사히 끝냈다.\n팀장님이 정리가 깔끔했다고 해 주셔서 그동안의 긴장이 한 번에 풀렸다." },
  { id: 106, daysAgo: 6, title: "발표 준비로 바빴던 하루", weather: "구름 조금", scores: [30, 49, 21], image: "heart",
    content: "내일 발표 자료를 마지막까지 다듬었다.\n친구가 보내 준 응원 메시지 덕분에 끝까지 힘을 낼 수 있었다." },
  { id: 105, daysAgo: 8, title: "친구와 먹은 국수 한 그릇", weather: "구름 조금", scores: [79, 17, 4], image: "noodles",
    content: "대학 친구를 오랜만에 만나 국숫집에 갔다.\n수다를 떨다 보니 세 시간이 금방 지나갔다. 다음엔 내가 맛집을 찾아 두기로 했다." },
  { id: 104, daysAgo: 10, title: "평범하게 흘러간 하루", weather: "흐림", scores: [24, 61, 15], image: "shore",
    content: "특별한 일 없이 일하고, 밥 먹고, 방을 정리한 하루였다.\n그래도 미뤄 둔 메일 답장을 다 보내서 홀가분하다." },
  { id: 103, daysAgo: 12, title: "호숫가 자전거 산책", weather: "맑음", scores: [84, 13, 3], image: "hills",
    content: "오랜만에 자전거를 빌려 호숫가를 한 바퀴 돌았다.\n바람이 선선해서 땀도 금방 식었다. 다음 주에도 꼭 다시 오고 싶다." },
  { id: 102, daysAgo: 13, title: "비 오는 날의 퇴근길", weather: "비", scores: [12, 33, 55], image: "crosswalk",
    content: "우산을 두고 나와서 퇴근길에 흠뻑 젖었다. 버스도 한참 늦게 와서 괜히 서운한 하루.\n집에 와서 따뜻한 차를 마시니 조금 나아졌다." },
  { id: 101, daysAgo: 15, title: "이번 달 목표 세우기", weather: "맑음", scores: [68, 27, 5], image: "magnolia",
    content: "다이어리 첫 장에 이번 달 목표를 적었다. 하루 30분 걷기, 책 한 권 읽기, 열두 시 전에 자기.\n거창하지 않아도 하나씩 지켜 보고 싶다." },
];

const sentimentOf = ([positive, neutral, negative]) =>
  positive >= neutral && positive >= negative ? "positive" : neutral >= negative ? "neutral" : "negative";

/**
 * Recommended videos. The backend asks the LLM for songs[] / searchKeywords[]
 * (JSON contract), searches YouTube with them and stores four video ids as
 * keyword1..4; these ids only exist for the stand-in player below.
 */
const VIDEOS = {
  "demo-piano": { title: "햇살 좋은 오후의 잔잔한 피아노", keyword: "기분 좋은 오후 피아노", duration: "41:08", image: "v-magnolia" },
  "demo-cat": { title: "고양이와 함께하는 느긋한 오후 브이로그", keyword: "힐링 브이로그", duration: "12:47", image: "v-cat" },
  "demo-lofi": { title: "구름 보며 듣는 편안한 로파이", keyword: "마음이 편해지는 음악", duration: "1:02:40", image: "v-sky" },
  "demo-walk": { title: "산책길에 듣기 좋은 어쿠스틱 플레이리스트", keyword: "가을 산책 플레이리스트", duration: "32:15", image: "v-lake" },
};
const KEYWORDS = { keyword1: "demo-piano", keyword2: "demo-cat", keyword3: "demo-lofi", keyword4: "demo-walk" };

/** GET /api/get-diary/{id} */
function diaryDetail(entry) {
  const [positive, neutral, negative] = entry.scores;
  return {
    id: entry.id,
    nickname: entry.nickname ?? ME.nickname,
    title: entry.title,
    content: entry.content,
    weather: entry.weather,
    date: kst(entry.daysAgo),
    positive,
    neutral,
    negative,
    confidence: sentimentOf(entry.scores),
    likeNum: entry.likeNum ?? 0,
    imageUrl: img(entry.image),
    ...KEYWORDS,
  };
}

/** GET /api/diaries/{year}/{month}, search results and shared-diary rows */
function listRow(entry) {
  const [positive, neutral, negative] = entry.scores;
  return {
    id: entry.id,
    date: kst(entry.daysAgo),
    title: entry.title,
    content: entry.content,
    sentiment: sentimentOf(entry.scores),
    confidencePositive: positive,
    confidenceNeutral: neutral,
    confidenceNegative: negative,
    imageUrl: img(entry.image),
  };
}

/* Community: other members' public diaries */
const POST = {
  id: 201, nickname: "느린구름", title: "호수 따라 걷는 저녁", image: "lake", weather: "선선함",
  scores: [88, 9, 3], daysAgo: 0, likeNum: 24,
  content: "퇴근하고 호수 둘레길을 천천히 걸었다.\n물 위로 노을이 번지는 걸 보고 있으니 하루의 피곤이 스르르 풀렸다.\n내일도 이 시간에 나와야겠다.",
};
const COMMUNITY = [
  POST,
  { id: 202, nickname: "마음산책", title: "우리 집 고양이 초상화", image: "cat" },
  { id: 203, nickname: "새벽편지", title: "비 오는 횡단보도", image: "crosswalk" },
  { id: 204, nickname: "푸른하루", title: "할머니 댁에서 먹은 국수", image: "noodles" },
  { id: 205, nickname: "달빛기록", title: "목련 사진을 꺼내 보며", image: "magnolia" },
  { id: 206, nickname: "별빛산책", title: "작은 용기를 낸 하루", image: "heart" },
  { id: 207, nickname: "느린구름", title: "구름 구경하는 점심시간", image: "sky" },
  { id: 208, nickname: "새벽편지", title: "춤추고 싶은 기분", image: "doodle" },
  { id: 209, nickname: "마음산책", title: "언덕 위 작은 피크닉", image: "hills" },
];
const COMMENTS = [
  { nickname: "마음산책", content: "글만 읽어도 노을이 그려져요. 오늘 하루도 고생 많으셨어요!" },
  { nickname: "달빛기록", content: "저도 호수 산책 정말 좋아해요. 다음에 같이 걸어요." },
  { nickname: "푸른하루", content: "이런 저녁이 하루하루 쌓이면 좋겠어요. 내일 기록도 기다릴게요." },
];

/* Shared (group) diaries: the 1:1 exchange diary extended to N members */
const SHARED = [
  { id: 31, title: "우리 넷의 교환일기", coverImageUrl: "coverImage3", createdAt: kst(40) },
  { id: 32, title: "100일 감사 챌린지", coverImageUrl: "coverImage5", createdAt: kst(75) },
  { id: 33, title: "고양이 집사 모임", coverImageUrl: "coverImage4", createdAt: kst(110) },
  { id: 34, title: "동네 산책 메이트", coverImageUrl: "coverImage2", createdAt: kst(150) },
];
const SHARED_MEMBERS = ["초록별", "달빛기록", "느린구름", "마음산책"];
const SHARED_CONTENTS = [
  { id: 3104, nickname: "마음산책", title: "요즘 자꾸 듣는 노래", daysAgo: 1, scores: [76, 19, 5], image: "doodle",
    content: "이번 주는 내 차례! 요즘 출근길마다 같은 노래를 반복해서 듣고 있어. 가사가 꼭 우리 이야기 같아서 들을 때마다 웃게 돼. 다음 사람도 요즘 듣는 노래를 하나씩 적어 주기!" },
  { id: 3103, nickname: "느린구름", title: "호숫가 피크닉 후기", daysAgo: 3, scores: [83, 14, 3], image: "hills",
    content: "지난 주말에 다녀온 피크닉 사진 올려! 돗자리 펴자마자 바람이 불어서 다 같이 웃었던 게 아직도 생각나. 다음엔 도시락 메뉴를 하나씩 정해서 가자." },
  { id: 3102, nickname: "달빛기록", title: "조금 지쳤던 한 주", daysAgo: 5, scores: [26, 52, 22], image: "heart",
    content: "할 일이 한꺼번에 몰려서 정신없는 한 주였어. 그래도 여기 적힌 너희 글을 읽으면서 힘을 많이 얻었어. 늘 고마워!" },
  { id: 3101, nickname: "초록별", title: "첫 페이지를 열며", daysAgo: 8, scores: [71, 24, 5], image: "magnolia",
    content: "우리 넷이 함께 쓰는 첫 교환일기! 매주 돌아가면서 한 편씩 써 보자. 서로의 하루를 천천히 읽어 주는 공간이 되었으면 좋겠어." },
];

/** Everything the `/api` shim answers with, as plain JSON. */
function fixtures(clip) {
  return {
    saved: clip.id !== "bluememories-write",
    saveDelay: 1150,
    me: ME,
    newDiary: { row: listRow(NEW_DIARY), detail: diaryDetail(NEW_DIARY) },
    diaries: MY_DIARIES.map((entry) => ({ row: listRow(entry), detail: diaryDetail(entry) })),
    community: {
      page: {
        content: COMMUNITY.map(({ id, title, nickname, image }) => ({ id, title, nickname, thumbnailUrl: img(image) })),
        page: { size: 30, number: 0, totalElements: COMMUNITY.length, totalPages: 1 },
      },
      details: Object.fromEntries(
        COMMUNITY.map((entry) => [entry.id, diaryDetail({ ...POST, likeNum: 12, ...entry })]),
      ),
      postId: POST.id,
      comments: COMMENTS,
    },
    shared: {
      list: SHARED,
      members: SHARED_MEMBERS,
      rows: SHARED_CONTENTS.map((entry) => ({ ...listRow(entry), nickname: entry.nickname })),
      details: Object.fromEntries(
        SHARED_CONTENTS.map((entry) => [entry.id, { ...listRow(entry), nickname: entry.nickname, weather: "맑음", ...KEYWORDS }]),
      ),
    },
  };
}

/* ---------------------------------------------------------------- */
/* In-page `/api` answers (runs in the browser, see the header)      */
/* ---------------------------------------------------------------- */

function apiShim(fx) {
  const state = { saved: fx.saved, liked: false, comments: fx.community.comments };
  const myDiaries = () => (state.saved ? [fx.newDiary, ...fx.diaries] : fx.diaries);

  /** Returns { data, delay? } or null (→ goes to the network and is logged as unmatched). */
  function answer(method, path, query, body) {
    const key = `${method} ${path}`;
    let match;
    if (key === "GET /user-info") return { data: fx.me };

    if (method === "GET" && (match = path.match(/^\/diaries\/(\d{4})\/(\d{1,2})$/))) {
      const prefix = `${match[1]}-${match[2].padStart(2, "0")}`;
      return { data: myDiaries().map((d) => d.row).filter((row) => row.date.startsWith(prefix)) };
    }
    if (key === "POST /diaries") {
      // The backend runs the emotion analysis and the recommendation before answering.
      state.saved = true;
      return { data: { id: fx.newDiary.detail.id }, delay: fx.saveDelay };
    }
    if (method === "GET" && (match = path.match(/^\/get-diary\/(\d+)$/))) {
      const mine = myDiaries().find((d) => d.detail.id === Number(match[1]));
      if (mine) return { data: mine.detail };
      const post = fx.community.details[match[1]];
      if (post) return { data: { ...post, likeNum: post.likeNum + (state.liked ? 1 : 0) } };
      return null;
    }
    if (method === "GET" && /^\/get-like\/\d+$/.test(path)) return { data: state.liked };
    if (method === "GET" && (match = path.match(/^\/get-comments\/(\d+)$/))) {
      return { data: Number(match[1]) === fx.community.postId ? state.comments : [] };
    }
    if (key === "POST /push-like") {
      state.liked = !state.liked;
      return { data: state.liked };
    }
    if (key === "POST /create-comment") {
      const comment = { nickname: fx.me.nickname, content: (body && JSON.parse(body).content) || "" };
      state.comments = [...state.comments, comment];
      return { data: comment };
    }
    if (method === "GET" && (path === "/search/title" || path === "/search/content")) {
      const field = path.endsWith("title") ? "title" : "content";
      const keyword = query.get("keyword") || "";
      return { data: myDiaries().map((d) => d.row).filter((row) => row[field].includes(keyword)) };
    }

    if (key === "GET /diaries/users") return { data: fx.community.page };

    if (key === "GET /list-shared-diary") return { data: fx.shared.list };
    if (method === "GET" && /^\/shared-diary-members\/\d+$/.test(path)) return { data: fx.shared.members };
    if (method === "GET" && (match = path.match(/^\/shared-diary-content\/\d+\/(asc|desc)$/))) {
      return { data: match[1] === "asc" ? [...fx.shared.rows].reverse() : fx.shared.rows };
    }
    if (method === "GET" && (match = path.match(/^\/shared-diary-content\/get-content\/(\d+)$/))) {
      return { data: fx.shared.details[match[1]] || null };
    }
    return null;
  }

  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__demoRequest = { method: String(method).toUpperCase(), url: String(url) };
    return open.call(this, method, url, ...rest);
  };
  XMLHttpRequest.prototype.send = function (body) {
    const request = this.__demoRequest;
    const url = request && new URL(request.url, location.href);
    const reply =
      url && url.origin === location.origin && url.pathname.startsWith("/api/")
        ? answer(request.method, url.pathname.slice(4), url.searchParams, typeof body === "string" ? body : null)
        : null;
    if (!reply) return send.call(this, body);

    const text = JSON.stringify(reply.data);
    const finish = () => {
      for (const [name, value] of Object.entries({
        readyState: 4, status: 200, statusText: "OK", responseText: text, response: text, responseURL: url.href,
      })) {
        Object.defineProperty(this, name, { configurable: true, value });
      }
      this.getAllResponseHeaders = () => "content-type: application/json\r\n";
      for (const type of ["readystatechange", "load", "loadend"]) this.dispatchEvent(new ProgressEvent(type));
    };
    // Resolve in a microtask so a click's navigation renders with its data in the same frame.
    if (reply.delay) setTimeout(finish, reply.delay);
    else queueMicrotask(finish);
  };
}

/* ---------------------------------------------------------------- */
/* YouTube stand-in                                                  */
/* ---------------------------------------------------------------- */

/**
 * react-youtube → youtube-player uses window.YT when it already exists instead of
 * loading https://www.youtube.com/iframe_api. This stand-in renders an iframe with
 * a static thumbnail-like card for the recommended video and switches cards when
 * the app cues the next video ("새로운 동영상 추천").
 */
function youtubeStandIn(videos) {
  const slide = (id, video) => `
    <div class="slide" data-id="${id}">
      <img class="bg" src="/demo-media/${video.image}.jpg" alt="">
      <div class="shade"></div>
      <div class="top">
        <div class="avatar">♪</div>
        <div class="meta"><div class="title">${video.title}</div><div class="sub">AI 추천 검색어 · ${video.keyword}</div></div>
      </div>
      <div class="play"><span></span></div>
      <div class="dur">${video.duration}</div>
    </div>`;
  const css = `
    html, body { margin: 0; height: 100%; overflow: hidden; background: #1d241f; }
    body { font-family: "Apple SD Gothic Neo", "Noto Sans KR", sans-serif; -webkit-font-smoothing: antialiased; }
    .slide { position: absolute; inset: 0; opacity: 0; transition: opacity .3s ease; }
    .slide.on { opacity: 1; }
    .bg { width: 100%; height: 100%; object-fit: cover; display: block; }
    .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgb(0 0 0 / 58%), rgb(0 0 0 / 0%) 34%, rgb(0 0 0 / 0%) 72%, rgb(0 0 0 / 34%)); }
    .top { position: absolute; top: 14px; left: 16px; right: 16px; display: flex; gap: 11px; align-items: center; color: #fff; }
    .avatar { flex: 0 0 38px; height: 38px; border-radius: 50%; background: #566e56; display: grid; place-items: center; font-size: 18px; }
    .title { font-size: 17px; font-weight: 700; letter-spacing: -0.2px; text-shadow: 0 1px 3px rgb(0 0 0 / 40%); }
    .sub { margin-top: 3px; font-size: 12.5px; opacity: .9; }
    .play { position: absolute; left: 50%; top: 50%; width: 74px; height: 74px; margin: -37px 0 0 -37px; border-radius: 50%;
      background: rgb(20 28 22 / 62%); box-shadow: 0 6px 22px rgb(0 0 0 / 28%); display: grid; place-items: center; }
    .play span { width: 0; height: 0; margin-left: 6px; border-style: solid; border-width: 13px 0 13px 22px; border-color: transparent transparent transparent #fff; }
    .dur { position: absolute; right: 12px; bottom: 12px; padding: 3px 7px; border-radius: 5px; background: rgb(0 0 0 / 72%); color: #fff; font-size: 12.5px; font-weight: 600; }`;
  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${Object.entries(videos)
    .map(([id, video]) => slide(id, video))
    .join("")}</body></html>`;

  // Preload the placeholder images so switching cards is instant.
  addEventListener("DOMContentLoaded", () => {
    for (const video of Object.values(videos)) new Image().src = `/demo-media/${video.image}.jpg`;
  });

  const noop = () => undefined;
  class Player {
    constructor(element, options = {}) {
      const target = typeof element === "string" ? document.getElementById(element) : element;
      const iframe = document.createElement("iframe");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("title", "추천 영상");
      iframe.style.border = "0";
      iframe.style.borderRadius = "10px";
      iframe.style.background = "#1d241f";
      // Like the real player: the iframe takes the element's place, destroy() puts it back.
      this.original = target;
      this.iframe = iframe;
      this.videoId = options.videoId;
      if (target?.isConnected) {
        target.replaceWith(iframe);
        const d = iframe.contentDocument;
        d.open();
        d.write(doc);
        d.close();
        this.show(this.videoId);
      }
      setTimeout(() => options.events?.onReady?.({ target: this, data: null }), 0);
    }
    show(id) {
      this.videoId = id;
      const d = this.iframe.contentDocument;
      if (!d) return;
      for (const node of d.querySelectorAll(".slide")) node.classList.toggle("on", node.dataset.id === id);
    }
    cueVideoById(arg) { this.show(typeof arg === "string" ? arg : arg?.videoId); }
    loadVideoById(arg) { this.cueVideoById(arg); }
    getIframe() { return this.iframe; }
    destroy() { if (this.iframe.isConnected) this.iframe.replaceWith(this.original); }
    getPlayerState() { return 5; }
  }
  for (const name of ["cueVideoByUrl", "loadVideoByUrl", "playVideo", "pauseVideo", "stopVideo", "getVideoLoadedFraction",
    "cuePlaylist", "loadPlaylist", "nextVideo", "previousVideo", "playVideoAt", "setShuffle", "setLoop", "getPlaylist",
    "getPlaylistIndex", "setOption", "mute", "unMute", "isMuted", "setVolume", "getVolume", "seekTo", "getPlaybackRate",
    "setPlaybackRate", "getAvailablePlaybackRates", "getPlaybackQuality", "setPlaybackQuality", "getAvailableQualityLevels",
    "getCurrentTime", "getDuration", "removeEventListener", "getVideoUrl", "getVideoEmbedCode", "getOptions", "getOption",
    "addEventListener", "setSize"]) {
    Player.prototype[name] = noop;
  }
  window.YT = { Player, PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 } };
}

/**
 * Two fixed-width controls wrap their label at this font on macOS Chrome
 * ("새로운 동영상 추/천", "좋아요/24"); keep them on one line for the recording.
 */
function keepLabelsOnOneLine() {
  const style = document.createElement("style");
  style.textContent = `
    label + p + div > button:has(> img) { white-space: nowrap; }
    div:has(> img[alt="like"]) { white-space: nowrap; width: auto !important; }`;
  const add = () => document.head.appendChild(style);
  if (document.head) add();
  else addEventListener("DOMContentLoaded", add);
}

/* ---------------------------------------------------------------- */
/* Network: demo images, blocked external hosts, unmatched `/api`    */
/* ---------------------------------------------------------------- */

async function handle(route, unmatched) {
  const request = route.request();
  const url = new URL(request.url());

  // Nothing leaves the machine: YouTube, fonts, analytics … are all blocked.
  if (url.origin !== APP_ORIGIN) {
    unmatched.add(`external ${url.origin}${url.pathname}`);
    return route.abort();
  }
  if (url.pathname.startsWith("/demo-media/")) {
    const name = url.pathname.slice("/demo-media/".length).replace(/\.jpg$/, "");
    if (!MEDIA[name]) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ status: 200, contentType: "image/jpeg", body: readFileSync(join(mediaDir, `${name}.jpg`)) });
  }
  if (url.pathname.startsWith("/api/")) {
    // Every known endpoint is answered in the page; anything reaching here is missing a fixture.
    unmatched.add(`${request.method()} ${url.pathname}${url.search}`);
    return route.fulfill({ status: 200, contentType: "application/json", body: request.method() === "GET" ? "[]" : "{}" });
  }
  return route.continue();
}

/* ---------------------------------------------------------------- */
/* Clip helpers                                                      */
/* ---------------------------------------------------------------- */

async function settle(page, ms = 700) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) => (image.complete ? null : image.decode().catch(() => null))),
    );
  });
  await page.waitForTimeout(ms);
}

async function open(page, path) {
  await page.goto(`${APP_URL}${path}`, { waitUntil: "networkidle" });
  await page.getByText(`${ME.nickname} 님 안녕하세요`).first().waitFor();
  await settle(page);
}

/** The calendar tile for a day of the current month. */
const dayTile = (page, day) => page.locator("div").filter({ hasText: new RegExp(`^${day}$`) }).last();

const scenario = {
  viewport: { width: 1280, height: 800 },
  scale: 2,
  outWidth: 1600,
  appUrl: APP_URL,
  start: prepareMedia,
  contextOptions: { colorScheme: "light" },
  async setup(context, { clip, unmatched }) {
    await context.addCookies([{ name: "token", value: "demo-access-token", url: APP_URL }]);
    await context.addInitScript(apiShim, fixtures(clip));
    await context.addInitScript(youtubeStandIn, VIDEOS);
    await context.addInitScript(keepLabelsOnOneLine);
    await context.route("**/*", (route) => handle(route, unmatched));
  },
  clips: [
    {
      id: "bluememories-write",
      title: "일기 작성 · 발행",
      caption: "본문을 쓰고 발행하면 AI 감정 분석을 거쳐 캘린더에 오늘의 감정이 표시됨",
      async prepare(page) {
        await open(page, "/calendar");
        await dayTile(page, TODAY_DAY).click();
        const body = page.getByPlaceholder("본문");
        await body.waitFor();
        await page.getByPlaceholder("제목").fill(NEW_DIARY.title);
        await page.getByPlaceholder("날씨").fill(NEW_DIARY.weather);
        await body.fill(`${NEW_DIARY.firstLine}\n`);
        await page.getByText("공개", { exact: true }).click();
        await page.locator("#inputTag").setInputFiles({
          name: "호수공원_산책.jpg",
          mimeType: "image/jpeg",
          buffer: readFileSync(join(mediaDir, `${NEW_DIARY.image}.jpg`)),
        });
        await body.evaluate((element) => element.blur());
        await settle(page, 500);
        await page.mouse.move(900, 560);
      },
      async run(page, h) {
        const body = page.getByPlaceholder("본문");
        const box = await body.boundingBox();
        await page.mouse.move(box.x + 330, box.y + 46, { steps: 8 });
        await page.mouse.down();
        await page.mouse.up();
        await body.evaluate((element) => element.setSelectionRange(element.value.length, element.value.length));
        await page.keyboard.type(NEW_DIARY.typed, { delay: 14 });
        await page.waitForTimeout(150);
        await h.clickOn(page, page.getByRole("button", { name: "발행" }), 9);
        await page.getByText("SUN", { exact: true }).waitFor({ timeout: 8000 });
        await page.waitForTimeout(150);
        // Rest the cursor beside today's new emotion face, not on the date.
        const tile = await dayTile(page, TODAY_DAY).boundingBox();
        await page.mouse.move(tile.x + tile.width * 0.86, tile.y + tile.height * 0.9, { steps: 9 });
        await page.waitForTimeout(500);
      },
      hold: 450,
    },
    {
      id: "bluememories-analysis",
      title: "감정 분석 · 콘텐츠 추천",
      caption: "일기의 긍정·중립·부정 점수와 감정에 맞춰 추천된 영상을 함께 확인",
      async prepare(page) {
        await open(page, "/calendar");
        await dayTile(page, TODAY_DAY).click();
        await page.getByText(NEW_DIARY.title).waitFor();
        await settle(page, 900);
        await page.mouse.move(1060, 520);
      },
      async run(page, h) {
        await page.waitForTimeout(700);
        await h.smoothScroll(page, 470, 650);
        await page.waitForTimeout(350);
        await h.clickOn(page, page.getByRole("button", { name: "새로운 동영상 추천" }), 9);
        await page.waitForTimeout(1000);
      },
      hold: 300,
    },
    {
      id: "bluememories-calendar",
      title: "감정 캘린더 · 일기 목록",
      caption: "한 달의 감정을 달력으로 보고 목록으로 바꿔 감정 점수와 요약을 훑어봄",
      async prepare(page) {
        // Visit the list once so its photos are already decoded in this document.
        await open(page, "/calendar-list");
        await page.locator("button").filter({ hasText: /^$/ }).last().click();
        await page.getByText("SUN", { exact: true }).waitFor();
        await settle(page, 600);
        await page.mouse.move(980, 470);
      },
      async run(page, h) {
        await page.waitForTimeout(600);
        await h.clickOn(page, page.locator("button:has(img[src*='posting_list'])"), 10);
        await page.getByPlaceholder("검색어를 입력하세요").waitFor();
        await page.waitForTimeout(700);
        await h.smoothScroll(page, 300, 600);
        await page.waitForTimeout(500);
      },
      hold: 400,
    },
    {
      id: "bluememories-shared",
      title: "공유 일기장",
      caption: "여러 명이 함께 쓰는 교환일기장에서 멤버들이 이어 쓴 일기와 감정을 확인",
      async prepare(page) {
        await open(page, "/shared-diary");
        await page.getByText(SHARED[0].title).click();
        await page.getByText(SHARED_CONTENTS[0].title).waitFor();
        await settle(page, 300);
        await page.goBack();
        await page.getByText("진행 중인 교환일기 목록").waitFor();
        await settle(page, 500);
        await page.mouse.move(560, 730);
      },
      async run(page, h) {
        await page.waitForTimeout(400);
        await h.clickOn(page, page.getByText(SHARED[0].title), 10);
        await page.getByText(SHARED_CONTENTS[0].title).waitFor();
        await page.waitForTimeout(800);
        await h.smoothScroll(page, 360, 600);
        await page.waitForTimeout(500);
      },
      hold: 400,
    },
    {
      id: "bluememories-community",
      title: "커뮤니티 · 댓글",
      caption: "공개 일기 피드에서 글을 열어 감정 분석 결과와 좋아요·댓글을 확인",
      async prepare(page) {
        await open(page, "/community");
        await page.getByText(POST.title, { exact: true }).click();
        await page.getByPlaceholder("댓글을 남겨보세요").waitFor();
        await settle(page, 300);
        await page.goBack();
        await page.getByText("다른 사람들은 어떤 일기를 쓸까요?").waitFor();
        await settle(page, 500);
        await page.mouse.move(640, 250);
      },
      async run(page, h) {
        await page.waitForTimeout(300);
        await h.clickOn(page, page.getByText(POST.title, { exact: true }), 10);
        await page.getByPlaceholder("댓글을 남겨보세요").waitFor();
        await page.waitForTimeout(800);
        const comments = await page
          .getByPlaceholder("댓글을 남겨보세요")
          .evaluate((element) => element.getBoundingClientRect().top + window.scrollY - 190);
        await h.smoothScroll(page, comments, 850);
        await page.waitForTimeout(500);
      },
      hold: 300,
    },
  ],
};

export default scenario;
