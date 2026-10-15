/**
 * Records short looping demo clips (3–5 s) of the real project frontends.
 *
 *   node scripts/record-clips.mjs <project> [clipId ...]
 *
 * Each scenario in scripts/clips/<project>.mjs serves the project's production
 * build, answers every backend call with demo fixtures (mock data: the services'
 * backends, wallets, payments and LLM are not running) and drives the UI through
 * one flow per clip. Frames come from the Chrome DevTools screencast and are
 * encoded with ffmpeg into an H.264 MP4 plus a JPEG poster in public/clips/<project>.
 *
 * Environment: CHROME_PATH (defaults to the macOS Chrome), FFMPEG_PATH.
 */
import { chromium } from "playwright-core";
import { spawnSync } from "node:child_process";
import { link, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const [project, ...only] = process.argv.slice(2);
if (!project) {
  console.error("usage: node scripts/record-clips.mjs <project> [clipId ...]");
  process.exit(1);
}
const scenario = (await import(`./clips/${project}.mjs`)).default;
const outDir = join(ROOT, "public", "clips", project);
await mkdir(outDir, { recursive: true });

/** Shown in place of the OS cursor so viewers can follow clicks. */
const CURSOR_SCRIPT = `
(() => {
  const install = () => {
    if (document.getElementById("__demo-cursor")) return;
    const style = document.createElement("style");
    style.textContent = \`
      html { scrollbar-width: none; }
      ::-webkit-scrollbar { display: none; }
      #__demo-cursor { position: fixed; z-index: 2147483647; left: 0; top: 0;
        width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%;
        background: rgb(17 18 20 / 28%); border: 2px solid rgb(255 255 255 / 95%);
        box-shadow: 0 2px 10px rgb(0 0 0 / 30%); pointer-events: none;
        transition: transform .12s ease, background-color .12s ease; opacity: 0; }
      #__demo-cursor.down { transform: scale(.7); background: rgb(234 88 12 / 70%); }
    \`;
    document.head.appendChild(style);
    const dot = document.createElement("div");
    dot.id = "__demo-cursor";
    document.body.appendChild(dot);
    addEventListener("mousemove", (e) => {
      dot.style.opacity = "1";
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    }, true);
    addEventListener("mousedown", () => dot.classList.add("down"), true);
    addEventListener("mouseup", () => dot.classList.remove("down"), true);
  };
  if (document.body) install();
  else addEventListener("DOMContentLoaded", install);
})();
`;

/** Helpers handed to every clip. */
export const helpers = {
  async smoothScroll(page, to, ms = 1200) {
    await page.evaluate(
      ([target, duration]) =>
        new Promise((resolve) => {
          const from = window.scrollY;
          const end =
            typeof target === "number"
              ? target
              : document.querySelector(target).getBoundingClientRect().top +
                window.scrollY -
                80;
          const start = performance.now();
          const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
          const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            window.scrollTo(0, from + (end - from) * ease(t));
            if (t < 1) requestAnimationFrame(step);
            else resolve();
          };
          requestAnimationFrame(step);
        }),
      [to, ms],
    );
  },
  async moveTo(page, locator, steps = 18) {
    const box = await locator.boundingBox();
    if (!box) throw new Error("element has no box");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
      steps,
    });
  },
  async clickOn(page, locator, steps = 18) {
    await helpers.moveTo(page, locator, steps);
    await page.waitForTimeout(150);
    await page.mouse.down();
    await page.waitForTimeout(90);
    await page.mouse.up();
  },
};

async function startScreencast(page, width, height) {
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    frames.push({ data, t: metadata.timestamp });
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", {
    format: "jpeg",
    quality: 92,
    maxWidth: width,
    maxHeight: height,
    everyNthFrame: 1,
  });
  return {
    async stop() {
      const end = Date.now() / 1000;
      await cdp.send("Page.stopScreencast");
      await cdp.detach();
      return { frames, end };
    },
  };
}

function ffmpeg(args) {
  const result = spawnSync(FFMPEG, ["-hide_banner", "-loglevel", "error", ...args]);
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed: ${result.stderr?.toString()}`);
  }
}

const FPS = 30;
const frameName = (prefix, index) => `${prefix}${String(index).padStart(5, "0")}.jpg`;

async function encode({ frames, end }, name, outWidth) {
  if (frames.length === 0) throw new Error(`${name}: no frames captured`);
  const dir = await mkdtemp(join(tmpdir(), "clip-"));
  for (let i = 0; i < frames.length; i++) {
    await writeFile(join(dir, frameName("f", i)), Buffer.from(frames[i].data, "base64"));
  }
  // The screencast sends frames irregularly (bursts while things move, nothing
  // while the page is still). Resample them onto a fixed 30 fps timeline so the
  // MP4 plays in real time and ends exactly where the recording ended.
  const start = frames[0].t;
  const count = Math.max(1, Math.round((end - start) * FPS));
  let current = 0;
  for (let k = 0; k < count; k++) {
    const t = start + k / FPS;
    while (current + 1 < frames.length && frames[current + 1].t <= t) current++;
    await link(join(dir, frameName("f", current)), join(dir, frameName("s", k)));
  }

  const mp4 = join(outDir, `${name}.mp4`);
  const poster = join(outDir, `${name}.jpg`);
  ffmpeg([
    "-y", "-framerate", String(FPS), "-i", join(dir, "s%05d.jpg"),
    "-vf", `scale=${outWidth}:-2:flags=lanczos,format=yuv420p`,
    "-c:v", "libx264", "-preset", "slow", "-crf", "23",
    "-movflags", "+faststart", "-an", mp4,
  ]);
  ffmpeg([
    "-y", "-i", join(dir, frameName("f", 0)),
    "-vf", `scale=${outWidth}:-2:flags=lanczos`, "-q:v", "4", poster,
  ]);
  await rm(dir, { recursive: true, force: true });
  return { mp4, poster, duration: count / FPS, frames: frames.length };
}

await scenario.start?.();
// Headless Chrome ignores the context's deviceScaleFactor for screencast
// frames, so force it at launch to capture at full (2x) resolution.
const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: [`--force-device-scale-factor=${scenario.scale ?? 2}`],
});
try {
  for (const clip of scenario.clips) {
    if (only.length && !only.includes(clip.id)) continue;
    const viewport = clip.viewport ?? scenario.viewport;
    const scale = scenario.scale ?? 2;
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: scale,
      locale: "ko-KR",
      timezoneId: "Asia/Seoul",
      ...(scenario.contextOptions ?? {}),
    });
    await context.addInitScript(CURSOR_SCRIPT);
    const unmatched = new Set();
    await scenario.setup(context, { clip, unmatched });
    const page = await context.newPage();
    page.on("pageerror", (error) => console.warn(`  [${clip.id}] pageerror: ${error.message}`));

    await clip.prepare(page, helpers);
    await page.waitForTimeout(400);
    const recording = await startScreencast(
      page,
      viewport.width * scale,
      viewport.height * scale,
    );
    await page.waitForTimeout(250);
    await clip.run(page, helpers);
    await page.waitForTimeout(clip.hold ?? 600);
    const result = await encode(
      await recording.stop(),
      clip.id,
      clip.outWidth ?? scenario.outWidth ?? 1600,
    );
    console.log(
      `${clip.id}: ${result.duration.toFixed(1)}s, ${result.frames} frames → ${result.mp4.replace(ROOT + "/", "")}`,
    );
    if (unmatched.size) console.log(`  unmatched API calls: ${[...unmatched].join(", ")}`);
    await context.close();
  }
} finally {
  await browser.close();
  await scenario.stop?.();
}
