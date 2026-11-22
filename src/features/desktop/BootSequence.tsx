"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { brands } from "./BrandArt";
import { readSetting } from "./settings";
import "./boot-sequence.css";

export type BootPreviewPhase = "straight" | "bend" | "ring";

const timeline = {
  appear: 200,
  bendAt: 700,
  bendFor: 600,
  dissolveAt: 2100,
  latestDissolve: 2320,
  dissolveFor: 480,
};
const pathLength = 354;
const ringSweep = Math.PI * 1.995;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Constant arc length keeps the same text run intact, including at the seam. */
function letterPath(bend: number) {
  if (bend < 0.001) return `M ${-pathLength / 2} 14 h ${pathLength}`;
  const sweep = ringSweep * bend;
  const radius = pathLength / sweep;
  const edgeX = radius * Math.sin(sweep / 2);
  const edgeY = (radius * (1 - Math.cos(sweep / 2))) / 2 + 14 * (1 - bend);
  return `M ${-edgeX} ${edgeY} A ${radius} ${radius} 0 ${sweep > Math.PI ? 1 : 0} 1 ${edgeX} ${edgeY}`;
}

async function warmBrandScene() {
  const images = [
    brands.saeroi.src,
    brands.potner.src,
    brands.neoulteo.src,
  ].map(async (src) => {
    if (!src) return;
    const image = new Image();
    image.src = src;
    await image.decode();
  });
  await Promise.allSettled([...images, document.fonts.ready]);
}

export function BootSequence({
  onDone,
  onReveal,
  previewPhase,
}: {
  onDone: () => void;
  onReveal?: () => void;
  previewPhase?: BootPreviewPhase;
}) {
  const pathId = useId();
  const screen = useRef<HTMLElement>(null);
  const curve = useRef<SVGPathElement>(null);
  const word = useRef<SVGGElement>(null);
  const finished = useRef(false);
  const complete = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  const fixed =
    process.env.NODE_ENV === "development" ? previewPhase : undefined;
  const fixedBend = fixed === "ring" ? 1 : fixed === "bend" ? 0.56 : 0;

  useEffect(() => {
    if (fixed) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || readSetting("reduce") === "1") {
      complete();
      return;
    }

    let frame = 0;
    let active = true;
    let ready = false;
    let fadingAt: number | undefined;
    const started = performance.now();
    void warmBrandScene().then(() => {
      if (active) ready = true;
    });

    function draw(time: number) {
      if (
        !active ||
        finished.current ||
        !curve.current ||
        !word.current ||
        !screen.current
      )
        return;
      const elapsed = time - started;
      const t = clamp((elapsed - timeline.bendAt) / timeline.bendFor);
      const bend = t * t * (3 - 2 * t);
      const spinTime = Math.max(
        0,
        elapsed - timeline.bendAt - timeline.bendFor,
      );
      if (t < 1 || screen.current.dataset.bootPhase !== "ring") {
        curve.current.setAttribute("d", letterPath(bend));
      }
      word.current.setAttribute("transform", `rotate(${spinTime * 0.16})`);
      word.current.style.opacity = String(
        0.65 + 0.35 * clamp(elapsed / timeline.appear),
      );
      screen.current.dataset.bootPhase =
        t === 0 ? "straight" : t < 1 ? "bend" : "ring";

      if (
        fadingAt === undefined &&
        elapsed >= timeline.dissolveAt &&
        (ready || elapsed >= timeline.latestDissolve)
      ) {
        fadingAt = elapsed;
        onReveal?.();
      }
      if (fadingAt !== undefined) {
        const exit = clamp((elapsed - fadingAt) / timeline.dissolveFor);
        screen.current.style.opacity = String(1 - exit);
        if (exit === 1) {
          complete();
          return;
        }
      }
      frame = requestAnimationFrame(draw);
    }
    const reduce = () => {
      if (motion.matches || readSetting("reduce") === "1") complete();
    };
    motion.addEventListener("change", reduce);
    window.addEventListener("portfolio-preferences", reduce);
    frame = requestAnimationFrame(draw);
    // A suspended animation frame or a rejected font/image must never gate entry.
    const deadline = setTimeout(
      complete,
      timeline.latestDissolve + timeline.dissolveFor + 100,
    );
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      clearTimeout(deadline);
      motion.removeEventListener("change", reduce);
      window.removeEventListener("portfolio-preferences", reduce);
    };
  }, [complete, fixed, onReveal]);

  return (
    <section
      className="sys-boot"
      ref={screen}
      aria-label="컴퓨터 부팅"
      data-boot-phase={fixed ?? "straight"}
    >
      <h1 className="sr-only">SYS Workspace</h1>
      <svg
        aria-hidden="true"
        className="sys-boot-word"
        viewBox="-210 -128 420 256"
      >
        <defs>
          <path id={pathId} ref={curve} d={letterPath(fixedBend)} />
        </defs>
        <g ref={word} transform={fixed === "ring" ? "rotate(58)" : undefined}>
          <text textAnchor="middle">
            <textPath
              href={`#${pathId}`}
              startOffset="50%"
              textLength="324"
              lengthAdjust="spacingAndGlyphs"
            >
              SYS Workspace
            </textPath>
          </text>
        </g>
      </svg>
      <button type="button" onClick={complete}>
        건너뛰기
      </button>
    </section>
  );
}
