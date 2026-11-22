"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
} from "lucide-react";
import { projects } from "@/content/projects";
import { desktopHref } from "@/lib/content/apps";
import { BrandArt } from "./BrandArt";
import { keepLockInHistory } from "./settings";
import "./orbit.css";

// Wrap the third desktop highlight around to the left of the opening piece.
const [first, second, third, ...remaining] = projects;
const works = [first, second, ...remaining, third];
const count = works.length;
const wrap = (value: number) => ((value % count) + count) % count;
const clamp = (n: number, low: number, high: number) =>
  Math.min(high, Math.max(low, n));

function orbitStyle(index: number, phase: number): CSSProperties {
  const angle = (index - phase) * ((2 * Math.PI) / count);
  const sine = Math.sin(angle);
  const depth = (1 + Math.cos(angle)) / 2;
  return {
    "--orbit-x": sine.toFixed(4),
    "--orbit-y": (14 + 57 * depth ** 2).toFixed(3) + "%",
    "--orbit-scale": (0.32 + 0.68 * Math.pow(depth, 3.1)).toFixed(3),
    "--orbit-yaw": (-sine * 25).toFixed(2) + "deg",
    "--orbit-roll": (-sine * 3.8).toFixed(2) + "deg",
    "--orbit-light": (0.43 + 0.57 * depth ** 2).toFixed(3),
    zIndex: Math.round(depth * 100),
  } as CSSProperties;
}

type Drag = {
  id: number;
  startX: number;
  lastX: number;
  time: number;
  width: number;
  phase: number;
  speed: number;
  moved: boolean;
};

export default function BrandOrbit({
  reduced = false,
  disabled = false,
}: {
  reduced?: boolean;
  disabled?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLButtonElement | null)[]>([]);
  const phase = useRef(0);
  const target = useRef(0);
  const frame = useRef(0);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const quiet = useRef(reduced);
  const work = works[current];

  const paint = useCallback((value: number) => {
    phase.current = value;
    slots.current.forEach((el, index) => {
      if (!el) return;
      const style = orbitStyle(index, value);
      for (const [key, v] of Object.entries(style)) {
        if (key === "zIndex") el.style.zIndex = String(v);
        else el.style.setProperty(key, String(v));
      }
    });
    setCurrent(wrap(Math.round(value)));
  }, []);

  const settle = useCallback(
    (destination: number) => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      target.current = destination;
      if (quiet.current || document.hidden) {
        paint(destination);
        return;
      }
      let previous = performance.now();
      const tick = (now: number) => {
        const delta = destination - phase.current;
        if (Math.abs(delta) < 0.001) {
          frame.current = 0;
          paint(destination);
          return;
        }
        const dt = clamp(now - previous, 1, 50);
        previous = now;
        paint(phase.current + delta * (1 - Math.exp(-dt / 95)));
        frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [paint],
  );

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      quiet.current =
        reduced ||
        media.matches ||
        document.documentElement.dataset.reduced === "true";
      if (quiet.current && frame.current) settle(target.current);
    };
    const hide = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame.current);
        frame.current = 0;
        if (drag.current) {
          const id = drag.current.id;
          if (stage.current?.hasPointerCapture(id))
            stage.current.releasePointerCapture(id);
          drag.current = null;
          stage.current?.removeAttribute("data-dragging");
          target.current = Math.round(phase.current);
        }
        paint(target.current);
      }
    };
    sync();
    if (disabled) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      drag.current = null;
      stage.current?.removeAttribute("data-dragging");
    }
    media.addEventListener("change", sync);
    window.addEventListener("portfolio-preferences", sync);
    document.addEventListener("visibilitychange", hide);
    return () => {
      cancelAnimationFrame(frame.current);
      media.removeEventListener("change", sync);
      window.removeEventListener("portfolio-preferences", sync);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [reduced, disabled, paint, settle]);

  function step(direction: number) {
    if (disabled) return;
    setZoomed(false);
    settle(Math.round(target.current) + direction);
  }

  function choose(index: number) {
    if (disabled || suppressClick.current) return;
    if (
      current === index &&
      Math.abs(phase.current - Math.round(phase.current)) < 0.01
    ) {
      setZoomed((value) => !value);
      return;
    }
    setZoomed(false);
    const distance = wrap(index - phase.current + count / 2) - count / 2;
    settle(phase.current + distance);
  }

  function start(e: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || !e.isPrimary || e.button !== 0) return;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    suppressClick.current = false;
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      time: e.timeStamp,
      width: e.currentTarget.clientWidth,
      phase: phase.current,
      speed: 0,
      moved: false,
    };
  }

  function move(e: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || !e.isPrimary) return;
    const slider = e.currentTarget;
    const stroke = drag.current;
    if (!stroke || stroke.id !== e.pointerId) {
      if (e.pointerType === "mouse" && !quiet.current) {
        const rect = slider.getBoundingClientRect();
        slider.style.setProperty(
          "--look-x",
          (((e.clientX - rect.left) / rect.width) * 2 - 1) * 7 + "px",
        );
        slider.style.setProperty(
          "--look-y",
          (((e.clientY - rect.top) / rect.height) * 2 - 1) * 3 + "px",
        );
      }
      return;
    }
    const dx = e.clientX - stroke.startX;
    if (!stroke.moved && Math.abs(dx) < 5) return;
    if (!stroke.moved) {
      slider.setPointerCapture(e.pointerId);
      slider.dataset.dragging = "true";
      stroke.moved = true;
      setZoomed(false);
    }
    const unit = clamp(stroke.width * 0.2, 70, 200);
    stroke.speed = clamp(
      (stroke.lastX - e.clientX) /
        Math.max(8, e.timeStamp - stroke.time) /
        unit,
      -0.015,
      0.015,
    );
    stroke.time = e.timeStamp;
    stroke.lastX = e.clientX;
    paint(stroke.phase - dx / unit);
  }

  function end(e: ReactPointerEvent<HTMLDivElement>, cancelled = false) {
    const stroke = drag.current;
    if (!stroke || stroke.id !== e.pointerId) return;
    drag.current = null;
    delete e.currentTarget.dataset.dragging;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    suppressClick.current = stroke.moved && !cancelled;
    const momentum =
      quiet.current || cancelled || e.timeStamp - stroke.time > 90
        ? 0
        : clamp(stroke.speed * 120, -1.4, 1.4);
    if (stroke.moved || cancelled) settle(Math.round(phase.current + momentum));
    else settle(Math.round(phase.current));
  }

  return (
    <section className="brand-orbit" aria-label="프로젝트 브랜드 전시">
      <div
        className="orbit-stage"
        ref={stage}
        tabIndex={disabled ? -1 : 0}
        role="group"
        aria-label="프로젝트 전시. 방향키로 이동하고 Enter로 중앙 작품을 확대하세요."
        data-zoomed={zoomed}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={(e) => end(e, true)}
        onLostPointerCapture={(e) => {
          if (e.target === e.currentTarget && drag.current) end(e, true);
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.removeProperty("--look-x");
          e.currentTarget.style.removeProperty("--look-y");
          if (drag.current && !drag.current.moved) end(e, true);
        }}
        onKeyDown={(e) => {
          if (disabled || e.altKey || e.metaKey || e.ctrlKey) return;
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            step(e.key === "ArrowLeft" ? -1 : 1);
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setZoomed((value) => !value);
          } else if (e.key === "Escape") setZoomed(false);
        }}
      >
        <div className="orbit-field" aria-hidden="true">
          <i />
          <i />
        </div>
        <div className="orbit-sculpture">
          {works.map((project, index) => (
            <button
              key={project.slug}
              className="orbit-object"
              style={orbitStyle(index, 0)}
              type="button"
              tabIndex={-1}
              data-centered={current === index}
              aria-label={
                project.name +
                (current === index
                  ? zoomed
                    ? " 축소"
                    : " 확대"
                  : " 중앙에 보기")
              }
              disabled={disabled}
              onClick={() => choose(index)}
              ref={(el) => {
                slots.current[index] = el;
              }}
            >
              <span className="orbit-lift">
                <span className="orbit-art" data-orbit-brand={project.slug}>
                  <BrandArt slug={project.slug} variant="exhibit" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="orbit-info">
        <button
          type="button"
          aria-label="이전 프로젝트"
          disabled={disabled}
          onClick={() => step(-1)}
        >
          <ChevronLeft size={17} />
        </button>
        <div className="orbit-caption" aria-live="polite" aria-atomic="true">
          <strong>{work.name}</strong>
          <span>{work.tagline}</span>
        </div>
        <button
          type="button"
          aria-label="다음 프로젝트"
          disabled={disabled}
          onClick={() => step(1)}
        >
          <ChevronRight size={17} />
        </button>
      </div>
      {!disabled && (
        <Link
          className="orbit-open"
          href={desktopHref("project:" + work.slug)}
          aria-label={work.name + " 프로젝트 열기"}
          onNavigate={keepLockInHistory}
        >
          프로젝트 열기 <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
      <span className="orbit-instruction">
        <MoveHorizontal size={15} aria-hidden="true" /> 드래그 또는 방향키로
        탐색
      </span>
    </section>
  );
}
