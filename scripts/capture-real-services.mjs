/**
 * Portfolio capture harness for the real project frontends.
 *
 * This file deliberately lives outside the service repositories. It serves each
 * production build, fulfils only backend/API requests with contract-shaped local
 * fixtures, and captures the UI rendered by the original React source.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";

const ROOT = "C:/Users/SSAFY";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const VIEWPORT = { width: 1440, height: 900 };

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
  ".otf": "font/otf",
};

function serveSpa(buildDir, port, fixtures = {}) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    if (fixtures[url.pathname]) {
      const fixturePath = fixtures[url.pathname];
      res.writeHead(200, { "content-type": mime[extname(fixturePath)] ?? "application/octet-stream" });
      res.end(readFileSync(fixturePath));
      return;
    }

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

const courses = [
  { id: 1, teacherId: 10, teacherName: "Emma Wilson", title: "English Conversation Lab", description: "뉴스와 일상 주제로 자연스럽게 말하는 실전 회화 수업", maxStudents: 8, language: "ENGLISH", level: "INTERMEDIATE" },
  { id: 2, teacherId: 11, teacherName: "Yuki Tanaka", title: "Travel Japanese", description: "여행지에서 바로 쓰는 일본어 표현과 롤플레잉", maxStudents: 6, language: "JAPANESE", level: "BEGINNER" },
  { id: 3, teacherId: 12, teacherName: "Lucía García", title: "Spanish Speaking Club", description: "문화 이야기와 함께 배우는 스페인어 회화", maxStudents: 10, language: "SPANISH", level: "BEGINNER" },
];

const blueImage = (name) => `http://127.0.0.1:3103/fixture/${name}`;
const blueDiaries = [
  { id: 101, title: "비 온 뒤 맑아진 오후", nickname: "초록별", imageUrl: blueImage("diary.png") },
  { id: 102, title: "작은 용기를 낸 하루", nickname: "달빛기록", imageUrl: blueImage("community.png") },
  { id: 103, title: "친구와 걷던 저녁길", nickname: "느린구름", imageUrl: blueImage("shared.png") },
  { id: 104, title: "나에게 보내는 응원", nickname: "마음산책", imageUrl: blueImage("recommend.png") },
  { id: 105, title: "고마운 순간 세 가지", nickname: "새벽편지", imageUrl: blueImage("community.png") },
  { id: 106, title: "주말의 따뜻한 햇살", nickname: "푸른하루", imageUrl: blueImage("diary.png") },
];

function json(route, data) {
  return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(data) });
}

async function mockSayBridge(page) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    const apiIndex = url.pathname.indexOf("/api/");
    if (apiIndex < 0) return route.continue();
    const path = url.pathname.slice(apiIndex + 4);
    if (path === "/user/me") return json(route, { id: 200, username: "portfolio@student.dev", email: "portfolio@student.dev", nickname: "민서", role: "STUDENT", profileImageUrl: "" });
    if (path === "/course/1") return json(route, courses[0]);
    if (path === "/course" || path.startsWith("/course/search")) return json(route, { content: courses });
    if (path === "/course/student/list") return json(route, courses);
    if (path === "/teacher/10") return json(route, { userId: 10, nickname: "Emma Wilson", description: "말할 기회를 많이 만드는 회화 전문 강사" });
    if (path === "/post/1") return json(route, [
      { postId: 501, title: "Week 4 · News discussion", content: "관심 있는 영문 뉴스 한 편을 고르고 핵심 내용을 2분 동안 설명해 주세요.", created: "2026-09-07T10:30:00", attachmentUrl: "https://example.test/week4-guide.pdf" },
      { postId: 502, title: "Pronunciation clinic", content: "수업에서 연습한 문장을 녹음해 제출해 주세요. 강세와 연결 발음을 확인합니다.", created: "2026-09-04T16:00:00", attachmentUrl: "" },
      { postId: 503, title: "Next live class", content: "다음 수업 주제는 Sustainable Travel입니다. 찬반 의견을 각각 준비해 주세요.", created: "2026-09-01T09:00:00", attachmentUrl: "" },
    ]);
    if (path.startsWith("/application/check/")) return json(route, false);
    if (path.startsWith("/enrollment/check/")) return json(route, true);
    if (path.startsWith("/homework/submissions")) return json(route, { 501: "https://example.test/minseo-week4.pdf", 502: "https://example.test/minseo-audio.mp3" });
    if (path === "/review/my-reviews") return json(route, [
      { id: 801, courseId: 2, courseTitle: "Travel Japanese", rating: 5, content: "여행 상황별 롤플레잉이 실용적이었어요." },
      { id: 802, courseId: 3, courseTitle: "Spanish Speaking Club", rating: 4, content: "매주 말하기 주제가 다양해서 좋았습니다." },
    ]);
    return json(route, {});
  });
}

async function mockGlople(page) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/api/info-recommend")) return json(route, [
      { age: 29, gender: "여성", mbti: "ENFP", travelDestinations: ["바르셀로나", "리스본", "제주"] },
      { age: 31, gender: "남성", mbti: "ENFJ", travelDestinations: ["교토", "프라하", "부산"] },
      { age: 27, gender: "여성", mbti: "INFP", travelDestinations: ["피렌체", "삿포로", "강릉"] },
    ]);
    return json(route, []);
  });
}

async function mockBlueMemories(page) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/user-info") return json(route, { id: 1, nickname: "초록별", userId: "portfolio" });
    if (/\/api\/diaries\/\d{4}\/\d{1,2}$/.test(path)) return json(route, [
      { id: 101, date: "2026-09-01", sentiment: "positive" },
      { id: 102, date: "2026-09-03", sentiment: "neutral" },
      { id: 103, date: "2026-09-05", sentiment: "positive" },
      { id: 104, date: "2026-09-08", sentiment: "positive" },
      { id: 105, date: "2026-09-11", sentiment: "negative" },
      { id: 106, date: "2026-09-14", sentiment: "neutral" },
      { id: 107, date: "2026-09-17", sentiment: "positive" },
      { id: 108, date: "2026-09-20", sentiment: "positive" },
      { id: 109, date: "2026-09-23", sentiment: "neutral" },
      { id: 110, date: "2026-09-27", sentiment: "negative" },
    ]);
    if (path === "/api/diaries/users") return json(route, blueDiaries);
    if (path === "/api/get-diary/101") return json(route, {
      id: 101, nickname: "초록별", title: "비 온 뒤 맑아진 오후", content: "오전에는 일이 마음처럼 풀리지 않아 속상했다.\n점심 무렵 비가 그치고 햇살이 들어와 잠시 산책했다.\n천천히 걷고 나니 복잡했던 마음도 한결 가벼워졌다.", weather: "맑음", date: "2026-09-01", positive: 76, neutral: 18, negative: 6, confidence: "positive", likeNum: 24, imageUrl: blueImage("diary.png"), keyword1: "5qap5aO4i9A", keyword2: "hLQl3WQQoQ0", keyword3: "kJQP7kiw5Fk", keyword4: "RgKAFK5djSk"
    });
    if (path === "/api/get-like/101") return json(route, true);
    if (path === "/api/get-comments/101") return json(route, [
      { nickname: "마음산책", content: "비 온 뒤의 공기처럼 마음도 맑아졌네요." },
      { nickname: "달빛기록", content: "짧은 산책이 큰 위로가 되는 날이 있어요." },
    ]);
    return json(route, {});
  });
}

async function shot(page, url, output, setup) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (setup) await setup(page);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: output });
  console.log(`✓ ${output}`);
}

const out = join(ROOT, "portfolio/public/projects");
for (const slug of ["saybridge", "glople", "bluememories"]) mkdirSync(join(out, slug), { recursive: true });

const servers = await Promise.all([
  serveSpa(join(ROOT, "pjt/SayBridge/frontend/build"), 3101),
  serveSpa(join(ROOT, "pjt/Glople/frontend/build"), 3102),
  serveSpa(join(ROOT, "pjt/BlueMemories/frontend/build"), 3103, {
    "/fixture/diary.png": join(ROOT, "pjt/BlueMemories/frontend/src/pages/main/image/diary.png"),
    "/fixture/community.png": join(ROOT, "pjt/BlueMemories/frontend/src/pages/main/image/community.png"),
    "/fixture/shared.png": join(ROOT, "pjt/BlueMemories/frontend/src/pages/main/image/sharedDiary.png"),
    "/fixture/recommend.png": join(ROOT, "pjt/BlueMemories/frontend/src/pages/main/image/todayRecommend.png"),
  }),
]);

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
try {
  const say = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1, locale: "ko-KR", colorScheme: "light" });
  say.on("pageerror", (error) => console.error(`SayBridge page error: ${error.message}`));
  await mockSayBridge(say);
  await shot(say, "http://127.0.0.1:3101/", join(out, "saybridge/overview.png"));
  await shot(say, "http://127.0.0.1:3101/courselist", join(out, "saybridge/courses.png"));
  await shot(say, "http://127.0.0.1:3101/course/1", join(out, "saybridge/course-detail.png"));
  await shot(say, "http://127.0.0.1:3101/mypage", join(out, "saybridge/mypage.png"));

  const glople = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1, locale: "ko-KR", colorScheme: "light" });
  await mockGlople(glople);
  await shot(glople, "http://127.0.0.1:3102/", join(out, "glople/overview.png"));
  await shot(glople, "http://127.0.0.1:3102/keyword", join(out, "glople/keyword-selection.png"), async (page) => {
    for (const label of ["자연", "야경", "박물관", "카페", "하이킹"]) {
      const button = page.getByRole("button", { name: label, exact: true });
      if (await button.count()) await button.first().click();
    }
  });
  await shot(glople, "http://127.0.0.1:3102/cosine", join(out, "glople/mbti-recommendation.png"), async (page) => {
    await page.getByPlaceholder("나이").fill("30");
    await page.getByPlaceholder("성별").fill("여성");
    await page.getByPlaceholder("MBTI").fill("ENFP");
    await page.getByRole("button", { name: "추천 받기" }).click();
  });

  const blue = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1, locale: "ko-KR", colorScheme: "light" });
  await mockBlueMemories(blue);
  await blue.context().addCookies([{ name: "token", value: "portfolio-local-token", domain: "127.0.0.1", path: "/" }]);
  await shot(blue, "http://127.0.0.1:3103/", join(out, "bluememories/overview.png"));
  await shot(blue, "http://127.0.0.1:3103/calendar", join(out, "bluememories/calendar.png"));
  await shot(blue, "http://127.0.0.1:3103/community", join(out, "bluememories/community.png"));
  await shot(blue, "http://127.0.0.1:3103/community", join(out, "bluememories/detail.png"), async (page) => {
    await page.getByText("비 온 뒤 맑아진 오후", { exact: true }).click();
    await page.waitForLoadState("networkidle");
  });
} finally {
  await browser.close();
  await Promise.all(servers.map((server) => new Promise((resolve) => server.close(resolve))));
}
