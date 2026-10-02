import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const base = process.env.PORTFOLIO_BASE_URL ?? "http://localhost:3100";
const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const out = "tmp/portfolio-qa";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const cases = [
  { name: "home-desktop", path: "/", width: 1440, height: 900 },
  { name: "home-tablet", path: "/", width: 768, height: 1024 },
  { name: "home-mobile", path: "/", width: 390, height: 844 },
  { name: "saeroi-desktop", path: "/projects/saeroi", width: 1440, height: 900 },
  { name: "saeroi-mobile", path: "/projects/saeroi", width: 390, height: 844 },
  ...["potner", "neoulteo", "saybridge", "glople", "bluememories", "mofy", "aws-deploy"].map((slug) => ({
    name: `${slug}-mobile`, path: `/projects/${slug}`, width: 390, height: 844, screenshot: false,
  })),
];

let failed = false;
for (const item of cases) {
  const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, locale: "ko-KR" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const response = await page.goto(`${base}${item.path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const images = page.locator("img");
  for (let index = 0; index < await images.count(); index++) {
    await images.nth(index).scrollIntoViewIfNeeded();
    await images.nth(index).evaluate(async (image) => {
      if (image.complete && image.naturalWidth > 0) return;
      await new Promise((resolve) => {
        const timeout = window.setTimeout(resolve, 5000);
        image.addEventListener("load", () => { window.clearTimeout(timeout); resolve(); }, { once: true });
        image.addEventListener("error", () => { window.clearTimeout(timeout); resolve(); }, { once: true });
      });
    });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  if (item.screenshot !== false) {
    await page.screenshot({ path: `${out}/${item.name}.png`, fullPage: true });
    await page.screenshot({ path: `${out}/${item.name}-first-screen.png` });
  }
  const state = await page.evaluate(() => ({
    title: document.title,
    heading: document.querySelector("h1")?.textContent?.trim() ?? "",
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
    projectLinks: document.querySelectorAll('a[href^="/projects/"]').length,
    sectionIds: [...document.querySelectorAll("main section[id]")].map((section) => section.id),
    projectGitHubLinks: [...document.querySelectorAll('.project-detail > header a[href*="github.com"]')].map((link) => link.href),
  }));
  const sectionOrderOk = item.path !== "/" || state.sectionIds.at(-1) === "projects";
  const projectLinksOk = !["/projects/potner", "/projects/saeroi"].includes(item.path) || state.projectGitHubLinks.length === 0;
  const ok = response?.status() === 200 && !state.overflow && state.brokenImages.length === 0 && errors.length === 0 && sectionOrderOk && projectLinksOk;
  failed ||= !ok;
  console.log(JSON.stringify({ case: item.name, status: response?.status(), ...state, errors, ok }));
  await page.close();
}

const mobileNavPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobileNavPage.goto(base, { waitUntil: "networkidle" });
const menu = mobileNavPage.getByRole("button", { name: "메뉴 열기" });
await menu.click();
const menuOpened = await menu.getAttribute("aria-expanded") === "true";
await mobileNavPage.locator("#mobile-nav").getByRole("link", { name: "프로젝트", exact: true }).click();
await mobileNavPage.waitForURL(/#projects$/, { timeout: 10000 }).catch(() => {});
const menuClosed = await menu.getAttribute("aria-expanded") === "false";
const mobileNavOk = menuOpened && new URL(mobileNavPage.url()).hash === "#projects" && menuClosed;
failed ||= !mobileNavOk;
console.log(JSON.stringify({ case: "mobile-navigation", menuOpened, menuClosed, url: mobileNavPage.url(), ok: mobileNavOk }));
const pdfResponse = await mobileNavPage.request.get(`${base}/seo-youngseok-portfolio.pdf`);
const pdfOk = pdfResponse.status() === 200 && pdfResponse.headers()["content-type"]?.includes("pdf");
failed ||= !pdfOk;
console.log(JSON.stringify({ case: "pdf-download", status: pdfResponse.status(), ok: pdfOk }));
await mobileNavPage.close();

await browser.close();
process.exit(failed ? 1 : 0);
