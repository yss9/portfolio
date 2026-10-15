/**
 * PotneR demo clips: the original Flutter app (App-develop, built for web with
 * API_BASE_URL=http://127.0.0.1:3115/api/v1) driven with demo fixtures.
 * The fixtures follow scripts/capture-potner.mjs.
 *
 * Build the app first (outside this repo):
 *   flutter build web --release --dart-define=API_BASE_URL=http://127.0.0.1:3115/api/v1
 * POTNER_APP_DIR points at that app checkout (default: ../.capture/potner-app).
 */
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_DIR =
  process.env.POTNER_APP_DIR ?? join(HERE, "../../../.capture/potner-app");
const BUILD_DIR = join(APP_DIR, "build/web");
const PORT = 3115;
const APP_URL = `http://127.0.0.1:${PORT}`;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".otf": "font/otf",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

let server;
export function serve() {
  server = createServer((req, res) => {
    const url = new URL(req.url, APP_URL);
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const requested = normalize(join(BUILD_DIR, relative || "index.html"));
    const safe = requested.startsWith(normalize(BUILD_DIR));
    const file =
      safe && existsSync(requested) && !requested.endsWith("/")
        ? requested
        : join(BUILD_DIR, "index.html");
    res.writeHead(200, {
      "content-type": mime[extname(file)] ?? "application/octet-stream",
    });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
}

/* ---------------------------------------------------------------- */
/* Demo fixtures                                                     */
/* ---------------------------------------------------------------- */

// Dates are relative to the recording time so labels read "2분 전", "어제", …
const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms) => new Date(NOW - ms).toISOString();
/** KST calendar date n days before the recording, as YYYY-MM-DD. */
const day = (n) => new Date(NOW - n * DAY + 9 * HOUR).toISOString().slice(0, 10);

const hero = () => readFileSync(join(APP_DIR, "assets/images/home/stitch_rose_hero.jpg"));
const closeup = () => readFileSync(join(APP_DIR, "assets/images/home/stitch_rose_photo.jpg"));

const plant = {
  plantId: "plant-roji",
  name: "로지",
  speciesName: "칼란디바",
  categoryName: "다육식물",
  lifeStageName: "개화기",
  createdAt: "2026-05-18",
  adoptedDate: "2026-05-18",
  representativePhoto: {
    thumbnailUrl: "/media/plant-roji/hero/thumbnail.jpg",
    originalUrl: "/media/plant-roji/hero/original.jpg",
  },
};

const sensors = [
  { sensorType: "SOIL_MOISTURE", unit: "PERCENT", value: 47.8, measuredAt: ago(2 * MIN), status: "NORMAL" },
  { sensorType: "ILLUMINANCE", unit: "LUX", value: 18420, measuredAt: ago(2 * MIN), status: "NOT_APPLICABLE" },
  { sensorType: "TEMPERATURE", unit: "CELSIUS", value: 24.6, measuredAt: ago(2 * MIN), status: "NORMAL" },
  { sensorType: "HUMIDITY", unit: "PERCENT", value: 58.2, measuredAt: ago(2 * MIN), status: "NORMAL" },
];

const photos = [
  ["photo-0901", day(8), "hero"],
  ["photo-0902", day(7), "hero"],
  ["photo-0903", day(6), "closeup"],
  ["photo-0904", day(5), "hero"],
  ["photo-0905", day(4), "closeup"],
  ["photo-0906", day(3), "hero"],
  ["photo-0907", day(2), "closeup"],
  ["photo-0908", day(1), "hero"],
  ["photo-0909", day(0), "closeup"],
].map(([photoId, photoDate, variant], index) => ({
  photoId,
  photoDate,
  thumbnailUrl: `/media/plant-roji/${variant}/thumbnail.jpg`,
  originalUrl: `/media/plant-roji/${variant}/original.jpg`,
  playbackUrl: `/media/plant-roji/${variant}/playback.jpg`,
  capturedAt: `${photoDate}T00:${String(10 + index).padStart(2, "0")}:00Z`,
}));

const diaries = [
  ["diary-0903", day(6), "조용히 햇살을 모은 날"],
  ["diary-0904", day(5), "바람이 살짝 간질였어요"],
  ["diary-0905", day(4), "물을 마시고 한 뼘 더"],
  ["diary-0906", day(3), "오늘도 잎이 반짝반짝"],
  ["diary-0907", day(2), "분홍빛 꽃잎이 열린 아침"],
  ["diary-0908", day(1), "따뜻한 창가에서 보낸 하루"],
  ["diary-0909", day(0), "새 꽃봉오리를 발견했어요"],
].map(([diaryId, diaryDate, title], index) => ({
  diaryId,
  diaryDate,
  title,
  thumbnailUrl: photos[index + 2]?.thumbnailUrl ?? photos.at(-1).thumbnailUrl,
}));

const growthProfile = {
  plantId: "plant-roji",
  customized: true,
  soilMoisture: { minPct: 40, maxPct: 58 },
  watering: { recommendedVolumeMl: 320, cycleDays: null },
  temperature: { minC: 20, maxC: 28 },
  humidity: { minPct: 45, maxPct: 68 },
  illuminance: { minLux: null, maxLux: null },
  dailyLight: { minLuxHour: 175000, maxLuxHour: 325000, targetLuxHour: 250000 },
};

function historyPoints(kind, interval) {
  const bases = { SOIL_MOISTURE: 48, TEMPERATURE: 24, HUMIDITY: 58, ILLUMINANCE: 14500 };
  const spread = kind === "ILLUMINANCE" ? 3200 : 2.2;
  const daily = interval === "DAY";
  return Array.from({ length: daily ? 7 : 12 }, (_, index) => {
    const average = bases[kind] + Math.sin(index / (daily ? 1.1 : 1.7)) * spread;
    const at = daily ? ago((6 - index) * DAY) : ago((11 - index) * 2 * HOUR);
    return {
      bucketAt: at,
      averageValue: Number(average.toFixed(1)),
      minimumValue: Number((average - spread * 0.35).toFixed(1)),
      maximumValue: Number((average + spread * 0.35).toFixed(1)),
      sampleCount: 120,
    };
  });
}

function json(route, data, status = 200) {
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
}

export async function handle(route, unmatched) {
  const request = route.request();
  const url = new URL(request.url());

  if (url.pathname.startsWith("/media/plant-roji/")) {
    const body = url.pathname.includes("closeup") ? closeup() : hero();
    return route.fulfill({ status: 200, contentType: "image/jpeg", body });
  }
  if (!url.pathname.startsWith("/api/v1/")) return route.continue();

  const path = url.pathname.slice("/api/v1/".length);
  const token = { accessToken: "demo-access-token", refreshToken: "demo-refresh-token", tokenType: "Bearer", accessTokenExpiresIn: 3600 };
  if (path === "auth/login" || path === "auth/reissue") return json(route, token);
  if (path === "users/me") return json(route, { userId: "user-demo", email: "demo@potner.app", nickname: "영석" });
  if (path === "plants") return json(route, { plants: [plant] });
  if (path === "plants/plant-roji/happiness") {
    return json(route, { grade: "VERY_HAPPY", headline: "오늘 로지는 아주 행복해요", detail: "햇살과 수분이 모두 알맞아 편안한 하루를 보내고 있어요." });
  }
  if (path === "plants/plant-roji/sensors/current") return json(route, { sensors });
  if (path === "plants/plant-roji/sensors/history") {
    const kind = url.searchParams.get("sensorType") ?? "SOIL_MOISTURE";
    const interval = url.searchParams.get("interval") ?? "HOUR";
    return json(route, { sensorType: kind, interval, points: historyPoints(kind, interval) });
  }
  if (path === "plants/plant-roji/daily-light") {
    return json(route, {
      today: { progressPct: 78.6, lightHours: 7.4, accumulatedLuxHour: 196500, targetLuxHour: 250000, coveragePct: 96.8, sampleCount: 864 },
      history: [
        { lightDate: day(1), lightStatus: "NORMAL", photoperiodStatus: "NORMAL", coveragePct: 98.2, lightHours: 10.8 },
        { lightDate: day(2), lightStatus: "NORMAL", photoperiodStatus: "NORMAL", coveragePct: 97.6, lightHours: 10.4 },
        { lightDate: day(3), lightStatus: "LOW", photoperiodStatus: "NORMAL", coveragePct: 95.1, lightHours: 9.8 },
      ],
    });
  }
  if (path === "plants/plant-roji/growth-profile") return json(route, growthProfile);
  if (path === "plants/plant-roji/photos") return json(route, { photos });
  if (path === "plants/plant-roji/devices") {
    return json(route, { robot: { currentState: "IDLE", stateChangedAt: ago(3 * MIN), batteryPercent: 86, batteryMeasuredAt: ago(3 * MIN) }, devices: [] });
  }
  if (path === "plants/plant-roji/diaries") return json(route, { diaries });
  if (/^plants\/plant-roji\/diaries\/diary-\d+$/.test(path)) {
    const diaryId = path.split("/").at(-1);
    const summary = diaries.find((item) => item.diaryId === diaryId) ?? diaries.at(-1);
    return json(route, {
      diaryId: summary.diaryId,
      diaryDate: summary.diaryDate,
      title: summary.title,
      content: "아침 햇살이 잎 끝에 내려앉자 몸이 천천히 따뜻해졌어. 흙은 촉촉했고 공기도 편안해서 마음껏 숨을 쉬었지. 오후에는 부드러운 바람을 쐬며 새로 올라온 꽃봉오리를 가만히 바라봤어. 오늘도 곁을 지켜줘서 고마워. 내일은 분홍빛 꽃잎을 조금 더 활짝 보여 줄게!",
      photo: { originalUrl: "/media/plant-roji/closeup/original.jpg", thumbnailUrl: "/media/plant-roji/closeup/thumbnail.jpg" },
    });
  }
  if (path === "plants/plant-roji/status-report") {
    return json(route, {
      date: url.searchParams.get("date") ?? day(0),
      happinessScore: 92,
      lightHours: 10.8,
      wateredMl: 318.5,
      adjustments: [
        { reason: "온도와 습도가 안정적이었어요", points: 8 },
        { reason: "목표 광량을 충분히 채웠어요", points: 7 },
        { reason: "알맞은 양의 물을 마셨어요", points: 5 },
      ],
    });
  }
  if (path === "plants/plant-roji") {
    return json(route, {
      plantId: plant.plantId,
      name: plant.name,
      species: { speciesId: "species-kalanchoe", name: plant.speciesName },
      category: { categoryId: "category-succulent", name: plant.categoryName },
      lifeStage: { lifeStageId: "stage-flowering", code: "FLOWERING", name: "개화기", description: "꽃이 피고 오래 유지되는 시기예요." },
      adoptedDate: plant.adoptedDate,
      representativePhoto: plant.representativePhoto,
      persona: {
        characterName: "칼란디바",
        flowerMeaning: "설렘",
        tags: ["감정풍부", "표현력", "활기"],
        personality: "감정 표현이 풍부해요. 사소한 변화도 크게 느끼고 설렘을 숨기지 않아요.",
        coreValue: "함께 나누는 설렘",
      },
    });
  }
  if (path === "alerts") {
    const alerts = [
      { alertId: "alert-1", plantId: plant.plantId, plantName: plant.name, metricType: "DAILY_LIGHT", deviation: "LOW", measuredValue: 168200, occurredAt: ago(26 * HOUR), resolvedAt: ago(21 * HOUR), active: false, read: false },
      { alertId: "alert-2", plantId: plant.plantId, plantName: plant.name, metricType: "STATION_WATER_LOW", deviation: "LOW", measuredValue: null, occurredAt: ago(5 * HOUR), resolvedAt: null, active: true, read: false },
    ];
    return json(route, { alerts, unreadCount: 2, page: 0, size: 100, totalElements: 2, totalPages: 1 });
  }
  if (path === "blooms") {
    return json(route, { blooms: [
      { bloomId: "bloom-1", plantId: plant.plantId, plantName: plant.name, bloomDate: day(2), source: "VISION", read: true, note: "첫 번째 꽃이 피었어요" },
      { bloomId: "bloom-2", plantId: plant.plantId, plantName: plant.name, bloomDate: day(0), source: "VISION", read: false, note: "두 번째 꽃봉오리가 열렸어요" },
    ] });
  }
  if (path === "robots") {
    return json(route, { robots: [{ robotId: "robot-1", deviceUid: "potner-rover-01", name: "포트너 로봇", connectionStatus: "ONLINE", lastSeenAt: ago(MIN), batteryPercent: 86, firmwareVersion: "1.4.2", assignedPlantId: plant.plantId, assignedPlantName: plant.name, devices: [
      { deviceUid: "potner-pi-01", deviceType: "RASPBERRY_PI", connectionStatus: "ONLINE", lastSeenAt: ago(MIN) },
      { deviceUid: "potner-jetson-01", deviceType: "JETSON_ORIN", connectionStatus: "ONLINE", lastSeenAt: ago(MIN) },
    ] }] });
  }

  if (request.method() !== "GET") return route.fulfill({ status: 204, body: "" });
  unmatched.add(`${request.method()} /${path}`);
  return json(route, {});
}

/* ---------------------------------------------------------------- */
/* Flutter helpers                                                   */
/* ---------------------------------------------------------------- */

async function waitForFlutter(page) {
  await page.waitForFunction(
    () => document.querySelector("flutter-view") || document.querySelector("flt-glass-pane"),
  );
  await page.waitForTimeout(1800);
  await page.evaluate(() => document.fonts.ready);
}

/** Turns on Flutter's semantics tree so text can be located. */
async function enableSemantics(page) {
  for (const candidate of [
    page.locator('[aria-label="Enable accessibility"]'),
    page.locator("flt-semantics-placeholder"),
  ]) {
    if (await candidate.count()) {
      await candidate.first().evaluate((element) => element.click());
      await page.waitForTimeout(400);
      return;
    }
  }
}

export async function open(page, hashPath) {
  await page.goto(`${APP_URL}/#${hashPath}`, { waitUntil: "networkidle" });
  await waitForFlutter(page);
  await enableSemantics(page);
  await page.waitForTimeout(600);
}

export async function login(page) {
  await open(page, "/login");
  const inputs = page.locator("input");
  await inputs.nth(0).fill("demo@potner.app");
  await inputs.nth(1).fill("potner1234!");
  await page.getByText("로그인", { exact: true }).last().click();
  await page.waitForTimeout(2500);
}

/** A Flutter semantics node by its accessible label or exact text. */
function flt(page, label, { exact = true } = {}) {
  const byLabel = exact
    ? page.locator(`flt-semantics[aria-label="${label}"]`)
    : page.locator(`flt-semantics[aria-label*="${label}"]`);
  return byLabel.or(page.getByText(label, { exact })).last();
}

/** Moves the demo cursor somewhere neutral so it is visible from frame one. */
async function park(page, x = 330, y = 640) {
  await page.mouse.move(x, y);
}

const scenario = {
  viewport: { width: 430, height: 900 },
  scale: 2,
  outWidth: 720,
  contextOptions: { colorScheme: "light" },
  start: serve,
  stop: () => new Promise((resolve) => server.close(resolve)),
  async setup(context, { unmatched }) {
    await context.route("**/*", (route) => handle(route, unmatched));
  },
  clips: [
    {
      id: "potner-login",
      title: "로그인",
      caption: "계정으로 로그인하면 반려 식물의 오늘 상태가 담긴 홈으로 이동",
      async prepare(page) {
        // Log in once off camera so the Korean fonts are cached, then start over.
        await login(page);
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
        // A hash change alone keeps the running app (and its session); reload it.
        await page.goto("about:blank");
        await open(page, "/login");
        await park(page, 300, 760);
      },
      async run(page, h) {
        const inputs = page.locator("input");
        await h.clickOn(page, inputs.nth(0), 12);
        await page.keyboard.type("demo@potner.app", { delay: 35 });
        await h.clickOn(page, inputs.nth(1), 8);
        await page.keyboard.type("potner1234!", { delay: 35 });
        await h.clickOn(page, page.getByText("로그인", { exact: true }).last(), 10);
        await page.waitForTimeout(1800);
      },
    },
    {
      id: "potner-home",
      title: "통합 홈",
      caption: "식물의 행복 상태와 토양 수분·조도·온도·습도를 한 화면에서 확인",
      async prepare(page) {
        await login(page);
        await park(page);
      },
      async run(page) {
        for (let i = 0; i < 14; i++) {
          await page.mouse.wheel(0, 60);
          await page.waitForTimeout(60);
        }
        await page.waitForTimeout(900);
        for (let i = 0; i < 14; i++) {
          await page.mouse.wheel(0, -60);
          await page.waitForTimeout(40);
        }
      },
    },
    {
      id: "potner-environment",
      title: "환경 분석",
      caption: "센서 이력을 항목과 기간별로 바꿔 보며 적정 범위와 비교",
      async prepare(page) {
        await login(page);
        await open(page, "/plants/plant-roji/environment");
        for (let i = 0; i < 6; i++) await page.mouse.wheel(0, 70);
        await page.waitForTimeout(500);
        await park(page, 320, 700);
      },
      async run(page, h) {
        await h.clickOn(page, flt(page, "조도"), 14);
        await page.waitForTimeout(700);
        await h.clickOn(page, flt(page, "온도"), 12);
        await page.waitForTimeout(700);
        await h.clickOn(page, flt(page, "7일"), 12);
        await page.waitForTimeout(900);
      },
    },
    {
      id: "potner-diary",
      title: "식물 일기",
      caption: "센서·돌봄 기록으로 매일 저녁 생성되는 일기와 상태 리포트",
      async prepare(page) {
        await login(page);
        // Visit the detail once so every glyph it uses is already loaded.
        await open(page, "/growth/diary/plant-roji/diary-0909");
        await open(page, "/growth");
        await park(page, 320, 640);
      },
      async run(page, h) {
        await h.clickOn(page, flt(page, "식물 일기", { exact: false }), 14);
        await page.waitForTimeout(1100);
        await h.clickOn(page, flt(page, "새 꽃봉오리를 발견했어요", { exact: false }), 14);
        await page.waitForTimeout(900);
        for (let i = 0; i < 8; i++) {
          await page.mouse.wheel(0, 70);
          await page.waitForTimeout(50);
        }
        await page.waitForTimeout(500);
      },
    },
    {
      id: "potner-timelapse",
      title: "성장 비교 · 타임랩스",
      caption: "두 날짜의 사진을 나란히 비교하고 타임랩스로 변화를 재생",
      async prepare(page) {
        await login(page);
        await open(page, "/growth/compare");
        await park(page, 320, 620);
      },
      async run(page, h) {
        await page.waitForTimeout(500);
        await h.clickOn(page, flt(page, "타임랩스 보기"), 14);
        await page.waitForTimeout(3000);
      },
    },
    {
      id: "potner-alerts",
      title: "알림",
      caption: "물 부족 같은 이상 알림과 개화 소식을 한곳에서 확인",
      async prepare(page) {
        await login(page);
        await park(page, 200, 640);
      },
      async run(page, h) {
        await h.clickOn(page, flt(page, "알림 탭", { exact: false }), 16);
        await page.waitForTimeout(1600);
      },
    },
  ],
};

export default scenario;
