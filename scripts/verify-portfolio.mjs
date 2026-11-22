import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
const base = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3127";
const out = "tmp/portfolio-qa";
const projectSlugs = [
  "saeroi", "potner", "neoulteo", "cirgent", "saybridge",
  "glople", "bluememories", "mofy", "aws-deploy",
];
await mkdir(out, { recursive: true });
const executablePath =
  process.env.CHROME_PATH ??
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : undefined);
const browser = await chromium.launch({ executablePath, headless: true });
const errors = [];
function watch(page) {
  page.on("pageerror", (e) => errors.push(e.message));
}

async function verifyProjectRoutes(viewport, mobile) {
  const page = await browser.newPage({
    viewport,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: "reduce",
    locale: "ko-KR",
  });
  watch(page);
  page.setDefaultTimeout(12000);
  const activate = (locator) => mobile ? locator.tap() : locator.click();
  const exhibit = page.getByRole("region", { name: "프로젝트 브랜드 전시" });
  const next = exhibit.getByRole("button", { name: "다음 프로젝트" });
  const openProject = exhibit.getByRole("link", { name: /프로젝트 열기$/ });
  const launchers = page.getByRole("navigation", { name: "프로젝트 바로가기" });
  const projectWindow = (slug) => page.locator(`[data-window="project:${slug}"]`);
  try {
    await page.goto(base);
    await openProject.waitFor();
    const order = await exhibit.locator("[data-orbit-brand]").evaluateAll(
      (nodes) => nodes.map((node) => node.dataset.orbitBrand),
    );
    assert.deepEqual([...order].sort(), [...projectSlugs].sort());

    const titles = new Map();
    for (const [index, slug] of order.entries()) {
      await openProject.waitFor();
      for (let step = 0; step < index; step++) await activate(next);
      const centered = exhibit.locator('[data-centered="true"] [data-orbit-brand]');
      assert.equal(await centered.getAttribute("data-orbit-brand"), slug);
      assert(await centered.locator("img").evaluate(async (image) => {
        await image.decode();
        return image.naturalWidth > 0;
      }));
      const href = await openProject.getAttribute("href");
      assert.equal(new URL(href, base).searchParams.get("app"), `project:${slug}`);
      if (index === 0 && !mobile) await openProject.press("Enter");
      else await activate(openProject);
      const win = projectWindow(slug);
      await win.getByRole("tab", { name: "프로젝트 노트", selected: true }).waitFor();
      titles.set(slug, await win.locator(".project-app h2").first().innerText());
      await page.goBack();
      await openProject.waitFor();
    }

    await activate(page.getByRole("link", { name: "게스트로 입장" }));
    await page.waitForURL("**/desktop/");
    await launchers.getByRole("link").last().waitFor();
    assert.equal(await launchers.getByRole("link").count(), projectSlugs.length);
    assert(await launchers.getByRole("link").evaluateAll((nodes) =>
      nodes.every((node) => node.getBoundingClientRect().right <= innerWidth),
    ));
    for (const slug of projectSlugs) {
      const path = `/projects/${slug}/`;
      const win = projectWindow(slug);
      await activate(launchers.locator(`a[href="${path}"]`));
      await win.getByRole("heading", { name: titles.get(slug), exact: true }).last().waitFor();
      assert.deepEqual(await win.getByRole("tab").allTextContents(),
        ["프로젝트 노트", "시연 화면", "성능 개선", "구현 기능", "트러블슈팅"]);
      await win.getByRole("tab", { name: "프로젝트 노트", selected: true }).waitFor();
      await win.getByRole("heading", { name: "내가 맡은 일" }).waitFor();
      const hasMetrics = ["cirgent", "glople", "bluememories"].includes(slug);
      const evidence = win.getByRole("navigation", { name: "프로젝트 자료" });
      await activate(evidence.getByRole("button", { name: hasMetrics ? /성능 개선 기록/ : /구현 기능 보기/ }));
      await win.getByRole("tab", { name: hasMetrics ? "성능 개선" : "구현 기능", selected: true }).waitFor();
      if (hasMetrics) {
        await win.getByRole("table").waitFor();
      } else {
        await activate(win.getByRole("tab", { name: "성능 개선" }));
        await win.getByText("공개된 성능 측정 기록이 없습니다.").waitFor();
      }
      await activate(win.getByRole("tab", { name: "프로젝트 노트" }));
      await activate(evidence.getByRole("button", { name: /시연 화면 보기/ }));
      await win.locator(".media-stage :is(video, img)").evaluate(async (medium) => {
        const image = medium instanceof HTMLVideoElement ? new Image() : medium;
        if (medium instanceof HTMLVideoElement) image.src = medium.poster;
        await image.decode();
      });
      await activate(win.getByRole("tab", { name: "구현 기능" }));
      await win.getByRole("tabpanel").locator("h3").last().waitFor();
      const clipped = await win.locator('.reader-index:visible button').evaluateAll((buttons) =>
        buttons.filter((button) => {
          const range = document.createRange();
          range.selectNodeContents(button);
          const box = button.getBoundingClientRect();
          return [...range.getClientRects()].some((line) =>
            line.left < box.left - 2 || line.right > box.right + 2 ||
            line.top < box.top - 2 || line.bottom > box.bottom + 2);
        }).map((button) => button.textContent)
      );
      assert.deepEqual(clipped, [], `${slug} 기능 목록 글자 잘림`);
      await activate(win.getByRole("tab", { name: "트러블슈팅" }));
      await win.getByRole("tabpanel").locator("h3").last().waitFor();
      assert(await win.locator(".window-scroll").evaluate(
        (node) => node.scrollWidth <= node.clientWidth + 1,
      ));
      await activate(win.getByRole("button", { name: "창 닫기" }));
      await win.waitFor({ state: "detached" });
    }

    for (const slug of projectSlugs) {
      const response = await page.goto(`${base}/projects/${slug}/?tab=features`);
      assert.equal(response.status(), 200);
      await page.getByRole("heading", { level: 1, name: titles.get(slug), exact: true }).waitFor();
      await page.getByRole("tab", { name: "구현 기능", selected: true }).waitFor();
      const record = page.getByRole("link", { name: "전체 기술 기록 읽기" });
      assert.equal(await record.getAttribute("href"), `/records/${slug}/`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await activate(record);
      await page.waitForURL(`**/records/${slug}/`);
      await page.getByRole("heading", { level: 1, name: titles.get(slug), exact: true }).waitFor();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    console.log(`PASS ${viewport.width}px · ${projectSlugs.length} exhibition, desktop, project and record routes`);
  } finally {
    await page.close();
  }
}

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    locale: "ko-KR",
  });
  watch(page);
  page.setDefaultTimeout(12000);
  await page.goto(base);
  const skip = page.getByRole("button", { name: "건너뛰기", exact: true });
  await skip.waitFor({ timeout: 15000 });
  assert.equal(
    await page.getByRole("link", { name: "게스트로 입장" }).count(),
    0,
  );
  await page.screenshot({ path: out + "/boot-screen.png" });
  await skip.press("Enter");
  const exhibit = page.locator("[data-orbit-brand]");
  await exhibit.first().waitFor();
  const exhibitedSlugs = await exhibit.evaluateAll((nodes) =>
    nodes.map((node) => node.dataset.orbitBrand),
  );
  assert.deepEqual(exhibitedSlugs.sort(), [...projectSlugs].sort());
  await page.screenshot({ path: out + "/entry-desktop.png" });
  await page.getByRole("link", { name: "게스트로 입장" }).click();
  await page.waitForURL("**/desktop/");
  await page.waitForFunction(() => document.activeElement?.id === "launcher-project:saeroi");
  await page.locator(".desktop-files .launcher").last().waitFor();
  assert.equal(await page.locator(".desktop-files .launcher").count(), projectSlugs.length);
  await page.screenshot({
    path: out + "/desktop-1440.png",
    animations: "disabled",
  });
  await page.goto(new URL("/?boot=1", base).href);
  await skip.waitFor();
  await page.getByRole("link", { name: "관리자 로그인" }).click();
  await page.waitForURL("**/admin/");
  await page.goBack();
  await page.getByRole("link", { name: "게스트로 입장" }).press("Enter");
  await page.waitForURL("**/desktop/");
  const saeroi = page.locator('.launcher[href="/projects/saeroi/"]');
  await saeroi.click();
  const window = page.locator('[data-window="project:saeroi"]');
  await window.getByRole("tab", { name: "시연 화면" }).click();
  await page
    .getByRole("button", { name: "새로이(SAEROI) 열기", exact: true })
    .click();
  assert.equal(await page.locator("[data-window]").count(), 1);
  await window.getByRole("button", { name: "최대화", exact: true }).click();
  await window.locator("video").evaluate((v) => v.play());
  await window.getByRole("button", { name: "최소화", exact: true }).click();
  assert(await window.locator("video").evaluate((v) => v.paused));
  assert.equal(await window.isVisible(), false);
  await page
    .getByRole("button", { name: "새로이(SAEROI) 열기", exact: true })
    .click();
  await window
    .getByRole("button", { name: "원래 크기로", exact: true })
    .click();
  const demo = window.getByRole("tab", { name: "시연 화면" });
  await demo.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(() => document.activeElement?.textContent === "성능 개선");
  await page.keyboard.press("ArrowRight");
  assert.equal(await demo.getAttribute("aria-selected"), "true");
  await page.waitForFunction(
    () => document.activeElement?.textContent === "구현 기능",
  );
  await page.keyboard.press("Enter");
  await page.waitForURL(/tab=features/);
  const title = window.locator(".window-titlebar h2"),
    box = await title.boundingBox(),
    before = await window.boundingBox();
  await page.mouse.move(box.x + 30, box.y + 8);
  await page.mouse.down();
  await page.mouse.move(box.x + 65, box.y + 33, { steps: 6 });
  await page.mouse.up();
  const moved = await window.boundingBox();
  assert(moved.x > before.x + 10);
  await page.mouse.move(moved.x + moved.width - 2, moved.y + moved.height - 2);
  await page.mouse.down();
  await page.mouse.move(
    moved.x + moved.width - 50,
    moved.y + moved.height - 45,
    { steps: 6 },
  );
  await page.mouse.up();
  assert((await window.boundingBox()).width < moved.width - 15);
  const retained = await window.boundingBox();
  await page.getByRole("button", { name: "프로필 열기", exact: true }).click();
  await page.waitForURL(/app=profile/);
  await page.goBack();
  await page.waitForURL(/tab=features/);
  assert.equal((await window.boundingBox()).x, retained.x);
  await page.goForward();
  await page.waitForURL(/app=profile/);
  await page
    .locator('[data-window="profile"]')
    .getByRole("button", { name: "창 닫기" })
    .click();
  await page.waitForURL(/tab=features/);
  await page.waitForFunction(
    () => document.activeElement?.id === "title-project:saeroi",
  );
  await page.getByRole("button", { name: "앱 검색", exact: true }).click();
  await page.getByRole("combobox").fill("PotneR");
  await page.keyboard.press("Enter");
  await page.waitForURL(/potner/);
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.screenshot({ path: out + "/desktop-1024.png" });
  await page.goto(base);
  await page.waitForURL("**/desktop/");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.screenshot({ path: out + "/desktop-390.png" });
  await page.locator('.launcher[href="/projects/potner/"]').click();
  const mobile = page.locator('[data-window="project:potner"]');
  await mobile.getByRole("tab", { name: "트러블슈팅" }).click();
  assert.equal(
    await mobile.getByRole("button", { name: "최대화", exact: true }).count(),
    0,
  );
  await mobile.getByRole("tab", { name: "구현 기능" }).click();
  const featurePicker = mobile.getByRole("combobox", {
    name: "구현 기능 목록",
  });
  await featurePicker.selectOption({ index: 1 });
  const featureTitle = await featurePicker
    .locator("option:checked")
    .innerText();
  await mobile
    .getByRole("heading", { name: featureTitle, exact: true })
    .waitFor();
  await mobile.getByRole("tab", { name: "트러블슈팅" }).click();
  await mobile.getByRole("tab", { name: "구현 기능" }).click();
  assert.equal(await featurePicker.inputValue(), "1");
  await page.addStyleTag({ content: "html{font-size:125%}" });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({ path: out + "/mobile-reader.png" });
  for (const slug of projectSlugs) {
    const response = await page.goto(
      base + "/projects/" + slug + "/?tab=features",
    );
    assert.equal(response.status(), 200);
    const feature = page.getByRole("tab", { name: "구현 기능" });
    await page.waitForFunction(() =>
      document
        .querySelector("[role=tab][aria-selected=true]")
        ?.textContent?.includes("구현 기능"),
    );
    assert.equal(await feature.getAttribute("aria-selected"), "true");
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
  await page.getByRole("tab", { name: "시연 화면" }).click();
  const image = page.getByRole("button", { name: /확대$/ });
  await image.click();
  await page.keyboard.press("Escape");
  await page.waitForFunction(() =>
    document.activeElement?.classList.contains("image-opener"),
  );
  await page.goto(base + "/projects/saeroi/");
  await page.getByRole("tab", { name: "시연 화면" }).click();
  await page.route("**/clips/**/*.mp4", (r) => r.abort());
  await page.locator("video").evaluate((v) => v.play().catch(() => {}));
  await page
    .getByText("영상을 불러오지 못해 대표 화면을 표시합니다.")
    .waitFor();
  await page.getByRole("tab", { name: "구현 기능" }).click();
  await page.goto(base + "/records/");
  await page.getByRole("link", { name: /PotneR/ }).click();
  await page.waitForURL("**/records/potner/");
  await page.goto(base + "/admin/");
  await page.getByRole("heading", { name: "개인 작업 공간" }).waitFor();
  const local = page.getByRole("button", { name: "로컬 개발 검토 열기" });
  if (await local.count()) {
    await local.click();
    await page.getByLabel("자료 제목").fill("검증용 원문");
    await page.getByLabel("메모 또는 원문").fill("동시 요청 처리 기록");
    await page.getByRole("button", { name: "자료 저장" }).click();
    await page.getByLabel("자료 제목").fill("검증용 이미지");
    await page.getByLabel("비공개 첨부파일").setInputFiles({
      name: "fixture.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jBu8AAAAASUVORK5CYII=",
        "base64",
      ),
    });
    await page.getByRole("button", { name: "자료 저장" }).click();
    await page
      .getByRole("checkbox", { name: "검증용 이미지 AI 입력" })
      .waitFor();
    await page.getByRole("checkbox", { name: "검증용 원문 AI 입력" }).check();
    await page.getByRole("button", { name: "제안 생성" }).click();
    await page.getByRole("button", { name: "생성 취소" }).click();
    await page.getByText("취소됨", { exact: true }).waitFor();
    await page.getByRole("button", { name: "제안 생성" }).click();
    await page
      .getByRole("button", { name: "선택 문단으로 새 문서 작성" })
      .click();
    await page.locator(".bn-editor[contenteditable=true]").waitFor();
    await page.getByLabel("문서 제목").fill("검토할 문서");
    const sourceLinks = page
      .locator("details")
      .filter({ has: page.locator("summary", { hasText: "연결된 자료" }) });
    await sourceLinks.locator("summary").click();
    await sourceLinks.getByRole("checkbox", { name: "검증용 이미지" }).check();
    await page.getByRole("button", { name: "문서 저장", exact: true }).click();
    await page.getByText("저장됨", { exact: true }).waitFor();
    const attachments = page.locator("details").filter({
      has: page.locator("summary", { hasText: "공개할 첨부 이미지 선택" }),
    });
    await attachments.locator("summary").click();
    await attachments.getByRole("checkbox", { name: "검증용 이미지" }).check();
    console.log("PASS local document saved");
    await page.getByRole("button", { name: "저장 버전 미리보기" }).click();
    await page.getByRole("img", { name: "검증용 이미지" }).waitFor();
    await page.getByRole("button", { name: "검토한 버전 발행 요청" }).click();
    await page
      .getByText(/배포 실패/)
      .first()
      .waitFor();
    await page.getByRole("button", { name: "작업", exact: true }).click();
    await page.getByLabel("할 일", { exact: true }).fill("작업 확인");
    await page.getByRole("button", { name: "작업 추가" }).click();
    await page.getByLabel("작업 확인").selectOption("done");
    console.log(
      "PASS local capture, AI cancel/review, editor save, preview, failed release and tasks",
    );
  }
  await verifyProjectRoutes({ width: 1440, height: 900 }, false);
  await verifyProjectRoutes({ width: 390, height: 844 }, true);
  await verifyProjectRoutes({ width: 320, height: 640 }, true);
  assert.deepEqual(errors, []);
  console.log(
    `PASS boot, exhibition, role entry, window lifecycle, geometry, focus, history, mobile and ${projectSlugs.length} direct project URLs`,
  );
} finally {
  await browser.close();
}
