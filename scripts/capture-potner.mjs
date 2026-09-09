/**
 * Capture harness for the original Potner Flutter frontend.
 *
 * The app is built from S15P11E104 App-develop without source changes. All
 * contract-shaped API fixtures and media responses stay in this script so the
 * portfolio capture setup remains separate from production code.
 */
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";

const ROOT = "C:/Users/SSAFY";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const APP_DIR = join(ROOT, "pjt/S15P11E104-app-capture");
const BUILD_DIR = join(APP_DIR, "build/web");
const OUTPUT_DIR = join(ROOT, "portfolio/public/projects/potner");
const APP_URL = "http://127.0.0.1:3115";
const VIEWPORT = { width: 430, height: 900 };

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function serveFlutter() {
  const server = createServer((req, res) => {
    const url = new URL(req.url, APP_URL);
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const requested = normalize(join(BUILD_DIR, relative || "index.html"));
    const safe = requested.startsWith(normalize(BUILD_DIR));
    const file = safe && existsSync(requested) ? requested : join(BUILD_DIR, "index.html");
    res.writeHead(200, { "content-type": mime[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(3115, "127.0.0.1", () => resolve(server)));
}

function json(route, data, status = 200) {
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
}

const hero = readFileSync(join(APP_DIR, "assets/images/home/stitch_rose_hero.jpg"));
const closeup = readFileSync(join(APP_DIR, "assets/images/home/stitch_rose_photo.jpg"));

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
  { sensorType: "SOIL_MOISTURE", unit: "PERCENT", value: 47.8, measuredAt: "2026-09-09T04:21:00Z", status: "NORMAL" },
  { sensorType: "ILLUMINANCE", unit: "LUX", value: 18420, measuredAt: "2026-09-09T04:21:00Z", status: "NOT_APPLICABLE" },
  { sensorType: "TEMPERATURE", unit: "CELSIUS", value: 24.6, measuredAt: "2026-09-09T04:21:00Z", status: "NORMAL" },
  { sensorType: "HUMIDITY", unit: "PERCENT", value: 58.2, measuredAt: "2026-09-09T04:21:00Z", status: "NORMAL" },
];

const photos = [
  ["photo-0901", "2026-09-01", "hero"],
  ["photo-0902", "2026-09-02", "hero"],
  ["photo-0903", "2026-09-03", "closeup"],
  ["photo-0904", "2026-09-04", "hero"],
  ["photo-0905", "2026-09-05", "closeup"],
  ["photo-0906", "2026-09-06", "hero"],
  ["photo-0907", "2026-09-07", "closeup"],
  ["photo-0908", "2026-09-08", "hero"],
  ["photo-0909", "2026-09-09", "closeup"],
].map(([photoId, photoDate, variant], index) => ({
  photoId,
  photoDate,
  thumbnailUrl: `/media/plant-roji/${variant}/thumbnail.jpg`,
  originalUrl: `/media/plant-roji/${variant}/original.jpg`,
  playbackUrl: `/media/plant-roji/${variant}/playback.jpg`,
  capturedAt: `${photoDate}T00:${String(10 + index).padStart(2, "0")}:00Z`,
}));

const diaries = [
  ["diary-0903", "2026-09-03", "조용히 햇살을 모은 날"],
  ["diary-0904", "2026-09-04", "바람이 살짝 간질였어요"],
  ["diary-0905", "2026-09-05", "물을 마시고 한 뼘 더"],
  ["diary-0906", "2026-09-06", "오늘도 잎이 반짝반짝"],
  ["diary-0907", "2026-09-07", "분홍빛 꽃잎이 열린 아침"],
  ["diary-0908", "2026-09-08", "따뜻한 창가에서 보낸 하루"],
  ["diary-0909", "2026-09-09", "새 꽃봉오리를 발견했어요"],
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

function historyPoints(kind) {
  const bases = {
    SOIL_MOISTURE: 48,
    TEMPERATURE: 24,
    HUMIDITY: 58,
    ILLUMINANCE: 14500,
  };
  const spread = kind === "ILLUMINANCE" ? 3200 : 2.2;
  return Array.from({ length: 12 }, (_, index) => {
    const average = bases[kind] + Math.sin(index / 1.7) * spread;
    return {
      bucketAt: new Date(Date.UTC(2026, 8, 8, index * 2 + 2)).toISOString(),
      averageValue: Number(average.toFixed(1)),
      minimumValue: Number((average - spread * 0.35).toFixed(1)),
      maximumValue: Number((average + spread * 0.35).toFixed(1)),
      sampleCount: 120,
    };
  });
}

async function installFixtures(page) {
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (url.pathname.startsWith("/media/plant-roji/")) {
      const body = url.pathname.includes("closeup") ? closeup : hero;
      return route.fulfill({ status: 200, contentType: "image/jpeg", body });
    }

    if (!url.pathname.startsWith("/api/v1/")) {
      return route.continue();
    }

    const path = url.pathname.slice("/api/v1/".length);
    if (path === "auth/login") {
      return json(route, {
        accessToken: "portfolio-access-token",
        refreshToken: "portfolio-refresh-token",
        tokenType: "Bearer",
        accessTokenExpiresIn: 3600,
      });
    }
    if (path === "auth/reissue") {
      return json(route, {
        accessToken: "portfolio-access-token-2",
        refreshToken: "portfolio-refresh-token",
        tokenType: "Bearer",
        accessTokenExpiresIn: 3600,
      });
    }
    if (path === "users/me") {
      return json(route, { userId: "user-portfolio", email: "potner@portfolio.local", nickname: "영석" });
    }
    if (path === "plants") return json(route, { plants: [plant] });
    if (path === "plants/plant-roji/happiness") {
      return json(route, { grade: "VERY_HAPPY", headline: "오늘 로지는 아주 행복해요", detail: "햇살과 수분이 모두 알맞아 편안한 하루를 보내고 있어요." });
    }
    if (path === "plants/plant-roji/sensors/current") return json(route, { sensors });
    if (path === "plants/plant-roji/sensors/history") {
      const kind = url.searchParams.get("sensorType") ?? "SOIL_MOISTURE";
      return json(route, { sensorType: kind, interval: url.searchParams.get("interval") ?? "HOUR", points: historyPoints(kind) });
    }
    if (path === "plants/plant-roji/daily-light") {
      return json(route, {
        today: { progressPct: 78.6, lightHours: 7.4, accumulatedLuxHour: 196500, targetLuxHour: 250000, coveragePct: 96.8, sampleCount: 864 },
        history: [
          { lightDate: "2026-09-08", lightStatus: "NORMAL", photoperiodStatus: "NORMAL", coveragePct: 98.2, lightHours: 10.8 },
          { lightDate: "2026-09-07", lightStatus: "NORMAL", photoperiodStatus: "NORMAL", coveragePct: 97.6, lightHours: 10.4 },
          { lightDate: "2026-09-06", lightStatus: "LOW", photoperiodStatus: "NORMAL", coveragePct: 95.1, lightHours: 9.8 },
        ],
      });
    }
    if (path === "plants/plant-roji/growth-profile") return json(route, growthProfile);
    if (path === "plants/plant-roji/photos") return json(route, { photos });
    if (path === "plants/plant-roji/devices") {
      return json(route, { robot: { currentState: "IDLE", stateChangedAt: "2026-09-09T04:20:00Z", batteryPercent: 86, batteryMeasuredAt: "2026-09-09T04:20:00Z" }, devices: [] });
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
        date: url.searchParams.get("date") ?? "2026-09-09",
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
        { alertId: "alert-1", plantId: plant.plantId, plantName: plant.name, metricType: "DAILY_LIGHT", deviation: "LOW", measuredValue: 168200, occurredAt: "2026-09-08T02:00:00Z", resolvedAt: "2026-09-08T07:20:00Z", active: false, read: false },
        { alertId: "alert-2", plantId: plant.plantId, plantName: plant.name, metricType: "STATION_WATER_LOW", deviation: "LOW", measuredValue: null, occurredAt: "2026-09-07T23:15:00Z", resolvedAt: null, active: true, read: false },
      ];
      return json(route, { alerts, unreadCount: 2, page: 0, size: 100, totalElements: 2, totalPages: 1 });
    }
    if (path === "blooms") {
      return json(route, { blooms: [
        { bloomId: "bloom-1", plantId: plant.plantId, plantName: plant.name, bloomDate: "2026-09-07", source: "VISION", read: true, note: "첫 번째 꽃이 피었어요" },
        { bloomId: "bloom-2", plantId: plant.plantId, plantName: plant.name, bloomDate: "2026-09-09", source: "VISION", read: false, note: "두 번째 꽃봉오리가 열렸어요" },
      ] });
    }
    if (path === "robots") {
      return json(route, { robots: [{ robotId: "robot-1", deviceUid: "potner-rover-01", name: "포트너 로봇", connectionStatus: "ONLINE", lastSeenAt: "2026-09-09T04:21:00Z", batteryPercent: 86, firmwareVersion: "1.4.2", assignedPlantId: plant.plantId, assignedPlantName: plant.name, devices: [
        { deviceUid: "potner-pi-01", deviceType: "RASPBERRY_PI", connectionStatus: "ONLINE", lastSeenAt: "2026-09-09T04:21:00Z" },
        { deviceUid: "potner-jetson-01", deviceType: "JETSON_ORIN", connectionStatus: "ONLINE", lastSeenAt: "2026-09-09T04:21:00Z" },
      ] }] });
    }

    if (request.method() !== "GET") return route.fulfill({ status: 204, body: "" });
    console.warn(`Unhandled mock GET: ${url.pathname}${url.search}`);
    return json(route, {});
  });
}

async function enableFlutterSemantics(page) {
  const candidates = [
    page.locator('[aria-label="Enable accessibility"]'),
    page.locator("flt-semantics-placeholder"),
  ];
  for (const candidate of candidates) {
    if (await candidate.count()) {
      // Flutter keeps this activation node just outside the painted viewport.
      // Dispatching its native click avoids Playwright's viewport guard while
      // still enabling the framework's own semantics tree.
      await candidate.first().evaluate((element) => element.click());
      await page.waitForTimeout(400);
      return;
    }
  }
}

async function waitForFlutter(page) {
  await page.waitForFunction(() => document.querySelector("flutter-view") || document.querySelector("flt-glass-pane"));
  await page.waitForTimeout(1_800);
  await page.evaluate(() => document.fonts.ready);
}

async function capture(page, hashPath, filename) {
  await page.goto(`${APP_URL}/#${hashPath}`, { waitUntil: "networkidle" });
  await waitForFlutter(page);
  await enableFlutterSemantics(page);
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(OUTPUT_DIR, filename) });
  console.log(`✓ ${join(OUTPUT_DIR, filename)}`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const server = await serveFlutter();
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

try {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    locale: "ko-KR",
    colorScheme: "light",
    timezoneId: "Asia/Seoul",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => console.error(`Page error: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") console.error(`Browser: ${message.text()}`);
  });
  await installFixtures(page);

  await capture(page, "/login", "login.png");

  const inputs = page.locator("input");
  await inputs.nth(0).fill("potner@portfolio.local");
  await inputs.nth(1).fill("potner1234!");
  await page.getByText("로그인", { exact: true }).last().click();
  await page.waitForTimeout(2_500);
  await page.screenshot({ path: join(OUTPUT_DIR, "overview.png") });
  console.log(`✓ ${join(OUTPUT_DIR, "overview.png")}`);

  await capture(page, "/plants/plant-roji/environment", "environment.png");
  await capture(page, "/growth/diary/plant-roji/diary-0909", "diary.png");
  await capture(page, "/growth/compare", "growth-comparison.png");

  await context.close();
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
