/**
 * Renders the system architecture diagrams that have no hand-made image.
 *
 *   node scripts/architecture/render.mjs [slug ...]
 *
 * Each `scripts/architecture/<slug>.mjs` describes boxes, groups and edges in
 * canvas coordinates. The page is laid out with HTML/CSS (Pretendard), the
 * connectors are drawn from the real box positions, and the canvas is saved at
 * 2x as `public/projects/<slug>/architecture.png`. The style follows the
 * existing diagrams: tone-coloured boxes, logos, bullets, coloured arrows and a
 * legend.
 *
 * Environment: CHROME_PATH (defaults to the macOS Chrome).
 */
import { chromium } from "playwright-core";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { brand, glyph } from "./icons.mjs";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(dirname(HERE));
const FONT_CSS = pathToFileURL(
  join(ROOT, "node_modules/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"),
).href;

const TONES = {
  blue: { line: "#3b6fd8", ink: "#1f55c6", soft: "#f3f7ff" },
  green: { line: "#3f9b4f", ink: "#2b7a37", soft: "#f4fbf4" },
  purple: { line: "#8b5cc8", ink: "#6a3dae", soft: "#f8f4fd" },
  orange: { line: "#ef8a25", ink: "#cf640c", soft: "#fff6ec" },
  gray: { line: "#94a3b8", ink: "#475569", soft: "#f8fafc" },
};

const escape = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** `react` → brand logo in its colour, `glyph:users` → outline icon in the box tone. */
function logo(name, size, tone) {
  if (name.startsWith("glyph:")) {
    const inner = glyph[name.slice(6)];
    if (!inner) throw new Error(`unknown glyph ${name}`);
    return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${TONES[tone].line}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }
  const mark = brand[name];
  if (!mark) throw new Error(`unknown brand ${name}`);
  const chip = CHIPS[name];
  if (chip) {
    return `<span class="logo-chip" style="background:${chip.bg};width:${size}px;height:${size}px"><svg width="${size * 0.72}" height="${size * 0.72}" viewBox="0 0 24 24" fill="${chip.fill}"><path d="${mark.path}"/></svg></span>`;
  }
  return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${mark.hex}"><path d="${mark.path}"/></svg>`;
}

/** Brand marks whose own colour disappears on a light box get a chip. */
const CHIPS = {
  kakao: { bg: "#FFCD00", fill: "#191919" },
};

function renderBox(box) {
  const tone = box.tone ?? "green";
  const size = box.logoSize ?? 46;
  const logos = (box.logos ?? []).map((name) => logo(name, size, tone)).join("");
  const bullets = box.bullets?.length
    ? `<ul class="bullets${box.cols === 2 ? " two" : ""}">${box.bullets
        .map((item) => `<li>${escape(item)}</li>`)
        .join("")}</ul>`
    : "";
  const steps = box.steps?.length
    ? `<ol class="steps${box.stepsDir === "row" ? " row" : ""}">${box.steps
        .map((step, i) => `${i ? `<li class="step-arrow" aria-hidden="true">${box.stepsDir === "row" ? "→" : "↓"}</li>` : ""}<li class="step">${escape(step)}</li>`)
        .join("")}</ol>`
    : "";
  const sections = box.sections?.length
    ? `<div class="sections" style="grid-template-columns:repeat(${box.sectionCols ?? 2},1fr)">${box.sections
        .map(
          (section) =>
            `<div class="section"><p class="section-title">${escape(section.title)}</p><ul class="bullets">${section.bullets
              .map((item) => `<li>${escape(item)}</li>`)
              .join("")}</ul></div>`,
        )
        .join("")}</div>`
    : "";
  const badge = box.badge ? `<span class="badge">${escape(box.badge)}</span>` : "";
  const note = box.note ? `<p class="note">${escape(box.note)}</p>` : "";
  const layout = box.layout ?? (box.w >= 330 && logos ? "side" : "stack");
  return `<div class="box tone-${tone} layout-${layout}${box.dashed ? " dashed" : ""}${box.highlight ? " highlight" : ""}" id="${box.id}" style="left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px">
    <div class="box-title">${escape(box.title)}${badge}</div>
    ${box.subtitle ? `<div class="box-subtitle">${escape(box.subtitle)}</div>` : ""}
    <div class="box-body">${logos ? `<div class="logos">${logos}</div>` : ""}<div class="box-text">${box.stepsDir === "row" ? steps + bullets + sections : bullets + sections + steps}${note}</div></div>
  </div>`;
}

function renderGroup(group) {
  const tone = group.tone ?? "gray";
  const mark = group.logo ? logo(group.logo, 26, tone) : "";
  return `<div class="group tone-${tone}${group.dashed === false ? "" : " dashed"}" id="${group.id}" style="left:${group.x}px;top:${group.y}px;width:${group.w}px;height:${group.h}px">
    <div class="group-title">${mark}<span>${escape(group.title)}</span>${group.subtitle ? `<small>${escape(group.subtitle)}</small>` : ""}</div>
  </div>`;
}

function renderLegend(spec) {
  const items = spec.legend ?? [
    ["blue", "파란색: 사용자 요청 흐름"],
    ["green", "초록색: 데이터 조회·저장"],
    ["purple", "보라색: 외부 API 연동"],
    ["orange", "주황색: 파일 업로드·배포"],
  ];
  const { x, y, w, h } = spec.legendBox;
  return `<div class="legend" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${items
    .map(
      ([tone, label, dashed]) =>
        `<span class="legend-item"><svg width="54" height="14"><line x1="2" y1="7" x2="44" y2="7" stroke="${TONES[tone].line}" stroke-width="3" ${dashed ? 'stroke-dasharray="6 5"' : ""}/><path d="M42 2 L52 7 L42 12 Z" fill="${TONES[tone].line}"/></svg><span style="color:${TONES[tone].ink}">${escape(label)}</span></span>`,
    )
    .join("")}</div>`;
}

/** Runs in the page: draws every edge from the laid-out boxes. */
function drawEdges({ edges, tones }) {
  const canvas = document.getElementById("canvas");
  const origin = canvas.getBoundingClientRect();
  const svg = document.getElementById("edges");
  const rect = (id) => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`edge endpoint ${id} not found`);
    const r = el.getBoundingClientRect();
    return { left: r.left - origin.left, top: r.top - origin.top, right: r.right - origin.left, bottom: r.bottom - origin.top, width: r.width, height: r.height };
  };
  const anchor = (id, side, at, abs) => {
    const r = rect(id);
    const t = at ?? 0.5;
    if (side === "left") return { x: r.left, y: abs ?? r.top + r.height * t };
    if (side === "right") return { x: r.right, y: abs ?? r.top + r.height * t };
    if (side === "top") return { x: abs ?? r.left + r.width * t, y: r.top };
    return { x: abs ?? r.left + r.width * t, y: r.bottom };
  };
  const horizontal = (side) => side === "left" || side === "right";
  const GAP = 6;
  const nudge = (p, side, d) => {
    if (side === "left") return { x: p.x - d, y: p.y };
    if (side === "right") return { x: p.x + d, y: p.y };
    if (side === "top") return { x: p.x, y: p.y - d };
    return { x: p.x, y: p.y + d };
  };

  const defs = Object.entries(tones)
    .map(
      ([name, tone]) =>
        `<marker id="head-${name}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${tone.line}"/></marker>`,
    )
    .join("");
  let paths = "";

  for (const edge of edges) {
    const [fromId, fromSide] = edge.from;
    const [toId, toSide] = edge.to;
    let a = nudge(anchor(fromId, fromSide, edge.fromAt, edge.fromAbs), fromSide, edge.both ? GAP : 2);
    let b = nudge(anchor(toId, toSide, edge.toAt, edge.toAbs), toSide, GAP);
    let points;
    if (edge.points) {
      points = [a, ...edge.points.map(([x, y]) => ({ x: x ?? a.x, y: y ?? a.y })), b];
    } else if (horizontal(fromSide) && horizontal(toSide)) {
      if (Math.abs(a.y - b.y) < 1) points = [a, { x: b.x, y: a.y }];
      else {
        const mid = edge.mid ?? (a.x + b.x) / 2;
        points = [a, { x: mid, y: a.y }, { x: mid, y: b.y }, b];
      }
    } else if (!horizontal(fromSide) && !horizontal(toSide)) {
      if (Math.abs(a.x - b.x) < 1) points = [a, { x: a.x, y: b.y }];
      else {
        const mid = edge.mid ?? (a.y + b.y) / 2;
        points = [a, { x: a.x, y: mid }, { x: b.x, y: mid }, b];
      }
    } else if (horizontal(fromSide)) {
      points = [a, { x: b.x, y: a.y }, b];
    } else {
      points = [a, { x: a.x, y: b.y }, b];
    }
    const tone = tones[edge.tone];
    const d = points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    paths += `<path d="${d}" fill="none" stroke="${tone.line}" stroke-width="2.6" stroke-linejoin="round" ${
      edge.dashed ? 'stroke-dasharray="7 6"' : ""
    } marker-end="url(#head-${edge.tone})" ${edge.both ? `marker-start="url(#head-${edge.tone})"` : ""}/>`;

    if (edge.label) {
      let best = 0;
      let length = -1;
      for (let i = 0; i < points.length - 1; i++) {
        const l = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
        if (edge.labelSegment === i || (edge.labelSegment === undefined && l > length)) {
          best = i;
          length = l;
        }
      }
      const p = points[best];
      const q = points[best + 1];
      const label = document.createElement("div");
      label.className = "edge-label";
      label.style.color = tone.ink;
      label.textContent = edge.label;
      canvas.appendChild(label);
      const at = edge.labelAt ?? 0.5;
      const cx = p.x + (q.x - p.x) * at + (edge.labelDx ?? 0);
      const cy = p.y + (q.y - p.y) * at + (edge.labelDy ?? 0);
      label.style.left = `${cx - label.offsetWidth / 2}px`;
      label.style.top = `${cy - label.offsetHeight / 2}px`;
    }
  }
  svg.innerHTML = `<defs>${defs}</defs>${paths}`;
}

function page(spec) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONT_CSS}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { word-break: keep-all; background: #fff; font-family: "Pretendard Variable", Pretendard, sans-serif; color: #1f2937; -webkit-font-smoothing: antialiased; }
  #canvas { position: relative; width: ${spec.width}px; height: ${spec.height}px; background: #fff; overflow: hidden; }
  #edges { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; overflow: visible; }
  .group { position: absolute; z-index: 1; border-radius: 18px; border: 2px solid; }
  .group.dashed { border-style: dashed; }
  .group-title { position: absolute; left: 18px; top: 12px; display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
  .group-title small { font-size: 15px; font-weight: 600; opacity: 0.8; margin-left: 4px; }
  .box { position: absolute; z-index: 3; border-radius: 16px; border: 2px solid; background: #fff; padding: 14px 18px 16px; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgb(15 23 42 / 6%); }
  .box.dashed { border-style: dashed; box-shadow: none; }
  .box.highlight { border-width: 3.5px; box-shadow: 0 0 0 5px rgb(239 138 37 / 22%), 0 2px 6px rgb(15 23 42 / 6%); }
  .box-title { text-align: center; font-size: 22px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; }
  .box-subtitle { text-align: center; font-size: 15px; font-weight: 600; color: #64748b; margin-top: 3px; }
  .badge { font-size: 13px; font-weight: 800; color: #fff; background: #ef8a25; border-radius: 999px; padding: 3px 10px; letter-spacing: 0; }
  .box-body { flex: 1; display: flex; gap: 16px; margin-top: 10px; min-height: 0; }
  .layout-stack .box-body { flex-direction: column; align-items: center; gap: 10px; }
  .layout-side .box-body { flex-direction: row; align-items: center; }
  .logos { display: flex; gap: 10px; align-items: center; justify-content: center; flex: none; }
  .layout-side .logos { flex-direction: column; }
  .box-text { min-width: 0; align-self: stretch; display: flex; flex-direction: column; justify-content: center; }
  .layout-stack .box-text { align-self: center; }
  .bullets { list-style: none; display: grid; gap: 5px; font-size: 17.5px; line-height: 1.38; font-weight: 500; letter-spacing: -0.02em; }
  .bullets.two { grid-template-columns: 1fr 1fr; column-gap: 22px; }
  .bullets li { position: relative; padding-left: 14px; }
  .bullets li::before { content: ""; position: absolute; left: 0; top: 0.62em; width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.55; }
  .steps { list-style: none; display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: 2px; }
  .sections { display: grid; gap: 12px; }
  .section { background: #fff; border-radius: 12px; padding: 10px 14px 12px; border: 1.5px solid rgb(148 163 184 / 35%); }
  .section-title { font-size: 16.5px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.02em; }
  .section .bullets { font-size: 16.5px; gap: 3px; }
  .logo-chip { display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; }
  .steps.row { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 6px; margin: 2px 0 10px; }
  .steps.row .step { min-width: 0; padding: 5px 11px; font-size: 15.5px; }
  .step { font-size: 16.5px; font-weight: 700; border-radius: 10px; padding: 6px 14px; text-align: center; min-width: 220px; }
  .step-arrow { font-size: 16px; font-weight: 800; line-height: 1; }
  .note { font-size: 15px; color: #64748b; margin-top: 6px; line-height: 1.4; }
  .edge-label { position: absolute; z-index: 4; white-space: nowrap; font-size: 15.5px; font-weight: 750; letter-spacing: -0.02em; background: #fff; padding: 1px 7px; border-radius: 6px; }
  .legend { position: absolute; z-index: 3; display: flex; justify-content: space-around; align-items: center; border: 1.5px solid #d6dbe3; border-radius: 14px; background: #fff; font-size: 16.5px; font-weight: 700; }
  .legend-item { display: inline-flex; align-items: center; gap: 10px; }
  ${Object.entries(TONES)
    .map(
      ([name, t]) => `.tone-${name} { border-color: ${t.line}; }
  .box.tone-${name} { background: ${t.soft}; }
  .box.tone-${name} .box-title { color: ${t.ink}; }
  .box.tone-${name} .bullets li::before { background: ${t.line}; opacity: 0.9; }
  .box.tone-${name} .section-title { color: ${t.ink}; }
  .box.tone-${name} .step { background: #fff; border: 1.5px solid ${t.line}; color: ${t.ink}; }
  .box.tone-${name} .step-arrow { color: ${t.line}; }
  .group.tone-${name} { background: ${t.soft}88; }
  .group.tone-${name} .group-title { color: ${t.ink}; }`,
    )
    .join("\n  ")}
</style></head><body>
<div id="canvas">
  ${(spec.groups ?? []).map(renderGroup).join("\n")}
  <svg id="edges"></svg>
  ${spec.boxes.map(renderBox).join("\n")}
  ${renderLegend(spec)}
</div></body></html>`;
}

const slugs = process.argv.slice(2);
const targets = slugs.length ? slugs : ["saeroi", "neoulteo", "mofy"];
const dir = await mkdtemp(join(tmpdir(), "architecture-"));
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
try {
  for (const slug of targets) {
    const spec = (await import(`./${slug}.mjs`)).default;
    const file = join(dir, `${slug}.html`);
    await writeFile(file, page(spec));
    const context = await browser.newContext({
      viewport: { width: spec.width, height: spec.height },
      deviceScaleFactor: 2,
    });
    const tab = await context.newPage();
    await tab.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await tab.evaluate(() => document.fonts.ready);
    await tab.evaluate(drawEdges, { edges: spec.edges, tones: TONES });
    const overflow = await tab.evaluate(() =>
      [...document.querySelectorAll(".box")]
        .filter((box) => box.scrollHeight > box.clientHeight + 1 || box.scrollWidth > box.clientWidth + 1)
        .map((box) => box.id),
    );
    if (overflow.length) console.warn(`  ${slug}: content overflows ${overflow.join(", ")}`);
    const out = join(ROOT, "public", "projects", slug, "architecture.png");
    await tab.locator("#canvas").screenshot({ path: out });
    console.log(`${slug}: ${spec.width}×${spec.height} → ${out.replace(ROOT + "/", "")}`);
    await context.close();
  }
} finally {
  await browser.close();
  await rm(dir, { recursive: true, force: true });
}
