/**
 * Capture harness for the original MOFY and Neoulteo frontends.
 *
 * The service repositories are only run/served. Contract-shaped API fixtures and
 * capture-only media live here so portfolio data never leaks into service code.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";

const ROOT = "C:/Users/SSAFY";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const VIEWPORT = { width: 1440, height: 900 };
const MOFY_URL = "http://127.0.0.1:3104";
const NEOULTEO_URL = "http://127.0.0.1:3105";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function serveSpa(buildDir, port) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const candidate = normalize(join(buildDir, relative || "index.html"));
    const file = candidate.startsWith(normalize(buildDir)) && existsSync(candidate)
      ? candidate
      : join(buildDir, "index.html");
    res.writeHead(200, { "content-type": mime[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

function startNextDev() {
  const cwd = join(ROOT, "pjt/Mofy/frontend");
  const child = spawn(
    process.execPath,
    [join(cwd, "node_modules/next/dist/bin/next"), "dev", "-p", "3104"],
    { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
  );
  child.stdout.on("data", (data) => process.stdout.write(`[MOFY] ${data}`));
  child.stderr.on("data", (data) => process.stderr.write(`[MOFY] ${data}`));
  return child;
}

function temporarilyDisableUnusedMofyImageImport() {
  const path = join(ROOT, "pjt/Mofy/frontend/styles/mainPageStyle.js");
  const original = readFileSync(path);
  const source = original.toString("utf8");
  const unusedImport = "import backgroundImage from '../public/images/backgroundImg.jpg'";
  if (!source.includes(unusedImport)) {
    throw new Error(`Expected MOFY compatibility marker was not found in ${path}`);
  }
  writeFileSync(path, source.replace(unusedImport, ""));
  return { path, original };
}

async function waitFor(url, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function json(route, data) {
  return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(data) });
}

const communityBoards = [
  { boardID: 31, title: "가을 옷장 정리, 오래 입는 니트 관리법", datetime: "2026-09-08T09:15:00", boardType: 1 },
  { boardID: 32, title: "웜톤 데일리 메이크업 컬러 추천해요", datetime: "2026-09-07T19:40:00", boardType: 1 },
  { boardID: 33, title: "출근룩과 주말룩을 같이 돌려 입는 방법", datetime: "2026-09-06T14:20:00", boardType: 1 },
  { boardID: 34, title: "이번 주 패션 전시 같이 보러 가실 분", datetime: "2026-09-05T11:05:00", boardType: 1 },
  { boardID: 35, title: "체형별 데님 핏 고르는 팁 공유", datetime: "2026-09-04T08:30:00", boardType: 1 },
  { boardID: 36, title: "미니멀 룩에 포인트 주는 액세서리", datetime: "2026-09-03T16:00:00", boardType: 1 },
];

const styleBoards = [
  { boardID: 1, title: "라벤더 셔츠로 완성한 소프트 데일리룩", datetime: "2026-09-08T11:30:00", boardType: 2 },
  { boardID: 2, title: "간절기 브라운 재킷 레이어드", datetime: "2026-09-07T17:10:00", boardType: 2 },
  { boardID: 3, title: "주말 성수동 데님 스타일링", datetime: "2026-09-06T13:40:00", boardType: 2 },
  { boardID: 4, title: "톤온톤으로 입어 본 출근 코디", datetime: "2026-09-05T09:20:00", boardType: 2 },
  { boardID: 5, title: "스니커즈 중심의 편안한 캠퍼스룩", datetime: "2026-09-04T15:55:00", boardType: 2 },
  { boardID: 6, title: "빈티지 셔츠와 와이드 팬츠 조합", datetime: "2026-09-03T18:25:00", boardType: 2 },
  { boardID: 7, title: "여름쿨톤을 위한 블루 포인트 룩", datetime: "2026-09-02T10:10:00", boardType: 2 },
];

const marketBoards = [
  { boardID: 21, title: "아워레가시 베이지 오버셔츠 M", price: 128000, state: true, datetime: "2026-09-08T10:00:00", boardType: 3 },
  { boardID: 22, title: "COS 울 블렌드 가디건 크림", price: 68000, state: true, datetime: "2026-09-07T20:30:00", boardType: 3 },
  { boardID: 23, title: "뉴발란스 530 실버 245", price: 74000, state: true, datetime: "2026-09-07T12:15:00", boardType: 3 },
  { boardID: 24, title: "빈티지 레더 숄더백 브라운", price: 49000, state: false, datetime: "2026-09-06T16:40:00", boardType: 3 },
  { boardID: 25, title: "유니클로 U 와이드 데님 28", price: 32000, state: true, datetime: "2026-09-05T13:05:00", boardType: 3 },
  { boardID: 26, title: "마르디 메크르디 스웨트셔츠", price: 42000, state: false, datetime: "2026-09-04T09:50:00", boardType: 3 },
];

const lookSources = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=88",
];

async function loadLookFixtures() {
  const fallback = readFileSync(join(ROOT, "pjt/Mofy/frontend/public/images/firstImg.jpg"));
  const fixtures = new Map();
  await Promise.all(lookSources.map(async (url, index) => {
    try {
      const response = await fetch(url);
      fixtures.set(`/fixture/look${index + 1}.jpg`, Buffer.from(await response.arrayBuffer()));
    } catch {
      fixtures.set(`/fixture/look${index + 1}.jpg`, fallback);
    }
  }));
  return fixtures;
}

async function mockMofy(page, lookFixtures) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "api.openweathermap.org") {
      return json(route, { main: { temp: 22.8 }, weather: [{ description: "맑고 선선함" }] });
    }
    if (!(["127.0.0.1", "localhost"].includes(url.hostname) && url.port === "8000")) {
      return route.continue();
    }

    if (lookFixtures.has(url.pathname)) {
      return route.fulfill({ status: 200, contentType: "image/jpeg", body: lookFixtures.get(url.pathname) });
    }
    if (/^\/board\/stylerank\/[1-4]\/$/.test(url.pathname)) {
      const rank = Number(url.pathname.split("/")[3]);
      return json(route, {
        image: `/fixture/look${rank}.jpg`,
        boardID: rank,
        usr_name: ["민서의 옷장", "온더무드", "윤슬", "소프트데이"][rank - 1],
      });
    }
    if (url.pathname === "/boardType/1/") return json(route, communityBoards);
    if (url.pathname === "/boardType/2/") return json(route, styleBoards);
    if (url.pathname === "/boardType/3/") return json(route, marketBoards);
    if (url.pathname === "/userinfo/") return json(route, { id: 1, username: "김민서", userID: "minseo" });
    if (url.pathname === "/user_image/") {
      return json(route, { profile_image_url: "http://127.0.0.1:8000/fixture/look5.jpg" });
    }
    if (url.pathname === "/search/suggestions/") {
      return json(route, {
        suggest_results1: "라벤더 셔츠",
        suggest_results2: "가을 데일리룩",
        suggest_results3: "소프트톤",
        suggest_results4: "와이드 데님",
        suggest_results5: "빈티지 가방",
      });
    }
    if (url.pathname === "/search/history/") {
      return json(route, ["니트", "데님", "출근룩", "스니커즈", "가디건"].map((query) => ({ query })));
    }
    if (url.pathname === "/search/popular/") {
      return json(route, {
        popular_results1: "가을 코디",
        popular_results2: "중고 재킷",
        popular_results3: "여름쿨톤",
        popular_results4: "OOTD",
        popular_results5: "데님",
      });
    }
    if (url.pathname === "/search/") return json(route, []);
    if (/^\/board\/\d+\/$/.test(url.pathname)) {
      const boardID = Number(url.pathname.split("/")[2]);
      return json(route, {
        boardID,
        title: "라벤더 셔츠로 완성한 소프트 데일리룩",
        content: "차분한 라벤더 셔츠에 크림 톤 팬츠를 매치했습니다. 가방과 슈즈는 브라운으로 맞춰 부드러운 분위기를 살렸어요.",
        boardType: 2,
        datetime: "2026-09-08T11:30:00",
        image: "/fixture/look1.jpg",
        like_num: 48,
        tags: "소프트톤,라벤더,데일리룩,가을코디",
      });
    }
    return json(route, {});
  });
}

const tourImages = {
  haeundae: "https://tong.visitkorea.or.kr/cms/resource/34/3090534_image2_1.JPG",
  gamcheon: "https://tong.visitkorea.or.kr/cms/resource/91/3365491_image2_1.jpg",
  gwangalli: "https://tong.visitkorea.or.kr/cms/resource/45/3311245_image2_1.jpg",
  oryukdo: "https://tong.visitkorea.or.kr/cms/resource/69/3492369_image2_1.jpg",
  seoul: "https://tong.visitkorea.or.kr/cms/resource/98/3487598_image2_1.jpg",
};

const neoulteoHotplaces = [
  { id: 1, attractionContentId: 99001, writerName: "여행러 민서", date: "2026-08-28", description: "해 질 무렵 산책하기 좋고 주변 맛집까지 이어 가기 편해요.", name: "해운대해수욕장", address: "부산광역시 해운대구 해운대해변로 264", imageUrl: tourImages.haeundae, type: "관광지", areaCode: 6, hotplaceCount: 18 },
  { id: 2, attractionContentId: 99001, writerName: "바다러버 하윤", date: "2026-08-21", description: "아침 바다는 한적해서 사진 찍기 특히 좋았습니다.", name: "해운대해수욕장", address: "부산광역시 해운대구 해운대해변로 264", imageUrl: tourImages.haeundae, type: "관광지", areaCode: 6, hotplaceCount: 18 },
  { id: 3, attractionContentId: 99002, writerName: "사진여행 라온", date: "2026-08-24", description: "알록달록한 골목마다 작은 전시와 전망 포인트가 이어집니다.", name: "감천문화마을", address: "부산광역시 사하구 감내2로 203", imageUrl: tourImages.gamcheon, type: "문화시설", areaCode: 6, hotplaceCount: 15 },
  { id: 4, attractionContentId: 99007, writerName: "야경수집 하린", date: "2026-08-19", description: "광안대교가 켜지는 시간에 맞춰 방문하면 야경이 멋져요.", name: "광안리해수욕장", address: "부산광역시 수영구 광안해변로 219", imageUrl: tourImages.gwangalli, type: "관광지", areaCode: 6, hotplaceCount: 14 },
  { id: 5, attractionContentId: 99009, writerName: "도보여행 준호", date: "2026-08-15", description: "해안 산책로와 함께 묶으면 반나절 코스로 알찹니다.", name: "오륙도스카이워크", address: "부산광역시 남구 오륙도로 137", imageUrl: tourImages.oryukdo, type: "레포츠", areaCode: 6, hotplaceCount: 11 },
  { id: 6, attractionContentId: 99018, writerName: "문화산책 은우", date: "2026-08-12", description: "한복을 입고 천천히 궁궐을 둘러보기 좋은 서울 대표 코스예요.", name: "경복궁", address: "서울특별시 종로구 사직로 161", imageUrl: tourImages.seoul, type: "문화시설", areaCode: 1, hotplaceCount: 12 },
  { id: 7, attractionContentId: 99002, writerName: "로컬탐방 도윤", date: "2026-08-10", description: "이른 오전에 가면 골목의 색과 바다 풍경을 여유롭게 볼 수 있어요.", name: "감천문화마을", address: "부산광역시 사하구 감내2로 203", imageUrl: tourImages.gamcheon, type: "문화시설", areaCode: 6, hotplaceCount: 15 },
];

const posts = [
  { id: 93001, userId: 9001, userName: "여행러 민서", category: "PLAN_SHARE", title: "부산 1박2일 바다 여행 코스 공유합니다", content: "해운대와 광안리를 먼저 보고 다음 날 감천문화마을을 천천히 걷는 코스입니다.", travelPlanId: "DEMO-BUSAN-2D", views: 142, likeCount: 36, commentCount: 8, createdAt: "2026-09-08T10:10:00" },
  { id: 93003, userId: 9003, userName: "맛집헌터 지훈", category: "REVIEW", title: "[핫플 추천] 해운대해수욕장", content: "부산역에서 이동하기 편하고 주변 맛집이 많아 여행 첫날 코스로 좋았습니다. 해 질 무렵 해변을 걷고 시장까지 이어지는 동선도 추천해요.", imageUrl: tourImages.haeundae, views: 118, likeCount: 29, commentCount: 6, createdAt: "2026-09-07T19:20:00" },
  { id: 93005, userId: 9005, userName: "야경수집 하린", category: "PLAN_SHARE", title: "서울 궁궐과 야경 1박2일", content: "경복궁, 북촌, 남산을 묶은 서울 도심 코스입니다.", travelPlanId: "DEMO-SEOUL-2D", views: 139, likeCount: 31, commentCount: 7, createdAt: "2026-09-06T18:00:00" },
  { id: 93010, userId: 9010, userName: "혼행러 시오", category: "REVIEW", title: "[핫플 추천] 광안리해수욕장", content: "광안대교 야경이 좋아 저녁 일정으로 추천합니다.", views: 128, likeCount: 24, commentCount: 4, createdAt: "2026-09-05T21:00:00" },
  { id: 93018, userId: 9018, userName: "계획공유 유나", category: "FREE", title: "여행 계획 공유 코드 기능 좋네요", content: "마음에 드는 여행 코스를 코드로 가져올 수 있어서 편합니다.", views: 76, likeCount: 17, commentCount: 5, createdAt: "2026-09-04T18:30:00" },
  { id: 93019, userId: 9019, userName: "전국도장 지호", category: "FREE", title: "AI 코스 평가 써본 후기", content: "장소가 너무 많은 날을 알려줘서 코스를 줄이는 데 도움이 됐습니다.", views: 82, likeCount: 20, commentCount: 3, createdAt: "2026-09-03T11:50:00" },
  { id: 93020, userId: 9020, userName: "숨은명소 다인", category: "QNA", title: "부산 비 오는 날 어디가 좋을까요?", content: "실내 위주로 갈 만한 부산 코스를 추천받고 싶습니다.", views: 63, likeCount: 9, commentCount: 9, createdAt: "2026-09-02T19:20:00" },
  { id: 93024, userId: 9004, userName: "너울터 운영팀", category: "NOTICE", title: "가을 여행 추천 데이터가 업데이트되었습니다", content: "지역별 관광지와 인기 핫플레이스 정보를 새로 반영했습니다.", views: 163, likeCount: 42, commentCount: 2, createdAt: "2026-09-01T09:00:00" },
];

async function mockNeoulteo(page) {
  await page.addInitScript(() => localStorage.setItem("neoulteo.jwt", "portfolio-local-token"));
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/users/me") {
      return json(route, { success: true, id: 9001, name: "여행러 민서", email: "demo1@neoulteo.test" });
    }
    if (url.pathname === "/api/hotplaces/popular") {
      const regionItems = url.searchParams.get("areaCode") === "6"
        ? neoulteoHotplaces.filter((item) => item.areaCode === 6)
        : neoulteoHotplaces;
      return json(route, { items: regionItems.slice(0, Number(url.searchParams.get("limit") || 5)) });
    }
    if (url.pathname === "/api/hotplaces") {
      const areaCode = url.searchParams.get("areaCode");
      return json(route, { items: areaCode ? neoulteoHotplaces.filter((item) => String(item.areaCode) === areaCode) : neoulteoHotplaces });
    }
    if (url.pathname === "/api/posts/93003/comments") {
      return json(route, { items: [
        { id: 1, userId: 9002, userName: "바다러버 하윤", content: "저녁에 광안리까지 이어서 가도 동선이 좋더라고요!", createdAt: "2026-09-08T09:10:00" },
        { id: 2, userId: 9007, userName: "카페투어 수아", content: "주변 카페 정보도 참고해서 다음 일정에 넣어볼게요.", createdAt: "2026-09-08T08:25:00" },
        { id: 3, userId: 9016, userName: "감성기록 나은", content: "해 질 무렵 사진이 정말 예쁘게 나오는 곳이에요.", createdAt: "2026-09-07T22:40:00" },
      ] });
    }
    if (url.pathname === "/api/posts/93003") return json(route, posts.find((post) => post.id === 93003));
    if (url.pathname === "/api/posts") return json(route, { posts });
    if (url.pathname === "/api/saved-places") return json(route, { items: [] });
    return json(route, {});
  });
}

async function shot(page, url, output, setup) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (setup) await setup(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1_200);
  await page.screenshot({ path: output });
  console.log(`✓ ${output}`);
}

const out = join(ROOT, "portfolio/public/projects");
for (const slug of ["mofy", "neoulteo"]) mkdirSync(join(out, slug), { recursive: true });

const lookFixtures = await loadLookFixtures();
const mofyCompatibility = temporarilyDisableUnusedMofyImageImport();
let mofyServer;
let neoulteoServer;

try {
  mofyServer = startNextDev();
  neoulteoServer = await serveSpa(join(ROOT, "pjt/neoulteo/frontend/dist"), 3105);
  await waitFor(`${MOFY_URL}/mks/login`);
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  try {
    const login = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1, locale: "ko-KR", colorScheme: "light" });
    await mockMofy(login, lookFixtures);
    await shot(login, `${MOFY_URL}/mks/login`, join(out, "mofy/login.png"));

    const mofy = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1, locale: "ko-KR", colorScheme: "light", geolocation: { latitude: 37.5665, longitude: 126.978 } });
    await mofy.context().grantPermissions(["geolocation"], { origin: MOFY_URL });
    await mofy.context().addCookies([{ name: "access_token", value: "portfolio-local-token", domain: "127.0.0.1", path: "/" }]);
    await mockMofy(mofy, lookFixtures);
    mofy.on("pageerror", (error) => console.error(`MOFY page error: ${error.message}`));
    await shot(mofy, `${MOFY_URL}/mainPage`, join(out, "mofy/overview.png"));
    await shot(mofy, `${MOFY_URL}/styleBoard`, join(out, "mofy/style-board.png"));
    await shot(mofy, `${MOFY_URL}/marketBoard`, join(out, "mofy/market.png"));
    await shot(mofy, `${MOFY_URL}/styleBoard`, join(out, "mofy/style-detail.png"), async (page) => {
      await page.locator('[id="1"]').evaluate((element) => element.click());
      await page.waitForURL("**/styleBoard/1");
      await page.waitForLoadState("networkidle");
    });

    const neoulteo = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1, locale: "ko-KR", colorScheme: "light" });
    await mockNeoulteo(neoulteo);
    neoulteo.on("pageerror", (error) => console.error(`Neoulteo page error: ${error.message}`));
    await shot(neoulteo, `${NEOULTEO_URL}/`, join(out, "neoulteo/overview.png"), async (page) => {
      await page.getByRole("button", { name: "시작하기" }).click();
      await page.getByRole("button", { name: /부산광역시 선택/ }).click();
    });
    await shot(neoulteo, `${NEOULTEO_URL}/hotplaces`, join(out, "neoulteo/hotplaces.png"));
    await shot(neoulteo, `${NEOULTEO_URL}/community`, join(out, "neoulteo/community.png"));
    await shot(neoulteo, `${NEOULTEO_URL}/community/93003`, join(out, "neoulteo/detail.png"));
  } finally {
    await browser.close();
  }
} finally {
  if (mofyServer) mofyServer.kill();
  if (neoulteoServer) await new Promise((resolve) => neoulteoServer.close(resolve));
  writeFileSync(mofyCompatibility.path, mofyCompatibility.original);
}
