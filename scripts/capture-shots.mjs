/**
 * Regenerates the demo screenshots in public/shots.
 *
 *   npm run dev                       # in another terminal
 *   node scripts/capture-shots.mjs
 *
 * Uses the Chrome already installed on the machine (override with CHROME_PATH)
 * rather than downloading a browser. Point it elsewhere with BASE_URL.
 *
 * Captures exactly the images the site references — the home-card `preview`
 * in src/content/projects/*.ts plus the README gallery. Each screen is driven
 * into a meaningful state before the shot (signalling finished, queries fired,
 * pipeline complete) so the image shows the demo actually doing something.
 *
 * To add a screen: append an entry with its `tab` index, matching the order of
 * that project's `demo` array in src/content/projects/<slug>.ts.
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import path from "node:path";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = process.argv[2] || "./public/shots";

const wait = (page, ms) => page.waitForTimeout(ms);

/** `tab` is the index into that project's `demo` array. */
const SHOTS = [
  {
    slug: "saybridge",
    id: "video",
    tab: 2,
    // Run the "before" order so the remote tile ends up genuinely black.
    prep: async (shell, page) => {
      await shell.getByRole("button", { name: "시그널링 실행" }).click();
      await wait(page, 7500);
    },
  },
  { slug: "saybridge", id: "homework", tab: 3 },
  { slug: "glople", id: "keyword", tab: 2 },
  {
    slug: "bluememories",
    id: "write",
    tab: 0,
    prep: async (shell, page) => {
      await shell.getByRole("button", { name: "저장하고 분석" }).click();
      await wait(page, 900);
    },
  },
  {
    slug: "bluememories",
    id: "recommend",
    tab: 2,
    prep: async (shell, page) => {
      await shell.getByRole("button", { name: "추천 요청" }).click();
      await wait(page, 900);
    },
  },
  {
    slug: "neoulteo",
    id: "attractions",
    tab: 1,
    prep: async (shell, page) => {
      await shell.getByRole("button", { name: "경복궁" }).first().click();
      await wait(page, 600);
    },
  },
  {
    slug: "neoulteo",
    id: "ai",
    tab: 5,
    prep: async (shell, page) => {
      await shell.getByRole("button", { name: /가을에 강원도에서/ }).click();
      await wait(page, 5000);
    },
  },
  {
    slug: "mofy",
    id: "palette",
    tab: 0,
    prep: async (shell, page) => {
      await shell.getByRole("button", { name: "분석 시작" }).click();
      await wait(page, 4200);
    },
  },
];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
  locale: "ko-KR",
});

mkdirSync(OUT, { recursive: true });
let failed = 0;

for (const shot of SHOTS) {
  // Reload per screen so prep steps never leak between shots.
  await page.goto(`${BASE}/projects/${shot.slug}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const shell = page.locator("[data-demo-shell]").first();
  await shell.waitFor({ state: "visible" });
  await shell.getByRole("tab").nth(shot.tab).click();
  await wait(page, 500);

  if (shot.prep) {
    try {
      await shot.prep(shell, page);
    } catch (e) {
      failed++;
      console.log(`  ! prep failed ${shot.slug}/${shot.id}: ${e.message.split("\n")[0]}`);
    }
  }
  await wait(page, 400);

  await shell.scrollIntoViewIfNeeded();
  await shell.screenshot({ path: path.join(OUT, `${shot.slug}-${shot.id}.png`) });
  console.log(`  ✓ ${shot.slug}-${shot.id}.png`);
}

// AWS Deploy has no UI — capture its troubleshooting write-up so the home card
// shows real page content instead of a fabricated app screen.
await page.goto(`${BASE}/projects/aws-deploy`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const trouble = page.locator("#troubleshooting .space-y-8").first();
await trouble.scrollIntoViewIfNeeded();
await wait(page, 500);
await trouble.screenshot({ path: path.join(OUT, "aws-deploy-troubleshooting.png") });
console.log("  ✓ aws-deploy-troubleshooting.png");

await browser.close();
console.log(`\n${SHOTS.length + 1} shots -> ${OUT}${failed ? ` (${failed} prep failures)` : ""}`);
process.exit(failed ? 1 : 0);
